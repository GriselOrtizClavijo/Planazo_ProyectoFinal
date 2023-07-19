package com.PI.Backend.service.ProductsService;

import com.PI.Backend.dto.ProductsDto.CategoryDto;
import com.PI.Backend.dto.ProductsDto.ImageDtoSimple;
import com.PI.Backend.entity.Products.Category;
import com.PI.Backend.entity.Products.Image;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.ProductosRepository.CategoryRepository;
import com.PI.Backend.repository.ProductosRepository.ImageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;
	@Autowired
	private ImageRepository imageRepository;

	@Autowired
	ObjectMapper mapper;

	public List<CategoryDto> listCategories() throws ResourceNotFoundException {
		List<Category> categories = (List<Category>) categoryRepository.findAll();
		List<CategoryDto> categoriaDtos = new ArrayList<>();

		for (Category category : categories) {
			if(category.isActive()){
				categoriaDtos.add(mapper.convertValue(category, CategoryDto.class));
			}

		}
		if (categoriaDtos.isEmpty()) {
			throw new ResourceNotFoundException("Lista no encontrada");
		}
		return categoriaDtos;

	};

	public CategoryDto createCategory(CategoryDto categoriaDto) throws BadRequestException {

		Category category = mapper.convertValue(categoriaDto, Category.class);

		categoryRepository.save(category);
		categoriaDto = mapper.convertValue(category, CategoryDto.class);

		if (categoriaDto.id <= 0 || categoriaDto.title == null) {
			String messageError = ("Error al crear la categoría, por favor revisar los datos ingresados");
			throw new BadRequestException(messageError);
		}

		return categoriaDto;

	};

	public CategoryDto searchCategory(int idCategoria) throws ResourceNotFoundException {
		Optional<Category> categoria = categoryRepository.findById(idCategoria);

		CategoryDto categoriaDto = null;

		if (categoria.isPresent()) {
			categoriaDto = mapper.convertValue(categoria, CategoryDto.class);
		} else {
			String mensError = ("No se encuentra la categoria");
			throw new ResolutionException(mensError);
		}
		return categoriaDto;
	}

	public CategoryDto updateCategory(int idCategory, CategoryDto categoryDto) throws ResourceNotFoundException {
		Optional<Category> categoryOptional = categoryRepository.findById(idCategory);

		if (categoryOptional.isPresent()) {
			Category category = categoryOptional.get();

			ImageDtoSimple imageDtoSimple = categoryDto.getImage();
			if (imageDtoSimple != null) {
				Image newImage = imageRepository.findById(imageDtoSimple.getId())
						.orElseThrow(() -> new BadRequestException("Image not found"));
				category.setImage(newImage);
			}

			if (categoryDto.getTitle() != null) {
				category.setTitle(categoryDto.getTitle());
			}
			if (categoryDto.getDescription() != null) {
				category.setDescription(categoryDto.getDescription());
			}

			Category updatedCategory = categoryRepository.save(category);

			categoryDto.setTitle(updatedCategory.getTitle());
			categoryDto.setDescription(updatedCategory.getDescription());

			if (updatedCategory.getImage() != null) {
				ImageDtoSimple imageDto = new ImageDtoSimple();
				imageDto.setId(updatedCategory.getImage().getId());
				imageDto.setImgUrl(updatedCategory.getImage().getImgUrl());
				categoryDto.setImage(imageDto);
			}
			return categoryDto;
		}

		throw new ResourceNotFoundException("Category not found");
	}

	public CategoryDto deleteCategory(Integer idCategory) throws ResourceNotFoundException {
		Optional<Category> category = categoryRepository.findById(idCategory);
		CategoryDto categoryDto = null;

		if (category.isPresent()) {
			category.get().setActive(false);
			categoryRepository.save(category.get()); // Guarda los cambios en la base de datos
			categoryDto = mapper.convertValue(category.get(), CategoryDto.class);
		} else {
			throw new ResourceNotFoundException("La categoría no existe");
		}
		return categoryDto;
	}
}

