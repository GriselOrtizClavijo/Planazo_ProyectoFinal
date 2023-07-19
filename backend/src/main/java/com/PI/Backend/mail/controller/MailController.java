package com.PI.Backend.mail.controller;

import com.PI.Backend.mail.service.AccountVerificationService;
import com.PI.Backend.security.authService.AuthenticationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail")
@AllArgsConstructor
@CrossOrigin(origins = { "http://127.0.0.1:5173", "http://localhost:5173",
		"http://planazo-hosting.s3-website.us-east-2.amazonaws.com" })
public class MailController {

	private final AccountVerificationService accountVerificationService;

	@GetMapping("/verified-account")
	public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
		AuthenticationResponse authenticationResponse = new AuthenticationResponse();
		authenticationResponse.setToken(token);
		ResponseEntity<String> confirmedResponse = accountVerificationService.confirmedAccount(authenticationResponse);

		String responseBody = confirmedResponse.getBody();
		HttpStatusCode httpStatus = confirmedResponse.getStatusCode();

		return ResponseEntity.status(httpStatus).body(responseBody);
	}

}
