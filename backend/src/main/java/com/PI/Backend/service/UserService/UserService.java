package com.PI.Backend.service.UserService;

import com.PI.Backend.dto.Users.UserDto;
import com.PI.Backend.dto.Users.UserDtoSimple;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.security.config.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    ObjectMapper mapper;

    public ResponseEntity<String> getVerifiedUserAccount(String token) {
        Users user = userRepository.findByVerificationCode(token);

        if (user.isVerified()) {

            return ResponseEntity.status(HttpStatus.OK)
                    .body("Bienvenido " + user.getFirstName());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("La cuenta de usuario no ha sido verificada");
        }
    }

    public ResponseEntity<String> getAdminAccount(Authentication authentication) {
        Users user = (Users) authentication.getPrincipal();

        if (user.isVerified()) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, "/admin-dashboard")
                    .body("Bienvenido " + user.getFirstName());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("La cuenta de usuario no ha sido verificada");
        }
    }

    public List<UserDtoSimple> listUser() {
        List<Users> users = (List<Users>) userRepository.findAll();
        List<UserDtoSimple> userDtos = new ArrayList<>();

        for (Users users1 : users) {
            if(users1.isActive()) {
            UserDtoSimple userDto = mapper.convertValue(users1, UserDtoSimple.class);
            userDtos.add(userDto);
            }
        }

        return userDtos;
    }

    public UserDtoSimple searchUser(int idUser) throws ResourceNotFoundException {
        Optional<Users> users = userRepository.findById(idUser);

        UserDtoSimple userDto = null;

        if (users.isPresent()) {
            userDto = mapper.convertValue(users, UserDtoSimple.class);
            return userDto;
        } else {
            throw new BadRequestException("Usuario no encontrado");
        }

    }

    public UserDtoSimple updateUser(int idUser, UserDtoSimple userDto) throws ResourceNotFoundException {
        Optional<Users> usersOptional = userRepository.findById(idUser);

        if (usersOptional.isPresent()) {
            Users users = usersOptional.get();

            if (userDto.getId() < 0) {
                users.setId(userDto.getId());
            }
           if (userDto.getFirstName() != null) {
                users.setFirstName(userDto.getFirstName());
            }
            if (userDto.getLastName() != null) {
                users.setLastName(userDto.getLastName());
            }
            if (userDto.getPhoneNumber() > 0) {
                users.setPhoneNumber(userDto.getPhoneNumber());
            }
            if (userDto.getRole() != null) {
                users.setRole(userDto.getRole());
            }

            Users updatedUser = userRepository.save(users);

            userDto.setId(updatedUser.getId());
            userDto.setFirstName(updatedUser.getFirstName());
            userDto.setLastName(updatedUser.getLastName());
            userDto.setEmail(updatedUser.getEmail());
            userDto.setPhoneNumber(updatedUser.getPhoneNumber());
            userDto.setRole(updatedUser.getRole());

            return userDto;
        } else {
            throw new ResourceNotFoundException("No se encontró el usuario y no se modificó correctamente");
        }
    }

    public UserDto deleteUser(int id) throws ResourceNotFoundException {
        Optional<Users> users = userRepository.findById(id);
        UserDto userDto = null;

        if (users.isPresent()) {
            users.get().setActive(false);
            userRepository.save(users.get());
            userDto = mapper.convertValue(users.get(), UserDto.class);
        } else {
            throw new ResourceNotFoundException("El usuario no existe");
        }
        return userDto;
    }

}

