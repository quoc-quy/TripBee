package com.tripbee.backend.repository;

import com.tripbee.backend.model.Favorite;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, String> {

    /**
     * Spring Data JPA sẽ tự động tạo một truy vấn
     * (SELECT ... FROM favorites WHERE user_id = ? AND tour_id = ?)
     * để kiểm tra xem một mục yêu thích đã tồn tại chưa.
     */
    boolean existsByUserAndTour(User user, Tour tour);
}