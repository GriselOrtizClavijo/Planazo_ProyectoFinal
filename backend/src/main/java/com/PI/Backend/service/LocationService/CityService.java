package com.PI.Backend.service.LocationService;

import com.PI.Backend.dto.LocationDto.CityDto;
import com.PI.Backend.dto.LocationDto.CityDtoSimple;
import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Location.Province;
import com.PI.Backend.entity.Products.Category;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.Location.CityRepository;
import com.PI.Backend.repository.Location.ProvinceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class CityService {

	@Autowired
	private CityRepository cityRepository;

	@Autowired
	ObjectMapper mapper;
	@Autowired
	private ProvinceRepository provinceRepository;

	public List<CityDto> listCities(Integer idProvincia, String name) throws ResourceNotFoundException {
		List<City> cities;

		if (idProvincia != null) {
			cities = cityRepository.findByProvinceId(idProvincia);
			if (cities.isEmpty()) {
				throw new ResourceNotFoundException("No existen ciudades para esta provincia");
			}
		} else if (name != null && !name.isEmpty()) {
			cities = cityRepository.findByPartialName(name);
			if (cities.isEmpty()) {
				throw new ResourceNotFoundException("No existe ciudad con este nombre");
			}
		} else {
			cities = (List<City>) cityRepository.findAll();
		}

		return cities.stream()
				.map(city -> mapper.convertValue(city, CityDto.class))
				.collect(Collectors.toList());
	}

	public CityDto createCity(CityDto cityDto) throws BadRequestException {
		City city = mapper.convertValue(cityDto, City.class);
		// Obtener el objeto Province por su ID
		Province province = provinceRepository.findById(city.getProvince().getId())
				.orElseThrow(() -> new BadRequestException("Province not found: " + city.getProvince().getName()));
		// Asignar la provincia a la ciudad
		city.setProvince(province);

		City savedCity = cityRepository.save(city);
		CityDto savedCityDTO = mapper.convertValue(savedCity, CityDto.class);

		return  savedCityDTO;
	}

	public CityDto searchCity(int id){
		Optional<City> city = cityRepository.findById(id);
		CityDto cityDto = null;

		if(city.isPresent()){
			cityDto = mapper.convertValue(city, CityDto.class);
		}
		else {
			throw new ResolutionException("No se encuentra la ciudad");
		}
		return cityDto;
	}

	public CityDto updateCity(int id, CityDto cityDto) throws ResourceNotFoundException {
		Optional<City> cityEntity = cityRepository.findById(id);

		if (cityEntity.isPresent()) {
			City city = cityEntity.get();

			city.setName(cityDto.getName());
			city.setProvince(cityDto.getProvince());

			City updatedCity = cityRepository.save(city);
			return convertToDto(updatedCity);
		} else {
			throw new ResourceNotFoundException("City not found for id: " + id);
		}
	}

	public CityDto convertToDto(City city) {
		CityDto cityDto = new CityDto();
		cityDto.setId(city.getId());
		cityDto.setName(city.getName());
		cityDto.setProvince(city.getProvince());
		return cityDto;
	}

	public ResponseEntity<String> deleteCity(Integer id) throws ResourceNotFoundException {
		Optional<City> city = cityRepository.findById(id);
		if (city.isPresent()) {
			cityRepository.deleteById(id);
		} else {
			throw new ResourceNotFoundException("La ciudad que desea eliminar no se puede encontrar");
		}
		return ResponseEntity.status(HttpStatus.OK).body("La ciudad se ha eliminado correctamente");
	};


}
