package com.tripbee.backend.model;

import com.tripbee.backend.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String paymentID;

    @Column(nullable = false)
    private Double amountPaid;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String paymentMethod; // (VNPAY, MOMO, CREDIT_CARD...)

    private String transactionCode; // Mã giao dịch từ cổng thanh toán

    // --- Mối quan hệ ---

    // Sửa lỗi: Payment liên kết với Invoice, không phải Booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
}