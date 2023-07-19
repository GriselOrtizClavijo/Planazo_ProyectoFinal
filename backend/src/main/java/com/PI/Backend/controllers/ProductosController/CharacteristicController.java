package com.PI.Backend.controllers.ProductosController;
import com.PI.Backend.dto.ProductsDto.CharacteristicDto;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.OkException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.service.ProductsService.CharacteristicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/characteristic")
public class CharacteristicController {


    @Autowired
    private CharacteristicService characteristicService;

    @GetMapping("/list")
    public ResponseEntity<List<CharacteristicDto>> listCharacteristic() throws IOException, ResourceNotFoundException {
        List<CharacteristicDto> characteristicDto = (List<CharacteristicDto>) characteristicService.listCharacteristic();
        System.out.println("List characteristic");
        return ResponseEntity.status(HttpStatus.OK).body(characteristicDto);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<CharacteristicDto>> createCharacteristic (@RequestBody List<CharacteristicDto> characteristicDto) throws BadRequestException {
        List<CharacteristicDto> characteristic = characteristicService.createCharacteristic(characteristicDto);
        System.out.println("Added characteristic");
        return ResponseEntity.status(HttpStatus.OK).body(characteristic);
    };

    @GetMapping("/search/{idCharacteristic}")
    public ResponseEntity<CharacteristicDto> searchCharacteristic(@PathVariable  int idCharacteristic) throws ResourceNotFoundException {
        CharacteristicDto characteristicDto = characteristicService.searchCharacteristic(idCharacteristic);
        return ResponseEntity.status(HttpStatus.OK).body(characteristicDto);
    }

    @PutMapping ("/update/{idCharacteristic}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CharacteristicDto> updateCharacteristic(@PathVariable int idCharacteristic,@RequestBody  CharacteristicDto characteristicDto) throws ResourceNotFoundException {
        characteristicService.updateCharacteristic(idCharacteristic, characteristicDto);
        return ResponseEntity.status(HttpStatus.OK).body(characteristicDto);

    }

    @DeleteMapping("/delete/{idCharacteristic}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteCharacteristic(@PathVariable int idCharacteristic) throws OkException, ResourceNotFoundException {
        characteristicService.deleteCharacteristic(idCharacteristic);
        return ResponseEntity.status(HttpStatus.OK).body("Se elimino la caracteristica con id: " + idCharacteristic);
    }


}

