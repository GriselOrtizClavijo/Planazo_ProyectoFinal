package com.PI.Backend.dto.ProductsDto;

import lombok.*;
import org.springframework.data.repository.cdi.Eager;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDtoBooking {

    public int id;
    public String title;
    public BigDecimal priceAdult;
    public BigDecimal priceMinor;

}
