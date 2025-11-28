// --- params để fetch ---
export interface BookingListParams {
  page: number;
  size: number;
  search?: string;
  status?: string;
}

// --- response từ API ---
export interface BookingAdmin {
  bookingID: string;
  bookingDate: string;
  numAdults: number;
  numChildren: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  user: {
    name: string;
  };
  tour: {
    title: string;
    startDate: string;
  };
}

export interface BookingListAdmin {
  content: BookingAdmin[];
  totalPages: number;
  totalElements: number;
  number: number; // trang hiện tại
}
