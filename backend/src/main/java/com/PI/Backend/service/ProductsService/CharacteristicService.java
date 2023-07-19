package com.PI.Backend.service.ProductsService;
import com.PI.Backend.dto.ProductsDto.CharacteristicDto;
import com.PI.Backend.entity.Products.Characteristic;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.repository.ProductosRepository.CharacteristicRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class CharacteristicService {


    private final CharacteristicRepository characteristicRepository;

    @Autowired
    ObjectMapper mapper;

    public List<CharacteristicDto> createCharacteristic (List<CharacteristicDto> characteristicDtos) {
        List<Characteristic> characteristics = new ArrayList<>();

        for (CharacteristicDto characteristicDto : characteristicDtos) {
            Characteristic characteristic = mapper.convertValue(characteristicDto, Characteristic.class);
            characteristics.add(characteristic);
        }

        List<Characteristic> savedCharacteristics = (List<Characteristic>) characteristicRepository.saveAll(characteristics);

        List<CharacteristicDto> characteristicDtoList = savedCharacteristics.stream()
                .map(city -> mapper.convertValue(city, CharacteristicDto.class))
                .collect(Collectors.toList());

        return characteristicDtoList;
    }

    public String deleteCharacteristic(int id){
        characteristicRepository.deleteById(id);
        return "Se eliminó la característica con id " + id;
    }

    public CharacteristicDto updateCharacteristic (CharacteristicDto characteristicDto){
        Characteristic characteristic = mapper.convertValue(characteristicDto, Characteristic.class);
        characteristicRepository.save(characteristic);
        return characteristicDto;
    }

    public CharacteristicDto searchCharacteristic (int idCharacteristic){
        Optional<Characteristic> characteristic = characteristicRepository.findById(idCharacteristic);
        CharacteristicDto characteristicDto = null;
        if (characteristic.isPresent()){
            characteristicDto = mapper.convertValue(characteristic, CharacteristicDto.class);
        }
        return characteristicDto;
    }

    public List<CharacteristicDto> listCharacteristic(){
        List<Characteristic> characteristics = (List<Characteristic>) characteristicRepository.findAll();
        List<CharacteristicDto> characteristicDto = new ArrayList<>();
        for (Characteristic characteristic: characteristics){
            characteristicDto.add(mapper.convertValue(characteristic, CharacteristicDto.class));
        }
        return  characteristicDto;
    }

    public CharacteristicDto updateCharacteristic(int idCharacteristic, CharacteristicDto characteristicDto) throws ResourceNotFoundException {

        Characteristic characteristic = characteristicRepository.findById(idCharacteristic)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la caracteristica con el id " + idCharacteristic));

        characteristic.setTitle(characteristicDto.getTitle());

        characteristicRepository.save(characteristic);
        characteristicDto = mapper.convertValue(characteristic, CharacteristicDto.class);

        return characteristicDto;
    }





}