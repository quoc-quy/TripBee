package com.tripbee.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String destinationID;

    @Column(nullable = false)
    private String nameDes;

    private String location;

    private String country;

    public String getDestinationID() {
        return destinationID;
    }

    public void setDestinationID(String destinationID) {
        this.destinationID = destinationID;
    }

    public String getNameDes() {
        return nameDes;
    }

    public void setNameDes(String nameDes) {
        this.nameDes = nameDes;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Set<TourDestination> getTourDestinations() {
        return tourDestinations;
    }

    public void setTourDestinations(Set<TourDestination> tourDestinations) {
        this.tourDestinations = tourDestinations;
    }

    public Set<Image> getImages() {
        return images;
    }

    public void setImages(Set<Image> images) {
        this.images = images;
    }

    // --- Mối quan hệ ---

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourDestination> tourDestinations;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Image> images;
}