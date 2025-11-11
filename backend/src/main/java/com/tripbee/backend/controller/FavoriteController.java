package com.tripbee.backend.controller;

import com.tripbee.backend.dto.FavoriteRequest;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favorites") // Endpoint này tự động được bảo vệ
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    /**
     * API để thêm một tour vào danh sách yêu thích.
     * Cần phải đăng nhập (gửi Bearer Token).
     */
    @PostMapping
    public ResponseEntity<?> addFavorite(
            @AuthenticationPrincipal Account currentUser,
            @RequestBody FavoriteRequest request
    ) {
        // 1. Lấy tourId từ request body
        String tourId = request.getTourId();

        // 2. Gọi service
        // Service sẽ tự động ném lỗi (401, 404, 409) nếu có vấn đề
        favoriteService.addFavorite(tourId, currentUser);

        // 3. Nếu thành công, trả về 201 Created (không cần nội dung)
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // [TODO] Bạn có thể thêm API GET và DELETE tại đây sau
    // @GetMapping
    // public ResponseEntity<?> getMyFavorites(...) {}

    // @DeleteMapping("/{favoriteId}")
    // public ResponseEntity<?> removeFavorite(...) {}
}