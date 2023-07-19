package com.PI.Backend.repository.Location;

import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Location.Province;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends CrudRepository<Province, Integer> {

	List<City> findByCities(int provinceId);
}
