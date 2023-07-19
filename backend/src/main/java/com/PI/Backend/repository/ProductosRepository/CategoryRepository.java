package com.PI.Backend.repository.ProductosRepository;

import com.PI.Backend.entity.Products.Category;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Integer> {
}
