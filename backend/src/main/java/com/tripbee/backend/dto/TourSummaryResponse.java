package com.tripbee.backend.dto;

import com.tripbee.backend.model.Tour;

// DTO này dùng để hiển thị tour tóm tắt ngoài trang chủ
public class TourSummaryResponse {
    private String tourID;
    private String title;
    private int durationDays;
    private String departurePlace;
    private Double priceAdult;
    private String imageURL; // Ảnh bìa
    private Integer ranking;

    // Constructor để chuyển đổi từ Tour Entity sang DTO
    public TourSummaryResponse(Tour tour) {
        this.tourID = tour.getTourID();
        this.title = tour.getTitle();
        this.durationDays = tour.getDurationDays();
        this.departurePlace = tour.getDeparturePlace();
        this.priceAdult = tour.getPriceAdult();
        this.imageURL = tour.getImageURL();
        this.ranking = tour.getRanking();
    }

    // Thêm các getters thủ công (vì chúng ta không dùng Lombok ở đây)
    public String getTourID() { return tourID; }
    public String getTitle() { return title; }
    public int getDurationDays() { return durationDays; }
    public String getDeparturePlace() { return departurePlace; }
    public Double getPriceAdult() { return priceAdult; }
    public String getImageURL() { return imageURL; }
    public Integer getRanking() { return ranking; }
}