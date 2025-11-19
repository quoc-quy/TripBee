package com.tripbee.backend.controller;

import com.tripbee.backend.dto.SeePayWebhookRequest;
import com.tripbee.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final BookingService bookingService;

    public WebhookController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/seepay")
    public ResponseEntity<String> handleSeepayWebhook(@RequestBody SeePayWebhookRequest webhookData) {
        try {
            // 1. Kiểm tra xem có phải tiền vào không (transferType = "in")
            if (!"in".equalsIgnoreCase(webhookData.getTransferType())) {
                return ResponseEntity.ok("Ignored: Not an incoming transfer");
            }

            // 2. Lấy Booking ID từ nội dung chuyển khoản
            // Giả sử nội dung chuyển khoản CHÍNH LÀ bookingID (do Frontend set QR)
            // Ví dụ content: "booking-12345"
            String bookingId = webhookData.getContent();

            // Nếu nội dung có thêm chữ (VD: "Thanh toan booking-12345"), bạn cần dùng Regex để tách ID ra.
            // Ở đây mình giả định nội dung sạch để demo đơn giản.

            // 3. Gọi Service xử lý
            bookingService.processPaymentWebhook(
                    bookingId,
                    webhookData.getTransferAmount(),
                    webhookData.getReferenceCode()
            );

            // 4. Phản hồi cho SeePay biết đã nhận thành công
            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            e.printStackTrace();
            // Vẫn trả về 200 OK để SeePay không gửi lại (retry), nhưng log lỗi để mình sửa
            return ResponseEntity.ok("Error processing webhook: " + e.getMessage());
        }
    }
}