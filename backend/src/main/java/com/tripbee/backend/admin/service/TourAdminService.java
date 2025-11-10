package com.tripbee.backend.admin.service;

import com.tripbee.backend.admin.dto.request.TourRequest;
import com.tripbee.backend.admin.dto.response.tour.TourAdminResponse;
import com.tripbee.backend.admin.dto.response.tour.TourDetailAdminResponse;
import com.tripbee.backend.model.Destination;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.TourDestination;
import com.tripbee.backend.model.TourType;
import com.tripbee.backend.model.enums.TourStatus;
import com.tripbee.backend.repository.DestinationRepository;
import com.tripbee.backend.repository.TourDestinationRepository;
import com.tripbee.backend.repository.TourRepository;
import com.tripbee.backend.repository.TourTypeRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.JoinType;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourAdminService {

    private final TourRepository tourRepository;
    private final TourTypeRepository tourTypeRepository;
    private final DestinationRepository destinationRepository;
    private final TourDestinationRepository tourDestinationRepository;

    public TourAdminService(TourRepository tourRepository, TourTypeRepository tourTypeRepository, DestinationRepository destinationRepository, TourDestinationRepository tourDestinationRepository) {
        this.tourRepository = tourRepository;
        this.tourTypeRepository = tourTypeRepository;
        this.destinationRepository = destinationRepository;
        this.tourDestinationRepository = tourDestinationRepository;
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

    // lưu tour
    @Transactional
    public Tour createTour(TourRequest dto) {
        Tour tour = new Tour();
        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setStartDate(dto.getStartDate());
        tour.setEndDate(dto.getEndDate());
        tour.setDurationDays(dto.getDurationDays());
        tour.setDurationNights(dto.getDurationNights());
        tour.setPriceAdult(dto.getPriceAdult());
        tour.setPriceChild(dto.getPriceChild());
        tour.setMinParticipants(dto.getMinGuests());
        tour.setMaxParticipants(dto.getMaxGuests());
        tour.setImageURL(dto.getImageURL());

        // map status string -> enum
        tour.setStatus(TourStatus.valueOf(dto.getStatus())); // đảm bảo cùng tên

        // tour type
        TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid tourTypeId"));
        tour.setTourType(tourType);

        // lưu tour trước để có tourID
        Tour saved = tourRepository.save(tour);

        // tạo TourDestination
        if (dto.getDestinationIds() != null) {
            for (String desId : dto.getDestinationIds()) {
                Destination des = destinationRepository.findById(desId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid destinationId: " + desId));

                TourDestination td = new TourDestination();
                td.setTour(saved);
                td.setDestination(des);
                tourDestinationRepository.save(td);
            }
        }

        return saved;
    }

    public TourDetailAdminResponse getTourDetail(String id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        // đảm bảo load quan hệ nếu dùng LAZY (hoặc bật transactional)
        return new TourDetailAdminResponse(tour);
    }

    @Transactional
    public Tour updateTour(String id, TourRequest dto) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        tour.setTitle(dto.getTitle());
        tour.setDescription(dto.getDescription());
        tour.setStartDate(dto.getStartDate());
        tour.setEndDate(dto.getEndDate());
        tour.setDurationDays(dto.getDurationDays());
        tour.setDurationNights(dto.getDurationNights());
        tour.setPriceAdult(dto.getPriceAdult());
        tour.setPriceChild(dto.getPriceChild());
        tour.setMinParticipants(dto.getMinGuests());
        tour.setMaxParticipants(dto.getMaxGuests());
        tour.setImageURL(dto.getImageURL());
        tour.setStatus(TourStatus.valueOf(dto.getStatus()));

        // tour type
        TourType tourType = tourTypeRepository.findById(dto.getTourTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid tourTypeId"));
        tour.setTourType(tourType);

        // XÓA CŨ ĐÚNG CÁCH (dùng orphanRemoval trên collection)
        if (tour.getTourDestinations() != null) {
            tour.getTourDestinations().clear(); // Hibernate tự xóa orphan
        }

        // THÊM MỚI
        if (dto.getDestinationIds() != null) {
            for (String desId : dto.getDestinationIds()) {
                Destination des = destinationRepository.findById(desId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid destinationId: " + desId));

                TourDestination td = new TourDestination();
                td.setTour(tour);
                td.setDestination(des);

                // Quan trọng: add vào collection của tour
                tour.getTourDestinations().add(td);
            }
        }

        return tourRepository.save(tour);
    }

}
