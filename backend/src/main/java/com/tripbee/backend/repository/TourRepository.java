package com.tripbee.backend.repository;

import com.tripbee.backend.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TourRepository extends JpaRepository<Tour, String>, JpaSpecificationExecutor<Tour> {
    // JpaSpecificationExecutor sẽ cung cấp các phương thức
    // như findAll(Specification<Tour> spec, Pageable pageable)
    // cho phép chúng ta lọc động
}