package com.tripbee.backend.admin.dto.response.tour;

import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.TourDestination;
import com.tripbee.backend.model.enums.TourStatus;

import java.util.Optional;

public class TourAdminResponse {
    private String tourID;
    private String title;
    private String imageURL;
    private int durationDays;
    private int durationNights;
    private Double priceAdult;
    private String tourTypeName;
    private String destinationName;
    private TourStatus status;

    public TourAdminResponse(Tour tour) {
        this.tourID = tour.getTourID();
        this.title = tour.getTitle();
        this.imageURL = tour.getImageURL();
        this.durationDays = tour.getDurationDays();
        this.durationNights = tour.getDurationNights();
        this.priceAdult = tour.getPriceAdult();
        this.status = tour.getStatus();

        if (tour.getTourType() != null) {
            this.tourTypeName = tour.getTourType().getNameType();
        }

        if (tour.getTourDestinations() != null && !tour.getTourDestinations().isEmpty()) {
            Optional<TourDestination> firstDest = tour.getTourDestinations().stream().findFirst();
            firstDest.ifPresent(tourDestination -> {
                if (tourDestination.getDestination() != null) {
                    this.destinationName = tourDestination.getDestination().getNameDes();
                }
            });
        }
    }

    public String getTourID() { return tourID; }
    public String getTitle() { return title; }
    public String getImageURL() { return imageURL; }
    public int getDurationDays() { return durationDays; }
    public int getDurationNights() { return durationNights; }
    public Double getPriceAdult() { return priceAdult; }
    public String getTourTypeName() { return tourTypeName; }
    public String getDestinationName() { return destinationName; }
    public TourStatus getStatus() { return status; }
}
