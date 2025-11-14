import { Link } from "react-router-dom";
import type { Tour } from "../../types/tour";
import { formatCurrency } from "../../utils/utils";
import { FaMapMarkerAlt, FaStar, FaClock, FaHeart } from "react-icons/fa";
import Button from "../Button";

import React, { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/app.context";
import { favoriteApi } from "../../apis/favorite.api";
import type { AxiosError } from "axios";

// Thêm prop isFavoritePage vào signature
export default function TourCard({
  tour,
  isFavoritePage = false,
}: {
  tour: Tour;
  isFavoritePage?: boolean;
}) {
  // Lấy đầy đủ context
  const { isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId } =
    useContext(AppContext);

  const isLiked = favoriteIds.has(tour.tourID);
  const queryClient = useQueryClient();

  const addFavoriteMutation = useMutation({
    mutationFn: favoriteApi.addFavorite,
  });
  const removeFavoriteMutation = useMutation({
    mutationFn: favoriteApi.removeFavorite,
  });

  // --- FIX NaN VÀ KIỂM TRA GIÁ TRỊ ---
  const finalPrice = tour.finalPrice || 0;
  const priceAdult = tour.priceAdult || 0;
  const hasDiscount = finalPrice < priceAdult;
  const averageRating = tour.averageRating || 0; // Fix NaN
  const reviewCount = tour.reviewCount || 0;
  const durationDays = tour.durationDays || 0;
  const durationNights = tour.durationNights || 0;
  // --- KẾT THÚC FIX NaN ---

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Bạn cần đăng nhập để thực hiện chức năng này");
      return;
    }

    if (isLiked) {
      // --- BỎ LIKE ---
      removeFavoriteMutation.mutate(tour.tourID, {
        onSuccess: () => {
          removeFavoriteId(tour.tourID);
          toast.success("Đã xóa khỏi danh sách yêu thích!");
          // Invalidate để cập nhật trang FavouriteTour
          queryClient.invalidateQueries({ queryKey: ["favoriteIds"] });
        },
        onError: () => {
          toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        },
      });
    } else {
      // --- THÊM LIKE ---
      addFavoriteMutation.mutate(
        { tourId: tour.tourID },
        {
          onSuccess: () => {
            addFavoriteId(tour.tourID);
            toast.success("Đã thêm tour vào danh sách yêu thích!");
            queryClient.invalidateQueries({ queryKey: ["favoriteIds"] });
          },
          onError: (error: AxiosError | Error) => {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response?.status === 409) {
              addFavoriteId(tour.tourID);
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
          <img
            src={tour.imageURL}
            alt={tour.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/400x256/E5E7EB/6B7280?text=Tour";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* ẨN NÚT TRÁI TIM NẾU LÀ TRANG YÊU THÍCH */}
        {!isFavoritePage && (
          <button
            onClick={handleFavoriteClick}
            disabled={
              addFavoriteMutation.isPending || removeFavoriteMutation.isPending
            }
            className={`absolute top-4 right-4 z-10 p-2.5 bg-white/90 rounded-full transition duration-300
                            ${
                              isLiked
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }
                            ${
                              addFavoriteMutation.isPending ||
                              removeFavoriteMutation.isPending
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }
                        `}
            aria-label="Yêu thích"
          >
            <FaHeart size={18} />
          </button>
        )}

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
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({reviewCount} đánh giá)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaClock className="text-gray-400" />
            <span>{`${durationDays} ngày ${durationNights} đêm`}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-secondary-dark mb-2 h-14 line-clamp-2">
          <Link
            to={`/tours/${tour.tourID}`}
            className="hover:text-blue-600 transition"
          >
            {tour.title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          {tour.destinationName}
        </div>
        <div className="flex items-baseline justify-end gap-2">
          {hasDiscount && (
            <span className="text-gray-500 line-through text-md">
              {formatCurrency(priceAdult)}
            </span>
          )}
          <span className="text-2xl font-bold text-red-600">
            {formatCurrency(finalPrice)}
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
