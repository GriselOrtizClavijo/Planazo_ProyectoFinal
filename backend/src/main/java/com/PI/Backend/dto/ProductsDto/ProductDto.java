package com.PI.Backend.dto.ProductsDto;

import com.PI.Backend.dto.LocationDto.CityDto;
import com.PI.Backend.dto.ReservationDto.BookingDto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDto {

	public int id;
	public Set<CategoryDtoSimple> categories;
	public CityDto city;
	public Set<ImageDtoSimple> img;
	public String title;
	public BigDecimal priceAdult;
	public BigDecimal priceMinor;
	public String description;
	public int ranking;
	public boolean availability;
	public Set<CharacteristicDto> characteristics;
	public List<Map<String, String>> bookings;
	public String policy;
	public Double lat;
	public Double lng;



	public void setBookings(List<Map<String, String>> bookings) {
		this.bookings = bookings;
	}
}
