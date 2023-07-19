package com.PI.Backend.dto.Users;

import com.PI.Backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoSimple {


    public int id;

    public String firstName;

    public String lastName;

    public String email;

    public int phoneNumber;
    public Role role;
}
