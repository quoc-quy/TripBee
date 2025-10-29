package com.tripbee.backend.controller;

import com.tripbee.backend.dto.TourSummaryResponse;
import com.tripbee.backend.service.TourService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tours") // API này đã được permitAll() trong SecurityConfig
public class TourController {

    private final TourService tourService;

    // (1) Dùng constructor để Spring tiêm (inject)
    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public ResponseEntity<Page<TourSummaryResponse>> getAllTours(
            // (2) Lấy các tham số từ Query Params
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String search,
            @RequestParam(name = "destination_id", required = false) String destinationId,
            @RequestParam(name = "tour_type_id", required = false) String tourTypeId,
            @RequestParam(name = "price_min", required = false) Double priceMin,
            @RequestParam(name = "price_max", required = false) Double priceMax
    ) {

        // (3) Gọi service
        Page<TourSummaryResponse> tourPage = tourService.getAllActiveTours(
                page, size, sort, search, destinationId, tourTypeId, priceMin, priceMax
        );

        // (4) Trả về Page (đã bao gồm thông tin phân trang)
        return ResponseEntity.ok(tourPage);
    }

    // TODO: Thêm API GET /api/tours/{id} (Lấy chi tiết 1 tour) ở đây
}