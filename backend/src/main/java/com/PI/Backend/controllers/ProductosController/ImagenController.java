package com.PI.Backend.controllers.ProductosController;

import com.PI.Backend.dto.ProductsDto.ImageDto;
import com.PI.Backend.dto.ProductsDto.ImageDtoSimple;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.OkException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.service.ProductsService.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
public class ImagenController {

	@Autowired
	private ImageService imageService;

	@GetMapping(value = "/list")
	public ResponseEntity<List<ImageDtoSimple>> listImage() throws ResourceNotFoundException {
		List<ImageDtoSimple> imagenDto = imageService.listImage();
		return ResponseEntity.status(HttpStatus.OK).body(imagenDto);
	}

	@PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImageDtoSimple> createImage(@RequestParam("image") MultipartFile image) throws BadRequestException {
		ImageDto imageDto = new ImageDto();
		imageDto.setImage(image);
		ImageDtoSimple savedImage = imageService.createImagen(imageDto);
		System.out.println("Image is added");

		return ResponseEntity.ok(savedImage);
	}



	@GetMapping("/search/{id}")
	public ResponseEntity<ImageDto> searchImage(@PathVariable int id) throws ResourceNotFoundException {
		ImageDto imageDto = imageService.searchImage(id);
		return ResponseEntity.status(HttpStatus.OK).body(imageDto);
	}
	@PutMapping("/update/{id}")
	public ResponseEntity<ImageDto> updateImage(@PathVariable int id, @RequestBody ImageDto imageDto) throws ResourceNotFoundException {
		ImageDto updatedImage = imageService.updateImage(id, imageDto);
		return ResponseEntity.ok(updatedImage);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteImage(@PathVariable int id) throws OkException, ResourceNotFoundException {
		imageService.deleteImage(id);
		return ResponseEntity.status(HttpStatus.OK).body("Se elimino la imagen con id: " + id);
	}

}
