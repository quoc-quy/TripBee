import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { schema, type Schema } from "../../utils/rules";
import { type Omit } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { loginAccount } from "../../apis/auth.api";
import Input from "../../components/Input";

type FormData = Omit<Schema, "confirm_password">;
const loginSchema = schema.omit(["confirm_password"]);
export default function LoginScreen() {
  const {
    register,
    watch,
    handleSubmit,
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
      },
    });
  });
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Đăng nhập
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
