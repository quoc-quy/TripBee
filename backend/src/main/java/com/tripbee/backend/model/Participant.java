package com.tripbee.backend.model;

import com.tripbee.backend.model.enums.Gender;
import com.tripbee.backend.model.enums.ParticipantType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "participants")
@Getter
@Setter
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String participantID;

    @Column(nullable = false)
    private String customerName;

    private String customerPhone;

    private String identification; // Số CMND/CCCD/Passport

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private ParticipantType participantType; // Phân loại người lớn/trẻ em

    // --- Mối quan hệ ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false) // Sửa lỗi: Phải là Booking
    private Booking booking;
}