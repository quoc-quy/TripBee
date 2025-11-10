package com.tripbee.backend.repository;

import com.tripbee.backend.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion,Long>,
        JpaSpecificationExecutor<Promotion> {
}
