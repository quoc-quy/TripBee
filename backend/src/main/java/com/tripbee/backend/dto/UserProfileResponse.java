package com.tripbee.backend.dto;

import com.tripbee.backend.model.Account;
import com.tripbee.backend.model.User;

// Không cần @Data vì chúng ta chỉ dùng constructor
public class UserProfileResponse {

    private String userID;
    private String username;
    private String name;
    private String email;
    private String role;
    private String avatarURL; // Thêm avatar nếu bạn muốn

    // Constructor để ánh xạ từ Account (UserDetails)
    public UserProfileResponse(Account account) {
        User user = account.getUser(); // Lấy đối tượng User liên kết

        this.userID = user.getUserID();
        this.username = account.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = account.getRole().name();
        this.avatarURL = user.getAvatarURL();
    }

    // Thêm các Getters thủ công
    public String getUserID() { return userID; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getAvatarURL() { return avatarURL; }
}