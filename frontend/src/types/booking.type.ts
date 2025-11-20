// frontend-demo/src/types/booking.type.ts

// Thông tin của một người tham gia (người lớn hoặc trẻ em)
export interface Participant {
  name: string;
  gender: "Nam" | "Nữ" | "Khác" | ""; // "" là giá trị mặc định
  phone?: string; // Bắt buộc cho người lớn, tùy chọn cho trẻ em
  cccd?: string; // Bắt buộc cho người lớn, tùy chọn cho trẻ em
}

type BookingStatus = "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELED";

// Toàn bộ dữ liệu form đặt tour
export interface BookingFormData {
  // Thông tin người đặt
  bookerName: string;
  bookerPhone: string;
  bookerEmail: string;
  note?: string;

  // Danh sách người tham gia
  otherAdults: Participant[];
  children: Participant[];
}

// [MỚI] Interface chi tiết Booking trả về từ API (dùng cho trang Payment)
export interface BookingDetail {
  bookingID: string;
  tourName: string;
  finalAmount: number;
  status: "PROCESSING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  bookingDate: string;
  numAdults: number;
  numChildren: number;
  customerName: string;
  customerPhone: string;
}

export interface BookingHistoryResponse {
  bookingID: string;
  tourID: string;
  tourTitle: string;
  tourImageURL: string;
  bookingDate: string;
  finalAmount: number;
  status: BookingStatus;
  numAdults: number;
  numChildren: number;
}
