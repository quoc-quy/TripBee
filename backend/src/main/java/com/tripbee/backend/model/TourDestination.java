package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_destinations")
@Getter
@Setter
public class TourDestination {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourDestinationID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;
}