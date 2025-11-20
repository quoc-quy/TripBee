package com.tripbee.backend.dto;

import com.tripbee.backend.model.Booking;
import com.tripbee.backend.model.enums.BookingStatus;

import java.time.format.DateTimeFormatter;

public class BookingHistoryResponse {

    private String bookingID;
    private String tourID;
    private String tourTitle;
    private String tourImageURL;
    private String bookingDate;
    private Double finalAmount;
    private BookingStatus status;
    private int numAdults;
    private int numChildren;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public BookingHistoryResponse(Booking booking) {
        this.bookingID = booking.getBookingID();
        this.tourID = booking.getTour().getTourID();
        this.tourTitle = booking.getTour().getTitle();
        this.tourImageURL = booking.getTour().getImageURL();
        this.bookingDate = booking.getBookingDate().format(DATE_FORMATTER); // Format ngày
        this.finalAmount = booking.getFinalAmount();
        this.status = booking.getStatus();
        this.numAdults = booking.getNumAdults();
        this.numChildren = booking.getNumChildren();
    }

    public String getBookingID() { return bookingID; }
    public String getTourID() { return tourID; }
    public String getTourTitle() { return tourTitle; }
    public String getTourImageURL() { return tourImageURL; }
    public String getBookingDate() { return bookingDate; }
    public Double getFinalAmount() { return finalAmount; }
    public BookingStatus getStatus() { return status; }
    public int getNumAdults() { return numAdults; }
    public int getNumChildren() { return numChildren; }

    public void setBookingID(String bookingID) { this.bookingID = bookingID; }
    public void setTourID(String tourID) { this.tourID = tourID; }
    public void setTourTitle(String tourTitle) { this.tourTitle = tourTitle; }
    public void setTourImageURL(String tourImageURL) { this.tourImageURL = tourImageURL; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public void setFinalAmount(Double finalAmount) { this.finalAmount = finalAmount; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public void setNumAdults(int numAdults) { this.numAdults = numAdults; }
    public void setNumChildren(int numChildren) { this.numChildren = numChildren; }
}