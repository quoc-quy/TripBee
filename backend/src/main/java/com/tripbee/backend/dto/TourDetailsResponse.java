package com.tripbee.backend.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.tripbee.backend.model.Promotion;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.model.TourDestination; 
import com.tripbee.backend.model.TourPromotion;
import com.tripbee.backend.model.enums.PromotionStatus;
import com.tripbee.backend.model.Destination;

public class TourDetailsResponse implements Serializable  {
    private static final long serialVersionUID = 1L;
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
    private Double finalPriceAdult; 
    private Double finalPriceChild; 
    private int maxParticipants;
    private String imageURL;
    private String status;
    private Integer ranking; 
    private TourTypeDto tourType;
    private List<DestinationDto> destinations;
    private List<TourImageDto> tourImages;
    private List<ItineraryDto> itineraries;

    public TourDetailsResponse() {}

    public static TourDetailsResponse build(Tour tour) {
        TourDetailsResponse response = new TourDetailsResponse();
        response.setTourID(tour.getTourID());
        response.setTitle(tour.getTitle());
        response.setDescription(tour.getDescription());
        response.setStartDate(tour.getStartDate()); 
        response.setEndDate(tour.getEndDate()); 
        response.setDurationDays(tour.getDurationDays());
        response.setDurationNights(tour.getDurationNights());
        response.setDeparturePlace(tour.getDeparturePlace());
        response.setPriceAdult(tour.getPriceAdult()); 
        response.setPriceChild(tour.getPriceChild()); 
        response.setMaxParticipants(tour.getMaxParticipants());
        response.setImageURL(tour.getImageURL());
        response.setStatus(tour.getStatus().name());
        response.setRanking(tour.getRanking());

        // Logic tính giá khuyến mãi
        double discountPercentage = 0;
        LocalDate today = LocalDate.now();

        Optional<Promotion> bestPromotion = tour.getTourPromotions().stream()
                .map(TourPromotion::getPromotion)
                .filter(p -> p.getStatus() == PromotionStatus.ACTIVE &&
                        !today.isBefore(p.getStartDate()) &&
                        !today.isAfter(p.getEndDate()))
                .max(Comparator.comparingDouble(Promotion::getDiscountPercentage));

        if (bestPromotion.isPresent()) {
            discountPercentage = bestPromotion.get().getDiscountPercentage();
        }

        double adultPrice = tour.getPriceAdult() != null ? tour.getPriceAdult() : 0.0;
        double childPrice = tour.getPriceChild() != null ? tour.getPriceChild() : 0.0;

        double rawFinalAdult = adultPrice * (1 - (discountPercentage / 100.0));
        double rawFinalChild = childPrice * (1 - (discountPercentage / 100.0));

        double finalAdult = Math.ceil(rawFinalAdult / 10000.0) * 10000.0;
        double finalChild = Math.ceil(rawFinalChild / 10000.0) * 10000.0;

        response.setFinalPriceAdult(finalAdult);
        response.setFinalPriceChild(finalChild);

        if (tour.getTourType() != null) {
            response.setTourType(new TourTypeDto(tour.getTourType()));
        }

        List<DestinationDto> destinationDtos = tour.getTourDestinations().stream()
                .map(TourDestination::getDestination)
                .map(DestinationDto::new) 
                .collect(Collectors.toList());
        response.setDestinations(destinationDtos);

        List<TourImageDto> destinationImages = new ArrayList<>();
        if (tour.getTourDestinations() != null) {
            for (TourDestination td : tour.getTourDestinations()) {
                Destination dest = td.getDestination();
                if (dest != null && dest.getImages() != null) {
                    for (com.tripbee.backend.model.Image img : dest.getImages()) {
                        TourImageDto dto = new TourImageDto(img);
                        
                        destinationImages.add(dto);
                    }
                }
            }
        }
        response.setTourImages(destinationImages);

        List<ItineraryDto> itineraryDtos = tour.getItineraries().stream()
                .map(ItineraryDto::new) 
                .collect(Collectors.toList());
        response.setItineraries(itineraryDtos);

        return response;
    }

    // --- Getters and Setters ---
    public String getTourID() { return tourID; }
    public void setTourID(String tourID) { this.tourID = tourID; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; } 
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; } 
    public LocalDate getEndDate() { return endDate; } 
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; } 
    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
    public int getDurationNights() { return durationNights; }
    public void setDurationNights(int durationNights) { this.durationNights = durationNights; }
    public String getDeparturePlace() { return departurePlace; }
    public void setDeparturePlace(String departurePlace) { this.departurePlace = departurePlace; }
    public Double getPriceAdult() { return priceAdult; } 
    public void setPriceAdult(Double priceAdult) { this.priceAdult = priceAdult; } 
    public Double getPriceChild() { return priceChild; } 
    public void setPriceChild(Double priceChild) { this.priceChild = priceChild; } 

    public Double getFinalPriceAdult() { return finalPriceAdult; }
    public void setFinalPriceAdult(Double finalPriceAdult) { this.finalPriceAdult = finalPriceAdult; }
    public Double getFinalPriceChild() { return finalPriceChild; }
    public void setFinalPriceChild(Double finalPriceChild) { this.finalPriceChild = finalPriceChild; }

    public int getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(int maxParticipants) { this.maxParticipants = maxParticipants; }
    public String getImageURL() { return imageURL; }
    public void setImageURL(String imageURL) { this.imageURL = imageURL; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRanking() { return ranking; } 
    public void setRanking(Integer ranking) { this.ranking = ranking; } 
    public TourTypeDto getTourType() { return tourType; }
    public void setTourType(TourTypeDto tourType) { this.tourType = tourType; }
    public List<DestinationDto> getDestinations() { return destinations; }
    public void setDestinations(List<DestinationDto> destinations) { this.destinations = destinations; }
    public List<TourImageDto> getTourImages() { return tourImages; }
    public void setTourImages(List<TourImageDto> tourImages) { this.tourImages = tourImages; }
    public List<ItineraryDto> getItineraries() { return itineraries; }
    public void setItineraries(List<ItineraryDto> itineraries) { this.itineraries = itineraries; }
}