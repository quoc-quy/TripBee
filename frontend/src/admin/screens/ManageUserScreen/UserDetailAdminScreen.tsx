import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userAdminApi } from "../../apis/userAdmin.api";
import { ArrowLeft, Pencil } from "lucide-react";

export default function UserDetailAdminScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-detail", id],
    queryFn: () => userAdminApi.getUserDetail(id!),
    enabled: !!id,
  });

  const user = data?.data;

  const { data: statsData } = useQuery({
    queryKey: ["user-stats", id],
    queryFn: () => userAdminApi.getUserStats(id!),
    enabled: !!id,
  });

  const stats = statsData?.data;

  if (isLoading) return <div className="p-8">Đang tải dữ liệu...</div>;

  if (isError || !user)
    return (
      <div className="p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <p className="text-red-500 mt-3">Không tìm thấy người dùng</p>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-sm">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 relative">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Chi tiết người dùng
        </h1>

        {/* Nút chỉnh sửa */}
        <Link
          to={`/admin/users/${id}/edit`}
          className="absolute top-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Pencil size={16} /> Chỉnh sửa
        </Link>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p><strong>Tên:</strong> {user.name}</p>
            <p><strong>SĐT:</strong> {user.phoneNumber || "—"}</p>
            <p><strong>Vai trò:</strong> {user.role}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {user.locked ? (
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg">Đã khóa</span>
              ) : (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">Hoạt động</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Ngày tạo:</strong> {user.createdAt}</p>
            <p><strong>Ngày cập nhật:</strong> {user.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* Thống kê */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Thống kê người dùng
        </h2>

        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-gray-50 shadow-sm">
            <p className="font-medium text-gray-600">Tổng đơn</p>
            <p className="text-2xl font-bold">{stats?.totalBookings}</p>
          </div>

          <div className="p-4 rounded-lg bg-green-100 shadow-sm">
            <p className="font-medium text-green-700">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-800">
              {stats?.completedBookings}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-100 shadow-sm">
            <p className="font-medium text-red-700">Hủy</p>
            <p className="text-2xl font-bold text-red-800">
              {stats?.cancelledBookings}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-blue-100 shadow-sm">
            <p className="font-medium text-blue-700">Tổng chi tiêu</p>
            <p className="text-2xl font-bold text-blue-900">
              {(stats?.totalSpend || 0).toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
