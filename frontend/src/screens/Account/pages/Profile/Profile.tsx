import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import type { UpdateProfileBody } from "../../../../apis/user.api";
import { schemaProfile, type SchemaProfile } from "../../../../utils/rules";
import { getProfile } from "../../../../apis/auth.api";
import userApi from "../../../../apis/user.api";

type FormData = SchemaProfile;

export default function Profile() {
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getProfile(),
  });

  console.log(userData?.data);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaProfile),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
      avatarUrl: "",
    },
  });

  if (userData && userData.data && !isLoading) {
    setValue("name", userData.data.name || "");
    setValue("phoneNumber", userData.data.phoneNumber || "");
    setValue("address", userData.data.address || "");
  }

  const updateProfileMutation = useMutation({
    mutationFn: (body: FormData) => userApi.updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Cập nhật hồ sơ thành công!");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error(
        error.message ||
          "Có lỗi xảy ra trong quá trình cập nhật. Vui lòng thử lại."
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    const payload: UpdateProfileBody = {
      name: data.name || undefined,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };
    updateProfileMutation.mutate(payload);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
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
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Thông tin cá nhân
      </h3>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-150`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Email (Không thể thay đổi)
            </label>
            <input
              type="email"
              id="email"
              defaultValue={userData?.data.email}
              disabled
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              id="phoneNumber"
              defaultValue={userData?.data.phoneNumber}
              {...register("phoneNumber")}
              className={`w-full border ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-150`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="md:col-span-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              defaultValue={userData?.data.address}
              {...register("address")}
              className={`w-full border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 outline-none transition duration-150`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 mt-6">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className={`flex items-center space-x-2 font-medium px-6 py-3 rounded-xl transition duration-300 ease-in-out ${
              updateProfileMutation.isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            }`}
          >
            {updateProfileMutation.isPending && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            <span>
              {updateProfileMutation.isPending
                ? "Đang cập nhật..."
                : "Cập nhật thông tin"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
