// frontend-demo/src/screens/TourDetailScreen/TourDetailScreen.tsx

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tourApi } from '../../apis/tour'
import { MapPin, Calendar, Clock, Users, ShieldCheck } from 'lucide-react'
import TourBookingSection from '../../components/TourBookingSection'
import { FaStar, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'
import type { Tour, TourDetails } from '../../types/tour'
import TourCard from '../../components/TourCard'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TourReviewSection from '../../components/TourReviewSection'

function RelatedToursSection({
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

  if (isLoadingRelated)
    return <div className="text-center py-10">Đang tải các tour liên quan...</div>
  if (relatedTours.length === 0) return null

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 border border-white/50">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Tours Liên Quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTours.map((tour: Tour) => (
          <TourCard key={tour.tourID} tour={tour} />
        ))}
      </div>
    </div>
  )
}

export default function TourDetailScreen() {
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

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">Đang tải chi tiết tour...</div>
    )
  if (!tour)
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy tour.</div>

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* HERO SECTION - GLASSMORPHISM & FULL WIDTH FEEL */}
      <div className="max-w-7xl mx-auto md:px-4 pt-4 md:pt-8 mb-10">
        <div
          className="relative h-[60vh] min-h-[450px] md:h-[70vh] rounded-b-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden group"
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex].url}
              alt={allImages[currentImageIndex].caption}
              className="w-full h-full object-cover cursor-pointer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => openLightbox(currentImageIndex)}
            />
          </AnimatePresence>

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Slider Controls - Glassmorphism */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
              startAutoSlide()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 border border-white/30 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
              startAutoSlide()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 border border-white/30 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40"
          >
            <FaChevronRight size={20} />
          </button>

          {/* Image Counter Badge */}
          <div className="absolute top-6 right-6 backdrop-blur-md bg-black/40 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full z-10">
            {currentImageIndex + 1} / {allImages.length}
          </div>

          {/* Hero Content Over Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                {tour.tourType.nameType}
              </span>
              <div className="flex items-center backdrop-blur-md bg-black/30 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                <FaStar className="text-yellow-400 mr-1.5" />
                <span>5.0 (20 đánh giá)</span>
              </div>
              <div className="flex items-center backdrop-blur-md bg-black/30 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                <MapPin size={16} className="mr-1.5 text-rose-400" />
                <span>{tour.destinations[0]?.nameDes}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 leading-tight drop-shadow-lg tracking-tight">
              {tour.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI - CHI TIẾT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Grid - Soft Shadows */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Calendar,
                  label: 'Khởi hành',
                  value: tour.startDate,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                {
                  icon: Clock,
                  label: 'Thời gian',
                  value: `${tour.durationDays}N ${tour.durationNights}Đ`,
                  color: 'text-green-600',
                  bg: 'bg-green-50'
                },
                {
                  icon: Users,
                  label: 'Số chỗ',
                  value: tour.maxParticipants,
                  color: 'text-yellow-600',
                  bg: 'bg-yellow-50'
                },
                {
                  icon: MapPin,
                  label: 'Nơi đi',
                  value: tour.departurePlace,
                  color: 'text-rose-600',
                  bg: 'bg-rose-50'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-3`}
                  >
                    <item.icon className={item.color} size={24} />
                  </div>
                  <span className="text-sm text-gray-500 font-medium mb-1">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Mô tả Tour - Glassmorphism Card */}
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center tracking-tight">
                <ShieldCheck className="text-blue-500 mr-2" size={28} />
                Điểm nổi bật của hành trình
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </div>

            {/* Lịch trình chi tiết */}
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
                Hành trình chi tiết
              </h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-indigo-100">
                {tour.itineraries
                  .sort((a, b) => a.dayNumber - b.dayNumber)
                  .map((item) => (
                    <div
                      key={item.dayNumber}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {item.dayNumber}
                      </div>

                      {/* Content Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 hover:bg-blue-50 transition-colors duration-300 p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-blue-600">Ngày {item.dayNumber}</h3>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Đánh giá */}
            <TourReviewSection tourId={tour.tourID} />
          </div>

          {/* CỘT PHẢI - WIDGET ĐẶT TOUR (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <TourBookingSection tour={tour} />
            </div>
          </div>
        </div>

        {/* Tours Liên Quan */}
        <div className="mt-8">
          <RelatedToursSection tourTypeId={tour.tourType.tourTypeID} currentTourId={tour.tourID} />
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-xl bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Các nút điều khiển Lightbox giữ nguyên */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-[52]"
            >
              <FaTimes size={30} />
            </button>
            <button
              onClick={prevLightboxImage}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all z-[52]"
            >
              <FaChevronLeft size={32} />
            </button>
            <button
              onClick={nextLightboxImage}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all z-[52]"
            >
              <FaChevronRight size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center z-[51]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={allImages[lightboxIndex].url}
                  alt={allImages[lightboxIndex].caption}
                  className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, type: 'spring' }}
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
