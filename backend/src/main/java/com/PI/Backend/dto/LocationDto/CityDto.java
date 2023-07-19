package com.PI.Backend.dto.LocationDto;

import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Location.Province;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CityDto {

	public int id;
	public String name;
	public Province province;

	/*public CityDto(City city) {
		this.id = city.getId();
		this.name = city.getName();
		this.province = city.getProvince();
	}*/
}
