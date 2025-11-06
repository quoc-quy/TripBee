// frontend/src/apis/booking.api.ts
import http from "../utils/http";

interface BookingRequestBody {
  tourID: string;
  numAdults: number;
  numChildren: number;
  promotionCode?: string;
}

export const bookingApi = {
  createBooking: (body: BookingRequestBody) => {
    return http.post<string>("bookings", body);
  },
};