import http from "../../utils/http";
import type { TourTypeAdminParams } from "../types/tourTypeAdmin";

export const tourTypeAdminApi = {
  getAllTours: (params: TourTypeAdminParams) => {
    return http.get("/admin/tour-types", { params });
  },
};
