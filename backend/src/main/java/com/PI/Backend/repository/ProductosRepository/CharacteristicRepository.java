package com.PI.Backend.repository.ProductosRepository;

import com.PI.Backend.entity.Products.Characteristic;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CharacteristicRepository extends CrudRepository<Characteristic, Integer> {
}

