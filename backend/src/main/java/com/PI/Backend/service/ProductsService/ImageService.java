package com.PI.Backend.service.ProductsService;

import com.PI.Backend.awss3.service.AWSS3Service;
import com.PI.Backend.dto.ProductsDto.ImageDto;
import com.PI.Backend.dto.ProductsDto.ImageDtoSimple;
import com.PI.Backend.entity.Products.Image;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.ProductosRepository.ImageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.lang.module.ResolutionException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {


	private final ImageRepository imageRepository;
	private final AWSS3Service awsS3Service;


	@Autowired
	ObjectMapper mapper;

	// * Metodos
	// -------------------------------------------------------------------------------------------------------
	public List<ImageDtoSimple> listImage() throws ResourceNotFoundException {
		List<Image> imagenes = (List<Image>) imageRepository.findAll();
		List<ImageDtoSimple> imagenDtos = new ArrayList<>();

		for (Image imagen : imagenes) {
			imagenDtos.add(mapper.convertValue(imagen, ImageDtoSimple.class));
		}
		if (imagenDtos.isEmpty()) {
			throw new ResourceNotFoundException("list not found");
		}
		return imagenDtos;
	}


	public ImageDtoSimple createImagen(ImageDto imagenDto) throws BadRequestException {

		// Obtengo el archivo de imagen desde imagenDto
		MultipartFile file = imagenDto.getImage();

		// Subo la imagen al bucket de S3
		String imageUrl = awsS3Service.uploadFile(file);
		imagenDto.setImgUrl(imageUrl);

		//la persisto en la tabla image de la bbdd

		Image imagen = new Image();
		imagen.setImgUrl(imagenDto.getImgUrl());
		Image savedImage = imageRepository.save(imagen);

		ImageDtoSimple response = mapper.convertValue(savedImage, ImageDtoSimple.class);

		if (savedImage.getImgUrl() == null) {
			String messageError = ("Error creating the image, check the data entered");
			throw new BadRequestException(messageError);
		}
		//devuelvo el id y la url (almacenados en la tabla Image)
		return response;
	};

	public ImageDto searchImage(int idImage) throws ResourceNotFoundException{
		Optional<Image> image = imageRepository.findById(idImage);

		ImageDto imageDto = null;

		if(image.isPresent()){
			imageDto = mapper.convertValue(image, ImageDto.class);
		}
		else {
			String mensError = ("No se encuentra la imagen");
			throw new ResolutionException(mensError);
		}
		return imageDto;
	}

	public ImageDto updateImage(int id, ImageDto imageDto) throws ResourceNotFoundException {
		Image imageExist = imageRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Image not found"));

		imageExist.setImgUrl(imageDto.getImgUrl());

		/*// Verificar si hay una nueva imagen proporcionada
		MultipartFile newImageFile = imageDto.getFile(); // Obtener la nueva imagen desde imagenDto
		if (newImageFile != null) {
			// Subir la nueva imagen al bucket de S3
			String newImageUrl = awsS3Service.uploadFile(newImageFile);
			imageExist.setImgUrl(newImageUrl);
		}*/

		Image updatedImage = imageRepository.save(imageExist);
		ImageDto updatedImageDto = convertToDto(updatedImage);

		return convertToDto(updatedImage);
	}

	private ImageDto convertToDto(Image image) {
		ImageDto imageDto = new ImageDto();
		imageDto.setId(image.getId());
		imageDto.setImgUrl(image.getImgUrl());
		return imageDto;
	}

	public ResponseEntity<String> deleteImage(int id) throws ResourceNotFoundException {
		Image imagenExistente = imageRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Image not found"));

		imageRepository.delete(imagenExistente);
		return ResponseEntity.ok("Deleted image");
	}

}
