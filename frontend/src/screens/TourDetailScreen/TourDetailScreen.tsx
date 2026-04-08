// frontend-demo/src/screens/TourDetailScreen/TourDetailScreen.tsx

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tourApi } from '../../apis/tour'
import { MapPin, Calendar, Clock, Users } from 'lucide-react'
import TourBookingSection from '../../components/TourBookingSection'
import {
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa'
import type { Tour, TourDetails } from '../../types/tour'
import TourCard from '../../components/TourCard'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
// (1. THÊM) Import component Review
import TourReviewSection from '../../components/TourReviewSection'

// (Giữ nguyên) Component con RelatedToursSection
function RelatedToursSection({
  // ... (code component này giữ nguyên) ...
  tourTypeId,
  currentTourId
}: {
  tourTypeId: string
  currentTourId: string
}) {
  const { data: relatedToursData, isLoading: isLoadingRelated } = useQuery({
    queryKey: ['relatedTours', tourTypeId],
    queryFn: () =>
      tourApi.getTours({
        tour_type_id: tourTypeId,
        size: 4,
        page: 0
      }),
    enabled: !!tourTypeId
  })

  const relatedTours =
    relatedToursData?.data.content
      .filter((tour: Tour) => tour.tourID !== currentTourId)
      .slice(0, 3) || []

  if (isLoadingRelated) {
    return <div className="text-center py-10">Đang tải các tour liên quan...</div>
  }

  if (relatedTours.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tours Liên Quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTours.map((tour: Tour) => (
          <TourCard key={tour.tourID} tour={tour} />
        ))}
      </div>
    </div>
  )
}

// === Component chính ===
export default function TourDetailScreen() {
  // --- (Giữ nguyên) Tất cả Hooks (useParams, useQuery, useState, useRef, useEffect...) ---
  const { id } = useParams<{ id: string }>()

  const { data: tourDetailsData, isLoading } = useQuery({
    queryKey: ['tourDetails', id],
    queryFn: () => (id ? tourApi.getTourDetails(id) : Promise.reject('Missing ID')),
    enabled: !!id
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const AUTO_SLIDE_DELAY = 5000
  const intervalRef = useRef<number | null>(null)

  const tour: TourDetails | undefined = tourDetailsData?.data

  const allImages = tour ? [{ url: tour.imageURL, caption: tour.title }, ...tour.tourImages] : []

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startAutoSlide = () => {
    stopAutoSlide()
    if (allImages.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
      }, AUTO_SLIDE_DELAY)
    }
  }

  useEffect(() => {
    if (allImages.length > 0 && lightboxIndex === null) {
      startAutoSlide()
    }
    return () => stopAutoSlide()
  }, [allImages.length, lightboxIndex])

  const nextImage = () => {
    if (allImages.length === 0) return
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    if (allImages.length === 0) return
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    stopAutoSlide()
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    startAutoSlide()
  }

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (allImages.length === 0) return
    setLightboxIndex((prev) => (prev === null ? 0 : prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (allImages.length === 0) return
    setLightboxIndex((prev) => (prev === null ? 0 : prev === 0 ? allImages.length - 1 : prev - 1))
  }

  if (isLoading) {
    return <div className="text-center py-20">Đang tải chi tiết tour...</div>
  }

  if (!tour) {
    return <div className="text-center py-20">Không tìm thấy tour.</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ... (Phần Header Tour giữ nguyên) ... */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded mr-3">
            {tour.tourType.nameType}
          </span>
          <div className="flex items-center mr-4">
            <FaStar className="text-yellow-500 mr-1" />
            <span>
              {5} ({20} đánh giá)
            </span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-1" />
            <span>{tour.destinations[0]?.nameDes}</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>
        <div className="flex items-center text-gray-600">
          <FaClock className="mr-2" />
          <span>{`${tour.durationDays} ngày ${tour.durationNights} đêm`}</span>
        </div>
      </div>

      {/* ... (Phần Slider giữ nguyên) ... */}
      <div
        className="h-96 md:h-[500px] bg-gray-200 relative mb-8 rounded-2xl shadow-lg overflow-hidden group"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={allImages[currentImageIndex].url}
            alt={allImages[currentImageIndex].caption}
            className="w-full h-full object-cover cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => openLightbox(currentImageIndex)}
          />
        </AnimatePresence>

        <button
          onClick={() => {
            prevImage()
            startAutoSlide()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-900 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Ảnh trước"
        >
          <FaChevronLeft size={20} />
        </button>

        <button
          onClick={() => {
            nextImage()
            startAutoSlide()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-900 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Ảnh kế tiếp"
        >
          <FaChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* ... (Phần Grid nội dung chính) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* ... (Thông tin nhanh giữ nguyên) ... */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Calendar className="mx-auto mb-2 text-blue-600" />
              <span className="font-semibold">Khởi hành</span>
              <p className="text-sm text-gray-700">{tour.startDate}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Clock className="mx-auto mb-2 text-green-600" />
              <span className="font-semibold">Thời gian</span>
              <p className="text-sm text-gray-700">
                {tour.durationDays} ngày {tour.durationNights} đêm
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <Users className="mx-auto mb-2 text-yellow-600" />
              <span className="font-semibold">Số chỗ</span>
              <p className="text-sm text-gray-700">{tour.maxParticipants}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <MapPin className="mx-auto mb-2 text-indigo-600" />
              <span className="font-semibold">Nơi đi</span>
              <p className="text-sm text-gray-700">{tour.departurePlace}</p>
            </div>
          </div>
          {/* ... (Mô tả chi tiết giữ nguyên) ... */}
          <div className="bg-white p-8 rounded-lg mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mô tả Tour</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />
          </div>
          {/* ... (Lịch trình giữ nguyên) ... */}
          <div className="bg-white p-8 rounded-lg mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hành trình chi tiết</h2>
            <div className="space-y-6 border-l-2 border-blue-500 pl-6">
              {tour.itineraries
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((item) => (
                  <div key={item.dayNumber} className="relative">
                    <div className="absolute -left-7 h-4 w-4 bg-blue-500 rounded-full top-1" />
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                      Ngày {item.dayNumber}: {item.title}
                    </h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* ... (Cột Đặt Tour giữ nguyên) ... */}
        <div className="lg:col-span-1">
          <TourBookingSection tour={tour} />
        </div>
      </div>

      {/* (2. THÊM MỚI) Thêm phần Đánh giá vào đây */}
      <TourReviewSection tourId={tour.tourID} />

      {/* ... (Phần Tours Liên Quan giữ nguyên) ... */}
      <RelatedToursSection tourTypeId={tour.tourType.tourTypeID} currentTourId={tour.tourID} />

      {/* ... (Phần Lightbox giữ nguyên) ... */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-[52]"
              aria-label="Đóng"
            >
              <FaTimes size={30} />
            </button>

            <button
              onClick={prevLightboxImage}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-[52]"
              aria-label="Ảnh trước"
            >
              <FaChevronLeft size={32} />
            </button>

            <button
              onClick={nextLightboxImage}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-[52]"
              aria-label="Ảnh kế tiếp"
            >
              <FaChevronRight size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center z-[51]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={allImages[lightboxIndex].url}
                  alt={allImages[lightboxIndex].caption}
                  className="max-w-full max-h-[90vh] rounded-lg object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
