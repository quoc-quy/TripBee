// frontend-demo/src/types/tour.ts

export interface Tour {
    tourID: string;
    title: string;
    imageURL: string;
    startDate: string;
    durationDays: number;
    durationNights: number;
    departurePlace: string;
    priceAdult: number;
    priceChild: number;
    finalPrice: number;
    tourTypeName: string;
    destinationName: string;
    originalPrice: number | null;
    discountPercentage: number | null;
    averageRating: number;
    reviewCount: number;
}

export interface TourList {
    content: Tour[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export type TourApiResponse = TourList;

/**
 * Đây là kiểu dữ liệu cho query params khi gọi API lấy danh sách tour
 * Dùng cho cả bộ lọc (filter) và phân trang (pagination).
 */
export interface TourListParams {
    page?: number | string;
    size?: number | string;
    sort?: string;
    search?: string;
    // (CẬP NHẬT) Đổi tên trường sang snake_case
    destination_id?: string;
    tour_type_id?: string;
}
