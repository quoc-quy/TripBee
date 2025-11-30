import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";

import type { BookingAdmin } from "../../types/bookingAdmin";
import type { BookingStatus } from "@/types/booking.type";
import type { PaymentStatus } from "@/admin/types/paymentStatus";
import { bookingAdminApi } from "../../apis/bookingAdmin.api";

// helper
const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const statusLabelMap: Record<BookingStatus, string> = {
  PROCESSING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};

const statusBadgeClassMap: Record<BookingStatus, string> = {
  PROCESSING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  CONFIRMED: "bg-green-50 text-green-700 border border-green-200",
  COMPLETED: "bg-blue-50 text-blue-700 border border-blue-200",
  CANCELED: "bg-red-50 text-red-600 border border-red-200",
};

const paymentLabelMap: Record<PaymentStatus, string> = {
  PENDING: "Chờ thanh toán",
  SUCCESS: "Đã thanh toán",
  FAILED: "Thanh toán lỗi",
};

const paymentBadgeClassMap: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  SUCCESS: "bg-green-50 text-green-700 border border-green-200",
  FAILED: "bg-red-50 text-red-600 border border-red-200",
};

const CanceledBookingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const size = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-canceled-bookings", page, size],
    queryFn: async () => {
      const res = await bookingAdminApi.getCanceledBookings({ page, size });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const bookings: BookingAdmin[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number ?? 0;

  const handleBack = () => {
    navigate("/admin/manage-booking");
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleProcessOne = async (id: string) => {
    const ok = window.confirm(
      "Xác nhận xử lý (xóa / hoàn tất) booking đã hủy này?"
    );
    if (!ok) return;

    
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Xử lý đơn hủy tour
            </h1>
            <p className="text-sm text-gray-500">
              Danh sách các booking ở trạng thái <b>Chờ hủy</b>. Bạn có thể xử
              lý từng đơn một.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-xs uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-semibold text-black">Booking</th>
              <th className="px-5 py-3 font-semibold text-black">
                Khách hàng
              </th>
              <th className="px-5 py-3 font-semibold text-black">Tour</th>
              <th className="px-5 py-3 font-semibold text-black">
                Ngày khởi hành
              </th>
              <th className="px-5 py-3 font-semibold text-black">Giá</th>
              <th className="px-5 py-3 font-semibold text-black">
                Thanh toán
              </th>
              <th className="px-5 py-3 font-semibold text-black text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Không có booking nào ở trạng thái ĐÃ HỦY.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.bookingID}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {b.bookingID}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {b.customerName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {b.numGuests} khách
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top max-w-xs">
                    <span
                      className="block max-w-[220px] truncate text-sm font-medium text-gray-900"
                      title={b.tourName}
                    >
                      {b.tourName}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-top">
                    {b.departureDate
                      ? new Date(b.departureDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  <td className="px-5 py-4 align-top">
                    <span className="text-blue-600 font-semibold">
                      {formatCurrency(b.finalAmount)}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        paymentBadgeClassMap[b.paymentStatus]
                      }`}
                    >
                      {paymentLabelMap[b.paymentStatus]}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-top text-center">
                    <button
                      type="button"
                      onClick={() => handleProcessOne(b.bookingID)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500 text-red-500 text-xs font-medium hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Hủy
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>

          <span className="text-gray-700 font-medium text-sm">
            Trang {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default CanceledBookingsScreen;
