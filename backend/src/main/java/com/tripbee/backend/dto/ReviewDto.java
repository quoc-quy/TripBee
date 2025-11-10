package com.tripbee.backend.dto;

import com.tripbee.backend.model.Review;
import com.tripbee.backend.model.User;

import java.time.LocalDateTime;

public class ReviewDto {

    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private ReviewUserDto user; // (1) Thông tin người dùng lồng bên trong

    // Constructor để chuyển đổi từ Review Entity sang DTO
    public ReviewDto(Review review) {
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();

        // (2) Kiểm tra null và tạo DTO người dùng
        if (review.getUser() != null) {
            this.user = new ReviewUserDto(review.getUser());
        }
    }

    // --- Getters ---
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public ReviewUserDto getUser() { return user; }


    // (3) LỚP LỒNG BÊN TRONG (Nested Class)
    // Dùng để chỉ hiển thị thông tin công khai của User
    private static class ReviewUserDto {
        private String name;
        private String avatarURL;

        public ReviewUserDto(User user) {
            this.name = user.getName();
            this.avatarURL = user.getAvatarURL();
        }

        // Getters cho lớp lồng
        public String getName() { return name; }
        public String getAvatarURL() { return avatarURL; }
    }
}