import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../../../../apis/booking.api";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { formatCurrency } from "../../../../utils/utils";

const StatusBadge = ({ status }: { status: string }) => {
  let classes = "";
  let text = "";

  switch (status) {
    case "COMPLETED":
      classes = "bg-green-100 text-green-700";
      text = "Hoàn thành";
      break;
    case "CONFIRMED":
      classes = "bg-blue-100 text-blue-700";
      text = "Đã xác nhận";
      break;
    case "PROCESSING":
      classes = "bg-yellow-100 text-yellow-700";
      text = "Đang xử lý";
      break;
    case "CANCELED":
      classes = "bg-red-100 text-red-700";
      text = "Đã hủy";
      break;
    default:
      classes = "bg-gray-100 text-gray-500";
      text = "Không rõ";
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {text}
    </span>
  );
};

export default function HistoryTour() {
  const {
    data: historyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookingHistory"],
    queryFn: bookingApi.getBookingHistory,
  });

  const bookings = historyData?.data || [];

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
        <span className="text-gray-600">Đang tải lịch sử đặt tour...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-8 border border-red-200 bg-red-50 rounded-lg shadow-md">
        Lỗi khi tải lịch sử đặt tour.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Lịch sử đặt Tour ({bookings.length})
      </h3>

      {bookings.length === 0 ? (
        <div className="text-center p-8 text-gray-500 border border-gray-200 bg-gray-50 rounded-lg">
          <FaCalendarAlt size={32} className="mx-auto mb-4 text-gray-400" />
          <p className="font-semibold">Bạn chưa có lịch sử đặt tour nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingID}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md md:flex"
            >
              <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                <img
                  src={booking.tourImageURL}
                  alt={booking.tourTitle}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/400x300/E5E7EB/6B7280?text=Tour";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 md:p-6 md:w-3/4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {booking.tourTitle}
                  </h4>

                  <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>Ngày đặt: {booking.bookingDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaUsers className="text-green-500" />
                      <span>
                        Khách: {booking.numAdults} Lớn, {booking.numChildren} Bé
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t pt-3 mt-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">
                      Tổng tiền:
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatCurrency(booking.finalAmount)}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      ID: {booking.bookingID}
                    </span>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
