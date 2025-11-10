// src/admin/screens/PromotionScreen/ManagePromotionScreen.tsx

import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Edit2, Trash2, PlusCircle, Tag, Calendar, Clock } from "lucide-react";
import { omitBy, isUndefined } from "lodash";
import { promotionAdminApi } from "../../apis/promotionAdmin.api";
import type {
    PromotionAdmin,
    PromotionListAdminParams,
} from "../../types/promotionAdmin";
import { formatCurrency } from "../../../utils/utils";

// ==== Kiểu dữ liệu cho query param ====
type ParsedPromotionParams = {
    page: number;
    size: number;
    search?: string;
    status?: string;
    discountType?: string;
};

// ==== Map trạng thái sang tiếng Việt và màu sắc ====
const STATUS_LABELS: Record<string, string> = {
    ACTIVE: "Đang hoạt động",
    PENDING: "Sắp diễn ra",
    EXPIRED: "Đã hết hạn",
};

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    EXPIRED: "bg-red-100 text-red-700",
};

// ==== Map loại khuyến mãi sang tiếng Việt ====
const DISCOUNT_TYPE_LABELS: Record<string, string> = {
    PERCENTAGE: "Phần trăm",
    FIXED_AMOUNT: "Cố định",
};

// ==== Hàm parse URLSearchParams -> object ====
const parseSearchParams = (
    searchParams: URLSearchParams
): ParsedPromotionParams => {
    const params = {
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
        size: searchParams.get("size") ? Number(searchParams.get("size")) : 10,
        search: searchParams.get("search") || undefined,
        status: searchParams.get("status") || undefined,
        discountType: searchParams.get("discountType") || undefined,
    };
    return omitBy(params, isUndefined) as ParsedPromotionParams;
};

// ==== Helper format ngày (giả định) ====
const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (error) {
        return dateString;
    }
};

export default function ManagePromotionScreen() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParams = parseSearchParams(searchParams);

    // === Lấy danh sách khuyến mãi ===
    const { data, isLoading } = useQuery({
        queryKey: ["admin-promotions", queryParams],
        queryFn: () =>
            promotionAdminApi
                .getAllPromotions(queryParams as PromotionListAdminParams)
                .then((res) => res.data),
        placeholderData: keepPreviousData,
    });

    const promotions = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.number || 0;

    const handlePageChange = (page: number) => {
        const newParams = { ...queryParams, page };
        setSearchParams(newParams as any);
    };

    // Hàm xử lý khi thay đổi bộ lọc
    const handleFilterChange = (
        key: keyof ParsedPromotionParams,
        value: string | undefined
    ) => {
        const newParams = { ...queryParams, [key]: value, page: 0 };
        setSearchParams(omitBy(newParams, isUndefined) as any);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleFilterChange("search", e.currentTarget.value || undefined);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi</h1>
                    <p className="text-gray-500 mt-1">Danh sách mã khuyến mãi đang hoạt động</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2">
                    <PlusCircle size={20} /> Tạo mã mới
                </button>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã, mô tả..."
                    defaultValue={queryParams.search || ""}
                    onKeyDown={handleSearch}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <select
                    className="border border-gray-300 rounded-lg p-2 min-w-[150px]"
                    value={queryParams.discountType || ""}
                    onChange={(e) => handleFilterChange("discountType", e.target.value || undefined)}
                >
                    <option value="">Loại khuyến mãi</option>
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định</option>
                </select>

                <select
                    className="border border-gray-300 rounded-lg px-4 py-2 min-w-[150px]"
                    value={queryParams.status || ""}
                    onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="PENDING">Sắp diễn ra</option>
                    <option value="EXPIRED">Đã hết hạn</option>
                </select>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
                        <tr>
                            <th className="px-5 py-3 text-center font-bold text-black">ID</th>
                            <th className="px-5 py-3 font-bold text-black">Mã KM</th>
                            <th className="px-5 py-3 font-bold text-black">Loại/Giá trị</th>
                            <th className="px-5 py-3 font-bold text-black">Thời gian</th>
                            <th className="px-5 py-3 text-center font-bold text-black">SL Giới hạn</th>
                            <th className="px-5 py-3 text-center font-bold text-black">SL Đã dùng</th>
                            <th className="px-5 py-3 text-center font-bold text-black">Trạng thái</th>
                            <th className="px-5 py-3 text-center font-bold text-black">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    Đang tải dữ liệu khuyến mãi...
                                </td>
                            </tr>
                        ) : promotions.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    Không tìm thấy mã khuyến mãi nào.
                                </td>
                            </tr>
                        ) : (
                            promotions.map((promotion: PromotionAdmin) => {
                                const label = STATUS_LABELS[promotion.status] || promotion.status;
                                const color = STATUS_COLORS[promotion.status] || "bg-gray-100 text-gray-700";
                                
                                const discountValue = promotion.discountType === "PERCENTAGE" 
                                    ? `${promotion.discountPercentage}%`
                                    : promotion.discountAmount 
                                        ? formatCurrency(promotion.discountAmount) 
                                        : "N/A";
                                
                                const discountTypeLabel = DISCOUNT_TYPE_LABELS[promotion.discountType] || promotion.discountType;

                                return (
                                    <tr 
                                        key={promotion.promotionID} 
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        <td className="px-5 py-4 text-center text-sm">{promotion.promotionID}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900 text-sm">{promotion.title}</p>
                                            <p className="text-gray-500 text-sm line-clamp-1 max-w-xs">{promotion.description}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            <div className="flex items-center gap-1 font-semibold">
                                                <Tag size={16} className="text-blue-500"/>
                                                {discountTypeLabel} - {discountValue}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-700">
                                                <Calendar size={14} className="text-gray-500"/>
                                                {formatDate(promotion.startDate)}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-700">
                                                <Clock size={14} className="text-gray-500"/>
                                                {formatDate(promotion.endDate)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm font-semibold">
                                            {promotion.limitUsage === -1 ? "Vô hạn" : promotion.limitUsage.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm font-semibold">
                                            {promotion.currentUsage.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm">
                                            <span className={`px-3 py-1.5 rounded-full font-medium ${color}`}>
                                                {label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center text-sm">
                                            <div className="inline-flex gap-2">
                                                <button className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50" aria-label="Chỉnh sửa">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="border border-red-500 text-red-500 rounded-lg p-2 hover:bg-red-50" aria-label="Xóa">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                    >
                        ←
                    </button>

                    <span className="text-gray-700 font-medium">
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
}