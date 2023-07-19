/*package com.PI.Backend.security.dbAdmin;

import static com.PI.Backend.entity.enums.Role.ADMIN;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.exception.UserAlreadyExistsException;
import com.PI.Backend.mail.service.EmailServiceImpl;
import com.PI.Backend.security.authService.AuthenticationResponse;
import com.PI.Backend.security.authService.AuthenticationService;
import com.PI.Backend.security.config.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Service
@AllArgsConstructor
public class AdminInit implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailServiceImpl emailService;
    private final UserRepository repository;

    private final AuthenticationService authenticationService;

    @Override
    @Transactional
    public void run(String... args) {

        Users user = userRepository.findByEmail("planazo.dh@gmail.com").orElse((null));
        if(user != null) {
          throw new UserAlreadyExistsException("Users already exists");
        }
        var adminFirst=(Users.builder()
                .firstName("admin")
                .lastName("adminPrincipal")
                .phoneNumber(123456789)
                .dni("00000")
                    .email("planazo.dh@gmail.com")
                    .password(passwordEncoder.encode("Admin123*"))
                    .role(ADMIN)
                .build());

        var jwtToken = jwtService.generateToken(adminFirst);
        adminFirst.setVerificationCode(jwtToken);
        repository.save(adminFirst);

        emailService.sendVerificationMail(
                new MultipartFile[0],
                adminFirst.getEmail(),
                new String[0],
                "Verificación de cuenta",
                "Por favor, verificar su email dando click en el siguiente enlace:<br><br>"
                        + authenticationService.generateVerificationLink(jwtToken)
                        + "<br><br>"
                        + "Si después de 48 horas no ha realizado la verificación, deberá revisar nuevamente el registro.");
                AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

        //.password(passwordEncoder.encode("0a5bc3e342432f1bad92ffd51b785343ec72906cdba6a26131060b008e786656"))
    }
}*/
