package com.tripbee.backend.dto;

import com.tripbee.backend.model.Destination;

public class DestinationDto {
    private String destinationID;
    private String nameDes;
    private String location;
    private String country;

    // Constructor
    public DestinationDto(Destination destination) {
        this.destinationID = destination.getDestinationID();
        this.nameDes = destination.getNameDes();
        this.location = destination.getLocation();
        this.country = destination.getCountry();
    }

    // Getters
    public String getDestinationID() { return destinationID; }
    public String getNameDes() { return nameDes; }
    public String getLocation() { return location; }
    public String getCountry() { return country; }
}