package com.PI.Backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class MailSenderException extends RuntimeException {
	public MailSenderException(String message) {
		super(message);
	}

}
