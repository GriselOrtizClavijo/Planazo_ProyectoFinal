package com.PI.Backend.dto.Users;

import com.PI.Backend.entity.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    public int id;

    public String firstName;

    public String lastName;

    public String email;

    public int phoneNumber;

    public Role role;

    private boolean isActive;

    private boolean verified;

}
