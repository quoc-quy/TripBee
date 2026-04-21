// frontend-demo/src/components/TourBookingSection/TourBookingSection.tsx

import { useEffect, useState, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Calendar, Heart, Tag } from 'lucide-react'
import type { TourDetails } from '../../types/tour'
import { formatCurrency } from '../../utils/utils'
import BookingModal from '../BookingModal'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'
import { favoriteApi } from '../../apis/favorite.api'

interface Props {
  tour: TourDetails
}
interface BookingFormData {
  adults: number
  children: number
  totalPrice: number
}

export default function TourBookingSection({ tour }: Props) {
  const { isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId } = useContext(AppContext)
  const queryClient = useQueryClient()
  const isLiked = favoriteIds.has(tour.tourID)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingFormData>({
    defaultValues: { adults: 1, children: 0, totalPrice: tour.finalPriceAdult }
  })

  const adults = watch('adults')
  const children = watch('children')
  const totalPrice = watch('totalPrice')

  useEffect(() => {
    const adultPrice = tour.finalPriceAdult || 0
    const childPrice = tour.finalPriceChild || 0
    setValue('totalPrice', adults * adultPrice + children * childPrice)
  }, [adults, children, tour.finalPriceAdult, tour.finalPriceChild, setValue])

  const handleOpenBookingModal = () => {
    if (!isAuthenticated) {
      toast.info('Bạn vui lòng đăng nhập để đặt tour nhé!')
      return
    }
    if (errors.adults || errors.children) return
    setIsModalOpen(true)
  }

  // ... (Giữ nguyên logic handleFavorite) ...
  const addFavoriteMutation = useMutation({ mutationFn: favoriteApi.addFavorite })
  const removeFavoriteMutation = useMutation({ mutationFn: favoriteApi.removeFavorite })

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.info('Bạn cần đăng nhập để thực hiện chức năng này')
      return
    }
    if (isLiked) {
      removeFavoriteMutation.mutate(tour.tourID, {
        onSuccess: () => {
          removeFavoriteId(tour.tourID)
          toast.success('Đã xóa khỏi danh sách yêu thích!')
          queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
        }
      })
    } else {
      addFavoriteMutation.mutate(
        { tourId: tour.tourID },
        {
          onSuccess: () => {
            addFavoriteId(tour.tourID)
            toast.success('Đã thêm tour vào yêu thích!')
            queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
          }
        }
      )
    }
  }

  const maxParticipants = tour.maxParticipants || 20
  const isProcessing = addFavoriteMutation.isPending || removeFavoriteMutation.isPending

  return (
    <div className="bg-white/90 backdrop-blur-2xl p-7 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Đặt tour</h2>
        <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <Tag size={12} className="mr-1" /> Giá tốt nhất
        </div>
      </div>

      <div className="bg-gray-50/50 p-4 rounded-2xl mb-6 space-y-3 border border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium text-sm">Người lớn</span>
          <div className="text-right">
            <span className="font-extrabold text-xl text-gray-900 block">
              {formatCurrency(tour.finalPriceAdult)}
            </span>
            {tour.priceAdult > tour.finalPriceAdult && (
              <span className="text-gray-400 text-sm line-through block">
                {formatCurrency(tour.priceAdult)}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
          <span className="text-gray-500 font-medium text-sm">Trẻ em</span>
          <span className="font-extrabold text-lg text-gray-900">
            {formatCurrency(tour.finalPriceChild)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white p-1 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider px-2 pt-2">
            Người lớn
          </label>
          <Controller
            name="adults"
            control={control}
            rules={{
              min: { value: 1, message: 'Tối thiểu 1' },
              validate: (value) => value + children <= maxParticipants || `Quá số lượng`
            }}
            render={({ field }) => (
              <input
                type="number"
                className="w-full px-2 pb-2 text-lg font-bold bg-transparent border-none focus:ring-0 outline-none"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                min="1"
                max={maxParticipants}
              />
            )}
          />
        </div>
        <div className="bg-white p-1 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider px-2 pt-2">
            Trẻ em
          </label>
          <Controller
            name="children"
            control={control}
            rules={{
              min: { value: 0, message: 'Không âm' },
              validate: (value) => adults + value <= maxParticipants || `Quá số lượng`
            }}
            render={({ field }) => (
              <input
                type="number"
                className="w-full px-2 pb-2 text-lg font-bold bg-transparent border-none focus:ring-0 outline-none"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                min="0"
                max={maxParticipants - adults}
              />
            )}
          />
        </div>
      </div>

      {(errors.adults || errors.children) && (
        <div className="mb-4 text-sm text-red-500 font-medium px-2">
          {errors.adults?.message || errors.children?.message}
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center text-blue-800">
        <Calendar size={20} className="mr-3 text-blue-500" />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-0.5">
            Khởi hành
          </div>
          <div className="font-semibold">
            {tour.startDate}{' '}
            <span className="text-blue-500 text-sm font-normal">
              (Còn {tour.maxParticipants - (adults + children)} chỗ)
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 px-2">
        <span className="text-gray-500 font-bold">Tổng cộng</span>
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          {formatCurrency(totalPrice)}
        </span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="w-full text-lg font-bold py-4 bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white rounded-xl shadow-lg shadow-orange-500/30 transform transition-all active:scale-[0.98] disabled:opacity-50"
          disabled={!!errors.adults || !!errors.children}
          onClick={handleOpenBookingModal}
        >
          Đặt Tour Ngay
        </button>

        <button
          type="button"
          className={`w-full flex items-center justify-center text-base font-semibold py-3 rounded-xl border-2 transition-all duration-300 ${
            isLiked
              ? 'text-rose-500 border-rose-100 bg-rose-50 hover:bg-rose-100'
              : 'text-gray-600 border-gray-100 bg-white hover:bg-gray-50'
          }`}
          onClick={handleFavorite}
          disabled={isProcessing}
        >
          <Heart
            size={20}
            className={`mr-2 transition-transform duration-300 ${isLiked ? 'fill-current text-rose-500 scale-110' : ''}`}
          />
          {isLiked ? 'Đã lưu vào Yêu thích' : 'Lưu vào Yêu thích'}
        </button>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tour={tour}
        bookingDetails={{ adults, children, totalPrice }}
      />
    </div>
  )
}
