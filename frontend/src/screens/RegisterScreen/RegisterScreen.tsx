import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { omit } from "lodash";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { schema, type Schema } from "../../utils/rules";
import Input from "../../components/Input";
import { registerAccount } from "../../apis/auth.api";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";

type FormData = Schema;
export default function RegisterScreen() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const registerMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) =>
      registerAccount(body),
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirm_password"]);
    registerMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success("Đăng ký tài khoản thành công!", { autoClose: 2000 });
        setIsAuthenticated(true);
        setProfile(data.data.user);
        navigate("/");
      },
    });
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
            <FaUserPlus className="text-4xl" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h2>
        <p className="text-gray-500 mb-8">
          Tạo tài khoản để trải nghiệm du lịch tuyệt vời với
        </p>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Input
                type="email"
                register={register}
                name="email"
                placeholder="Nhập email"
                className="w-full pr-4 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                errorMessage={errors.email?.message}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                type="password"
                register={register}
                name="password"
                placeholder="Nhập mật khẩu"
                className="w-full pr-4 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-left text-sm font-medium text-gray-700 mb-1"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                type="password"
                register={register}
                name="confirm_password"
                placeholder="Nhập mật khẩu"
                className="w-full pr-4 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-400 text-white py-3 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out font-semibold"
          >
            Đăng ký
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
