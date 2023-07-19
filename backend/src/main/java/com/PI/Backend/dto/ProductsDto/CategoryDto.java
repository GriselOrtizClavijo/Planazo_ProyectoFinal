package com.PI.Backend.dto.ProductsDto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryDto {

	public int id;
	public String title;
	private String description;
	private ImageDtoSimple image;
	private String video;
	private boolean isActive;


}

