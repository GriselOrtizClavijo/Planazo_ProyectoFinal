package com.PI.Backend.dto.ProductsDto;

import com.PI.Backend.dto.LocationDto.CityDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDtoSimple {

	public int id;
	public CityDto city;
	public List<ImageDtoSimple> img;
	public String title;
	public BigDecimal priceAdult;
	public int ranking;
	public String policy;
}
