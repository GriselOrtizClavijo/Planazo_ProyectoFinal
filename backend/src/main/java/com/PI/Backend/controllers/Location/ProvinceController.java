package com.PI.Backend.controllers.Location;

import com.PI.Backend.dto.LocationDto.ProvinceDto;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.service.LocationService.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/provinces")
public class ProvinceController {

	@Autowired
	private ProvinceService provinceService;

	@GetMapping
	public ResponseEntity<List<ProvinceDto>> listCities() throws ResourceNotFoundException {
		List<ProvinceDto> provinceDtos = provinceService.listProvince();
		return ResponseEntity.status(HttpStatus.OK).body(provinceDtos);
	}

	@GetMapping("/search/{id}")
	public ResponseEntity<ProvinceDto> searchProvince(@PathVariable int id){
		ProvinceDto provinceDto = provinceService.searchProvince(id);
		return ResponseEntity.status(HttpStatus.OK).body(provinceDto);
	}

	@PostMapping
	public ResponseEntity<List<ProvinceDto>> createProvince(@RequestBody List<ProvinceDto> provinceDto)
			throws BadRequestException {
		List<ProvinceDto> createProvince = provinceService.createProvince(provinceDto);
		System.out.println("Province is added");
		return ResponseEntity.status(HttpStatus.OK).body(createProvince);
	};

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteProvince(@PathVariable int id) throws ResourceNotFoundException {
		provinceService.deleteProvince(id);
		return ResponseEntity.status(HttpStatus.OK).body("Se elimino la provincia con id: " + id);
	}
}
