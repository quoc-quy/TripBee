package com.tripbee.backend.service;

import com.tripbee.backend.exception.InvalidDataException; // Import mới
import com.tripbee.backend.exception.ResourceNotFoundException; // Exception bạn đã có
import com.tripbee.backend.model.Promotion;
import com.tripbee.backend.model.enums.PromotionStatus;
import com.tripbee.backend.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PromotionService {

    private final PromotionRepository promotionRepository;

    @Autowired
    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // Lấy danh sách tất cả khuyến mãi
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // Tạo một khuyến mãi mới
    public Promotion createPromotion(Promotion promotion) {
        // --- Ném InvalidDataException (400 Bad Request) ---
        if (promotion.getTitle() == null || promotion.getTitle().isEmpty()) {
            throw new InvalidDataException("Title (promotion code) không được để trống.");
        }
        if (promotion.getStartDate().isAfter(promotion.getEndDate())) {
            throw new InvalidDataException("Ngày bắt đầu không thể sau ngày kết thúc.");
        }

        // Kiểm tra trùng lặp Title
        if (promotionRepository.findByTitle(promotion.getTitle()).isPresent()) {
            throw new InvalidDataException("Title (promotion code) đã tồn tại.");
        }

        // Thiết lập mặc định
        if (promotion.getStatus() == null) {
            promotion.setStatus(PromotionStatus.INACTIVE);
        }
        promotion.setCurrentUsage(0);

        return promotionRepository.save(promotion);
    }

    // Cập nhật một khuyến mãi theo ID
    public Promotion updatePromotion(Long id, Promotion updatedPromotion) {
        // --- Ném ResourceNotFoundException (404 Not Found) ---
        Promotion existingPromotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khuyến mãi không tìm thấy."));

        // Cập nhật các trường
        existingPromotion.setDescription(updatedPromotion.getDescription());
        existingPromotion.setDiscountPercentage(updatedPromotion.getDiscountPercentage());
        existingPromotion.setDiscountAmount(updatedPromotion.getDiscountAmount());
        existingPromotion.setLimitUsage(updatedPromotion.getLimitUsage());
        existingPromotion.setStartDate(updatedPromotion.getStartDate());
        existingPromotion.setEndDate(updatedPromotion.getEndDate());
        existingPromotion.setStatus(updatedPromotion.getStatus());

        // --- Kiểm tra InvalidDataException (400 Bad Request) sau khi cập nhật ---
        if (existingPromotion.getStartDate().isAfter(existingPromotion.getEndDate())) {
            throw new InvalidDataException("Ngày bắt đầu không thể sau ngày kết thúc.");
        }

        return promotionRepository.save(existingPromotion);
    }
}