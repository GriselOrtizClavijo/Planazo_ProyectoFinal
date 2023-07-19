package com.PI.Backend.service.ProductsService;

import com.PI.Backend.dto.LocationDto.CityDto;
import com.PI.Backend.dto.ProductsDto.*;
import com.PI.Backend.entity.ApiResponse;
import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Products.Category;
import com.PI.Backend.entity.Products.Characteristic;
import com.PI.Backend.entity.Products.Image;
import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Pagination;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.Location.CityRepository;
import com.PI.Backend.repository.ProductosRepository.CategoryRepository;
import com.PI.Backend.repository.ProductosRepository.CharacteristicRepository;
import com.PI.Backend.repository.ProductosRepository.ImageRepository;
import com.PI.Backend.repository.ProductosRepository.ProductRepository;
import com.PI.Backend.repository.ReviewRepository.ReviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Log4j2
public class ProductService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	ObjectMapper mapper;

	@Autowired
	private final ImageRepository imageRepository;

	@Autowired
	private final CategoryRepository categoryRepository;

	@Autowired
	private final CityRepository cityRepository;
	@Autowired
	private CharacteristicRepository characteristicRepository;
	@Autowired
	private ReviewRepository reviewRepository;

	public ApiResponse listProducts(
			int page, int page_size,
			List<Integer> idCategories,
			List<Integer> idCities,
			LocalDate dateStart,
			LocalDate dateEnd,
			boolean random) throws ResourceNotFoundException {

		List<ProductDto> productDtos = new ArrayList<>();
		int adjustedPage = page - 1;

		Pageable pageable = PageRequest.of(adjustedPage, page_size);
		Page<Product> productosPage = null;

		if ((idCategories != null && !idCategories.isEmpty()) && (dateStart != null && dateEnd != null) && (idCities != null && !idCities.isEmpty())) {
			List<Category> categories = (List<Category>) categoryRepository.findAllById(idCategories);
			List<City> cities = (List<City>) cityRepository.findAllById(idCities);
			productosPage = productRepository.findAvailableProductsByCityAndCategoriesAndDateRange(cities, categories, dateStart, dateEnd, pageable);

		} else if ((dateStart != null && dateEnd != null) && (idCities != null && !idCities.isEmpty())) {
			List<City> cities = (List<City>) cityRepository.findAllById(idCities);
			productosPage = productRepository.findAvailableProductsByCityAndDateRange(cities, dateStart, dateEnd, pageable);
		} else if((dateStart != null && dateEnd != null) && (idCategories != null && !idCategories.isEmpty())){
			List<Category> categories = (List<Category>) categoryRepository.findAllById(idCategories);
			productosPage = productRepository.findAvailableProductsByCategoriesAndDateRange(categories, dateStart, dateEnd, pageable);
		} else if ((idCities != null && !idCities.isEmpty()) && (idCategories != null && !idCategories.isEmpty())){
			List<City> cities = (List<City>) cityRepository.findAllById(idCities);
			List<Category> categories = (List<Category>) categoryRepository.findAllById(idCategories);
			productosPage = productRepository.findProductsByCityAndCategories(cities, categories, pageable);
		}
		else if (idCities != null && !idCities.isEmpty()) {
			List<City> cities = (List<City>) cityRepository.findAllById(idCities);
			productosPage = productRepository.findByCityInAndAvailabilityTrue(cities, pageable);

		} else if (dateStart != null && dateEnd != null) {
			List<Product> allAvailableProducts = productRepository.findProductsByBookingDateRange(dateStart, dateEnd);
			int start = (int) pageable.getOffset();
			int end = Math.min((start + pageable.getPageSize()), allAvailableProducts.size());
			productosPage = new PageImpl<>(allAvailableProducts.subList(start, end), pageable, allAvailableProducts.size());
		} else if (idCategories != null && !idCategories.isEmpty()) {
			List<Category> categories = (List<Category>) categoryRepository.findAllById(idCategories);
			productosPage = productRepository.findByCategoriesInAndAvailabilityTrue(categories, pageable);
		}

		else {
			productosPage = productRepository.findAllByAvailabilityTrue(pageable);
		}

		if (productosPage.isEmpty()) {
			throw new ResourceNotFoundException("No hay suficientes productos");
		}

		List<Product> productos = new ArrayList<>(productosPage.getContent());
		if(random){
			Collections.shuffle(productos, new Random());}

		List<ProductDto> productosDto = productos.stream()
				.map(producto -> mapper.convertValue(producto, ProductDto.class))
				.collect(Collectors.toList());


		Pagination pagination = new Pagination();
		pagination.setTotal_elements(productosPage.getTotalElements());
		pagination.setPage_size(pageable.getPageSize());
		pagination.setCurrent_page(adjustedPage + 1);
		int totalPages = productosPage.getTotalPages();
		pagination.setTotal_pages(totalPages);

		ApiResponse response = new ApiResponse();
		response.setData(productosDto);
		response.setPagination(pagination);

		if (productosPage.hasNext()) {
			int nextPage = pageable.getPageNumber() + 1;
			response.getPagination().setNext_page(nextPage + 1);
		} else {
			response.getPagination().setNext_page(null);
		}

		if (productosPage.hasPrevious()) {
			int previousPage = pageable.getPageNumber() + 1;
			response.getPagination().setPrevious_page(previousPage - 1);
		} else {
			response.getPagination().setPrevious_page(null);
		}

		return response;
	}

	public ProductDto createProduct(ProductDto productoDto) throws BadRequestException {

		Product producto = mapper.convertValue(productoDto, Product.class);
		producto.setAvailability(true);

		//LLAMA CATEGORIAS...
		Set<CategoryDtoSimple> categoryDtos = productoDto.getCategories();
		Set<Category> categories = new HashSet<>();
		for (CategoryDtoSimple categoryDto : categoryDtos) {
			Category categoria = categoryRepository.findById(categoryDto.getId())
					.orElseThrow(() -> new BadRequestException("Category not found: " + categoryDto.getId()));
			categories.add(categoria);
		}
		producto.setCategories(categories);

		//LLAMA LAS IMAGENES
		Set<ImageDtoSimple> imagenDtos = productoDto.getImg();
		List<Image> images = new ArrayList<>();
		for (ImageDtoSimple imagenDto : imagenDtos) {
			Image image = imageRepository.findById(imagenDto.getId())
					.orElseThrow(() -> new BadRequestException("Image not found: " + imagenDto.getId()));
			;
			images.add(image);
		}
		producto.setImg(images);

		//LLAMA LA CIUDAD

		CityDto cityDto = productoDto.getCity();
		City city = cityRepository.findById(cityDto.getId())
				.orElseThrow(() -> new BadRequestException("City not found"));
		producto.setCity(city);

		//LLAMA LAS CARACTERISTICAS
		Set<CharacteristicDto> characteristicDtos = productoDto.getCharacteristics();
		Set<Characteristic> characteristics = new HashSet<>();
		for (CharacteristicDto characteristicDto : characteristicDtos) {
			Characteristic characteristic = characteristicRepository.findById(characteristicDto.getId())
					.orElseThrow(() -> new BadRequestException("Characteristic not found: " + characteristicDto.getId()));
			characteristics.add(characteristic);
		}
		producto.setCharacteristics(characteristics);

			Product existingProduct = productRepository.findByTitle(productoDto.getTitle());
			if (existingProduct != null) {
				System.out.println("Product with the same title already exists");
				throw new BadRequestException("Product with the same title already exists");
			}
			productRepository.save(producto);

			productoDto = mapper.convertValue(producto, ProductDto.class);

			return productoDto;

	}

	public ProductDto searchProduct(int idProduct) {
		Optional<Product> optionalProduct = productRepository.findById(idProduct);

		if (optionalProduct.isPresent() && optionalProduct.get().isAvailability()) {
			Product product = optionalProduct.get();

			ProductDto productoDto = mapper.convertValue(product, ProductDto.class);

			Set<ImageDtoSimple> imgList = product.getImg().stream()
					.map(image -> mapper.convertValue(image, ImageDtoSimple.class))
					.collect(Collectors.toSet());
			productoDto.setImg(imgList);

			Set<CategoryDtoSimple> categories = product.getCategories().stream()
					.map(category -> {
						CategoryDtoSimple categoryDto = new CategoryDtoSimple();
						categoryDto.setId(category.getId());
						categoryDto.setTitle(category.getTitle());
						return categoryDto;
					})
					.collect(Collectors.toSet());

			productoDto.setCategories(categories);

			CityDto cityDto = productoDto.getCity();
			City city = cityRepository.findById(cityDto.getId())
					.orElseThrow(() -> new BadRequestException("City not found"));
			productoDto.setCity(mapper.convertValue(city, CityDto.class));

			Set<CharacteristicDto> characteristics = product.getCharacteristics().stream()
					.map(characteristic -> {
						CharacteristicDto characteristicDto = new CharacteristicDto();
						characteristicDto.setId(characteristic.getId());
						characteristicDto.setTitle(characteristic.getTitle());
						return characteristicDto;
					})
					.collect(Collectors.toSet());

			productoDto.setCharacteristics(characteristics);

			List<Map<String, LocalDate>> bookings = productRepository.getBookingsWithDateRangeByProductId(idProduct);

			List<Map<String, String>> bookingDtos = bookings.stream()
					.map(booking -> {
						Map<String, String> bookingDto = new HashMap<>();

						if (booking.get("from") != null) {
							LocalDate fromDate = booking.get("from");
							bookingDto.put("from", fromDate.toString());
						}
						if (booking.get("to") != null) {
							LocalDate toDate = booking.get("to");
							bookingDto.put("to", toDate.toString());
						}
						return bookingDto;
					})
					.collect(Collectors.toList());

			productoDto.setBookings(bookingDtos);

			//Obtener el rating del producto (promedio de puntuacion en las reviews)

			int avgProductRating = reviewRepository.findAverageRateByProductId(idProduct);
			productoDto.setRanking(avgProductRating);

			return productoDto;
		} else {
			throw new ResolutionException("Product not found");
		}
	}


	/*public ProductDto updateProduct(ProductDto productDto) throws ResourceNotFoundException {
		Optional<Product> productEntity = productRepository.findById(productDto.getId());

		if (productEntity.isPresent()) {
			Product product = productEntity.get();

			// Modificar ciudad
			CityDto newCityDto = productDto.getCity();
			if (newCityDto != null) {
				City newCity = cityRepository.findById(newCityDto.getId())
						.orElseThrow(() -> new BadRequestException("City not found"));
				product.setCity(newCity);
			}

			// Modificar categorías
			if (productDto.getCategories() != null) {
				Set<CategoryDtoSimple> updatedCategories = productDto.getCategories();
				Set<Category> existingCategories = product.getCategories();

				for (CategoryDtoSimple categoryDto : updatedCategories) {
					if (categoryDto.getId() > 0) {
						Optional<Category> categoryEntity = categoryRepository.findById(categoryDto.getId());
						if (categoryEntity.isPresent()) {
							Category category = categoryEntity.get();
							existingCategories.add(category);
						} else {
							throw new ResourceNotFoundException("La categoría con el ID " + categoryDto.getId() + " no existe");
						}
					} else {
						// Mantener la categoría existente
						Category existingCategory = new Category();
						existingCategory.setTitle(categoryDto.getTitle());
						existingCategories.add(existingCategory);
					}
				}
			}

			// Modificar características
			Set<CharacteristicDto> characteristics = null;

			if (characteristics != null) {
				Set<CharacteristicDto> characteristicSet = new HashSet<>();
				for (CharacteristicDto characteristicDto : characteristics) {
					// Obtener el ID de la característica del objeto CharacteristicDto
					int characteristicId = characteristicDto.getId();

					// Obtener la característica correspondiente al ID
					Characteristic characteristic = characteristicRepository.findById(characteristicId)
							.orElseThrow(() -> new BadRequestException("Characteristic not found"));

					// Crear una nueva instancia de CharacteristicDto y asignar los valores correspondientes
					CharacteristicDto convertedCharacteristicDto = new CharacteristicDto();
					convertedCharacteristicDto.setId(characteristic.getId());
					convertedCharacteristicDto.setTitle(characteristic.getTitle());

					// Agregar el CharacteristicDto convertido al conjunto
					characteristicSet.add(convertedCharacteristicDto);
				}

				// Asignar el conjunto de características convertidas al producto
				productDto.setCharacteristics(characteristicSet);
			}


			//modificar imagen
			if (productDto.getImg() != null) {
				Set<Image> newImages = new HashSet<>();
				for (ImageDtoSimple imageDto : productDto.getImg()) {
					Image newImage = new Image();
					newImage.setImgUrl(imageDto.getImgUrl());
					newImages.add(newImage);
				}
				product.setImg(newImages);

			} else {
				// Conservar las imágenes existentes
				product.setImg(product.getImg());
			}


			// Modificar demás propiedades
			if (productDto.getTitle() != null) {
				product.setTitle(productDto.getTitle());
			}
			if (productDto.getPriceAdult() != null) {
				product.setPriceAdult(productDto.getPriceAdult());
			}
			if (productDto.getPriceMinor() != null) {
				product.setPriceMinor(productDto.getPriceMinor());
			}
			if (productDto.getDescription() != null) {
				product.setDescription(productDto.getDescription());
			}
			if (productDto.getRanking() > 0) {
				product.setRanking(productDto.getRanking());
			}
			if (productDto.isAvailability()) {
				product.setAvailability(productDto.isAvailability());
			}

			Product updatedProduct = productRepository.save(product);

				productDto.setTitle(updatedProduct.getTitle());
				productDto.setPriceAdult(updatedProduct.getPriceAdult());
				productDto.setPriceMinor(updatedProduct.getPriceMinor());
				productDto.setDescription(updatedProduct.getDescription());
				productDto.setRanking(updatedProduct.getRanking());

				CityDto cityDto = new CityDto(updatedProduct.getCity());
				productDto.setCity(cityDto);

				characteristics = product.getCharacteristics().stream()
						.map(characteristic -> {
							CharacteristicDto characteristicDto = new CharacteristicDto();
							characteristicDto.setId(characteristic.getId());
							characteristicDto.setTitle(characteristic.getTitle());
							return characteristicDto;
						})
						.collect(Collectors.toSet());
				productDto.setCharacteristics(characteristics);

				Set<CategoryDtoSimple> categories = product.getCategories().stream()
						.map(category -> {
							CategoryDtoSimple categoryDto = new CategoryDtoSimple();
							categoryDto.setId(category.getId());
							categoryDto.setTitle(category.getTitle());
							return categoryDto;
						})
						.collect(Collectors.toSet());

				productDto.setCategories(categories);

				System.out.println("Se logra modificar el producto encontrado");

				return productDto;
			} else {
				System.out.println("No se encontró el producto y no se modificó correctamente");
				return null;
			}
		}*/


	public ResponseEntity<String> deleteProduct(Integer idProduct) throws ResourceNotFoundException {
		Optional<Product> producto = productRepository.findById(idProduct);

		if (producto.isPresent()) {
			producto.get().setAvailability(false);
			productRepository.save(producto.get());
		} else {
			throw new ResourceNotFoundException("El producto que desea eliminar no se puede encontrar");
		}
		return ResponseEntity.status(HttpStatus.OK).body("El producto se ha eliminado correctamente");
	};


	public List<ProductDto> listProductLocations() throws ResourceNotFoundException {
		List<Product> products = (List<Product>) productRepository.findAll();
		List<ProductDto> productDtoArrayList = new ArrayList<>();

		for (Product product: products){
			if(products.isEmpty()){
				throw new ResourceNotFoundException("La lista de productos está vacía");
			}
			if (product.isAvailability()) {
				productDtoArrayList.add(mapper.convertValue(product, ProductDto.class));
			}
		}
		return  productDtoArrayList;

	};
}
