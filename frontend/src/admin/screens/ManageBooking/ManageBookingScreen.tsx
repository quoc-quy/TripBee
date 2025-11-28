import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, Edit2 } from "lucide-react";
import type { BookingAdmin, BookingListAdmin, BookingListParams } from "../../types/bookingAdmin";
import { bookingAdminApi } from "../../apis/bookingAdminApi ";

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  SUCCESS: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
};

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  SUCCESS: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};


export default function ManageBookingScreen() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const queryParams: BookingListParams = {
        page: Number(searchParams.get("page") || 0),
        size: Number(searchParams.get("size") || 10),
        search: searchParams.get("search") || undefined,
        status: searchParams.get("status") || undefined
    };

    // === Fetch bookings ===
    const { data, isLoading } = useQuery<BookingListAdmin>({
        queryKey: ["admin-bookings", queryParams],
        queryFn: () => bookingAdminApi.getAllBookings(queryParams).then(res => res.data)
    });

    // === Fetch stats ===
    const { data: stats } = useQuery({
        queryKey: ["admin-bookings-stats"],
        queryFn: () => bookingAdminApi.getStats().then(res => res.data)
    });

    const handlePageChange = (page: number) => {
        setSearchParams({ ...queryParams, page } as any);
    };

    const handleDetail = (bookingID: string) => navigate(`/admin/bookings/${bookingID}`);
    const handleEdit = (bookingID: string) => navigate(`/admin/bookings/${bookingID}/edit`);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* --- Statistics --- */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Tổng booking</p>
                    <p className="text-xl font-bold">{stats?.total || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Đang xử lý</p>
                    <p className="text-xl font-bold">{stats?.processing || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Đã xác nhận</p>
                    <p className="text-xl font-bold">{stats?.confirmed || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Hoàn thành</p>
                    <p className="text-xl font-bold">{stats?.completed || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Đã hủy</p>
                    <p className="text-xl font-bold">{stats?.canceled || 0}</p>
                </div>
            </div>

            {/* --- Filter/Search --- */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã booking, khách, tour..."
                    defaultValue={queryParams.search || ""}
                    onKeyDown={e => {
                        if (e.key === "Enter") setSearchParams({ ...queryParams, search: e.currentTarget.value, page: 0 } as any);
                    }}
                    className="border p-2 rounded w-full sm:w-1/3"
                />
                <select
                    value={queryParams.status || ""}
                    onChange={e => setSearchParams({ ...queryParams, status: e.target.value || undefined, page: 0 } as any)}
                    className="border p-2 rounded min-w-[200px]"
                >
                    <option value="">Tất cả trạng thái</option>
                    {Object.keys(PAYMENT_LABELS).map(s => <option key={s} value={s}>{PAYMENT_LABELS[s]}</option>)}
                </select>
            </div>

            {/* --- Table --- */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
                        <tr>
                            <th className="px-5 py-3 font-bold text-black">Booking</th>
                            <th className="px-5 py-3 font-bold text-black">Khách hàng</th>
                            <th className="px-5 py-3 font-bold text-black">Tour</th>
                            <th className="px-5 py-3 font-bold text-black">Ngày khởi hành</th>
                            <th className="px-5 py-3 font-bold text-black">Final Cost</th>
                            <th className="px-5 py-3 font-bold text-black">Trạng thái booking</th>
                            <th className="px-5 py-3 font-bold text-black">Trạng thái thanh toán</th>
                            <th className="px-5 py-3 font-bold text-black">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {isLoading ? (
                            <tr><td colSpan={8} className="text-center py-8">Đang tải dữ liệu...</td></tr>
                        ) : (
                            data?.content?.map((b: BookingAdmin) => (
                                <tr key={b.bookingID} className="border-b hover:bg-gray-50 transition-all">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold">{b.bookingID}</p>
                                        <p className="text-gray-500 text-sm">{new Date(b.bookingDate).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p>{b.user.name}</p>
                                        <p className="text-gray-500 text-sm">Người đi: {b.numAdults + b.numChildren}</p>
                                    </td>
                                    <td className="px-5 py-4">{b.tour.title}</td>
                                    <td className="px-5 py-4">{b.tour.startDate}</td>
                                    <td className="px-5 py-4">{b.finalAmount?.toLocaleString()}đ</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full font-medium ${PAYMENT_COLORS[b.status]}`}>{PAYMENT_LABELS[b.status]}</span>
                                    </td>
                                    <td className="px-5 py-4">{b.paymentStatus}</td>
                                    <td className="px-5 py-4">
                                        <div className="inline-flex gap-2">
                                            <button onClick={() => handleDetail(b.bookingID)} className="border p-2 rounded text-gray-600 hover:bg-gray-50"><Eye size={16} /></button>
                                            <button onClick={() => handleEdit(b.bookingID)} className="border p-2 rounded text-blue-500 hover:bg-blue-50"><Edit2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Pagination --- */}
            {(data?.totalPages ?? 0) > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => handlePageChange(queryParams.page - 1)}
                        disabled={queryParams.page === 0}
                        className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                        ←
                    </button>
                    <span className="text-gray-700 font-medium">
                        Trang {queryParams.page + 1} / {data?.totalPages ?? 0}
                    </span>
                    <button
                        onClick={() => handlePageChange(queryParams.page + 1)}
                        disabled={queryParams.page + 1 >= (data?.totalPages ?? 0)}
                        className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                        →
                    </button>
                </div>
            )}

        </div>
    );
}
