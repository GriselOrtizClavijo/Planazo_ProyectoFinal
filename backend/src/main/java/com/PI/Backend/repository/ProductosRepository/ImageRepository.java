package com.PI.Backend.repository.ProductosRepository;

import com.PI.Backend.entity.Products.Image;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends CrudRepository<Image, Integer> {
}
