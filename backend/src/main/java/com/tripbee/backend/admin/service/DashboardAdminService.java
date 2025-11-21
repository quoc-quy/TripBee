package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.response.dashboard.DashboardStatsResponse;
import com.tripbee.backend.admin.dto.response.dashboard.MonthlyRevenueDto;
import com.tripbee.backend.admin.dto.response.dashboard.TopTourDto;
import com.tripbee.backend.model.Booking;
import com.tripbee.backend.model.enums.BookingStatus;
import com.tripbee.backend.model.enums.PaymentStatus;
import com.tripbee.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardAdminService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ContactMessageRepository contactMessageRepository;

    public DashboardStatsResponse getDashboardStats() {
        // 1. Doanh thu thực tế (Dựa trên Payment SUCCESS)
        Double revenue = paymentRepository.calculateTotalRevenue(PaymentStatus.SUCCESS);

        // 2. Tổng số đơn hàng
        long totalBookings = bookingRepository.count();

        // 3. Thống kê trạng thái Booking (Dùng Enum chuẩn trong BookingStatus)
        List<Object[]> statusCounts = bookingRepository.countBookingsByStatus();
        Map<String, Long> statusMap = new HashMap<>();

        // Khởi tạo map mặc định để tránh null cho frontend
        statusMap.put(BookingStatus.CONFIRMED.name(), 0L);
        statusMap.put(BookingStatus.PROCESSING.name(), 0L);
        statusMap.put(BookingStatus.COMPLETED.name(), 0L);
        statusMap.put(BookingStatus.CANCELED.name(), 0L);

        for (Object[] row : statusCounts) {
            if (row[0] != null) {
                statusMap.put(row[0].toString(), (Long) row[1]);
            }
        }

        // 4. User stats
        long totalUsers = userRepository.count();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        // Lưu ý: Hàm này yêu cầu bạn đã thêm field createdAt vào User
        long newUsers = userRepository.countByCreatedAtAfter(startOfMonth);

        // 5. Top Tours (Lấy top 5 tour đã COMPLETED)
        List<TopTourDto> topTours = bookingRepository.findTopSellingTours(
                BookingStatus.COMPLETED,
                PageRequest.of(0, 5)
        );

        // 6. Tin nhắn
        long totalMessages = contactMessageRepository.count();

        // --- MỚI: 7. Biểu đồ doanh thu theo tháng (Năm hiện tại) ---
        int currentYear = LocalDate.now().getYear();
        List<Object[]> monthlyData = paymentRepository.findMonthlyRevenue(PaymentStatus.SUCCESS, currentYear);

        // Chuyển đổi sang Map để dễ tra cứu: <Tháng, Tiền>
        Map<Integer, Double> revenueMap = new HashMap<>();
        for (Object[] row : monthlyData) {
            Integer month = (Integer) row[0];
            Double amount = (Double) row[1];
            revenueMap.put(month, amount);
        }

        // Tạo list đủ 12 tháng, tháng nào thiếu thì điền 0
        List<MonthlyRevenueDto> revenueTrend = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            Double amount = revenueMap.getOrDefault(m, 0.0);
            revenueTrend.add(new MonthlyRevenueDto(m, amount));
        }

        return DashboardStatsResponse.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .totalBookings(totalBookings)
                .bookingStatusStats(statusMap)
                .revenueTrend(revenueTrend) // Dữ liệu mới
                .totalUsers(totalUsers)
                .newUsersThisMonth(newUsers)
                .topSellingTours(topTours)
                .pendingContactMessages(totalMessages)
                .build();
    }

    // --- MỚI: Chức năng xuất báo cáo CSV ---
    public void exportBookingsToCsv(PrintWriter writer) {
        List<Booking> bookings = bookingRepository.findAll();

        // Viết Header CSV
        writer.println("Booking ID,User Email,Tour Name,Booking Date,Total Price,Status");

        // Viết từng dòng dữ liệu
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (Booking booking : bookings) {
            writer.printf("%s,%s,%s,%s,%s,%s%n",
                    escapeSpecialCharacters(booking.getBookingID()),
                    escapeSpecialCharacters(booking.getUser().getEmail()),
                    escapeSpecialCharacters(booking.getTour().getTitle()),
                    booking.getBookingDate().format(formatter),
                    booking.getFinalAmount(),
                    booking.getStatus()
            );
        }
    }

    // Helper để xử lý trường hợp chuỗi có chứa dấu phẩy trong CSV
    private String escapeSpecialCharacters(String data) {
        if (data == null) return "";
        String escapedData = data.replaceAll("\\R", " "); // Xóa xuống dòng
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }
}