// src/main/java/com/tripbee/backend/admin/controller/PromotionAdminController.java
package com.tripbee.backend.admin.controller;

import com.tripbee.backend.admin.dto.PromotionAdminResponse;
import com.tripbee.backend.admin.service.PromotionAdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/promotions") // Đường dẫn API mới
public class PromotionAdminController {

    private final PromotionAdminService promotionAdminService;

    public PromotionAdminController(PromotionAdminService promotionAdminService) {
        this.promotionAdminService = promotionAdminService;
    }

    @GetMapping
    public ResponseEntity<Page<PromotionAdminResponse>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort // Thêm tham số sort
    ) {
        // Gọi service để lấy danh sách khuyến mãi đã được lọc/phân trang
        Page<PromotionAdminResponse> promotionPage = promotionAdminService.getAllPromotions(
                page, size, search, status, sort
        );
        return ResponseEntity.ok(promotionPage);
    }

    // [TODO] Bạn có thể thêm các API POST, PUT, DELETE cho Promotion tại đây.
}