package com.tripbee.backend.dto;

import com.tripbee.backend.model.TourType;

public class TourTypeDto {
    private String tourTypeID;
    private String nameType;

    // Constructor
    public TourTypeDto(TourType tourType) {
        this.tourTypeID = tourType.getTourTypeID();
        this.nameType = tourType.getNameType();
    }

    // Getters
    public String getTourTypeID() { return tourTypeID; }
    public String getNameType() { return nameType; }
}