package com.tripbee.backend.admin.controller;

import com.tripbee.backend.admin.dto.response.TourTypeResponse;
import com.tripbee.backend.admin.service.TourAdminService;
import com.tripbee.backend.admin.service.TourTypeAdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tour-types")
public class TourTypeAdminController {

    private final TourTypeAdminService tourTypeAdminService;

    public TourTypeAdminController(TourTypeAdminService tourTypeAdminService) {
        this.tourTypeAdminService = tourTypeAdminService;
    }


    @GetMapping
    public List<TourTypeResponse> getAllTourTypes() {
        return tourTypeAdminService.getAll();
    }
}
