package com.tripbee.backend.dto;

import java.time.LocalDate;

public class CancelEstimationResponse {

    private String bookingID;
    private String tourTitle;
    private LocalDate startDate;
    private long daysRemaining;
    private double feePercentage;
    private double feeAmount;
    private double refundAmount;

    public CancelEstimationResponse() {}

    public CancelEstimationResponse(String bookingID, String tourTitle, LocalDate startDate,
                                    long daysRemaining, double feePercentage, double feeAmount, double refundAmount) {
        this.bookingID = bookingID;
        this.tourTitle = tourTitle;
        this.startDate = startDate;
        this.daysRemaining = daysRemaining;
        this.feePercentage = feePercentage;
        this.feeAmount = feeAmount;
        this.refundAmount = refundAmount;
    }

    public String getBookingID() {
        return bookingID;
    }

    public void setBookingID(String bookingID) {
        this.bookingID = bookingID;
    }

    public String getTourTitle() {
        return tourTitle;
    }

    public void setTourTitle(String tourTitle) {
        this.tourTitle = tourTitle;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public double getFeePercentage() {
        return feePercentage;
    }

    public void setFeePercentage(double feePercentage) {
        this.feePercentage = feePercentage;
    }

    public double getFeeAmount() {
        return feeAmount;
    }

    public void setFeeAmount(double feeAmount) {
        this.feeAmount = feeAmount;
    }

    public double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(double refundAmount) {
        this.refundAmount = refundAmount;
    }
}
