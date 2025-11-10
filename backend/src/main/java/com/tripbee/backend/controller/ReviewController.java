package com.tripbee.backend.controller;

import com.tripbee.backend.dto.ReviewDto;
import com.tripbee.backend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// (1) Định nghĩa đường dẫn cơ sở cho tất cả API bên trong
@RequestMapping("/api/tours/{tourId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // (2) Xử lý request GET tới /api/tours/{tourId}/reviews
    @GetMapping
    public ResponseEntity<Page<ReviewDto>> getReviewsForTour(
            @PathVariable String tourId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        // (3) Gọi service
        Page<ReviewDto> reviewPage = reviewService.getApprovedReviewsForTour(tourId, page, size);

        // (4) Trả về kết quả (đã bao gồm thông tin phân trang)
        return ResponseEntity.ok(reviewPage);
    }

    // [TODO] Bạn có thể thêm API POST (để tạo review mới) vào đây sau
    // @PostMapping
    // public ResponseEntity<?> createReview(...) {}
}