package com.PI.Backend.repository.ProductosRepository;

import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Products.Category;
import com.PI.Backend.entity.Products.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {

	Page<Product> findAllByAvailabilityTrue(Pageable pageable);
    Page<Product> findByCategoriesInAndAvailabilityTrue(List<Category> categories, Pageable pageable);

    Page<Product> findByCityInAndAvailabilityTrue(List<City> cities, Pageable pageable);

    Product findByTitle(String title);

    @Query("SELECT p " +
            "FROM Product p " +
            "WHERE p.availability = true " +
            "AND p NOT IN (" +
            "   SELECT b.product " +
            "   FROM Booking b " +
            "   WHERE b.dateStart <= :dateEnd " +
            "   AND b.dateEnd >= :dateStart " +
            "   AND b.isActive = true" +
            ")")
    List<Product> findProductsByBookingDateRange(
            @Param("dateStart") LocalDate dateStart,
            @Param("dateEnd") LocalDate dateEnd);


    @Query("SELECT new Map(" +
            "b.dateStart as from, b.dateEnd as to) " +
            "FROM Booking b " +
            "WHERE b.product.id = :idProduct " +
            "AND b.isActive = true")
    List<Map<String, LocalDate>> getBookingsWithDateRangeByProductId(@Param("idProduct") int productId);

    @Query("SELECT p " +
            "FROM Product p " +
            "WHERE p.availability = true " +
            "AND p.city IN :cities " +
            "AND NOT EXISTS (" +
            "   SELECT b " +
            "   FROM Booking b " +
            "   WHERE b.product = p " +
            "   AND b.dateStart <= :dateEnd " +
            "   AND b.dateEnd >= :dateStart" +
            "   AND b.isActive = true"+
            ")")
    Page<Product> findAvailableProductsByCityAndDateRange(
            @Param("cities") List<City> cities,
            @Param("dateStart") LocalDate dateStart,
            @Param("dateEnd") LocalDate dateEnd,
            Pageable pageable);

    @Query("SELECT p " +
            "FROM Product p " +
            "INNER JOIN p.categories c " +
            "WHERE p.availability = true " +
            "AND p.city IN :cities " +
            "AND c IN :categories " +
            "AND NOT EXISTS (" +
            "   SELECT b " +
            "   FROM Booking b " +
            "   WHERE b.product = p " +
            "   AND b.dateStart <= :dateEnd " +
            "   AND b.dateEnd >= :dateStart" +
            "   AND b.isActive = true" +
            ")")
    Page<Product> findAvailableProductsByCityAndCategoriesAndDateRange(
            @Param("cities") List<City> cities,
            @Param("categories") List<Category> categories,
            @Param("dateStart") LocalDate dateStart,
            @Param("dateEnd") LocalDate dateEnd,
            Pageable pageable);

    @Query("SELECT p " +
            "FROM Product p " +
            "INNER JOIN p.categories c " +
            "WHERE p.availability = true " +
            "AND c IN :categories " +
            "AND NOT EXISTS (" +
            "   SELECT b " +
            "   FROM Booking b " +
            "   WHERE b.product = p " +
            "   AND b.dateStart <= :dateEnd " +
            "   AND b.dateEnd >= :dateStart" +
            "   AND b.isActive = true"+
            ")")
    Page<Product> findAvailableProductsByCategoriesAndDateRange(
            @Param("categories") List<Category> categories,
            @Param("dateStart") LocalDate dateStart,
            @Param("dateEnd") LocalDate dateEnd,
            Pageable pageable);

    @Query("SELECT p " +
            "FROM Product p " +
            "INNER JOIN p.categories c " +
            "WHERE p.availability = true " +
            "AND p.city IN :cities " +
            "AND c IN :categories")
    Page<Product> findProductsByCityAndCategories(
            @Param("cities") List<City> cities,
            @Param("categories") List<Category> categories,
            Pageable pageable);
}
