import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { FaShieldAlt, FaKey } from 'react-icons/fa'

// Ghi chú: Hãy thay đổi logic mutation API dưới đây cho phù hợp với API đổi mật khẩu thực tế của bạn
const passwordSchema = yup.object({
  oldPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

type PasswordFormData = yup.InferType<typeof passwordSchema>

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      // TODO: Thêm API call tại đây, ví dụ: await userApi.changePassword(data)
      console.log(data)
      toast.success('Đổi mật khẩu thành công!')
      reset()
    } catch (error) {
      toast.error('Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.')
    }
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <FaShieldAlt size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Bảo Mật Tài Khoản</h2>
        </div>
        <p className="text-gray-500 font-medium ml-13">
          Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn.
        </p>
      </div>

      <div className="bg-slate-50/70 p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Mật khẩu hiện tại
            </label>
            <input
              {...register('oldPassword')}
              type="password"
              className="w-full px-5 py-4 bg-white border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-sm"
              placeholder="••••••••"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200/60 my-6"></div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mật khẩu mới</label>
            <input
              {...register('newPassword')}
              type="password"
              className="w-full px-5 py-4 bg-white border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-sm"
              placeholder="••••••••"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-5 py-4 bg-white border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-sm"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FaKey />
              Cập Nhật Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
