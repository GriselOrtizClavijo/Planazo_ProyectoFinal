package com.PI.Backend.service.ReservationService;

import com.PI.Backend.dto.ProductsDto.ImageDtoSimple;
import com.PI.Backend.dto.ProductsDto.ProductDtoList;
import com.PI.Backend.dto.ReservationDto.BookingDto;
import com.PI.Backend.dto.ReservationDto.BookingDtoList;
import com.PI.Backend.dto.Users.UserDtoSimple;
import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Products.Product;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.Reservations.PaymentType;
import com.PI.Backend.entity.users.UserRepository;
import com.PI.Backend.entity.users.Users;
import com.PI.Backend.exception.BadRequestException;
import com.PI.Backend.exception.ResourceNotFoundException;
import com.PI.Backend.mail.service.EmailServiceImpl;
import com.PI.Backend.repository.Location.CityRepository;
import com.PI.Backend.repository.ProductosRepository.ProductRepository;
import com.PI.Backend.repository.ReservationRepository.BookingRepository;
import com.PI.Backend.repository.ReservationRepository.TypePaymentRespository;
import com.PI.Backend.security.config.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;



@Service
@RequiredArgsConstructor
@Component
public class BookingService {

	private final BookingRepository bookingRepository;
	private final UserRepository userRepository;

	private final ObjectMapper mapper;
	private final ProductRepository productRepository;

	private final EmailServiceImpl emailService;
	private final TypePaymentRespository typePaymentRespository;

	private final CityRepository cityRepository;

	public List<BookingDtoList> listBooking() {
		List<Booking> bookingList = (List<Booking>) bookingRepository.findAll();
		List <BookingDtoList> bookingDtosList = new ArrayList<>();
		for (Booking booking : bookingList) {
			BookingDtoList bookingDto = mapper.convertValue(booking, BookingDtoList.class);
			ProductDtoList productDto = bookingDto.getProduct();
			if (productDto != null) {
				List<ImageDtoSimple> images = productDto.getImg();
				if (!images.isEmpty()) {
					ImageDtoSimple firstImage = images.get(0);
					productDto.setImg(Collections.singletonList(firstImage));
					}
				}
				bookingDtosList.add(bookingDto);
			}
		if (bookingDtosList.isEmpty()) {
			throw new BadRequestException("Usuario no encontrado");
		}

		return bookingDtosList;
	}


	public List<BookingDtoList> listBookingByIdUser(String username) {
		List<Booking> bookingList = bookingRepository.findByUserEmailAndIsActive(username);
		List <BookingDtoList> bookingDtos = new ArrayList<>();
		for (Booking booking : bookingList) {
			BookingDtoList bookingDto = mapper.convertValue(booking, BookingDtoList.class);

			ProductDtoList productDto = bookingDto.getProduct();

			if (productDto != null) {
				List<ImageDtoSimple> images = productDto.getImg();
				if (!images.isEmpty()) {
					ImageDtoSimple firstImage = images.get(0);
					productDto.setImg(Collections.singletonList(firstImage));
				}
			}

			bookingDtos.add(bookingDto);
		}

		if (bookingDtos.isEmpty()) {
			throw new BadRequestException("Usuario no encontrado");
		}

		return bookingDtos;
	}



