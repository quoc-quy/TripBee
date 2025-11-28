package com.tripbee.backend.admin.dto.response.ContactMessage;

import com.tripbee.backend.model.ContactMessage;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ContactMessageResponse {
    private String id;
    private String email;
    private String phone;
    private String message;
    private LocalDateTime sentAt;
    private String userName; // Tên người gửi (nếu là user đã đăng nhập)

    public ContactMessageResponse(ContactMessage msg) {
        this.id = msg.getContactMessID();
        this.email = msg.getEmail();
        this.phone = msg.getPhone();
        this.message = msg.getMessage();
        this.sentAt = msg.getSentAt();

        // Nếu có user liên kết thì lấy tên, nếu không thì là "Khách vãng lai"
        if (msg.getUser() != null) {
            this.userName = msg.getUser().getName();
        } else {
            this.userName = "Guest (Khách vãng lai)";
        }
    }
}