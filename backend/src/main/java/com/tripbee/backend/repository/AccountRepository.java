package com.tripbee.backend.repository;

import com.tripbee.backend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    // Spring Data JPA sẽ tự động hiểu phương thức này
    // và tạo truy vấn: SELECT * FROM "Account" WHERE "userName" = ?
    Optional<Account> findByUserName(String userName);
}