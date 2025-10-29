package com.tripbee.backend.dto;

import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.enums.TourStatus;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public class TourDetailsResponse {
    private String tourID;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int durationDays;
    private int durationNights;
    private String departurePlace;
    private Double priceAdult;
    private Double priceChild;
    private int maxParticipants;
    private String imageURL; // Ảnh bìa
    private TourStatus status;

    // Các thông tin liên kết
    private TourTypeDto tourType;
    private Set<DestinationDto> destinations;
    private Set<ItineraryDto> itineraries;
    private Set<TourImageDto> tourImages; // Thư viện ảnh

    // Constructor chính để chuyển đổi từ Tour Entity
    public TourDetailsResponse(Tour tour) {
        this.tourID = tour.getTourID();
        this.title = tour.getTitle();
        this.description = tour.getDescription();
        this.startDate = tour.getStartDate();
        this.endDate = tour.getEndDate();
        this.durationDays = tour.getDurationDays();
        this.durationNights = tour.getDurationNights();
        this.departurePlace = tour.getDeparturePlace();
        this.priceAdult = tour.getPriceAdult();
        this.priceChild = tour.getPriceChild();
        this.maxParticipants = tour.getMaxParticipants();
        this.imageURL = tour.getImageURL();
        this.status = tour.getStatus();

        // Chuyển đổi các thông tin liên kết
        // Lưu ý: Cần đảm bảo các collection này đã được tải (EAGER hoặc JOIN FETCH)
        // hoặc xử lý LazyInitializationException nếu cần.
        if (tour.getTourType() != null) {
            this.tourType = new TourTypeDto(tour.getTourType());
        }

        if (tour.getItineraries() != null) {
            this.itineraries = tour.getItineraries().stream()
                    .map(ItineraryDto::new)
                    .collect(Collectors.toSet());
        }

        if (tour.getTourImages() != null) {
            this.tourImages = tour.getTourImages().stream()
                    .map(TourImageDto::new)
                    .collect(Collectors.toSet());
        }

        if (tour.getTourDestinations() != null) {
            this.destinations = tour.getTourDestinations().stream()
                    // Chỉ lấy Destination từ TourDestination
                    .map(td -> new DestinationDto(td.getDestination()))
                    .collect(Collectors.toSet());
        }
    }

    // Getters cho tất cả các trường
    public String getTourID() { return tourID; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public int getDurationDays() { return durationDays; }
    public int getDurationNights() { return durationNights; }
    public String getDeparturePlace() { return departurePlace; }
    public Double getPriceAdult() { return priceAdult; }
    public Double getPriceChild() { return priceChild; }
    public int getMaxParticipants() { return maxParticipants; }
    public String getImageURL() { return imageURL; }
    public TourStatus getStatus() { return status; }
    public TourTypeDto getTourType() { return tourType; }
    public Set<DestinationDto> getDestinations() { return destinations; }
    public Set<ItineraryDto> getItineraries() { return itineraries; }
    public Set<TourImageDto> getTourImages() { return tourImages; }
}