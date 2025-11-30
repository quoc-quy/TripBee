package com.tripbee.backend.admin.dto.response.promotions;

import com.tripbee.backend.model.Promotion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PromotionSimpleResponse {
    private String promotionID;
    private String title;

    public PromotionSimpleResponse(Promotion promotion) {
        this.promotionID = promotion.getPromotionID();
        this.title = promotion.getTitle();
    }
}
