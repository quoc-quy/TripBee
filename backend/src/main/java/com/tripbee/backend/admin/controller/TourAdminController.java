package com.tripbee.backend.admin.controller;

import com.tripbee.backend.admin.dto.TourAdminResponse;
import com.tripbee.backend.admin.service.TourAdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tours")
public class TourAdminController {

    private final TourAdminService tourAdminService;

    public TourAdminController(TourAdminService tourAdminService) {
        this.tourAdminService = tourAdminService;
    }

    @GetMapping
    public ResponseEntity<Page<TourAdminResponse>> getAllTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(name = "tour_type_id", required = false) String tourTypeId,
            @RequestParam(required = false) String status
    ) {
        Page<TourAdminResponse> tourPage = tourAdminService.getAllTours(page, size, search, tourTypeId, status);
        return ResponseEntity.ok(tourPage);
    }
}
