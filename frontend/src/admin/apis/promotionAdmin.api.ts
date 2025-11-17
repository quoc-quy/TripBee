import http from "../../utils/http";
import type {
  PromotionAdmin,
  PromotionDetailAdmin,
  PromotionListAdmin,
  PromotionListAdminParams,
  PromotionSave,
} from "../types/promotionAdmin";

export const promotionAdminApi = {
  /**
   * Lấy danh sách khuyến mãi có phân trang và bộ lọc
   * API: GET /api/admin/promotions
   */
  getAllPromotions: (params: PromotionListAdminParams) => {
    return http.get<PromotionListAdmin>("/admin/promotions", { params });
  },
  // Bạn có thể thêm các hàm create, update, delete ở đây
  getPromotionById: (id: string) => {
    return http.get<PromotionDetailAdmin>(`/admin/promotions/${id}`);
  },

  // (MỚI) Tạo khuyến mãi
  createPromotion: (data: PromotionSave) => {
    return http.post<PromotionAdmin>("/admin/promotions", data);
  },

  // (MỚI) Cập nhật khuyến mãi
  updatePromotion: (id: string, data: PromotionSave) => {
    return http.put<PromotionAdmin>(`/admin/promotions/${id}`, data);
  },
};
