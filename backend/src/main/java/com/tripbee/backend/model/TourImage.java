package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_images")
@Getter
@Setter
public class TourImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourImageID;

    @Column(nullable = false)
    private String url;

    private String caption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;
}