package com.tripbee.backend.repository;

import com.tripbee.backend.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItineraryRepository extends JpaRepository<Itinerary, String> { }