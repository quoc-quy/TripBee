package com.tripbee.backend.model;

import com.tripbee.backend.model.enums.PromotionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "promotions")
@Getter
@Setter
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String promotionID;

    @Column(nullable = false, unique = true)
    private String title; // Dùng làm "promotion code"

    @Column(columnDefinition = "TEXT")
    private String description;

    private int discountPercentage; // Giảm %

    private Double discountAmount; // Giảm tiền cố định (ưu tiên dùng 1 trong 2)

    private int limitUsage; // Giới hạn số lần dùng

    private int currentUsage = 0; // Đã dùng bao nhiêu lần

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PromotionStatus status;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    // --- Mối quan hệ ---

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourPromotion> tourPromotions;

    @OneToMany(mappedBy = "promotion")
    private Set<Booking> bookings;
}