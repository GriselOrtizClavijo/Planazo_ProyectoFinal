package com.PI.Backend.controllers.ProductosController;

import com.PI.Backend.dto.ProductsDto.CategoryDto;
import com.PI.Backend.dto.ProductsDto.ImageDto;
import com.PI.Backend.dto.ProductsDto.ImageDtoSimple;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.ProductosRepository.CategoryRepository;
import com.PI.Backend.service.ProductsService.CategoryService;
import com.PI.Backend.service.ProductsService.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoriaService;

    @Autowired
    ImageService imageService;
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/list")
    public ResponseEntity<Object> listCategories() throws ResourceNotFoundException {
       try {
           List<CategoryDto> categoryDtos = categoriaService.listCategories();
           List<Map<String, Object>> responseList = new ArrayList<>();

           for (CategoryDto categoryDto : categoryDtos) {
               Map<String, Object> response = new HashMap<>();
               response.put("id", categoryDto.getId());
               response.put("title", categoryDto.getTitle());
               response.put("description", categoryDto.getDescription());
               response.put("urlImg", categoryDto.getImage().getImgUrl());
               response.put("video", categoryDto.getVideo());

               responseList.add(response);
           }

           return ResponseEntity.status(HttpStatus.OK).body(responseList);
       } catch(Exception e){
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       }
    }

    @PostMapping(path="/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createCategory (
               @RequestParam(value = "image", required = false) MultipartFile image ,
               @RequestParam(value = "title", required = false) String title,
               @RequestParam(value="description", required = false) String description,
               @RequestParam(value="video", required = false) String video)
               throws BadRequestException {

        try {
            ImageDto imageDto = new ImageDto();
            imageDto.setImage(image);

            ImageDtoSimple savedImage = imageService.createImagen(imageDto);

            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setTitle(title);
            categoryDto.setDescription(description);
            categoryDto.setImage(savedImage);
            categoryDto.setVideo(video);
            categoryDto.setActive(true);

            CategoryDto categoria = categoriaService.createCategory(categoryDto);
            System.out.println("Added category");
            return ResponseEntity.status(HttpStatus.OK).body(categoria.getId());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    };

    @GetMapping("/search/{idCategory}")
    public ResponseEntity<Object> searchCategory(@PathVariable  int idCategory) throws BadRequestException {
        try{
        CategoryDto categoryDto = categoriaService.searchCategory(idCategory);

            Map<String, Object> response = new HashMap<>();

            response.put("id", categoryDto.getId());
            response.put("title", categoryDto.getTitle());
            response.put("description", categoryDto.getDescription());
            response.put("urlImg", categoryDto.getImage().getImgUrl());
            response.put("video", categoryDto.getVideo());

        return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping (path="/update/{idCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCategory(
            @PathVariable int idCategory,
            @RequestBody CategoryDto categoryDto,
            @RequestParam(value = "image", required = false) MultipartFile image ,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value="description", required = false) String description)
            {

        try {
            CategoryDto updatedCategory = categoriaService.updateCategory(idCategory, categoryDto);

            ImageDto imageDto = new ImageDto();
            imageDto.setImage(image);
            ImageDtoSimple savedImage = imageService.createImagen(imageDto);

            categoryDto = new CategoryDto();
            categoryDto.setId(idCategory);
            categoryDto.setTitle(title);
            categoryDto.setDescription(description);
            categoryDto.setImage(savedImage);

            return ResponseEntity.status(HttpStatus.OK).body(updatedCategory);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{idCategory}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public ResponseEntity<?> deleteCategory(@PathVariable int idCategory)
            throws BadRequestException {
        try {
            categoriaService.deleteCategory(idCategory);
            return ResponseEntity.status(HttpStatus.OK).body("Se elimino la categoria con id: " + idCategory);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
