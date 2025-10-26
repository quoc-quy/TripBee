package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "destinations")
@Getter
@Setter
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String destinationID;

    @Column(nullable = false)
    private String nameDes;

    private String location;

    private String country;

    // --- Mối quan hệ ---

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourDestination> tourDestinations;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Image> images;
}