package com.PI.Backend.dto.ProductsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class CharacteristicDto {

    private int id;

    private String title;

    public CharacteristicDto(String title) {
        this.title=title;
    }
}
