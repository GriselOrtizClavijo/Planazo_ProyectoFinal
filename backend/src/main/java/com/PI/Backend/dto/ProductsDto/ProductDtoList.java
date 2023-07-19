package com.PI.Backend.dto.ProductsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDtoList {

	public int id;
	public List<ImageDtoSimple> img;
	public String title;

}
