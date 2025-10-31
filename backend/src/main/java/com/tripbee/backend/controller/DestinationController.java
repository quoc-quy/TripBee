package com.tripbee.backend.controller;

import com.tripbee.backend.dto.DestinationResponse;
import com.tripbee.backend.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // (1) THÊM IMPORT
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getAllDestinations(
            // (2) THÊM THAM SỐ NÀY
            @RequestParam(required = false) String location
    ) {
        // (3) TRUYỀN THAM SỐ VÀO SERVICE
        List<DestinationResponse> destinations = destinationService.getAllDestinations(location);
        return ResponseEntity.ok(destinations);
    }
}