package com.PI.Backend.entity.users;

import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.Reviews.Review;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.PI.Backend.entity.enums.Role;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Users")
public class Users implements UserDetails {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id", nullable = false)
        private int id;

        @Column(nullable = false, length = 20)
        @NotEmpty
        private String firstName;

        @Column(nullable = false, length = 20)
        private String lastName;

        @Column(nullable = false, length = 20)
        private String dni;
        @Column(unique = true, nullable = false)
        @Email
        private String email;

        @NotNull
        private String password;

        @Column(nullable = false, length = 40)
        @Digits(integer = 9, message = "El número de teléfono debe tener exactamente 9 dígitos", fraction = 0)
        private int phoneNumber;

        @Enumerated(EnumType.STRING)
        private Role role;

        @Column
        private String verificationCode;

        @Column
        private boolean verified;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private List<Review> reviews;


        @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JoinTable(
                name = "favorites",
                joinColumns = @JoinColumn(name = "idUser", referencedColumnName = "id"),
                inverseJoinColumns = @JoinColumn(name = "idProduct", referencedColumnName = "idProduct")
        )
        @JsonIgnore
        private Set<Product> favorites;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private List<Booking> bookings;

        private boolean isActive;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
