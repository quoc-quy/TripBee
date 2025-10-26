package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "tour_id"}) // 1 user chỉ favorite 1 tour 1 lần
})
@Getter
@Setter
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String favoriteID;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime addedAt;

    // --- Mối quan hệ ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;
}