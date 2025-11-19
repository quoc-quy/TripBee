package com.tripbee.backend.repository;

import com.tripbee.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    // Có thể thêm các hàm tìm kiếm tùy chỉnh nếu cần sau này
    // Ví dụ: Tìm Payment theo TransactionCode
    Payment findByTransactionCode(String transactionCode);
}