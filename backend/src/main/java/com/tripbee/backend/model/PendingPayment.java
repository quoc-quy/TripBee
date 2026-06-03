package com.tripbee.backend.model;

import com.tripbee.backend.model.enums.PendingPaymentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pending_payments")
public class PendingPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pendingPaymentID;

    @Column(nullable = false)
    private String transactionCode;

    @Column(nullable = false)
    private Double amount;

    private String bookingID;

    @Column(columnDefinition = "TEXT")
    private String transferInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PendingPaymentStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public PendingPayment() {}

    public PendingPayment(String transactionCode, Double amount, String bookingID, String transferInfo, PendingPaymentStatus status, LocalDateTime createdAt) {
        this.transactionCode = transactionCode;
        this.amount = amount;
        this.bookingID = bookingID;
        this.transferInfo = transferInfo;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getPendingPaymentID() {
        return pendingPaymentID;
    }

    public void setPendingPaymentID(Long pendingPaymentID) {
        this.pendingPaymentID = pendingPaymentID;
    }

    public String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getBookingID() {
        return bookingID;
    }

    public void setBookingID(String bookingID) {
        this.bookingID = bookingID;
    }

    public String getTransferInfo() {
        return transferInfo;
    }

    public void setTransferInfo(String transferInfo) {
        this.transferInfo = transferInfo;
    }

    public PendingPaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PendingPaymentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
