package com.tripbee.backend.dto;

import com.tripbee.backend.model.Destination;
import com.tripbee.backend.model.Image;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class DestinationResponse {

    private String destinationID;
    private String nameDes;
    private String location;
    private String country;
    private List<String> imageURLs; // Mảng các URL
    private int tourCount; // Số lượng tour có sẵn

    public DestinationResponse(Destination destination) {
        this.destinationID = destination.getDestinationID();
        this.nameDes = destination.getNameDes();
        this.location = destination.getLocation();
        this.country = destination.getCountry();

        // (1) Lấy danh sách URL từ Set<Image>
        if (destination.getImages() != null) {
            this.imageURLs = destination.getImages().stream()
                    .map(Image::getUrl)
                    .collect(Collectors.toList());
        }

        // (2) Lấy số lượng tour từ Set<TourDestination>
        if (destination.getTourDestinations() != null) {
            this.tourCount = destination.getTourDestinations().size();
        } else {
            this.tourCount = 0;
        }
    }

    // Getters
    public String getDestinationID() { return destinationID; }
    public String getNameDes() { return nameDes; }
    public String getLocation() { return location; }
    public String getCountry() { return country; }
    public List<String> getImageURLs() { return imageURLs; }
    public int getTourCount() { return tourCount; }
}