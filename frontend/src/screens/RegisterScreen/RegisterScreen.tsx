import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { FaUserPlus, FaCheckCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { schema, type Schema } from '../../utils/rules'
import Input from '../../components/Input'
import { registerAccount } from '../../apis/auth.api'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import type { SimpleProfile } from '../../types/user.type'

type FormData = Schema

export default function RegisterScreen() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body as any)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password']) as Omit<FormData, 'confirm_password'>
    registerMutation.mutate(body as any, {
      onSuccess: (data) => {
        toast.success('Đăng ký tài khoản thành công!', { autoClose: 2000 })
        setIsAuthenticated(true)
        const authData = data.data
        const simpleProfile: SimpleProfile = {
          userID: authData.userID,
          email: authData.email,
          role: authData.role
        }

        setProfile(simpleProfile)
        navigate('/')
      },
      onError: () => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại.')
      }
    })
  })

  const isPending = registerMutation.isPending

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
        style={{ backgroundImage: 'url(/hero.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-black/70 to-blue-900/80 backdrop-blur-[2px]" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-md w-full border border-white/50 transform transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <FaUserPlus className="text-3xl ml-2" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tạo Tài Khoản</h2>
          <p className="text-gray-500 font-medium leading-snug">
            Tham gia cộng đồng TripBee để trải nghiệm những chuyến đi tuyệt vời.
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1"
            >
              Email
            </label>
            <div className="relative">
              <Input
                type="email"
                register={register}
                name="email"
                placeholder="nhap.email@example.com"
                className="w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all font-medium text-gray-800"
                errorMessage={errors.email?.message}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                type="password"
                register={register}
                name="password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all font-medium text-gray-800 tracking-wider"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                type="password"
                register={register}
                name="confirm_password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all font-medium text-gray-800 tracking-wider"
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] ${
              isPending
                ? 'bg-teal-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)]'
            }`}
          >
            {isPending ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
            {!isPending && <FaCheckCircle />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-80 transition-opacity"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
