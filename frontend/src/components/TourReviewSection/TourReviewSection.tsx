// frontend-demo/src/components/TourReviewSection/TourReviewSection.tsx

import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { reviewApi } from '../../apis/review.api'
import ReviewCard from '../ReviewCard'
import type { Review } from '../../types/review.type'
import { MessageSquareQuote } from 'lucide-react'

const REVIEW_PAGE_SIZE = 5

interface Props {
  tourId: string
}

export default function TourReviewSection({ tourId }: Props) {
  const [page, setPage] = useState(0)

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', tourId, page],
    queryFn: () => reviewApi.getReviewsForTour(tourId, { page: page, size: REVIEW_PAGE_SIZE }),
    placeholderData: keepPreviousData
  })

  const reviews = reviewsData?.data.content || []
  const totalPages = reviewsData?.data.totalPages || 0
  const totalElements = reviewsData?.data.totalElements || 0

  if (isLoading && reviews.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 border border-white text-center">
        <div className="animate-pulse bg-gray-200 h-8 w-48 mx-auto rounded mb-4"></div>
        <div className="text-gray-400">Đang tải đánh giá...</div>
      </div>
    )
  }

  if (totalElements === 0) return null

  return (
    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 border border-white">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-2xl mr-4">
          <MessageSquareQuote className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Đánh giá từ khách hàng
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Dựa trên {totalElements} nhận xét
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review: Review, index: number) => (
          <div
            key={review.createdAt + index}
            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={reviewsData?.data.first}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trang trước
          </button>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm">
            {page + 1} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={reviewsData?.data.last}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  )
}
