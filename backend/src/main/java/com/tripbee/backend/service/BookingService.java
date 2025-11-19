package com.tripbee.backend.service;

import com.tripbee.backend.dto.BookingRequest;
import com.tripbee.backend.model.*;
import com.tripbee.backend.model.enums.BookingStatus;
import com.tripbee.backend.model.enums.PaymentStatus;
import com.tripbee.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class BookingService {

    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public BookingService(TourRepository tourRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository,
                          PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository) {
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // 1. Logic tạo Booking mới
    @Transactional
    public Booking processBooking(BookingRequest request, Account account) {
        // Tìm Tour
        Tour tour = tourRepository.findById(request.getTourID())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        // Tìm User
        User user = userRepository.findById(account.getUser().getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tính giá
        double totalPrice = (tour.getPriceAdult() * request.getNumAdults())
                + (tour.getPriceChild() * request.getNumChildren());

        // Tạo Booking
        Booking booking = new Booking();
        booking.setTour(tour);
        booking.setUser(user);
        booking.setNumAdults(request.getNumAdults());
        booking.setNumChildren(request.getNumChildren());
        booking.setTotalPrice(totalPrice);
        booking.setFinalAmount(totalPrice); // Có thể trừ khuyến mãi nếu có
        booking.setStatus(BookingStatus.PROCESSING); // Trạng thái chờ thanh toán

        // Tạo Invoice (Hóa đơn) rỗng đi kèm
        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setTotalAmount(totalPrice);

        // [UPDATED] Chỉ set ngày tạo, không set PaymentStatus cho Invoice nữa
        invoice.setCreatedAt(LocalDateTime.now());

        booking.setInvoice(invoice);

        // Lưu Booking (Cascade sẽ tự lưu Invoice)
        return bookingRepository.save(booking);
    }

    // Helper: Lấy Booking theo ID
    public Booking getBookingById(String bookingID) {
        return bookingRepository.findById(bookingID)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // 2. Logic Xử lý Webhook Thanh toán
    @Transactional
    public void processPaymentWebhook(String bookingId, BigDecimal amount, String transactionInfo) {
        // Tìm Booking theo ID nhận được từ nội dung chuyển khoản
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking ID from webhook not found: " + bookingId));

        // Kiểm tra xem đã thanh toán chưa để tránh xử lý trùng
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            System.out.println("Booking " + bookingId + " is already paid.");
            return;
        }

        // 1. Cập nhật trạng thái Booking -> CONFIRMED (Đã xác nhận)
        booking.setStatus(BookingStatus.CONFIRMED);

        // 2. Tạo bản ghi Payment và gắn vào Invoice
        Invoice invoice = booking.getInvoice();
        if (invoice != null) {
            // [UPDATED] Không set PaymentStatus cho Invoice ở đây nữa

            // Tạo Payment mới
            Payment payment = new Payment();
            payment.setInvoice(invoice);
            payment.setAmountPaid(amount.doubleValue());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setPaymentMethod("BANK_TRANSFER_QR");
            payment.setTransactionCode(transactionInfo); // Mã tham chiếu từ ngân hàng

            // Set trạng thái cho Payment (Giao dịch thành công)
            payment.setStatus(PaymentStatus.SUCCESS);

            // Lưu Payment
            paymentRepository.save(payment);
            // Invoice có thể không cần save lại nếu không thay đổi field nào,
            // nhưng cứ để save để đảm bảo tính nhất quán nếu có trigger cập nhật ngày sửa đổi
            invoiceRepository.save(invoice);
        }

        bookingRepository.save(booking);
        System.out.println("Successfully updated Booking " + bookingId + " to CONFIRMED.");
    }
}