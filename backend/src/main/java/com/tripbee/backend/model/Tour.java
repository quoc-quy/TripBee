package com.tripbee.backend.model;

import com.tripbee.backend.model.enums.TourStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "tours")
@Getter
@Setter
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourID;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private int durationDays; // Cải tiến từ 'duration'

    private int durationNights; // Cải tiến từ 'duration'

    private String departurePlace;

    @Column(nullable = false)
    private Double priceAdult;

    @Column(nullable = false)
    private Double priceChild;

    private int maxParticipants;
    private int minParticipants;

    private String imageURL; // Ảnh bìa

    @Enumerated(EnumType.STRING)
    private TourStatus status;

    private Integer ranking;

    // --- Mối quan hệ ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_type_id") // Sửa lỗi: Tour phải có tourTypeID
    private TourType tourType;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourDestination> tourDestinations;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourImage> tourImages; // Thư viện ảnh

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Itinerary> itineraries; // Lịch trình chi tiết

    @OneToMany(mappedBy = "tour")
    private Set<Booking> bookings;

    @OneToMany(mappedBy = "tour")
    private Set<Review> reviews;

    @OneToMany(mappedBy = "tour")
    private Set<Favorite> favorites;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourPromotion> tourPromotions;
}