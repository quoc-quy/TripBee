package com.tripbee.backend.admin.controller;

import com.tripbee.backend.admin.dto.response.DestinationAdminResponse;
import com.tripbee.backend.admin.service.DestinationAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/destinations")
public class DestinationAdminController {

    private final DestinationAdminService destinationAdminService;

    public DestinationAdminController(DestinationAdminService destinationAdminService) {
        this.destinationAdminService = destinationAdminService;
    }

    @GetMapping
    public ResponseEntity<List<DestinationAdminResponse>> getDestinations(
            @RequestParam(required = false) String region
    ) {
        if (region != null && !region.isEmpty()) {
            return ResponseEntity.ok(destinationAdminService.getByRegion(region));
        }
        return ResponseEntity.ok(destinationAdminService.getAll());
    }
}
