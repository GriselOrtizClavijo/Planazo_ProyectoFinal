package com.PI.Backend.service.LocationService;

import com.PI.Backend.dto.LocationDto.ProvinceDto;
import com.PI.Backend.entity.Location.Province;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.Location.ProvinceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProvinceService {

	private final ProvinceRepository provinceRepository;

	@Autowired
	ObjectMapper mapper;
	public List<ProvinceDto> listProvince() {
		List<Province> provincies = (List<Province>) provinceRepository.findAll();
		List<ProvinceDto> provinceDtos = new ArrayList<>();

		for (Province province : provincies) {
			ProvinceDto provinceDto = mapper.convertValue(province, ProvinceDto.class);
			provinceDtos.add(provinceDto);
		}
		return provinceDtos;
	}

	public List<ProvinceDto> createProvince(List<ProvinceDto> provinceDtos) throws BadRequestException {
		List<Province> provinces = new ArrayList<>();

		for (ProvinceDto provinceDto : provinceDtos) {
			Province province = mapper.convertValue(provinceDto, Province.class);
			provinces.add(province);
			System.out.println("Ingresa a for");
		}

		List<Province> savedProvinces = (List<Province>) provinceRepository.saveAll(provinces);
		System.out.println("guarda las provincias");

		List<ProvinceDto> provinceDtoList = savedProvinces.stream()
				.map(city -> mapper.convertValue(city, ProvinceDto.class))
				.collect(Collectors.toList());
		System.out.println("convierte a Dto");

		return provinceDtoList;

	}

	public ProvinceDto searchProvince(int id){
		Optional<Province> province = provinceRepository.findById(id);
		ProvinceDto provinceDto = null;

		if(province.isPresent()){
			provinceDto = mapper.convertValue(province, ProvinceDto.class);
		}
		else {
			throw new ResolutionException("No se encuentra la provincia");
		}
		return provinceDto;
	}


	public ResponseEntity<String> deleteProvince(int id) throws ResourceNotFoundException {
		Province province = provinceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Province not found"));

		provinceRepository.delete(province);
		return ResponseEntity.ok("Deleted Province");
	}

}
