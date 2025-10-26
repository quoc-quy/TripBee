package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_promotions")
@Getter
@Setter
public class TourPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourPromotionID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;
}