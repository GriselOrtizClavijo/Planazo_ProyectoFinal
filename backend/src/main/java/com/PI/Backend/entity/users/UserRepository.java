package com.PI.Backend.entity.users;

import com.PI.Backend.entity.Products.Product;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
@Transactional
public interface UserRepository extends CrudRepository<Users, Integer> {

	Optional<Users> findByEmail(String email);

	Users findByVerificationCode(String verificationCode);

}
