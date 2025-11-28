package com.tripbee.backend.repository;

import com.tripbee.backend.admin.dto.response.dashboard.TopTourDto;
import com.tripbee.backend.model.Booking;
import com.tripbee.backend.model.enums.BookingStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findByUser_UserID(String userId);

    long countByUser_UserID(String userId);

    long countByUser_UserIDAndStatus(String userId, BookingStatus status);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.user.userID = :userId")
    Double sumTotalAmountByUser(@Param("userId") String userId);

    @EntityGraph(attributePaths = {"tour"})
    List<Booking> findAllByUser_userID(String userId);

    // Thống kê số lượng theo từng trạng thái
    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> countBookingsByStatus();

    // Lấy Top Tour bán chạy dựa trên số lượng booking đã HOÀN THÀNH
    // Dùng 'finalAmount' để tính doanh thu, 'title' từ Tour
    @Query("SELECT new com.tripbee.backend.admin.dto.response.dashboard.TopTourDto(" + // Đã sửa đường dẫn
            "b.tour.title, COUNT(b), SUM(b.finalAmount)) " +
            "FROM Booking b " +
            "WHERE b.status = :status " +
            "GROUP BY b.tour.title " +
            "ORDER BY COUNT(b) DESC")
    List<TopTourDto> findTopSellingTours(@Param("status") BookingStatus status, Pageable pageable);
}
