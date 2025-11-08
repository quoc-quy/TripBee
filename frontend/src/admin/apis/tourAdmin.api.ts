
import http from "../../utils/http";
import type { TourListAdminParams } from "../../types/tour";

export const tourAdminApi = {
  getAllTours: (params: TourListAdminParams) => {
    return http.get("/admin/tours", { params });
  },
};
