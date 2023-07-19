package com.PI.Backend.repository.ReservationRepository;

import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Reservations.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends CrudRepository<Booking, Integer> {
    @Query("SELECT b " +
            "FROM Booking b " +
            "WHERE b.product = :idProduct " +
            "AND b.dateStart <= :dateEnd " +
            "AND b.dateEnd >= :dateStart")
    List<Booking> findBookingsByProductIdAndDateRange(
            @Param("idProduct") Product idProduct,
            @Param("dateStart") LocalDate dateStart,
            @Param("dateEnd") LocalDate dateEnd);

    @Query("SELECT b FROM Booking b WHERE b.user.email = :userEmail AND b.isActive = true")
    List<Booking> findByUserEmailAndIsActive(@Param("userEmail") String userEmail);


//    @Query("SELECT b FROM Booking b WHERE b.isActive = 1")
    List<Booking> findAllByIsActiveTrue();

//    Page<Booking> findAll(Pageable pageable);

    //List<Booking>findByProduct_Id(Integer productId);
//    List<Booking>findByUserEmail(String userEmail);
}
