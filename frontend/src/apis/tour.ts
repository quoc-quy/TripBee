import http from "../utils/http";
import type { TourApiResponse } from "../types/tour";

export const tourApi = {
    getFeaturedTours: () => {
        // Lấy 6 tour đầu tiên, sắp xếp theo ranking (như trong TourService)
        return http.get<TourApiResponse>("tours", {
            params: {
                size: 6,
                sort: "ranking,asc",
            },
        });
    },
};
