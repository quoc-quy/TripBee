// Dựa trên TourSummaryResponse từ backend
export interface Tour {
    tourID: string;
    title: string;
    imageURL: string;
    durationDays: number;
    durationNights: number;
    destinationName: string; // Đổi từ departurePlace
    priceAdult: number;
    finalPrice: number;
    discountPercentage: number;
    averageRating: number;
    reviewCount: number;
    tourTypeName: string;
}

// Dựa trên đối tượng Page<> của Spring
export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // Trang hiện tại
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// Đây là kiểu dữ liệu API /api/tours trả về
export type TourApiResponse = Page<Tour>;
