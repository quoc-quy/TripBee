import http from "../../utils/http";
import type { PromotionListAdmin, PromotionListAdminParams } from "../types/promotionAdmin";

export const promotionAdminApi = {
    /**
     * Lấy danh sách khuyến mãi có phân trang và bộ lọc
     * API: GET /api/admin/promotions
     */
    getAllPromotions: (params: PromotionListAdminParams) => {
        return http.get<PromotionListAdmin>("/admin/promotions", { params });
    },
    // Bạn có thể thêm các hàm create, update, delete ở đây
};