package com.tripbee.backend.repository;

import com.tripbee.backend.model.Destination;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // (1) THÊM IMPORT
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, String>,
        JpaSpecificationExecutor<Destination> {
}