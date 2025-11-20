import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { schema, type Schema } from "../../utils/rules";
import { type Omit } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { loginAccount } from "../../apis/auth.api";
import Input from "../../components/Input";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import type { SimpleProfile } from "../../types/user.type";
import { isAxiosError } from "axios";

type FormData = Omit<Schema, "confirm_password">;
const loginSchema = schema.omit(["confirm_password"]);
export default function LoginScreen() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<Schema, "confirm_password">) => loginAccount(body),
  });

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        setIsAuthenticated(true);
        const authData = data.data;

        const simpleProfile: SimpleProfile = {
          userID: authData.userID,
          email: authData.email,
          role: authData.role,
        };

        setProfile(simpleProfile);
        navigate("/");
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          setError("email", {
            type: "manual",
            message: "Email hoặc mật khẩu không chính xác.",
          });
          setError("password", {
            type: "manual",
            message: "Email hoặc mật khẩu không chính xác.",
          });
        }
      },
    });
  });

  const isPending = loginAccountMutation.isPending;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <FaUser className="text-4xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
        <p className="text-gray-500 mb-8">Chào mừng bạn trở lại!</p>

        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          {(errors.email?.message || errors.password?.message) &&
            (errors.email?.type === "manual" ||
              errors.password?.type === "manual") && (
              <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded-md text-left">
                {errors.email?.message || errors.password?.message}
              </div>
            )}
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
                placeholder="Nhập password"
                className="w-full pr-4 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
