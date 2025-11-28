package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.request.ReviewStatusRequest;
import com.tripbee.backend.admin.dto.response.review.ReviewAdminResponse;
import com.tripbee.backend.exception.ResourceNotFoundException;
import com.tripbee.backend.model.Review;
import com.tripbee.backend.model.enums.ReviewStatus;
import com.tripbee.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewAdminService {

    private final ReviewRepository reviewRepository;

    // Lấy tất cả review (lọc theo status)
    public Page<ReviewAdminResponse> getAllReviews(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Review> result;

        if (status == null || status.isEmpty()) {
            result = reviewRepository.findAll(pageable);
        } else {
            ReviewStatus st = ReviewStatus.valueOf(status.toUpperCase());
            result = reviewRepository.findByStatus(st, pageable);
        }

        return result.map(ReviewAdminResponse::new);
    }

    // Duyệt / Ẩn review
    public void updateStatus(String reviewId, ReviewStatusRequest request) {
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        ReviewStatus newStatus = ReviewStatus.valueOf(request.getStatus().toUpperCase());

        r.setStatus(newStatus);
        reviewRepository.save(r);
    }
}
