package com.PI.Backend.dto.ReservationDto;

import com.PI.Backend.dto.ProductsDto.ProductDtoBooking;
import com.PI.Backend.dto.ProductsDto.ProductDtoList;
import com.PI.Backend.dto.Users.UserDtoBooking;
import com.PI.Backend.entity.Reservations.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDtoList {

	public int id;
	public ProductDtoList product;
	public LocalDate dateStart;
	public LocalDate dateEnd;
	public BigDecimal totalPrice;


}
