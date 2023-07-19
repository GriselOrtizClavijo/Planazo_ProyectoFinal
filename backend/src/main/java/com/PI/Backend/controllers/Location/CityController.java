package com.PI.Backend.controllers.Location;

import com.PI.Backend.dto.LocationDto.CityDto;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.service.LocationService.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cities")
public class CityController {

	@Autowired
	private CityService cityService;

	@GetMapping
	public ResponseEntity<Object> listCities(
			@RequestParam(value = "idProvince", required = false) Integer idProvincia,
			@RequestParam(value = "name", required = false) String name)
			throws ResourceNotFoundException {
		List<CityDto> cityDto = cityService.listCities(idProvincia, name);
		List<Map<String, Object>> responseList = new ArrayList<>();

		for (CityDto cityDtos : cityDto) {
			Map<String, Object> response = new HashMap<>();
			response.put("id", cityDtos.getId());
			response.put("name", cityDtos.getName());
			response.put("province", cityDtos.getProvince().getName());

			responseList.add(response);
		}

		return ResponseEntity.status(HttpStatus.OK).body(responseList);
	}

	@PostMapping
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Integer> createCity(@RequestBody CityDto cityDto) throws BadRequestException {
		CityDto createdCity = cityService.createCity(cityDto);
		return ResponseEntity.status(HttpStatus.OK).body(createdCity.getId());
	}


	@GetMapping("/search/{id}")
	public ResponseEntity<CityDto> searchCity(@PathVariable int id){
		CityDto cityDto = cityService.searchCity(id);
		return ResponseEntity.status(HttpStatus.OK).body(cityDto);
	}

	@PutMapping("/update/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<CityDto> updateCity(@PathVariable int id, @RequestBody CityDto cityDto) throws ResourceNotFoundException {
		CityDto updatedCity = cityService.updateCity(id, cityDto);
		return ResponseEntity.ok(updatedCity);
	}

	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> deleteCity(@PathVariable int id) throws ResourceNotFoundException {
		try {
			cityService.deleteCity(id);
			return ResponseEntity.status(HttpStatus.OK).body("Se eliminó la ciudad con id: " + id);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La ciudad que desea eliminar no se puede encontrar");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Se produjo un error durante la eliminación de la ciudad");
		}
	}

}
