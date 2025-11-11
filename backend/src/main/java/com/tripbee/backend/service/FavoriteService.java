package com.tripbee.backend.service;

import com.tripbee.backend.exception.ConflictException;
import com.tripbee.backend.exception.ResourceNotFoundException;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.model.Favorite;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.User;
import com.tripbee.backend.repository.FavoriteRepository;
import com.tripbee.backend.repository.TourRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final TourRepository tourRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, TourRepository tourRepository) {
        this.favoriteRepository = favoriteRepository;
        this.tourRepository = tourRepository;
    }

    @Transactional
    public void addFavorite(String tourId, Account currentUser) {
        // 1. Lấy User từ Account đã xác thực
        // (Chúng ta biết 'user' đã được tải EAGER trong Account)
        User user = currentUser.getUser();

        // 2. Tìm Tour từ tourId
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // 3. Kiểm tra xem user này đã favorite tour này chưa
        if (favoriteRepository.existsByUserAndTour(user, tour)) {
            // Nếu đã tồn tại, ném lỗi 409 Conflict
            throw new ConflictException("You have already favorited this tour.");
        }

        // 4. Tạo và lưu đối tượng Favorite mới
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setTour(tour);
        // trường 'addedAt' sẽ tự động được gán bởi @CreationTimestamp

        favoriteRepository.save(favorite);
    }
}