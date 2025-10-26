package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "itineraries")
@Getter
@Setter
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String itineraryID;

    @Column(nullable = false)
    private int dayNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;
}