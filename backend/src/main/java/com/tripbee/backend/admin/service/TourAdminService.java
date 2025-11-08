package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.TourAdminResponse;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.TourType;
import com.tripbee.backend.model.enums.TourStatus;
import com.tripbee.backend.repository.TourRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourAdminService {

    private final TourRepository tourRepository;

    public TourAdminService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public Page<TourAdminResponse> getAllTours(int page, int size, String search, String tourTypeId, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Tour> spec = buildSpecification(search, tourTypeId, status);

        Page<Tour> tourPage = tourRepository.findAll(spec, pageable);
        return tourPage.map(TourAdminResponse::new);
    }

    private Specification<Tour> buildSpecification(String search, String tourTypeId, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // (1) Tìm kiếm theo tên
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), pattern));
            }

            // (2) Lọc theo loại tour
            if (tourTypeId != null && !tourTypeId.isEmpty()) {
                Join<Tour, TourType> joinType = root.join("tourType", JoinType.LEFT);
                predicates.add(cb.equal(joinType.get("tourTypeID"), tourTypeId));
            }

            // (3) Lọc theo trạng thái
            if (status != null && !status.isEmpty()) {
                try {
                    TourStatus parsed = TourStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), parsed));
                } catch (IllegalArgumentException e) {
                    // Nếu status không hợp lệ thì bỏ qua
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
