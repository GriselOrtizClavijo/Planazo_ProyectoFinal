package com.PI.Backend.controllers.UserController;

import com.PI.Backend.dto.Users.UserDtoSimple;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.service.UserService.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

@RestController
@RequestMapping("/session")
@RequiredArgsConstructor
public class UserController {

	private final UserService service;

	@GetMapping("list")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> listUsers() throws ResourceNotFoundException {
		try {
			List<UserDtoSimple> userDtoList = service.listUser();
			return ResponseEntity.status(HttpStatus.OK).body(userDtoList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

		}
	}

	@GetMapping("/search/{idUser}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> searchUser(@PathVariable  int idUser) throws ResourceNotFoundException {
		try {
			UserDtoSimple userDto = service.searchUser(idUser);
			return ResponseEntity.status(HttpStatus.OK).body(userDto);
		} catch(Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PatchMapping("/update/{idUser}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> updateUsers(@PathVariable int idUser, @RequestBody UserDtoSimple userDto)
			throws ResourceNotFoundException {
		try {
			service.updateUser(idUser, userDto);
			return ResponseEntity.status(HttpStatus.OK).body(userDto);
		} catch (Exception e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}

	}

	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<?> deleteUser(@PathVariable int id)
			throws ResourceNotFoundException {
		try {service.deleteUser(id);
			return ResponseEntity.status(HttpStatus.OK).body("Se elimino el usuario con id: " + id);
		} catch (ResourceNotFoundException e){
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/user")
	public ResponseEntity<String> getUserAccount(@RequestParam("token") String token) {
		service.getVerifiedUserAccount(token);
		return ResponseEntity.status(HttpStatus.OK).body("Bievenido a la sesión de usuario");
	}

	@GetMapping("/admin")
	public ResponseEntity<String> getAdminDashboard(Authentication authentication) {
		service.getAdminAccount(authentication);
		return ResponseEntity.status(HttpStatus.OK).body("Bievenido a la sesión de administrador");
	}

	@PostMapping("/logout")
	public RedirectView logout(HttpSession session) {
		session.invalidate();
		return new RedirectView("/home");
	}

}
