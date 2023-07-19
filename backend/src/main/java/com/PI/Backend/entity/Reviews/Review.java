package com.PI.Backend.entity.Reviews;

import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.users.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;

@Entity
@Table(name = "Review")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idReview", nullable = false)
    private int id;

    @Column
    private int rate;

    @Column
    private LocalDate date;

    @Column(length = 300)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @NonNull
    private Product product;

    @ManyToOne
    //(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NonNull
    private Users user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @NonNull
    private Booking booking;

}
