package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "invoices")
@Getter
@Setter
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String invoiceID;

    @Column(nullable = false)
    private Double totalAmount; // Bằng Booking.finalAmount

    private Double taxPercentage;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    // --- Mối quan hệ ---

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", referencedColumnName = "bookingID", nullable = false)
    private Booking booking;

    // Sửa lỗi: 1 Hóa đơn có nhiều lần thanh toán (trả góp)
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private Set<Payment> payments;
}