import { useState, useContext } from "react";
import { FaHeart, FaCheckCircle, FaHeadset } from "react-icons/fa";
import Button from "../Button";
import { formatCurrency } from "../../utils/utils";
import { AppContext } from "../../contexts/app.context";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "../../apis/booking.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface Props {
  tourID: string;
  priceAdult: number;
  priceChild: number;
  finalPrice: number;
  discountPercentage: number;
  originalPrice: number | null;
}

// (MỚI) Component đặt tour (Phần bên phải màn hình chi tiết tour)
export default function TourBookingSection({
  tourID,
  priceAdult,
  priceChild,
  finalPrice,
  discountPercentage,
  originalPrice,
}: Props) {
  const { isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);

  const totalPrice = numAdults * priceAdult + numChildren * priceChild;
  const finalAmount = totalPrice; // Giữ đơn giản, không áp dụng khuyến mãi ở đây

  const createBookingMutation = useMutation({
    mutationFn: bookingApi.createBooking,
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.warn("Bạn cần đăng nhập để đặt tour.", { autoClose: 2000 });
      navigate("/login");
      return;
    }

    if (numAdults + numChildren === 0) {
      toast.error("Vui lòng chọn số lượng người tham gia.");
      return;
    }

    // Gọi API đặt tour
    createBookingMutation.mutate(
      {
        tourID,
        numAdults,
        numChildren,
        promotionCode: "", // Có thể bổ sung trường nhập code
      },
      {
        onSuccess: () => {
          toast.success("Yêu cầu đặt tour thành công! Chúng tôi sẽ liên hệ lại.", {
            autoClose: 3000,
          });
          // Có thể chuyển hướng đến trang lịch sử đặt tour
          // navigate("/me");
        },
        onError: (error) => {
          // Xử lý lỗi API
          console.error("Booking failed:", error);
          toast.error("Đặt tour thất bại. Vui lòng thử lại sau.", { autoClose: 3000 });
        },
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Giá Tour</h3>
      <div className="flex justify-end items-baseline mb-4">
        {discountPercentage > 0 && originalPrice && (
          <span className="text-lg text-gray-500 line-through mr-2">
            {formatCurrency(originalPrice)}
          </span>
        )}
        <span className="text-3xl font-bold text-red-600">
          {formatCurrency(finalPrice)}
        </span>
        <span className="text-sm text-gray-500"> / người lớn</span>
      </div>

      {/* Số lượng người */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số khách
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-md p-1 flex-1">
            <label className="text-xs mr-2">Người lớn:</label>
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition"
              onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="w-10 text-center border-none focus:ring-0 p-0"
              value={numAdults}
              onChange={(e) => setNumAdults(Number(e.target.value))}
              min="1"
            />
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition"
              onClick={() => setNumAdults(numAdults + 1)}
            >
              +
            </button>
          </div>

          <div className="flex items-center border border-gray-300 rounded-md p-1 flex-1">
            <label className="text-xs mr-2">Trẻ em:</label>
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition"
              onClick={() => setNumChildren(Math.max(0, numChildren - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="w-10 text-center border-none focus:ring-0 p-0"
              value={numChildren}
              onChange={(e) => setNumChildren(Number(e.target.value))}
              min="0"
            />
            <button
              type="button"
              className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition"
              onClick={() => setNumChildren(numChildren + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Tổng cộng */}
      <div className="flex justify-between items-center text-xl font-bold text-gray-800 border-t pt-4 mt-4">
        <span>Tổng cộng:</span>
        <span className="text-red-600">
          {formatCurrency(finalAmount)}
        </span>
      </div>

      {/* Nút đặt tour */}
      <Button
        type="button"
        variant="solid"
        className="w-full mt-4 py-3"
        onClick={handleBooking}
        disabled={createBookingMutation.isPending}
      >
        {createBookingMutation.isPending ? "Đang xử lý..." : "ĐẶT TOUR NGAY"}
      </Button>

      {/* Nút yêu thích */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-2 py-3 border-gray-400 text-gray-600 hover:bg-gray-100"
      >
        <FaHeart className="mr-2" /> Yêu thích
      </Button>

      {/* Lợi ích */}
      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <p className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Hoàn tiền 100% nếu hủy trước 7 ngày
        </p>
        <p className="flex items-center">
          <FaHeadset className="text-blue-500 mr-2 flex-shrink-0" /> Hỗ trợ 24/7
        </p>
        <p className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Đảm bảo chất lượng dịch vụ
        </p>
      </div>
    </div>
  );
}