package com.PI.Backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.OK)
public class OkException extends Exception {
	public OkException(String message) {
		super(message);
	}
}
