package com.tripbee.backend.service;

import com.tripbee.backend.dto.ReviewDto;
import com.tripbee.backend.model.Review;
import com.tripbee.backend.model.enums.ReviewStatus;
import com.tripbee.backend.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    /**
     * Lấy danh sách các review đã được duyệt (APPROVED) cho một tour,
     * có phân trang và sắp xếp theo ngày tạo mới nhất.
     */
    @Transactional(readOnly = true) // Đảm bảo chỉ đọc, tối ưu hiệu suất
    public Page<ReviewDto> getApprovedReviewsForTour(String tourId, int page, int size) {

        // (1) Tạo đối tượng Pageable, sắp xếp theo 'createdAt' mới nhất
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        // (2) Gọi repository, chỉ lấy các review 'APPROVED'
        Page<Review> reviewPage = reviewRepository.findReviewsByTourAndStatus(
                tourId,
                ReviewStatus.APPROVED, // Chỉ lấy review đã duyệt
                pageable
        );

        // (3) Chuyển đổi Page<Review> sang Page<ReviewDto>
        return reviewPage.map(ReviewDto::new);
    }
}