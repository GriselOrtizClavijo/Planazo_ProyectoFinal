package com.PI.Backend.controllers.ProductosController;

import com.PI.Backend.dto.LocationDto.CityDto;
import com.PI.Backend.dto.ProductsDto.*;
import com.PI.Backend.dto.ProductsDto.CategoryDtoSimple;
import com.PI.Backend.dto.ProductsDto.CharacteristicDto;
import com.PI.Backend.dto.ProductsDto.ProductDto;
import com.PI.Backend.entity.ApiResponse;
import com.PI.Backend.entity.Products.PolicyLoader;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.ProductosRepository.ProductRepository;
import com.PI.Backend.repository.ReviewRepository.ReviewRepository;
import com.PI.Backend.service.ProductsService.ImageService;
import com.PI.Backend.service.ProductsService.ProductService;
import com.PI.Backend.service.ReviewsService.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.Multipart;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {


	private final ProductService productService;
	@Autowired
	private ImageService imgService;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ReviewService reviewService;

	@Autowired
	ObjectMapper mapper;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}


	@GetMapping("/list")
	public ResponseEntity<Object> listProducts(
			@RequestParam(value = "page", required = false, defaultValue = "1") int page,
			@RequestParam(value = "page_size", required = false, defaultValue = "10") int page_size,
			@RequestParam(value = "idCategory", required = false) List<Integer> idCategories,
			@RequestParam(value = "city", required = false) List<Integer> idCities,
			@RequestParam(value = "dateStart", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateStart,
			@RequestParam(value = "dateEnd", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEnd,
			@RequestParam(value = "random", required = false) boolean random
	) throws ResourceNotFoundException {
	try{
		ApiResponse apiResponse = productService.listProducts(page, page_size, idCategories, idCities, dateStart, dateEnd, random);
		List<Map<String, Object>> responseList = new ArrayList<>();

			for (ProductDto productDto : apiResponse.getData()) {

				Map<String, Object> response = new HashMap<>();
				int rating = reviewService.getProductAverageRate(productDto.getId());

				Set<ImageDtoSimple> images = productDto.getImg();
				if (!images.isEmpty()) {
					int randomIndex = new Random().nextInt(images.size());
					ImageDtoSimple randomImage = images.stream().skip(randomIndex).findFirst().orElse(null);
					if (randomImage != null) {
						response.put("img", randomImage.getImgUrl());
					}
				}

				response.put("id", productDto.getId());
				response.put("title", productDto.getTitle());
				response.put("rating", rating);
				response.put("price", productDto.getPriceAdult());
				response.put("city",
						productDto.getCity().getName() + ", " + productDto.getCity().getProvince().getName());
				response.put("location", productDto.getLat() + ", " + productDto.getLng());

				responseList.add(response);
			}

			Map<String, Object> responseData = new HashMap<>();
			responseData.put("data", responseList);
			responseData.put("pagination", apiResponse.getPagination());

		return ResponseEntity.status(HttpStatus.OK).body(responseData);
	} catch (Exception e){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		}
	}

	@PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> createProduct(MultipartHttpServletRequest request)
			throws BadRequestException {
		try {
			Map<String, String[]> parameterMap = request.getParameterMap();
			Map<String, MultipartFile> fileMap = request.getFileMap();

			ImageDto imageDto = new ImageDto();
			ProductDto productDto = new ProductDto();

			productDto.setImg(new HashSet<>());
			productDto.setCategories(new HashSet<>());
			productDto.setCharacteristics(new HashSet<>());

			for (Map.Entry<String, MultipartFile> entry : fileMap.entrySet()) {
				String fileName = entry.getKey();
				MultipartFile file = entry.getValue();

				imageDto.setImage(file);
				ImageDtoSimple savedImage = imgService.createImagen(imageDto);

				productDto.getImg().add(savedImage);
			}


			for (Map.Entry<String, String[]> entry : parameterMap.entrySet()) {
				String paramName = entry.getKey();
				String[] paramValues = entry.getValue();

				if (paramName.contains("cat")) {
					CategoryDtoSimple categoryDtoSimple = new CategoryDtoSimple();
					categoryDtoSimple.setId(Integer.parseInt(paramValues[0]));
					productDto.getCategories().add(categoryDtoSimple);
				} else if (paramName.contains("char")) {
					CharacteristicDto characteristicDto = new CharacteristicDto();
					characteristicDto.setId(Integer.parseInt(paramValues[0]));
					productDto.getCharacteristics().add(characteristicDto);
				} else if (paramName.contains("city")) {
					CityDto cityDto = new CityDto();
					cityDto.setId(Integer.parseInt(paramValues[0]));
					productDto.setCity(cityDto);
				} else if (paramName.contains("title")) {
					productDto.setTitle(paramValues[0]);
				} else if (paramName.contains("description")) {
					productDto.setDescription(paramValues[0]);
				} else if (paramName.contains("adultPrice")) {
					BigDecimal adultPrice = BigDecimal.valueOf(Double.valueOf(paramValues[0]));
					productDto.setPriceAdult(adultPrice);
				} else if (paramName.contains("minorPrice")) {
					BigDecimal minorPrice = BigDecimal.valueOf(Double.valueOf(paramValues[0]));
					productDto.setPriceMinor(minorPrice);
				} else if (paramName.contains("policy")) {
					String policy = PolicyLoader.loadGeneralPolicy();
					productDto.setPolicy(policy);
				} else if (paramName.contains("lat")) {
					Double lat = Double.valueOf(paramValues[0]);
					productDto.setLat(lat);
				} else if (paramName.contains("lng")) {
					Double lng = Double.valueOf(paramValues[0]);
					;
					productDto.setLng(lng);
				}

			}

			ProductDto createdProduct = productService.createProduct(productDto);
			System.out.println("Product Added");
			return ResponseEntity.status(HttpStatus.OK).body(createdProduct.getId());
		} catch (Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	};

	@GetMapping("/search/{idProducto}")
	public ResponseEntity<Object> searchProduct(@PathVariable int idProducto) {
		try {
			ProductDto productDto = productService.searchProduct(idProducto);

			Map<String, Object> response = new HashMap<>();

			List<String> images = productDto.getImg().stream()
					.map(ImageDtoSimple::getImgUrl)
					.collect(Collectors.toList());
			response.put("img", images);

			response.put("id", productDto.getId());
			response.put("title", productDto.getTitle());
			response.put("rating", productDto.getRanking());
			response.put("priceAdult", productDto.getPriceAdult());
			response.put("priceMinor", productDto.getPriceMinor());
			response.put("description", productDto.getDescription());
			response.put("city", productDto.getCity().name + ", " + productDto.getCity().getProvince().getName());
			response.put("location", productDto.getLat() + ", " + productDto.getLng());
			response.put("categories", productDto.getCategories());
			response.put("characteristics", productDto.getCharacteristics());
			response.put("policy", productDto.getPolicy());
			response.put("bookings", productDto.getBookings());

			return ResponseEntity.status(HttpStatus.OK).body(response);
		} catch (Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	// Modificar
	/*
	 * @PatchMapping("/update/{idProduct}")
	 *
	 * @PreAuthorize("hasAuthority('ADMIN')")
	 * public ResponseEntity<Object> updateProduct(
	 *
	 * @PathVariable int idProduct,
	 *
	 * @ModelAttribute ProductDto productDto,
	 *
	 * @RequestParam(value = "image", required = false) MultipartHttpServletRequest
	 * request)
	 * throws ResourceNotFoundException {
	 *
	 * productDto.setId(idProduct);
	 *
	 * // Inicializar la lista de imágenes si no está presente
	 * if (productDto.getImg() == null) {
	 * productDto.setImg(new HashSet<>());
	 * }
	 *
	 * // Procesar cada uno de los archivos recibidos
	 * if (request != null) {
	 * for (Iterator<String> it = request.getFileNames(); it.hasNext(); ) {
	 * String fileName = it.next();
	 * MultipartFile file = request.getFile(fileName);
	 *
	 * ImageDto imageDto = new ImageDto();
	 * imageDto.setImage(file);
	 * ImageDtoSimple savedImage = imgService.createImagen(imageDto);
	 * productDto.getImg().add(savedImage);
	 * }
	 * }
	 *
	 * ProductDto updatedProduct = productService.updateProduct(productDto);
	 *
	 * Map<String, Object> response = new HashMap<>();
	 *
	 * response.put("title", updatedProduct.getTitle());
	 * response.put("priceAdult", updatedProduct.getPriceAdult());
	 * response.put("priceMinor", updatedProduct.getPriceMinor());
	 * response.put("description", updatedProduct.getDescription());
	 * response.put("ranking", updatedProduct.getRanking());
	 * response.put("availability", updatedProduct.isAvailability());
	 * response.put("city", updatedProduct.getCity().getName() + ", " +
	 * updatedProduct.getCity().getProvince().getName());
	 * response.put("characteristics", updatedProduct.getCharacteristics());
	 * response.put("categories", updatedProduct.getCategories());
	 * response.put("image", updatedProduct.getImg());
	 *
	 *
	 * if (updatedProduct != null) {
	 * return ResponseEntity.status(HttpStatus.OK).body(response);
	 * } else {
	 * return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	 * }
	 *
	 * }
	 */


	@DeleteMapping("/delete/{idProduct}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> deleteProduct(@PathVariable int idProduct) throws ResourceNotFoundException {
		try {
			productService.deleteProduct(idProduct);
			return ResponseEntity.status(HttpStatus.OK).body("Se elimino el producto con id: " + idProduct);
		} catch (Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/list/locations")
	public ResponseEntity<Object> listProductLocations() throws ResourceNotFoundException {
		try {
			List<ProductDto> productDtos = productService.listProductLocations();
			List<Map<String, Object>> responseList = new ArrayList<>();

			for (ProductDto productDto : productDtos) {
				Map<String, Object> response = new HashMap<>();
				response.put("id", productDto.getId());
				response.put("title", productDto.getTitle());
				response.put("lat", productDto.getLat());
				response.put("lng", productDto.getLng());
				Set<ImageDtoSimple> images = productDto.getImg();
				if (!images.isEmpty()) {
					int randomIndex = new Random().nextInt(images.size());
					ImageDtoSimple randomImage = images.stream().skip(randomIndex).findFirst().orElse(null);
					if (randomImage != null) {
						response.put("img", randomImage.getImgUrl());
					}
				}
				responseList.add(response);
			}
			return ResponseEntity.status(HttpStatus.OK).body(responseList);
		} catch (Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

}
