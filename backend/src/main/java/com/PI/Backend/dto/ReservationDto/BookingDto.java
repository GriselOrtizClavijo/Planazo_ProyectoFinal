package com.PI.Backend.dto.ReservationDto;

import com.PI.Backend.dto.ProductsDto.ProductDtoBooking;
import com.PI.Backend.dto.Users.UserDtoBooking;
import com.PI.Backend.entity.Reservations.PaymentType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDto {

	public int id;
	public ProductDtoBooking product;
	public UserDtoBooking user;
	public PaymentType paymentType;
	public LocalDate dateStart;
	public LocalDate dateEnd;
	public BigDecimal totalPrice;
	public int countAdults;
	public int countChildren;
	public boolean COVIDvaccine;
	public boolean reducedMobility;
	public String comment;
	public boolean isActive;
	}
