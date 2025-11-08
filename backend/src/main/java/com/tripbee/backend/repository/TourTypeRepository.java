package com.tripbee.backend.repository;

import com.tripbee.backend.model.TourType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourTypeRepository extends JpaRepository<TourType, String> {
    // Spring Data JPA sẽ tự động cung cấp phương thức findAll()
    // mà chúng ta cần.
}