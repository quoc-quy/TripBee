package com.tripbee.backend.controller;

import com.tripbee.backend.dto.BookingRequest;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Yêu cầu phải đăng nhập
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request,
            @AuthenticationPrincipal Account currentUser // Lấy thông tin user từ JWT
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        boolean success = bookingService.processBooking(request, currentUser);

        if (success) {
            return ResponseEntity.ok("Booking request received successfully.");
        } else {
            // [TODO: Trả về lỗi chi tiết hơn]
            return ResponseEntity.badRequest().body("Failed to process booking.");
        }
    }
}