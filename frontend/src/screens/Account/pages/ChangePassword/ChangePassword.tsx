import React from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import {
  schemaChangePassword,
  type SchemaChangePassword,
} from "../../../../utils/rules";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordBody } from "../../../../apis/user.api";
import userApi from "../../../../apis/user.api";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

type FormData = SchemaChangePassword;
export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schemaChangePassword),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body: ChangePasswordBody) => userApi.changePassword(body),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;

        if (errorMessage.includes("Mật khẩu cũ không chính xác")) {
          setError("oldPassword", {
            type: "manual",
            message: errorMessage,
          });
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Đã xảy ra lỗi hệ thống.");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    const payload: ChangePasswordBody = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    changePasswordMutation.mutate(payload);
  });

  return (
    <div className="rounded-sm px-2 md:px-7 md:pb-20 pb-10">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-2xl font-bold capitalize text-gray-900">
          Đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>

      {/* Liên kết form với onSubmit */}
      <form className="mt-8 mr-auto max-w-4xl" onSubmit={onSubmit} noValidate>
        <div className="mt-6 flex-row md:pr-12 md:mt-0">
          {/* Mật khẩu cũ (oldPassword) */}
          <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">
              Mật khẩu cũ
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                name="oldPassword"
                placeholder="Mật khẩu cũ..."
                type="password"
                className="relative"
                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm"
                register={register}
                errorMessage={errors.oldPassword?.message}
              />
            </div>
          </div>

          {/* Mật khẩu mới (newPassword) */}
          <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">
              Mật khẩu mới
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                name="newPassword"
                placeholder="Mật khẩu mới..."
                type="password"
                className="relative"
                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm"
                register={register}
                errorMessage={errors.newPassword?.message}
              />
            </div>
          </div>

          {/* Nhập lại mật khẩu mới (confirmNewPassword) */}
          <div className="mt-2 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize">
              Nhập lại mật khẩu mới
            </div>
            <div className="sm:w-[80%] sm:pl-5">
              <Input
                name="confirmNewPassword"
                placeholder="Xác nhận mật khẩu mới..."
                type="password"
                className="relative"
                classNameInput="px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm"
                register={register}
                errorMessage={errors.confirmNewPassword?.message}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap flex-col sm:flex-row">
            <div className="sm:w-[20%] truncate pt-3 sm:text-right capitalize" />
            <div className="sm:w-[80%] sm:pl-5">
              <Button
                className="flex items-center h-9 bg-blue-600 px-5 text-center text-sm text-white hover:bg-blue-700/90 rounded-sm"
                type="submit"
                disabled={changePasswordMutation.isPending || isSubmitting}
              >
                {(changePasswordMutation.isPending || isSubmitting) && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
