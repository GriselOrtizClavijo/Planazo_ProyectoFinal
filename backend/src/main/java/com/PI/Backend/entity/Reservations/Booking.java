package com.PI.Backend.entity.Reservations;

import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.users.Users;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "Bookings")
@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idBooking", nullable = false)
	private int id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idProduct")
	private Product product;

	@ManyToOne
	@JoinColumn(name = "idUser")
	private Users user;

	@ManyToOne
	@JoinColumn(name = "idPaymentType")
	@NonNull
	private PaymentType paymentType;

	@NonNull
	private LocalDate dateStart;
	@NonNull
	private LocalDate dateEnd;

	private BigDecimal totalPrice;
	@NonNull
	private int countAdults;
	@NonNull
	private int countChildren;
	@NonNull
	private boolean COVIDvaccine;
	@NonNull
	private boolean reducedMobility;
	@Column(length = 300)
	private String comment;

	private boolean isActive;


}
