package com.PI.Backend.service.ProductsService;

import com.PI.Backend.dto.ProductsDto.ProductDto;
import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.repository.ProductosRepository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    public ResponseEntity<String> addFavorite (Optional<Users>  user, Optional<Product> product){
        user = userRepository.findById(user.get().getId());
        product = productRepository.findById(product.get().getId());

        if (user.isEmpty() || product.isEmpty()){
            return ResponseEntity.badRequest().body("Usuario o producto no encontrado.");
        }

        Users users = user.get();
        Product products = product.get();
        Set<Product> favorites = users.getFavorites();

        if(!users.isVerified()){
            String verificationEndPoint = baseUrl + "/auth/register";
            return ResponseEntity.badRequest().body("Por favor registrarse en el siguiente enlace" + ", " + verificationEndPoint) ;
        } else if (favorites.contains(products)) {
            return ResponseEntity.badRequest().body("El producto ya está en la lista de favoritos");
        }

        favorites.add(products);
        userRepository.save(users);

        return ResponseEntity.ok("Producto agregado a favoritos.");

    }

    public ResponseEntity<String> deleteFavorite (Optional<Users>  user, Optional<Product> product) {

        if (user.isEmpty() || product.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario o producto no encontrado.");
        }
        Users users = user.get();
        Product products = product.get();

        Set<Product> favorites = users.getFavorites();

        if (!favorites.contains(products)) {
            return ResponseEntity.badRequest().body("El producto no está en la lista de favoritos.");
        }

        favorites.remove(products);
        userRepository.save(users);

        return ResponseEntity.ok("Producto eliminado de favoritos.");
    }

}
