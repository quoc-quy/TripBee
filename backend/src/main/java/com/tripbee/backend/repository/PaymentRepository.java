package com.tripbee.backend.repository;

import com.tripbee.backend.model.Payment;
import com.tripbee.backend.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    // Có thể thêm các hàm tìm kiếm tùy chỉnh nếu cần sau này
    // Ví dụ: Tìm Payment theo TransactionCode
    Payment findByTransactionCode(String transactionCode);

    @Query("SELECT SUM(p.amountPaid) FROM Payment p WHERE p.status = :status")
    Double calculateTotalRevenue(@Param("status") PaymentStatus status);

    @Query("SELECT MONTH(p.paymentDate) as month, SUM(p.amountPaid) as total " +
            "FROM Payment p " +
            "WHERE p.status = :status AND YEAR(p.paymentDate) = :year " +
            "GROUP BY MONTH(p.paymentDate) " +
            "ORDER BY MONTH(p.paymentDate) ASC")
    List<Object[]> findMonthlyRevenue(@Param("status") PaymentStatus status, @Param("year") int year);
}