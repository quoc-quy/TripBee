import http from "../../utils/http";
import type { BookingListParams, BookingListAdmin } from "../types/bookingAdmin";

export const bookingAdminApi = {
    
  getAllBookings: (params: BookingListParams) => http.get<BookingListAdmin>("/admin/bookings", { params }),
  
  getStats: () => http.get<{ total: number; processing: number; confirmed: number; completed: number; canceled: number }>("/admin/bookings/stats")
};
