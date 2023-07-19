package com.PI.Backend.controllers.ProductosController;

import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.repository.ProductosRepository.ProductRepository;
import com.PI.Backend.service.ProductsService.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/favs")
@RequiredArgsConstructor
public class FavoritesController {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final FavoriteService favoriteService;

    @Value("${app.base-url}")
    private String baseUrl;

    @PostMapping("/us/{userId}/fav/{productId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<String> addFav(@PathVariable Optional<Users> userId, @PathVariable Optional<Product> productId) {

        try {
            ResponseEntity<String> response = favoriteService.addFavorite(userId, productId);
            return response;
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al agregar el producto de favoritos.");
        }

    }

    @DeleteMapping("/us/{userId}/fav/{productId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<String> deleteFav(@PathVariable Optional<Users> userId, @PathVariable Optional<Product> productId) {
        try {
            ResponseEntity<String> response = favoriteService.deleteFavorite(userId, productId);
            return response;
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al eliminar el producto de favoritos.");
        }

    }
}



