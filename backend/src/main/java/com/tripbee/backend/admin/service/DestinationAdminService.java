package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.response.DestinationAdminResponse;
import com.tripbee.backend.dto.DestinationResponse;
import com.tripbee.backend.model.Destination;
import com.tripbee.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationAdminService {

    private final DestinationRepository destinationRepository;

    public DestinationAdminService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // Lấy tất cả destination
    public List<DestinationAdminResponse> getAll() {
        return destinationRepository.findAll()
                .stream()
                .map(DestinationAdminResponse::new)
                .toList();
    }

    // Lấy theo region: miền bắc, trung, nam
    public List<DestinationAdminResponse> getByRegion(String region) {
        return destinationRepository.findAllByRegion(region)
                .stream()
                .map(DestinationAdminResponse::new)
                .toList();
    }


}
