// src/main/java/com/tripbee/backend/admin/service/PromotionAdminService.java
package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.PromotionAdminResponse;
import com.tripbee.backend.model.Promotion;
import com.tripbee.backend.model.enums.PromotionStatus;
import com.tripbee.backend.repository.PromotionRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PromotionAdminService {

    private final PromotionRepository promotionRepository;

    public PromotionAdminService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public Page<PromotionAdminResponse> getAllPromotions(int page, int size, String search, String status, String sortBy) {
        // Mặc định sắp xếp theo ngày tạo mới nhất nếu không có sortBy
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sortBy != null && !sortBy.isEmpty()) {
            try {
                String[] parts = sortBy.split(",");
                String property = parts[0];
                Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("desc"))
                        ? Sort.Direction.DESC : Sort.Direction.ASC;
                sort = Sort.by(direction, property);
            } catch (Exception e) {
                // Giữ nguyên sort mặc định nếu có lỗi
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Promotion> spec = buildSpecification(search, status);

        Page<Promotion> promotionPage = promotionRepository.findAll(spec, pageable);
        return promotionPage.map(PromotionAdminResponse::new);
    }

    private Specification<Promotion> buildSpecification(String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // (1) Tìm kiếm theo tiêu đề (promotion code) hoặc mô tả
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titleLike, descLike));
            }

            // (2) Lọc theo trạng thái
            if (status != null && !status.isEmpty()) {
                try {
                    PromotionStatus parsed = PromotionStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), parsed));
                } catch (IllegalArgumentException e) {
                    // Nếu status không hợp lệ thì bỏ qua
                }
            }

            // [FIX N+1]: Chỉ cần FETCH ở đây nếu bạn muốn hiển thị quan hệ (ví dụ: Tour Promotion)
            // Trong trường hợp này, Promotion không có quan hệ nhiều Tour (chỉ có TourPromotion),
            // nên ta không cần fetch.

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}