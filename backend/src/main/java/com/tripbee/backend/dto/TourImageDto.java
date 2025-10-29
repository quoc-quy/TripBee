package com.tripbee.backend.dto;

import com.tripbee.backend.model.TourImage;

public class TourImageDto {
    private String url;
    private String caption;

    // Constructor
    public TourImageDto(TourImage tourImage) {
        this.url = tourImage.getUrl();
        this.caption = tourImage.getCaption();
    }

    // Getters
    public String getUrl() { return url; }
    public String getCaption() { return caption; }
}