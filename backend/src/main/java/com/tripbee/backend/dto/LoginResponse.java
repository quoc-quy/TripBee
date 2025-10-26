package com.tripbee.backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean success;
    private String message;
    private String userID;
    private String username;
    private String role;

    // THÊM 1: Constructor rỗng (cần cho JSON)
    public LoginResponse() {
    }

    // THÊM 2: Constructor cho trường hợp đăng nhập THẤT BẠI
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // THÊM 3: Constructor cho trường hợp đăng nhập THÀNH CÔNG
    public LoginResponse(boolean success, String message, String userID, String username, String role) {
        this.success = success;
        this.message = message;
        this.userID = userID;
        this.username = username;
        this.role = role;
    }

    // THÊM 4: Getters và Setters thủ công
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}