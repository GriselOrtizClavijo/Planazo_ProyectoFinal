package com.PI.Backend.service.ReviewsService;

import com.PI.Backend.dto.ReviewDto.ReviewDto;
import com.PI.Backend.dto.Users.UserDto;
import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.Reviews.Review;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.ProductosRepository.ProductRepository;
import com.PI.Backend.repository.ReservationRepository.BookingRepository;
import com.PI.Backend.repository.ReviewRepository.ReviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDate;
import java.util.*;

@Service
@AllArgsConstructor
public class ReviewService {
    // * Prop para acceso a capa
    // ---------------------------------------------------------------------------------------
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    ObjectMapper mapper;

    /*----Listar todos las reviews de un producto */

    public List<ReviewDto> listReviews(int productId) {
        List<Review> reviews = reviewRepository.findAllByProductId(productId);
        List<ReviewDto> reviewDtos = new ArrayList<>();

        for (Review review : reviews) {
            ReviewDto reviewDto = new ReviewDto();
            reviewDto.setId(review.getId());
            reviewDto.setRate(review.getRate());
            reviewDto.setDate(review.getDate());
            reviewDto.setComment(review.getComment());
            reviewDto.setUser(mapper.convertValue(review.getUser(), UserDto.class));


            reviewDtos.add(reviewDto);
        }

        return reviewDtos;
    }

    /*---- Crear una review */
    public ReviewDto createReview(ReviewDto reviewDto, Users user) throws ResourceNotFoundException {
        // Obtener el producto por su ID
        Product product = productRepository.findById(reviewDto.getProduct().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        Booking booking = bookingRepository.findById(reviewDto.getBooking().getId())
                .orElseThrow(()-> new ResourceAccessException("Reserva no encontrada"));

        if (user == null || !user.isVerified()) {
            throw new BadRequestException("El Usuario no se encuentra debe Ingresar o Registrarse  para poder comentar ");
        }

        boolean reviewExists = reviewRepository.existsByUserAndBooking(user, booking);
        if (reviewExists) {
            throw new IllegalArgumentException("El usuario ya ha realizado una revisión para esta reserva");
        }


        Review review = new Review();
        review.setDate(LocalDate.now());
        review.setComment(reviewDto.getComment());
        review.setRate(reviewDto.getRate());
        review.setProduct(product);
        review.setUser(user);
        review.setBooking(booking);

        Review savedReview = reviewRepository.save(review);

        return mapper.convertValue(savedReview, ReviewDto.class);
    }

    /*---- Eliminar una review */
    public int deleteReview(int reviewId) throws ResourceNotFoundException {
        Optional<Review> review = reviewRepository.findById(reviewId);

        if (review.isPresent()) {
            reviewRepository.deleteById(reviewId);

        } else {
            throw new ResourceNotFoundException("La review no existe");
        }
        return reviewId;
    };

    /*---- Obtener promedio de opiniones/rating de un producto */
    public int getProductAverageRate(int productId) {
        return reviewRepository.findAverageRateByProductId(productId);
    }
    /*--- Buscar review por bookingId */
    public ReviewDto searchReview(int bookingId, Users user) throws ResourceNotFoundException {
        Optional<Review> review = reviewRepository.findByBookingIdAndUserId(bookingId, user.getId());
        ReviewDto reviewDto = null;
        if (review.isPresent()) {
            Review reviewEntity = review.get();
            reviewDto = new ReviewDto();
            reviewDto.setId(reviewEntity.getId());
            reviewDto.setDate(reviewEntity.getDate());
            reviewDto.setComment(reviewEntity.getComment());
            reviewDto.setRate(reviewEntity.getRate());

        } else {
            throw new ResourceNotFoundException("No hay reviews de este usuario para esta reserva");
        }
        return reviewDto;
    }

}


