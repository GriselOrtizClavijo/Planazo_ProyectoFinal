package com.PI.Backend.entity;

import com.PI.Backend.dto.ProductsDto.ProductDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {

	private List<ProductDto> data;
	private Pagination pagination;

}
