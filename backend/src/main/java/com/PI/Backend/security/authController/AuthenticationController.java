package com.PI.Backend.security.authController;

import com.PI.Backend.entity.users.Users;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.security.authService.AuthenticationRequest;
import com.PI.Backend.security.authService.AuthenticationService;
import com.PI.Backend.security.authService.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://127.0.0.1:5173", "http://localhost:5173", "http://planazo-hosting.s3-website.us-east-2.amazonaws.com" })
@RequiredArgsConstructor
@Log4j2
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        Users user = userRepository.findByEmail(request.getEmail()).orElse((null));
        if(user != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario ya existe");
        }
        log.info("Created Users");
        return ResponseEntity.ok(service.register(request));
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        Users user = userRepository.findByEmail(request.getEmail()).orElse((null));

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Users or password error");
        }  else if(!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cuenta no verificada, por favor dirigirse al enlace de verificación de su correo electrónico");
        }  else if(!user.isActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario dado de baja, registrarse nuevamente");
        }
        log.info("Access allowed to user");

        String token = service.authenticate(request);

        Map<String, Object> response = new HashMap<>();
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

}

