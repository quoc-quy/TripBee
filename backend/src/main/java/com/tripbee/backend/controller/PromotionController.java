package com.tripbee.backend.controller;

import com.tripbee.backend.model.Promotion;
import com.tripbee.backend.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    @Autowired
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    /** GET /api/admin/promotions */
    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        List<Promotion> promotions = promotionService.getAllPromotions();
        return ResponseEntity.ok(promotions);
    }

    /** POST /api/admin/promotions */
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion newPromotion = promotionService.createPromotion(promotion);
        return new ResponseEntity<>(newPromotion, HttpStatus.CREATED);
    }

    /** PUT /api/admin/promotions/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable("id") Long id, @RequestBody Promotion updatedPromotion) {
        Promotion result = promotionService.updatePromotion(id, updatedPromotion);
        return ResponseEntity.ok(result);
    }
}