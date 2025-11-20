package com.tripbee.backend.repository;

import com.tripbee.backend.model.Booking;
import com.tripbee.backend.model.enums.BookingStatus;
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
}
