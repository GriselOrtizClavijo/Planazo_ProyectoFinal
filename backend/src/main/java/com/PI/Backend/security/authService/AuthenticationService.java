package com.PI.Backend.security.authService;

import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.UserAlreadyExistsException;
import com.PI.Backend.mail.service.EmailServiceImpl;
import com.PI.Backend.security.config.JwtService;
import com.PI.Backend.entity.enums.Role;
import com.PI.Backend.entity.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final EmailServiceImpl emailService;

	@Value("${app.base-url}")
	private String baseUrl;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	public AuthenticationResponse register(RegisterRequest request) {
		Users user = this.repository.findByEmail(request.getEmail()).orElse((null));
		if (user != null) {
			throw new UserAlreadyExistsException("Users already exists");
		}
		var users = Users.builder()
				.firstName(request.getFirstName())
				.lastName(request.getLastName())
				.email(request.getEmail())
				.dni(request.getDni())
				.phoneNumber(request.getPhoneNumber())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.build();

		var jwtToken = jwtService.generateToken(users);
		users.setVerificationCode(jwtToken);
		repository.save(users);

		emailService.sendVerificationMail(
				new MultipartFile[0],
				request.getEmail(),
				new String[0],
				"Verificación de cuenta",
				"Por favor, verificar su email dando click en el siguiente enlace:<br><br>"
						+ generateVerificationLink(jwtToken)
						+ "<br><br>"
						+ "Si después de 48 horas no ha realizado la verificación, deberá revisar nuevamente el registro.");

		return AuthenticationResponse.builder()
				.token(jwtToken)
				.build();
	}

	public String authenticate(AuthenticationRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(),
						request.getPassword()));
		var user = repository.findByEmail(request.getEmail())
				.orElseThrow();

		var jwtToken = jwtService.generateToken(user);

		 AuthenticationResponse.builder()
				.token(jwtToken)
				.build();

		return jwtToken;
	}

	public String generateVerificationLink(String jwtToken) {
		String verificationEndPoint = frontendUrl + "/verification";
		return verificationEndPoint + "?token=" + jwtToken;
	}

}
