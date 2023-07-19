package com.PI.Backend.repository.ReviewRepository;

import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.Reviews.Review;
import com.PI.Backend.entity.users.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId")
    List<Review> findAllByProductId(@Param("productId") int productId);
    boolean existsByUserAndBooking(Users user, Booking booking);
    @Query("SELECT r FROM Review r WHERE r.booking.id = :bookingId AND r.user.id = :userId")
    Optional<Review> findByBookingIdAndUserId(@Param("bookingId") int bookingId, @Param("userId") int userId);
    @Query("SELECT COALESCE(AVG(r.rate), 0) FROM Review r WHERE r.product.id = :productId")
    int findAverageRateByProductId(@Param("productId") int productId);
}
