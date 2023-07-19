package com.PI.Backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pagination {

	private long total_elements;
	private int page_size;
	private int current_page;
	private Integer previous_page;
	private Integer next_page;
	private int total_pages;
}
