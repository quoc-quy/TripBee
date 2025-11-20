package com.tripbee.backend.controller;

import com.tripbee.backend.dto.SeePayWebhookRequest;
import com.tripbee.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
            // 1. Kiểm tra tiền vào
            if (!"in".equalsIgnoreCase(webhookData.getTransferType())) {
                return ResponseEntity.ok("Ignored: Not an incoming transfer");
            }

            String content = webhookData.getContent();
            String bookingId = null;

            // 2. [LOGIC MỚI] Cắt chuỗi dựa vào khoảng trắng
            // Mẫu nội dung: "ACC_NO  PHONE  BOOKING_ID  TRACE..."
            // Cắt theo khoảng trắng (\\s+)
            if (content != null) {
                String[] parts = content.trim().split("\\s+");

                // Lấy phần tử thứ 3 (index 2) nếu có đủ độ dài
                if (parts.length >= 3) {
                    bookingId = parts[2];
                } else {
                    // Fallback: Nếu format lạ (ví dụ dính liền), thử tìm chuỗi 32 ký tự Hex
                    // bookingId = ... (có thể thêm regex dự phòng ở đây nếu cần)
                    System.out.println("Format warning: Content does not have enough parts split by space.");
                }
            }

            if (bookingId == null) {
                return ResponseEntity.ok("Ignored: Booking ID not found in content");
            }

            // 3. [LOGIC MỚI] Chuẩn hóa UUID (Thêm dấu gạch ngang)
            // Nếu ID là chuỗi 32 ký tự hex (chưa có gạch ngang), ta format lại thành chuẩn UUID
            // Input:  1e7a6c5f851e4f1b809d6a17a14a9677
            // Output: 1e7a6c5f-851e-4f1b-809d-6a17a14a9677
            if (bookingId.matches("^[a-fA-F0-9]{32}$")) {
                bookingId = bookingId.replaceFirst(
                        "(\\w{8})(\\w{4})(\\w{4})(\\w{4})(\\w{12})",
                        "$1-$2-$3-$4-$5"
                );
                System.out.println("Formatted Booking ID to UUID: " + bookingId);
            }

            System.out.println("Final Processing Booking ID: " + bookingId);

            // 4. Gọi Service xử lý
            bookingService.processPaymentWebhook(
                    bookingId,
                    webhookData.getTransferAmount(),
                    webhookData.getReferenceCode()
            );

            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Error processing webhook: " + e.getMessage());
        }
    }
}