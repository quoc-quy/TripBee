package com.tripbee.backend.service;

import com.tripbee.backend.dto.BookingHistoryResponse;
import com.tripbee.backend.dto.BookingRequest;
import com.tripbee.backend.exception.ResourceNotFoundException;
import com.tripbee.backend.model.*;
import com.tripbee.backend.service.EmailService.PaymentSuccessEmailData;
import com.tripbee.backend.model.enums.BookingStatus;
import com.tripbee.backend.model.enums.PaymentStatus;
import com.tripbee.backend.repository.*;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Backoff;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.UUID;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.tripbee.backend.dto.CancelEstimationResponse;

@Service
public class BookingService {

    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final EmailService emailService;
    private final CancellationPolicyRepository policyRepository;
    private final CacheManager cacheManager;

    public BookingService(TourRepository tourRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository,
                          PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          EmailService emailService,
                          CancellationPolicyRepository policyRepository,
                          CacheManager cacheManager) {
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.emailService = emailService;
        this.policyRepository = policyRepository;
        this.cacheManager = cacheManager;
    }

    private void evictTourCache(String tourId) {
        try {
            Cache toursCache = cacheManager.getCache("tours");
            if (toursCache != null) {
                toursCache.evict(tourId);
            }
        } catch (Exception e) {
            System.err.println("Failed to evict tours cache: " + e.getMessage());
        }
    }

