// frontend-demo/src/screens/TourDetailScreen/TourDetailScreen.tsx

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tourApi } from "../../apis/tour";
import { MapPin, Calendar, Clock, Users, Sun, Moon } from "lucide-react";
import TourBookingSection from "../../components/TourBookingSection";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import type { TourDetails } from "../../types/tour";

// (MỚI) Định nghĩa base URL của backend
const BACKEND_URL = "http://localhost:8080";

export default function TourDetailScreen() {
    const { id } = useParams<{ id: string }>();

    const { data: tourDetailsData, isLoading } = useQuery({
        queryKey: ["tourDetails", id],
        queryFn: () => (id ? tourApi.getTourDetails(id) : Promise.reject("Missing ID")),
        enabled: !!id, // Chỉ chạy query khi có id
    });

    const tour: TourDetails | undefined = tourDetailsData?.data;

    if (isLoading) {
        return <div className="text-center py-20">Đang tải chi tiết tour...</div>;
    }

    if (!tour) {
        return <div className="text-center py-20">Không tìm thấy tour.</div>;
    }

    // Lấy tên các điểm đến
    const destinationNames = tour.destinations.map((dest) => dest.nameDes).join(", ");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Phần Header Tour */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded mr-3">
                        {tour.tourType.nameType}
                    </span>
                    <div className="flex items-center mr-4">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span>
                            {5} ({20} đánh giá)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{tour.destinations[0]?.nameDes}</span>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>

                <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>{`${tour.durationDays} ngày ${tour.durationNights} đêm`}</span>
                </div>
            </div>
            {/* Phần Hero Image */}
            <div className="h-96 bg-cover bg-center relative">
                <img
                    src={tour.imageURL}
                    alt=""
                    className="h-full w-full object-cover rounded-2xl"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                {" "}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <Calendar className="mx-auto mb-2 text-blue-600" />
                            <span className="font-semibold">Khởi hành</span>
                            <p className="text-sm text-gray-700">{tour.startDate}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <Clock className="mx-auto mb-2 text-green-600" />
                            <span className="font-semibold">Thời gian</span>
                            <p className="text-sm text-gray-700">
                                {tour.durationDays} ngày {tour.durationNights} đêm
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <Users className="mx-auto mb-2 text-yellow-600" />
                            <span className="font-semibold">Số chỗ</span>
                            <p className="text-sm text-gray-700">{tour.maxParticipants}</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <MapPin className="mx-auto mb-2 text-indigo-600" />
                            <span className="font-semibold">Nơi đi</span>
                            <p className="text-sm text-gray-700">{tour.departurePlace}</p>
                        </div>
                    </div>

                    {/* Mô tả chi tiết */}
                    <div className="bg-white p-8 rounded-lg mb-3">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mô tả Tour</h2>
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: tour.description }}
                        />
                    </div>

                    {/* Lịch trình */}
                    <div className="bg-white p-8 rounded-lg mb-8 shadow-2xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Hành trình chi tiết
                        </h2>
                        <div className="space-y-6 border-l-2 border-blue-500 pl-6">
                            {tour.itineraries
                                .sort((a, b) => a.dayNumber - b.dayNumber) // Sắp xếp lịch trình
                                .map((item) => (
                                    <div key={item.dayNumber} className="relative">
                                        <div className="absolute -left-7 h-4 w-4 bg-blue-500 rounded-full top-1" />
                                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                            Ngày {item.dayNumber}: {item.title}
                                        </h3>
                                        <p className="text-gray-700">{item.description}</p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Thư viện ảnh */}
                    <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thư viện ảnh</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {tour.tourImages.map((image, index) => (
                                <img
                                    key={index}
                                    // (CẬP NHẬT) Thêm BACKEND_URL
                                    src={`${BACKEND_URL}${image.url}`}
                                    alt={image.caption}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* Cột bên phải: Đặt Tour */}
                <div className="lg:col-span-1">
                    <TourBookingSection tour={tour} />
                </div>
            </div>
        </div>
    );
}
