package com.tripbee.backend.dto;

import lombok.Data;

// DTO để nhận dữ liệu đặt tour từ client
@Data
public class BookingRequest {
    private String tourID;
    private int numAdults;
    private int numChildren;
    private String promotionCode; // Mã khuyến mãi (nếu có)

    // Thông tin cơ bản của người đặt (có thể lấy từ token)
    // Trường hợp này, ta sẽ lấy userID từ JWT Token

    // Getter/Setter thủ công
    public String getTourID() {
        return tourID;
    }

    public void setTourID(String tourID) {
        this.tourID = tourID;
    }

    public int getNumAdults() {
        return numAdults;
    }

    public void setNumAdults(int numAdults) {
        this.numAdults = numAdults;
    }

    public int getNumChildren() {
        return numChildren;
    }

    public void setNumChildren(int numChildren) {
        this.numChildren = numChildren;
    }

    public String getPromotionCode() {
        return promotionCode;
    }

    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }
}