package com.PI.Backend.repository.Location;

import com.PI.Backend.entity.Location.City;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends CrudRepository<City, Integer> {

    List<City> findByName(String name);

    List<City> findByProvinceId(Integer idProvincia);

    @Query("SELECT c " +
            "FROM City c " +
            "WHERE LOWER(c.name) " +
            "LIKE LOWER(CONCAT('%', :partialName, '%'))")
    List<City> findByPartialName(@Param("partialName") String partialName);

    @Query("SELECT c " +
            "FROM City c " +
            "WHERE c.province.id = :provinceId " +
            "AND LOWER(c.name) LIKE LOWER(CONCAT('%', :partialName, '%'))")
    List<City> findByProvinceIdAndPartialName(
            @Param("provinceId") int idProvincia,
            @Param("partialName") String name);
}
