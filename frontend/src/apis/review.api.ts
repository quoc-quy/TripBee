// frontend-demo/src/apis/review.api.ts
import http from "../utils/http";
import type { ReviewApiResponse } from "../types/review.type";

export const reviewApi = {
    /**
     * Lấy danh sách review đã được duyệt cho 1 tour, có phân trang
     * API: GET /api/tours/{tourId}/reviews
     */
    getReviewsForTour: (
        tourId: string,
        params: {
            page: number;
            size: number;
        }
    ) => {
        return http.get<ReviewApiResponse>(`tours/${tourId}/reviews`, {
            params,
        });
    },
};
