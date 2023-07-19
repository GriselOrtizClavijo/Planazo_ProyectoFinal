package com.PI.Backend.repository.ReservationRepository;

import com.PI.Backend.entity.Reservations.PaymentType;
import org.springframework.data.repository.CrudRepository;

public interface TypePaymentRespository extends CrudRepository<PaymentType, Integer> {
}
