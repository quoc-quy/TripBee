package com.tripbee.backend.service;

import com.tripbee.backend.dto.BookingRequest;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.model.Booking;
import com.tripbee.backend.model.enums.BookingStatus;
import com.tripbee.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
    // [TODO] Bạn cần inject TourRepository, PromotionRepository, BookingRepository, etc.
    @Autowired
    private BookingRepository bookingRepository;

    // Logic đặt tour đơn giản
    public boolean processBooking(BookingRequest request, Account account) {
        // [TODO: LOGIC CHÍNH XÁC CẦN Ở ĐÂY]
        // 1. Kiểm tra Tour có ACTIVE không.
        // 2. Tính toán Total Price, Final Price dựa trên Tour.priceAdult, Tour.priceChild, và promotionCode.
        // 3. Tạo và lưu Booking (BookingStatus.PROCESSING).
        // 4. Tạo và lưu Invoice (chưa có Payment).

        System.out.println("Processing booking for TourID: " + request.getTourID());
        System.out.println("User: " + account.getUsername());
        System.out.println("Adults: " + request.getNumAdults() + ", Children: " + request.getNumChildren());
        // Giả lập thành công
        return true;
    }

}