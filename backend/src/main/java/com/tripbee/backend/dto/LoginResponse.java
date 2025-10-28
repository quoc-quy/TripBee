package com.tripbee.backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private String userID;
    private String username;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponse(boolean success, String message, String token, String userID, String username, String role) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userID = userID;
        this.username = username;
        this.role = role;
    }

    // (2) THÊM CÁC GETTERS THỦ CÔNG (ĐẶC BIỆT LÀ isSuccess)

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getUserID() {
        return userID;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    // Bạn cũng có thể thêm các Setters nếu cần
}