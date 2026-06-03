package com.tripbee.backend.admin.controller;

import com.tripbee.backend.model.PendingPayment;
import com.tripbee.backend.model.enums.PendingPaymentStatus;
import com.tripbee.backend.repository.PendingPaymentRepository;
import com.tripbee.backend.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/pending-payments")
public class PendingPaymentAdminController {

    private final PendingPaymentRepository pendingPaymentRepository;
    private final BookingService bookingService;

    public PendingPaymentAdminController(PendingPaymentRepository pendingPaymentRepository, BookingService bookingService) {
        this.pendingPaymentRepository = pendingPaymentRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<Page<PendingPayment>> getPendingPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PendingPayment> pendingPayments = pendingPaymentRepository.findByStatus(PendingPaymentStatus.PENDING, pageable);
        return ResponseEntity.ok(pendingPayments);
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolvePendingPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String bookingID = body.get("bookingID");
        if (bookingID == null || bookingID.isBlank()) {
            return ResponseEntity.badRequest().body("bookingID is required");
        }

        PendingPayment paymentLog = pendingPaymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pending payment transaction not found: " + id));

        if (paymentLog.getStatus() == PendingPaymentStatus.RESOLVED) {
            return ResponseEntity.badRequest().body("Transaction already resolved.");
        }

        try {
            // Xác nhận thanh toán thủ công với số tiền thực tế trong log giao dịch
            bookingService.processPaymentWebhook(
                    bookingID,
                    BigDecimal.valueOf(paymentLog.getAmount()),
                    paymentLog.getTransactionCode()
            );

            // Cập nhật log giao dịch
            paymentLog.setBookingID(bookingID);
            paymentLog.setStatus(PendingPaymentStatus.RESOLVED);
            pendingPaymentRepository.save(paymentLog);

            return ResponseEntity.ok(Map.of("message", "Resolved pending payment manually successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to resolve payment manually: " + e.getMessage());
        }
    }
}
