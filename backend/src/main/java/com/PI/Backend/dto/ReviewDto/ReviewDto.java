package com.PI.Backend.dto.ReviewDto;

import com.PI.Backend.dto.ProductsDto.ProductDto;
import com.PI.Backend.dto.ReservationDto.BookingDto;
import com.PI.Backend.dto.Users.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDto {
    public int id;
    public LocalDate date;
    public String comment;
    public int rate;
    public ProductDto product;
    public UserDto user;
    public BookingDto booking;


}

