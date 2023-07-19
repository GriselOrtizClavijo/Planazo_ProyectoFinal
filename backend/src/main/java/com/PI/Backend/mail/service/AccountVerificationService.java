package com.PI.Backend.mail.service;

import com.PI.Backend.entity.users.Users;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.security.authService.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AccountVerificationService {

	private final UserRepository userRepository;

	private final EmailServiceImpl emailService;

	@Value("${spring.mail.username}")
	private String fromEmail;

	@Value("${app.base-url}")
	private String baseUrl;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	public ResponseEntity<String> verifyAccount(AuthenticationResponse token) {

		if (token != null && StringUtils.hasText(token.getToken())) {
			Users user = userRepository.findByVerificationCode(token.getToken());
			if (user != null) {
				user.setVerified(true);
				user.setActive(true);
				userRepository.save(user);

				return ResponseEntity.status(HttpStatus.FOUND)
						.header(HttpHeaders.LOCATION, "/mail/verified-account")
						.body("{\"message\": \"Account verified successfully\"}");
			} else {
				return ResponseEntity.badRequest().body("Invalid verification token");
			}
		}
		return ResponseEntity.ok("User Page");
	}

	public ResponseEntity<String> confirmedAccount(AuthenticationResponse token) {

		if (token != null && StringUtils.hasText(token.getToken())) {
			Users user = userRepository.findByVerificationCode(token.getToken());

			if (user != null) {
				user.setVerified(true);
				user.setActive(true);
				userRepository.save(user);

				String link = "";

				link = frontendUrl + "/login";

				emailService.sendVerificationMail(
						new MultipartFile[0],
						user.getEmail(),
						new String[0],
						"Confirmación de cuenta",
						"Felicitaciones, tu cuenta ha sido confirmada! "
								+ "<br><br>"
								+ "Da click en el siguiente enlace y elige tu próxima aventura..."
								+ "<br><br>"
								+ link);
			}
		}
		return ResponseEntity.ok("Felicidades ! Cuenta confirmada");
	}


}
