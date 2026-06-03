package com.tripbee.backend.controller;

import com.tripbee.backend.dto.SeePayWebhookRequest;
import com.tripbee.backend.model.PendingPayment;
import com.tripbee.backend.model.enums.PendingPaymentStatus;
import com.tripbee.backend.repository.PendingPaymentRepository;
import com.tripbee.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final BookingService bookingService;
    private final PendingPaymentRepository pendingPaymentRepository;

    public WebhookController(BookingService bookingService, PendingPaymentRepository pendingPaymentRepository) {
        this.bookingService = bookingService;
        this.pendingPaymentRepository = pendingPaymentRepository;
    }

    @PostMapping("/seepay")
    public ResponseEntity<String> handleSeepayWebhook(@RequestBody SeePayWebhookRequest webhookData) {
        try {
            // 1. Kiểm tra tiền vào
            if (!"in".equalsIgnoreCase(webhookData.getTransferType())) {
                return ResponseEntity.ok("Ignored: Not an incoming transfer");
            }

            String transactionCode = webhookData.getReferenceCode();
            if (transactionCode == null || transactionCode.isBlank()) {
                transactionCode = String.valueOf(webhookData.getId());
            }

            String content = webhookData.getContent();
            String bookingId = null;

            // 2. Tìm chuỗi có tiền tố 'tbbk' và chuẩn hóa UUID
            if (content != null) {
                String advancedRegex = "(?i)(tbbk)[\\s-]?([a-f0-9]{8})[\\s-]?([a-f0-9]{4})[\\s-]?([a-f0-9]{4})[\\s-]?([a-f0-9]{4})[\\s-]?([a-f0-9]{12})";
                Pattern advancedPattern = Pattern.compile(advancedRegex);
                Matcher advancedMatcher = advancedPattern.matcher(content);

                if (advancedMatcher.find()) {
                    bookingId = String.format("%s-%s-%s-%s-%s-%s",
                            advancedMatcher.group(1).toLowerCase(),
                            advancedMatcher.group(2),
                            advancedMatcher.group(3),
                            advancedMatcher.group(4),
                            advancedMatcher.group(5),
                            advancedMatcher.group(6)
                    );
                } else {
                    Pattern basicPattern = Pattern.compile("tbbk-[a-zA-Z0-9-]+");
                    Matcher basicMatcher = basicPattern.matcher(content);
                    if (basicMatcher.find()) {
                        bookingId = basicMatcher.group();
                    }
                }
            }

            // Kiểm tra trùng lặp giao dịch đã xử lý thành công
            Optional<PendingPayment> existingOpt = pendingPaymentRepository.findByTransactionCode(transactionCode);
            if (existingOpt.isPresent() && existingOpt.get().getStatus() == PendingPaymentStatus.RESOLVED) {
                return ResponseEntity.ok("Webhook already processed (RESOLVED)");
            }

            // Lưu log giao dịch tạm thời ở trạng thái PENDING
            PendingPayment paymentLog;
            if (existingOpt.isPresent()) {
                paymentLog = existingOpt.get();
                paymentLog.setBookingID(bookingId);
                paymentLog.setTransferInfo(content);
            } else {
                paymentLog = new PendingPayment(
                        transactionCode,
                        webhookData.getTransferAmount().doubleValue(),
                        bookingId,
                        content,
                        PendingPaymentStatus.PENDING,
                        LocalDateTime.now()
                );
                paymentLog = pendingPaymentRepository.save(paymentLog);
            }

            if (bookingId == null) {
                return ResponseEntity.ok("Booking ID not found in content (logged as PENDING)");
            }

            System.out.println("Processing webhook payment for booking: " + bookingId + " with amount: " + webhookData.getTransferAmount());

            // Gọi service xử lý thanh toán
            bookingService.processPaymentWebhook(
                    bookingId,
                    webhookData.getTransferAmount(),
                    transactionCode
            );

            // Cập nhật trạng thái thành RESOLVED sau khi xử lý thành công
            paymentLog.setStatus(PendingPaymentStatus.RESOLVED);
            pendingPaymentRepository.save(paymentLog);

            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Error processing webhook: " + e.getMessage());
        }
    }
}