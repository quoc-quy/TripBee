import React from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

export default function ChangePassword() {
  return (
    <div className="rounded-sm px-2 md:px-7 md:pb-20 pb-10">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form className="mt-8 mr-auto max-w-4xl">
        <div className="mt-6 flex-row md:pr-12 md:mt-0">
          <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">
              Mật khẩu cũ
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                name="password"
                placeholder="Password..."
                type="password"
                className="relative"
                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm"
              />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">
              Mật khẩu mới
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                name="new_password"
                placeholder="New Password..."
                type="password"
                className="relative"
                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm"
              />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">
              Nhập lại mật khẩu mới
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                name="confirm_password"
                placeholder="Confirm Password..."
                type="password"
                className="relative"
                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                className="flex items-center h-9 bg-[#ee4d2d] px-5 text-center text-sm text-white hover:bg-[#ee4d2d]/80 rounded-sm"
                type="submit"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
