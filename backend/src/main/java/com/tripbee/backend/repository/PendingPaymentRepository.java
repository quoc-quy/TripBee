package com.tripbee.backend.repository;

import com.tripbee.backend.model.PendingPayment;
import com.tripbee.backend.model.enums.PendingPaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PendingPaymentRepository extends JpaRepository<PendingPayment, Long> {
    Optional<PendingPayment> findByTransactionCode(String transactionCode);
    List<PendingPayment> findByStatus(PendingPaymentStatus status);
    Page<PendingPayment> findByStatus(PendingPaymentStatus status, Pageable pageable);
}
