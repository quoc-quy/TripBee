// frontend-demo/src/components/TourCard/TourCard.tsx

import { Link } from "react-router-dom";
import type { Tour } from "../../types/tour";
import { formatCurrency } from "../../utils/utils";
import { FaMapMarkerAlt, FaStar, FaClock, FaHeart } from "react-icons/fa";
import Button from "../Button";

// (1) Sửa imports: Xóa useState, thêm useQueryClient
import React, { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/app.context";
import { favoriteApi } from "../../apis/favorite.api";
import type { AxiosError } from "axios";

export default function TourCard({ tour }: { tour: Tour }) {
    // (2) Lấy đầy đủ context
    const { isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId } =
        useContext(AppContext);

    // (3) Sửa lỗi: 'isLiked' KHÔNG PHẢI LÀ STATE
    // Nó là một giá trị được suy ra (derived) trực tiếp từ context
    const isLiked = favoriteIds.has(tour.tourID);

    // (4) Lấy queryClient (dùng để vô hiệu hóa query "my-favorites")
    const queryClient = useQueryClient();

    // (5) Mutations (giữ nguyên)
    const addFavoriteMutation = useMutation({
        mutationFn: favoriteApi.addFavorite,
    });
    const removeFavoriteMutation = useMutation({
        mutationFn: favoriteApi.removeFavorite,
    });

    // (6) CẬP NHẬT LOGIC CLICK
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info("Bạn cần đăng nhập để thực hiện chức năng này");
            return;
        }

        // Logic Toggle (bật/tắt)
        if (isLiked) {
            // --- Nếu ĐANG LIKED -> BỎ LIKE ---
            removeFavoriteMutation.mutate(tour.tourID, {
                onSuccess: () => {
                    // Cập nhật AppContext ngay lập tức
                    removeFavoriteId(tour.tourID);
                    toast.success("Đã xóa khỏi danh sách yêu thích!");
                    // (Tùy chọn) Báo cho các trang khác (như /account/favouriteTour) biết
                    queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
                },
                onError: () => {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại.");
                },
            });
        } else {
            // --- Nếu CHƯA LIKED -> THÊM LIKE ---
            addFavoriteMutation.mutate(
                { tourId: tour.tourID },
                {
                    onSuccess: () => {
                        // Cập nhật AppContext ngay lập tức
                        addFavoriteId(tour.tourID);
                        toast.success("Đã thêm tour vào danh sách yêu thích!");
                        queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
                    },
                    onError: (error: AxiosError | Error) => {
                        const axiosError = error as AxiosError<{ message: string }>;
                        // Nếu lỗi 409 (nghĩa là CSDL có nhưng context chưa kịp load)
                        if (axiosError.response?.status === 409) {
                            addFavoriteId(tour.tourID); // Đồng bộ lại context
                            toast.info("Bạn đã yêu thích tour này rồi.");
                        } else {
                            toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
                        }
                    },
                }
            );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative">
                <Link to={`/tours/${tour.tourID}`} className="block h-64">
                    {/* ... img ... */}
                    <img
                        src={tour.imageURL}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* (7) CẬP NHẬT NÚT BẤM (logic className giờ đã đúng) */}
                <button
                    onClick={handleFavoriteClick}
                    disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                    className={`absolute top-4 right-4 z-10 p-2.5 bg-white/90 rounded-full transition duration-300
                        ${
                            isLiked
                                ? "text-red-500" // Đã thích (lấy từ context)
                                : "text-gray-400 hover:text-red-500" // Chưa thích
                        }
                        ${
                            addFavoriteMutation.isPending || removeFavoriteMutation.isPending
                                ? "cursor-not-allowed opacity-50" // Đang xử lý
                                : ""
                        }
                    `}
                    aria-label="Yêu thích"
                >
                    <FaHeart size={18} />
                </button>

                {/* ... (Phần còn lại của TourCard giữ nguyên) ... */}
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
                {/* ... (Phần còn lại của p-5 giữ nguyên) ... */}
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
