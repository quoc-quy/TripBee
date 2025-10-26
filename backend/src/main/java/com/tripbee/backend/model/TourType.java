package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "tour_types")
@Getter
@Setter
public class TourType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourTypeID;

    @Column(nullable = false, unique = true)
    private String nameType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    // --- Mối quan hệ ---

    // Sửa lỗi: 1 TourType có nhiều Tour
    @OneToMany(mappedBy = "tourType")
    private Set<Tour> tours;
}