import React from "react";
import type { useForm } from "react-hook-form";
import type { BookingFormData } from "../../types/booking.type";

export default function DashboardScreen() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Bảng điều khiển</h1>
            <p className="text-gray-600">
                Đây là khu vực tổng quan thống kê hệ thống, doanh thu, và các hoạt động gần đây.
            </p>
        </div>
    );
}
// --- Component Input Tùy Chỉnh (để dùng nội bộ) ---
// (Dùng Input và Select chuẩn sẽ dễ hơn)
export type FormInputProps = {
    label: string;
    id: string;
    register: ReturnType<(typeof useForm<BookingFormData>)["register"]>;
    error?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
};
