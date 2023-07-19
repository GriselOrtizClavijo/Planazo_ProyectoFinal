package com.PI.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginacionDto {

	public long totalItems;
	public int pageSize;
	public int pageNumber;
	public int previousPage;
	public int nextPage;
	public int totalPages;
}
