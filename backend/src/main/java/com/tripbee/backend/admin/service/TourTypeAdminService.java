package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.response.TourTypeResponse;
import com.tripbee.backend.model.TourType;
import com.tripbee.backend.repository.TourTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourTypeAdminService {

    private final TourTypeRepository tourTypeRepository;

    public TourTypeAdminService(TourTypeRepository tourTypeRepository) {
        this.tourTypeRepository = tourTypeRepository;
    }

    public List<TourTypeResponse> getAll() {
        return tourTypeRepository.findAll().stream()
                .map(TourTypeResponse::new)
                .toList();
    }
}
