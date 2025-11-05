import { Link } from "react-router-dom";
import type { Tour } from "../../types/tour";
import { formatCurrency } from "../../utils/utils";
// (MỚI) Thêm FaClock và FaHeart
import { FaMapMarkerAlt, FaStar, FaClock, FaHeart } from "react-icons/fa";
import Button from "../Button";

export default function TourCard({ tour }: { tour: Tour }) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative">
                {/* Ảnh chính */}
                <Link to={`/tours/${tour.tourID}`} className="block h-64">
                    <img
                        src={tour.imageURL}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>

                {/* (MỚI) Nút Yêu thích (Trái tim) */}
                <button
                    className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 rounded-full text-gray-400 hover:text-red-500 transition duration-300"
                    aria-label="Yêu thích"
                >
                    <FaHeart size={18} />
                </button>

                {/* (SỬA) Loại tour - nền xanh chữ trắng */}
                <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {tour.tourTypeName?.toLowerCase().replace("tour ", "")}
                </div>

                {/* (SỬA) Cập nhật vị trí Giảm giá (dưới Loại tour) */}
                {tour.discountPercentage > 0 && (
                    <div className="absolute bottom-5 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Giảm {tour.discountPercentage}%
                    </div>
                )}
            </div>

            {/* --- Nội dung Card --- */}
            <div className="p-5">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    {/* (SỬA) Sao màu vàng */}
                    <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        <span className="font-medium">{tour.averageRating}</span>
                        <span className="text-gray-500">({tour.reviewCount} đánh giá)</span>
                    </div>

                    {/* (SỬA) Thêm icon đồng hồ */}
                    <div className="flex items-center gap-1.5">
                        <FaClock className="text-gray-400" />
                        <span>{`${tour.durationDays} ngày ${tour.durationNights} đêm`}</span>
                    </div>
                </div>

                {/* Tiêu đề */}
                <h3 className="text-xl font-bold text-secondary-dark mb-2 h-14 line-clamp-2">
                    <Link to={`/tours/${tour.tourID}`} className="hover:text-blue-600 transition">
                        {tour.title}
                    </Link>
                </h3>

                {/* Địa điểm */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {tour.destinationName}
                </div>

                {/* Giá tiền */}
                <div className="flex items-baseline justify-end gap-2">
                    {tour.finalPrice < tour.priceAdult && (
                        <span className="text-gray-500 line-through text-md">
                            {formatCurrency(tour.priceAdult)}
                        </span>
                    )}
                    <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(tour.finalPrice)}
                    </span>
                </div>

                {/* Nút bấm */}
                <div className="flex gap-3 mt-5">
                    <Button
                        as="link"
                        to={`/tours/${tour.tourID}`}
                        variant="outline"
                        className="flex-1"
                    >
                        Xem chi tiết
                    </Button>
                    <Button as="button" variant="solid" className="flex-1">
                        Đặt ngay
                    </Button>
                </div>
            </div>
        </div>
    );
}
