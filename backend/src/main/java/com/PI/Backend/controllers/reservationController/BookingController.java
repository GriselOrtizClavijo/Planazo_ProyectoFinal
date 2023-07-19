package com.PI.Backend.controllers.reservationController;

import com.PI.Backend.dto.ReservationDto.BookingDto;
import com.PI.Backend.dto.ReservationDto.BookingDtoList;
import com.PI.Backend.dto.Users.UserDto;
import com.PI.Backend.dto.Users.UserDtoSimple;
import com.PI.Backend.entity.Products.Image;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.security.config.JwtService;
import com.PI.Backend.service.ReservationService.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/booking")
public class BookingController {

	private final BookingService bookingService;


	@GetMapping("/list")
	public ResponseEntity<List<BookingDtoList>> listBooking(Authentication authentication) {
		List<BookingDtoList> bookingDtos;

		if (isAdminUser(authentication)) {
			bookingDtos = bookingService.listBooking();

		} else {
			String idUser = getUserId(authentication);
			bookingDtos = bookingService.listBookingByIdUser(idUser);
		}

		return ResponseEntity.status(HttpStatus.OK).body(bookingDtos);
	}

	private boolean isAdminUser(Authentication authentication) {
		return authentication.getAuthorities().stream()
				.anyMatch(role -> role.getAuthority().equals("ADMIN"));
	}

	private String getUserId(Authentication authentication) {
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		return userDetails.getUsername(); // Assuming the username is the user ID
	}

	@PostMapping("/create")
	@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
	public ResponseEntity<?> createBooking(@RequestBody BookingDto booking, Authentication authentication)
			throws ResourceNotFoundException, IOException {

		try {
			Users user = (Users) authentication.getPrincipal();
			BookingDto createdBooking = null;
			createdBooking = bookingService.createBooking(booking, user);
			return ResponseEntity.status(HttpStatus.OK).body(createdBooking.getId());
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (BadRequestException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@GetMapping("/search/{bookingId}")
	@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
	public ResponseEntity<Object> searchBooking(@PathVariable int bookingId) throws ResourceNotFoundException{
		Optional<Booking> booking = bookingService.searchBooking(bookingId);

		Map<String, Object> response = new HashMap<>();
		response.put("id", booking.get().getId());
		response.put("dateStart", booking.get().getDateStart());
		response.put("dateEnd", booking.get().getDateEnd());
		response.put("totalPrice", booking.get().getTotalPrice());
		response.put("countAdults", booking.get().getCountAdults());
		response.put("countChildren", booking.get().getCountChildren());
		response.put("COVIDvaccine", booking.get().isCOVIDvaccine());
		response.put("reducedMobility", booking.get().isReducedMobility());
		response.put("comment", booking.get().getComment());
		response.put("idProduct", booking.get().getProduct().getId());
		response.put("title", booking.get().getProduct().getTitle());
		response.put("city", booking.get().getProduct().getCity().getName() + ", " + booking.get().getProduct().getCity().getProvince().getName());

		List<Image> images = booking.get().getProduct().getImg();
		if (!images.isEmpty()) {
			int randomIndex = new Random().nextInt(images.size());
			Image randomImage = images.stream().skip(randomIndex).findFirst().orElse(null);
			if (randomImage != null) {
				response.put("img", randomImage.getImgUrl());
			}
		}

		response.put("characteristic", booking.get().getProduct().getCharacteristics());
		response.put("firsName", booking.get().getUser().getFirstName());
		response.put("lastName", booking.get().getUser().getLastName());
		response.put("email", booking.get().getUser().getEmail());
		response.put("phoneNumber", booking.get().getUser().getPhoneNumber());
		response.put("paymentType", booking.get().getPaymentType());

		return ResponseEntity.status(HttpStatus.OK).body(response);

	}


	@DeleteMapping("/delete/{bookingId}")
	@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
	public ResponseEntity<?> deleteBooking(@PathVariable int bookingId) throws ResourceNotFoundException {
		try {
			bookingService.deleteBooking(bookingId);
			return ResponseEntity.status(HttpStatus.OK).body("Se eliminó la reserva con id: " + bookingId);
		}catch (Exception e){
			return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

}
