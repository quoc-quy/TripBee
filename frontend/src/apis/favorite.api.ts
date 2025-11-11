// frontend-demo/src/apis/favorite.api.ts
import http from "../utils/http";

// Định nghĩa kiểu dữ liệu body cho request
interface FavoriteRequestBody {
    tourId: string;
}

// Định nghĩa kiểu dữ liệu response (backend chỉ trả về 201 Created, không có body)
// Chúng ta có thể dùng kiểu 'unknown' hoặc 'void'
type FavoriteSuccessResponse = unknown;

export const favoriteApi = {
    /**
     * Gửi yêu cầu thêm một tour vào danh sách yêu thích
     * API: POST /api/favorites
     */
    addFavorite: (body: FavoriteRequestBody) => {
        return http.post<FavoriteSuccessResponse>("favorites", body);
    },

    // TODO: Thêm API getFavorites và removeFavorite khi backend sẵn sàng
};
