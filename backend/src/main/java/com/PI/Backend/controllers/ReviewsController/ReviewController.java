package com.PI.Backend.controllers.ReviewsController;

import com.PI.Backend.dto.ReviewDto.ReviewDto;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.OkException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.service.ReviewsService.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    private final ReviewService reviewService;

    @GetMapping("/list/{productId}")
    public ResponseEntity<Object> listReviews(@PathVariable int productId) {
            List<ReviewDto> reviewDtos = reviewService.listReviews(productId);
            List<Map<String, Object>> responseList = new ArrayList<>();
            for (ReviewDto reviewDto : reviewDtos) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", reviewDto.getId());
                response.put("date", reviewDto.getDate());
                response.put("comment", reviewDto.getComment());
                response.put("rate", reviewDto.getRate());
                response.put("name", reviewDto.getUser().getFirstName() + " " + reviewDto.getUser().getLastName());

                responseList.add(response);
            }
            return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @GetMapping("/search/{bookingId}")
    public ResponseEntity<?> searchReview(@PathVariable int bookingId,Authentication authentication){
        try {
            Users user = (Users) authentication.getPrincipal();
            ReviewDto review = reviewService.searchReview(bookingId, user);
            Map<String, Object> response = new HashMap<>();
            response.put("id", review.getId());
            response.put("date", review.getDate());
            response.put("comment", review.getComment());
            response.put("rate", review.getRate());
            //response.put("name", review.getUser().getFirstName() + " " + review.getUser().getLastName());
            return  ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody ReviewDto reviewDto, Authentication authentication) {
        try {
            Users user = (Users) authentication.getPrincipal();
            ReviewDto createdReview = reviewService.createReview(reviewDto, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview.getId());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable int reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.status(HttpStatus.OK).body("Se elimino la review con id: " + reviewId);
        } catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
    
}
