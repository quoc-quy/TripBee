import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { tourApi } from "../../apis/tour";
import { FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";
import TourBookingSection from "../../components/TourBookingSection";
import type { TourDetails } from "../../types/tour";

// (TẠM THỜI) Import màn hình TourScreen để tránh lỗi, bạn có thể xóa nếu không cần
// import TourScreen from "../TourScreen"; 
// SỬA LỖI: Cần thêm interface TourDetails vào file `frontend/src/types/tour.ts`

// --- NỘI DUNG MÀN HÌNH CHI TIẾT TOUR ---
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
  
  // Lấy rating giả định (vì backend chưa cung cấp averageRating/reviewCount)
  const averageRating = 4.8; 
  const reviewCount = 234;

  return (
    <div className="bg-gray-100 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Phần Header Tour */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded mr-3">
              {tour.tourType.nameType}
            </span>
            <div className="flex items-center mr-4">
              <FaStar className="text-yellow-500 mr-1" />
              <span>{averageRating} ({reviewCount} đánh giá)</span>
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

        {/* Phần Nội dung Tour và Đặt Tour */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột chính: Chi tiết Tour */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ảnh cover */}
            <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-xl">
                <img src={tour.imageURL} alt={tour.title} className="w-full h-full object-cover" />
            </div>

            {/* Tổng quan */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tổng quan</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{tour.description}</p>
            </div>

            {/* Lịch trình */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch trình chi tiết</h2>
              <div className="space-y-6">
                {tour.itineraries.map((item) => (
                  <div key={item.dayNumber} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {`Ngày ${item.dayNumber}: ${item.title}`}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

             {/* Bao gồm / Không bao gồm */}
             <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bao gồm & Không bao gồm</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-green-600 mb-2">Bao gồm</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>Xe du lịch đời mới có điều hòa</li>
                            <li>Khách sạn 3-4 sao</li>
                            <li>Bữa ăn theo chương trình</li>
                            <li>Vé tham quan các điểm du lịch</li>
                            <li>Hướng dẫn viên nhiệt tình</li>
                            <li>Bảo hiểm du lịch</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Không bao gồm</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>Vé máy bay khứ hồi</li>
                            <li>Chi phí cá nhân</li>
                            <li>Đồ uống có cồn</li>
                            <li>Tips cho HDV và tài xế</li>
                            <li>Phụ thu phòng đơn</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>

          {/* Cột bên phải: Đặt Tour */}
          <div className="lg:col-span-1">
            <TourBookingSection
              tourID={tour.tourID}
              priceAdult={tour.priceAdult}
              priceChild={tour.priceChild}
              finalPrice={tour.finalPrice}
              discountPercentage={tour.discountPercentage}
              originalPrice={tour.priceAdult} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}