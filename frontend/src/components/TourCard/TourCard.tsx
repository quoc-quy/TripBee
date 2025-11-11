// frontend-demo/src/components/TourCard/TourCard.tsx

import { Link } from "react-router-dom";
import type { Tour } from "../../types/tour";
import { formatCurrency } from "../../utils/utils";
import { FaMapMarkerAlt, FaStar, FaClock, FaHeart } from "react-icons/fa";
import Button from "../Button";

// (THÊM) Import các hooks và dependencies cần thiết
import React, { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/app.context";
import { favoriteApi } from "../../apis/favorite.api";
import type { AxiosError } from "axios";

export default function TourCard({ tour }: { tour: Tour }) {
    // (THÊM) Lấy trạng thái đăng nhập
    const { isAuthenticated } = useContext(AppContext);

    // (THÊM) State để quản lý trạng thái "đã thích" của card này
    // Giả định ban đầu là chưa thích.
    // Lưu ý: State này chỉ tồn tại trong phiên render,
    // nó sẽ reset nếu tải lại trang.
    const [isLiked, setIsLiked] = useState(false);

    // (THÊM) Khởi tạo mutation để gọi API
    const addFavoriteMutation = useMutation({
        mutationFn: favoriteApi.addFavorite,
    });

    // (THÊM) Hàm xử lý khi nhấn nút trái tim
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Ngăn thẻ <Link> của card bị kích hoạt
        e.preventDefault();
        e.stopPropagation();

        // 1. Nếu chưa đăng nhập, không làm gì cả
        if (!isAuthenticated) {
            // (Bạn có thể thêm toast thông báo "Vui lòng đăng nhập" ở đây nếu muốn)
            // toast.info("Bạn cần đăng nhập để thực hiện chức năng này");
            return;
        }

        // 2. Nếu đã đăng nhập, gọi API
        addFavoriteMutation.mutate(
            { tourId: tour.tourID },
            {
                onSuccess: () => {
                    // 3. Nếu thành công, đổi màu trái tim và thông báo
                    setIsLiked(true);
                    toast.success("Đã thêm tour vào danh sách yêu thích!");
                },
                onError: (error: AxiosError | Error) => {
                    // 4. Nếu lỗi
                    const axiosError = error as AxiosError<{ message: string }>;
                    if (axiosError.response?.status === 409) {
                        // Lỗi 409 (Conflict) nghĩa là đã thích tour này rồi
                        setIsLiked(true); // Cập nhật lại state cho đúng
                        toast.info("Bạn đã yêu thích tour này rồi.");
                    } else {
                        // Lỗi chung
                        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
                    }
                },
            }
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative">
                <Link to={`/tours/${tour.tourID}`} className="block h-64">
                    <img
                        src={tour.imageURL}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* (CẬP NHẬT) Nút Yêu thích (Trái tim) */}
                <button
                    onClick={handleFavoriteClick}
                    disabled={addFavoriteMutation.isPending} // Vô hiệu hóa khi đang gọi API
                    className={`absolute top-4 right-4 z-10 p-2.5 bg-white/90 rounded-full transition duration-300
                        ${
                            isLiked
                                ? "text-red-500" // Trái tim màu đỏ nếu đã thích
                                : "text-gray-400 hover:text-red-500" // Mặc định
                        }
                        ${addFavoriteMutation.isPending ? "cursor-not-allowed" : ""}
                    `}
                    aria-label="Yêu thích"
                >
                    <FaHeart size={18} />
                </button>

                <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {tour.tourTypeName?.toLowerCase().replace("tour ", "")}
                </div>

                {tour.discountPercentage > 0 && (
                    <div className="absolute bottom-5 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Giảm {tour.discountPercentage}%
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        <span className="font-medium">{tour.averageRating}</span>
                        <span className="text-gray-500">({tour.reviewCount} đánh giá)</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <FaClock className="text-gray-400" />
                        <span>{`${tour.durationDays} ngày ${tour.durationNights} đêm`}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-secondary-dark mb-2 h-14 line-clamp-2">
                    <Link to={`/tours/${tour.tourID}`} className="hover:text-blue-600 transition">
                        {tour.title}
                    </Link>
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {tour.destinationName}
                </div>

                <div className="flex items-baseline justify-end gap-2">
                    {tour.finalPrice < (tour.priceAdult || 0) && (
                        <span className="text-gray-500 line-through text-md">
                            {formatCurrency(tour.priceAdult)}
                        </span>
                    )}
                    <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(tour.finalPrice)}
                    </span>
                </div>

                <div className="flex gap-3 mt-5">
                    <Button
                        as="link"
                        to={`/tours/${tour.tourID}`}
                        variant="outline"
                        className="flex-1"
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        as="link"
                        to={`/tours/${tour.tourID}`}
                        variant="solid"
                        className="flex-1"
                    >
                        Đặt ngay
                    </Button>
                </div>
            </div>
        </div>
    );
}
