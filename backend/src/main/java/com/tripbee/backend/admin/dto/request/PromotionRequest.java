package com.tripbee.backend.admin.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PromotionRequest {
    private String title;
    private String description;
    private int discountPercentage;
    private Double discountAmount;
    private int limitUsage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // Chuyển String sang Enum trong Service
}