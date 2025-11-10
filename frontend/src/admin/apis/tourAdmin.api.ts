
import http from "../../utils/http";
import type { TourListAdminParams } from "../../types/tour";
import type { TourDetailAdmin } from "../types/tourAdmin";

export const tourAdminApi = {
  getAllTours: (params: TourListAdminParams) => {
    return http.get("/admin/tours", { params });
  },

  getTourById: (id: string) => http.get<TourDetailAdmin>(`/admin/tours/${id}`),

  createTour: (data: any) => http.post("/admin/tours", data),

  updateTour: (id: string, data: any) => http.put(`/admin/tours/${id}`, data),
};
