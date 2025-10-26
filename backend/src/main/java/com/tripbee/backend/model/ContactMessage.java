package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String contactMessID;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime sentAt;

    // --- Mối quan hệ ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // Cho phép Guest (NULL) gửi
    private User user;
}