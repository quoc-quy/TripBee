package com.tripbee.backend.dto;

import com.tripbee.backend.model.TourImage;
import com.tripbee.backend.model.Image;

public class TourImageDto {
    private String url;
    private String caption;


    public TourImageDto(Image image) {
        this.url = image.getUrl();
        this.caption = image.getCaption();
    }
    public TourImageDto() {
    }

    // Getters
    public String getUrl() { return url; }
    public String getCaption() { return caption; }
}