	public BookingDto createBooking(BookingDto bookingDto, Users user) throws ResourceNotFoundException, IOException {
		try {
			Product product = productRepository.findById(bookingDto.getProduct().getId())
					.orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

			PaymentType paymentType = typePaymentRespository.findById(bookingDto.getPaymentType().getId())
					.orElseThrow(() -> new ResourceNotFoundException("Tipo de pago no encontrado"));

			if (user == null || !user.isVerified()) {
				throw new BadRequestException("El Usuario no se encuentra debe Ingresar o Registrarse  para poder hacer una reserva ");
			} else if (bookingDto.getProduct() == null || bookingDto.getDateStart() == null || bookingDto.getDateEnd() == null
					|| bookingDto.getCountAdults() <= 0 || bookingDto.getCountChildren() < 0 || bookingDto.getPaymentType() == null) {
				throw new BadRequestException("Por favor complete todos los datos de la reserva");
			}

			LocalDate dateStart = bookingDto.getDateStart();
			LocalDate dateEnd = bookingDto.getDateEnd();

			if (!isProductAvailable(product, dateStart, dateEnd)) {
				throw new ResourceNotFoundException("El producto no está disponible para las fechas seleccionadas");
			}


			Booking booking = new Booking();
			booking.setProduct(product);
			booking.setUser(user);
			booking.setDateStart(bookingDto.getDateStart());
			booking.setDateEnd(bookingDto.getDateEnd());
			booking.setTotalPrice(bookingDto.getTotalPrice());
			booking.setCountAdults(bookingDto.getCountAdults());
			booking.setCountChildren(bookingDto.getCountChildren());
			booking.setCOVIDvaccine(bookingDto.isCOVIDvaccine());
			booking.setReducedMobility(bookingDto.isReducedMobility());
			booking.setComment(bookingDto.getComment());
			booking.setPaymentType(paymentType);
			booking.setActive(true);

			bookingRepository.save(booking);

			String reducedMobilityText = bookingDto.isReducedMobility() ? "Requerido" : "No requerido";
			String covidVaccineText = bookingDto.isCOVIDvaccine() ? "Completo" : "Incompleto";

			emailService.sendVerificationMail(
					new MultipartFile[0],
					user.getEmail(),
					new String[0],
					"Confirmación de Reserva",
					"<p style=\"text-align=center;\"><strong><h3>A continuación encontrarás los detalles de tu reserva: </h3></strong></p>"
							+ "<p><br></p>"
							+ "<span><strong>Experiencia: </strong>" + product.getTitle() + "</span>"
							+ "<br>"
							+ "<span><strong>Usuario principal en la reserva: </strong> " + user.getFirstName() + " " + user.getLastName() + "</span>"
							+ "<br><br>"
							+ "<span><strong>Fechas de la reserva:</strong></span>"
							+ "<br>"
							+ "<span><strong>Fecha de inicio: </strong> " + bookingDto.getDateStart() + "</span>" + "  "
							+ "<span><strong>Fecha final: </strong> " + bookingDto.getDateEnd() + "</span>"
							+ "<br><br>"
							+ "<span><strong>Valor total de la reserva: </strong> $" + bookingDto.getTotalPrice() + "</span>"
							+ "<br>"
							+ "<span><strong>Método de pago: </strong> " + paymentType.getTittle() + "</span>"
							+ "<br><br>"
							+ "<span><strong>Cantidad de Adultos:</strong> " + bookingDto.getCountAdults() + "</span>" + "  "
							+ "<span><strong>Cantidad de niños:</strong> " + bookingDto.getCountChildren() + "</span>"
							+ "<br><br>"
							+ "<span><strong>Requerimientos adicionales: </strong></span>"
							+ "<br><br>"
							+ "<span><strong>Requiere asistencia por persona con movilidad reducida: </strong>" + reducedMobilityText + "</span>"
							+ "<br>"
							+ "<span><strong>Estado de vacunación: </strong> " + covidVaccineText + "</span>"
							+ "<br>"
							+ "<span><strong>Comentarios adicionales: </strong> " + bookingDto.getComment() + "</span>"
							+ "<p><br></p>"
							+ "<img style=\"width:200px;height:200px;display: block; margin: 0 auto;\" src=\"https://proyectointegrador-c7-grupo5.s3.us-east-2.amazonaws.com/1686007327981_Logo.png\" />"
			);

			bookingDto = mapper.convertValue(booking, BookingDto.class);
			return bookingDto;
		} catch (Exception e) {
			throw new BadRequestException("Error al crear la reserva");}

	}

	private boolean isProductAvailable(Product product, LocalDate dateStart, LocalDate dateEnd) {
		List<Booking> bookings = bookingRepository.findBookingsByProductIdAndDateRange(product, dateStart, dateEnd);
		return bookings.isEmpty();
	}



	public Optional<Booking> searchBooking(int bookingId) throws ResourceNotFoundException{
		Optional<Booking> booking = bookingRepository.findById(bookingId);

		if(booking.isPresent()){
			City cityDto = booking.get().getProduct().getCity();
			City city = cityRepository.findById(cityDto.getId())
					.orElseThrow(() -> new BadRequestException("City not found"));
			booking.get().getProduct().setCity(cityDto);

		} else {
			throw new BadRequestException("La reserva buscada no existe");
		}
		return booking;
	}

	public BookingDto deleteBooking(int bookingId) throws ResourceNotFoundException{
		Optional<Booking> booking = bookingRepository.findById(bookingId);
		BookingDto bookingDto = null;

		if(booking.isPresent()){
			booking.get().setActive(false);
			bookingRepository.save(booking.get());
			bookingDto = mapper.convertValue(booking, BookingDto.class);
		} else {
			throw new ResourceNotFoundException("La reserva no existe");
		}
		return bookingDto;
	}

}


