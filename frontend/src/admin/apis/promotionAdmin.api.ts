
 import http from "../../utils/http";
import type { PromotionSimple } from "../types/promotionAdmin";

export const promotionAdminApi = {
  getSimplePromotions: () =>
    http.get<PromotionSimple[]>("/admin/promotions/simple"),
};