package com.tripbee.backend.service;

import com.tripbee.backend.dto.DestinationResponse;
import com.tripbee.backend.model.Destination;
import com.tripbee.backend.repository.DestinationRepository;
import jakarta.persistence.criteria.JoinType; // (Mới)
import jakarta.persistence.criteria.Predicate; // (Mới)
import org.springframework.data.jpa.domain.Specification; // (Mới)
import org.springframework.stereotype.Service;

import java.util.ArrayList; // (Mới)
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // (1) Cập nhật phương thức để chấp nhận tham số lọc
    public List<DestinationResponse> getAllDestinations(String location) {

        // (2) Xây dựng Specification
        Specification<Destination> spec = (root, query, criteriaBuilder) -> {

            // (3) FIX N+1: Luôn fetch các collection cần thiết
            // (Chỉ fetch cho truy vấn chính, không phải cho truy vấn count)
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("images", JoinType.LEFT);
                root.fetch("tourDestinations", JoinType.LEFT);
                // Tránh trùng lặp do LEFT JOIN
                query.distinct(true);
            }

            // (4) Thêm logic lọc (Predicate)
            List<Predicate> predicates = new ArrayList<>();

            if (location != null && !location.isEmpty()) {
                // So sánh chính xác (case-sensitive)
                predicates.add(criteriaBuilder.equal(root.get("location"), location));

                // (Tùy chọn) Nếu muốn tìm kiếm không phân biệt chữ hoa/thường:
                // predicates.add(criteriaBuilder.equal(
                //     criteriaBuilder.lower(root.get("location")),
                //     location.toLowerCase()
                // ));
            }

            // (5) Kết hợp các điều kiện lọc (nếu có)
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };


        // (6) Gọi phương thức findAll(spec) thay vì findAll()
        List<Destination> destinations = destinationRepository.findAll(spec);

        // (7) Chuyển đổi danh sách Entity sang DTO
        return destinations.stream()
                .map(DestinationResponse::new)
                .collect(Collectors.toList());
    }
}