    // 1. Logic tạo Booking mới
    @Transactional
    public Booking processBooking(BookingRequest request, Account account) {
        // Tìm Tour với Pessimistic Lock để chống Race Condition
        Tour tour = tourRepository.findByIdWithLock(request.getTourID())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        // Kiểm tra dung lượng tour
        long bookedSeats = bookingRepository.countBookedSeatsForTour(request.getTourID());
        int requestedSeats = request.getNumAdults() + request.getNumChildren();
        if (bookedSeats + requestedSeats > tour.getMaxParticipants()) {
            long remaining = Math.max(0, tour.getMaxParticipants() - bookedSeats);
            throw new IllegalStateException("Tour đã hết chỗ trống. Chỉ còn " + remaining + " chỗ trống.");
        }

        // Tìm User
        User user = userRepository.findById(account.getUser().getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tính giá
        double totalPrice = (tour.getPriceAdult() * request.getNumAdults())
                + (tour.getPriceChild() * request.getNumChildren());

        // Tạo Booking
        Booking booking = new Booking();
        String customID = "tbbk-" + UUID.randomUUID().toString();
        booking.setBookingID(customID);
        booking.setTour(tour);
        booking.setUser(user);
        booking.setNumAdults(request.getNumAdults());
        booking.setNumChildren(request.getNumChildren());
        booking.setTotalPrice(totalPrice);
        booking.setFinalAmount(totalPrice); 
        booking.setStatus(BookingStatus.PROCESSING); 

        // [NEW LOGIC] Xử lý danh sách người tham gia (Participants)
        if (request.getParticipants() != null && !request.getParticipants().isEmpty()) {
            Set<Participant> participantSet = new HashSet<>();

            for (BookingRequest.ParticipantDto dto : request.getParticipants()) {
                Participant p = new Participant();
                p.setCustomerName(dto.getCustomerName());
                p.setCustomerPhone(dto.getCustomerPhone());
                p.setIdentification(dto.getIdentification());
                p.setGender(dto.getGender());
                p.setParticipantType(dto.getParticipantType());

                // Quan trọng: Gán Booking cho Participant để tạo khóa ngoại đúng
                p.setBooking(booking);

                participantSet.add(p);
            }

            booking.setParticipants(participantSet);
        }

        // Tạo Invoice (Hóa đơn) rỗng đi kèm
        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setTotalAmount(totalPrice);

        // [UPDATED] Chỉ set ngày tạo, không set PaymentStatus cho Invoice nữa
        invoice.setCreatedAt(LocalDateTime.now());

        booking.setInvoice(invoice);

        // Lưu Booking (Cascade sẽ tự lưu Invoice và Participants)
        Booking savedBooking = bookingRepository.save(booking);
        evictTourCache(savedBooking.getTour().getTourID());
        return savedBooking;
    }

    // Helper: Lấy Booking theo ID
    public Booking getBookingById(String bookingID) {
        return bookingRepository.findById(bookingID)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // 2. Logic Xử lý Webhook Thanh toán
    @Retryable(
        retryFor = {RuntimeException.class },
        noRetryFor = {IllegalArgumentException.class},
        maxAttempts=3,
        backoff = @Backoff(delay = 3000, maxDelay = 5000)
    )
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

        // Kiểm tra số tiền thanh toán
        if (amount.doubleValue() < booking.getFinalAmount()) {
            throw new IllegalArgumentException("Số tiền thanh toán (" + amount.doubleValue() + ") không đủ so với yêu cầu (" + booking.getFinalAmount() + ")");
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

        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("Successfully updated Booking " + bookingId + " to CONFIRMED.");

        try {
            String customerEmail = savedBooking.getUser().getEmail();
            String customerName = savedBooking.getUser().getName();

            if (customerEmail != null && !customerEmail.isEmpty()) {
                // [FIX] Lấy dữ liệu cần thiết ngay trong Transaction để tránh LazyInitializationException
                PaymentSuccessEmailData emailData = PaymentSuccessEmailData.builder()
                        .toEmail(customerEmail)
                        .customerName(customerName)
                        .bookingId(savedBooking.getBookingID())
                        .tourTitle(savedBooking.getTour().getTitle())      // Hibernate sẽ query Tour tại đây
                        .startDate(savedBooking.getTour().getStartDate())  // Hibernate sẽ query Tour tại đây
                        .numAdults(savedBooking.getNumAdults())
                        .numChildren(savedBooking.getNumChildren())
                        .finalAmount(savedBooking.getFinalAmount())
                        .build();

                // Gọi hàm Async với DTO
                emailService.sendPaymentSuccessEmail(emailData);
            } else {
                System.out.println("User email is empty, skipping email notification.");
            }
        } catch (Exception e) {
            // Log lỗi email nhưng KHÔNG throw exception để tránh rollback giao dịch thanh toán
            System.err.println("Error triggering payment email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional(readOnly = true)
    public List<BookingHistoryResponse> getUserBookingHistory(Account currentUser) {
        String userID = currentUser.getUser().getUserID();

        List<Booking> bookings = bookingRepository.findAllByUser_userID(userID);

        return bookings.stream()
                .map(BookingHistoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void requestCancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Kiểm tra logic: Chỉ cho hủy nếu tour chưa diễn ra hoặc logic nghiệp vụ của bạn
        if (booking.getStatus() == BookingStatus.PROCESSING || booking.getStatus() == BookingStatus.CONFIRMED) {
            booking.setStatus(BookingStatus.CANCELLATION_REQUESTED);
            Booking savedBooking = bookingRepository.save(booking);
            evictTourCache(savedBooking.getTour().getTourID());

            // Gửi email thông báo yêu cầu hủy đã được tiếp nhận
            try {
                if (savedBooking.getUser() != null && savedBooking.getUser().getEmail() != null) {
                    var user = savedBooking.getUser();
                    var tour = savedBooking.getTour();

                    EmailService.BookingCanceledEmailData emailData =
                            EmailService.BookingCanceledEmailData.builder()
                                    .toEmail(user.getEmail())
                                    .customerName(user.getName())
                                    .bookingId(savedBooking.getBookingID())
                                    .tourTitle(tour != null ? tour.getTitle() : "(Không rõ tên tour)")
                                    .startDate(tour != null ? tour.getStartDate() : null)
                                    .numAdults(savedBooking.getNumAdults())
                                    .numChildren(savedBooking.getNumChildren())
                                    .finalAmount(savedBooking.getFinalAmount())
                                    .build();

                    emailService.sendCancellationRequestEmail(emailData);
                }
            } catch (Exception e) {
                System.err.println("Failed to send cancellation request email: " + e.getMessage());
            }
        } else {
            throw new IllegalStateException("Không thể yêu cầu hủy tour này");
        }
    }

    @Scheduled(fixedRate = 60000) // Chạy mỗi 60 giây (1 phút)
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu khi xóa
    public void deleteExpiredBookings() {
        // Mốc thời gian là 3 phút trước so với hiện tại
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(3);

        // Tìm các booking trạng thái PENDING (chưa thanh toán) và được tạo trước mốc 3 phút
        List<Booking> expiredBookings = bookingRepository.findByStatusAndBookingDateBefore(BookingStatus.PROCESSING, cutoffTime);

        if (!expiredBookings.isEmpty()) {
            java.util.Set<String> tourIds = expiredBookings.stream()
                    .map(b -> b.getTour().getTourID())
                    .collect(Collectors.toSet());
            bookingRepository.deleteAll(expiredBookings);
            tourIds.forEach(this::evictTourCache);
            System.out.println("Đã xóa " + expiredBookings.size() + " booking hết hạn thanh toán.");
        }
    }

    @Transactional(readOnly = true)
    public CancelEstimationResponse getCancelEstimation(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        Tour tour = booking.getTour();
        LocalDate today = LocalDate.now();
        LocalDate startDate = tour.getStartDate();

        long daysRemaining = ChronoUnit.DAYS.between(today, startDate);
        double feePercentage = 100.0; // Phạt tối đa nếu không khớp chính sách nào

        // Tìm chính sách phạt phù hợp
        List<CancellationPolicy> policies = policyRepository.findAllByOrderByDaysBeforeDepartureDesc();
        for (CancellationPolicy policy : policies) {
            if (daysRemaining >= policy.getDaysBeforeDeparture()) {
                feePercentage = policy.getFeePercentage();
                break;
            }
        }

        double feeAmount = booking.getFinalAmount() * (feePercentage / 100.0);
        double refundAmount = Math.max(0.0, booking.getFinalAmount() - feeAmount);

        return new CancelEstimationResponse(
                booking.getBookingID(),
                tour.getTitle(),
                startDate,
                daysRemaining,
                feePercentage,
                feeAmount,
                refundAmount
        );
    }
}