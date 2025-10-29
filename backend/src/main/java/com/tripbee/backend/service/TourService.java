package com.tripbee.backend.service;

import com.tripbee.backend.dto.TourDetailsResponse;
import com.tripbee.backend.dto.TourSummaryResponse;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.TourDestination; // Cần để join
import com.tripbee.backend.model.TourType; // Cần để join
import com.tripbee.backend.model.Destination; // Cần để join
import com.tripbee.backend.model.enums.TourStatus;
import com.tripbee.backend.repository.TourRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.tripbee.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourService {

    private final TourRepository tourRepository;

    // (1) Dùng constructor để Spring tiêm (inject)
    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public Page<TourSummaryResponse> getAllActiveTours(
            int page, int size, String sort,
            String search, String destinationId, String tourTypeId,
            Double priceMin, Double priceMax) {

        // (2) Xây dựng đối tượng Pageable (phân trang và sắp xếp)
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));

        // (3) Xây dựng Specification (lọc động)
        Specification<Tour> spec = buildSpecification(search, destinationId, tourTypeId, priceMin, priceMax);

        // (4) Gọi Repository
        Page<Tour> tourPage = tourRepository.findAll(spec, pageable);

        // (5) Chuyển đổi Page<Tour> sang Page<TourSummaryResponse>
        return tourPage.map(TourSummaryResponse::new);
    }

    public TourDetailsResponse getTourDetails(String tourId) {
        // Tìm tour bằng ID, nếu không thấy thì ném lỗi 404
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // Chuyển đổi Tour Entity sang DTO chi tiết
        return new TourDetailsResponse(tour);
    }

    private Specification<Tour> buildSpecification(
            String search, String destinationId, String tourTypeId,
            Double priceMin, Double priceMax) {

        // Trả về một hàm lambda (Specification)
        return (root, query, criteriaBuilder) -> {

            // Dùng List để chứa các điều kiện (Predicate)
            List<Predicate> predicates = new ArrayList<>();

            // (A) Điều kiện BẮT BUỘC: Chỉ lấy tour 'ACTIVE'
            predicates.add(criteriaBuilder.equal(root.get("status"), TourStatus.ACTIVE));

            // (B) Thêm điều kiện TÌM KIẾM (nếu có)
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate titleLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                predicates.add(criteriaBuilder.or(titleLike, descLike)); // Tìm theo title HOẶC description
            }

            // (C) Thêm điều kiện LỌC THEO GIÁ (nếu có)
            if (priceMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("priceAdult"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("priceAdult"), priceMax));
            }

            // (D) Thêm điều kiện LỌC THEO LOẠI TOUR (nếu có)
            if (tourTypeId != null) {
                Join<Tour, TourType> tourTypeJoin = root.join("tourType");
                predicates.add(criteriaBuilder.equal(tourTypeJoin.get("tourTypeID"), tourTypeId));
            }

            // (E) Thêm điều kiện LỌC THEO ĐỊA ĐIỂM (nếu có) - Đây là join phức tạp
            if (destinationId != null) {
                Join<Tour, TourDestination> tourDestJoin = root.join("tourDestinations");
                Join<TourDestination, Destination> destJoin = tourDestJoin.join("destination");
                predicates.add(criteriaBuilder.equal(destJoin.get("destinationID"), destinationId));
            }

            // (F) Kết hợp tất cả điều kiện bằng AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // (6) Hàm hỗ trợ chuyển đổi chuỗi sort (ví dụ: "price,asc") sang đối tượng Sort
    private Sort parseSort(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "ranking"); // Mặc định sắp xếp theo ranking
        }
        try {
            String[] parts = sort.split(",");
            String property = parts[0];
            Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("desc"))
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            return Sort.by(direction, property);
        } catch (Exception e) {
            return Sort.by(Sort.Direction.ASC, "ranking"); // Nếu chuỗi sort bị lỗi, dùng mặc định
        }
    }
}