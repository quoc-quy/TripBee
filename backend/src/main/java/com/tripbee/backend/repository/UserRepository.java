package com.tripbee.backend.repository;

import com.tripbee.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Spring Data JPA tự hiểu: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
    long countByCreatedAtAfter(LocalDateTime date);
}