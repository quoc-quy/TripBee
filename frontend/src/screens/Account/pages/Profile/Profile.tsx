import React from "react";
import { getProfile } from "../../../../apis/auth.api";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: userData } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getProfile();
    },
  });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Thông tin cá nhân</h3>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên</label>
            <input
              type="text"
              defaultValue={userData?.data.name}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue={userData?.data.email}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              defaultValue={userData?.data.phoneNumber}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giới tính</label>
            <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none">
              <option disabled>Giới tính</option>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Địa chỉ</label>
            <input
              type="text"
              defaultValue={userData?.data.address}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg"
          >
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  );
}
