package com.PI.Backend.dto.ProductsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageDto {

	public int id;
	public String imgUrl;
	public MultipartFile image;

}
