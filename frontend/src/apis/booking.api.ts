import http from "../utils/http";
import type { BookingDetail } from "../types/booking.type"; // Import type vừa tạo
// Import type vừa tạo

interface BookingRequestBody {
    tourID: string;
    numAdults: number;
    numChildren: number;
    promotionCode?: string;
    // Thêm các trường này để khớp với payload thực tế từ BookingModal
    bookerName: string;
    bookerPhone: string;
    bookerEmail: string;
    otherAdults?: any[];
    children?: any[];
    note?: string;
}

interface BookingResponse {
    message: string;
    bookingID: string;
}

export const bookingApi = {
    createBooking: (body: BookingRequestBody) => {
        // Backend trả về object chứa message và bookingID
        return http.post<BookingResponse>("bookings", body);
    },

    // Thêm hàm này
    getBookingById: (id: string) => {
        return http.get<BookingDetail>(`bookings/${id}`);
    },
};
