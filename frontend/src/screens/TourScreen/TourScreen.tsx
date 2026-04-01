/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { tourApi } from '../../apis/tour'
import TourCard from '../../components/TourCard'
import TourFilterSection from '../../components/TourFilterSection'
import type { Tour, TourListParams } from '../../types/tour'
import { omitBy, isUndefined } from 'lodash'
import Button from '../../components/Button'
import { destinationApi } from '../../apis/destination'
import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight, FaCompass } from 'react-icons/fa'

type ParsedTourParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  region: any
  page: number
  size: number
  sort?: string
  search?: string
  destination_id?: string
  tour_type_id?: string
  priceMin?: number
  priceMax?: number
}

const parseSearchParams = (searchParams: URLSearchParams): ParsedTourParams => {
  const params = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: searchParams.get('size') ? Number(searchParams.get('size')) : 12,
    sort: searchParams.get('sort') || undefined,
    search: searchParams.get('search') || undefined,
    destination_id: searchParams.get('destination_id') || undefined,
    tour_type_id: searchParams.get('tour_type_id') || undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    region: searchParams.get('region') || undefined
  }
  return omitBy(params, isUndefined) as ParsedTourParams
}

export default function TourScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = parseSearchParams(searchParams)

  const { data: destinationsData } = useQuery({
    queryKey: ['destinations'],
    queryFn: destinationApi.getPopularDestinations
  })

  const uniqueRegions = useMemo(() => {
    if (!destinationsData?.data) return []
    const regions = destinationsData.data.map((dest) => dest.region)
    return [...new Set(regions)].filter(Boolean).sort()
  }, [destinationsData])

  const { data: toursData, isLoading } = useQuery({
    queryKey: ['tours', queryParams],
    queryFn: () => tourApi.getTours(queryParams as TourListParams),
    placeholderData: keepPreviousData
  })

  const tours = toursData?.data.content || []
  const totalPages = toursData?.data.totalPages || 0
  const currentPage = toursData?.data.number || 0

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page: page }
    setSearchParams(newParams as any)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleRegionClick = (regionValue: string | undefined) => {
    const newParams = {
      ...queryParams,
      region: regionValue,
      page: 0
    }
    const cleanedParams = omitBy(newParams, isUndefined)
    setSearchParams(cleanedParams as any)
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* HERO SECTION (Premium Glassmorphism) */}
      <div className="relative pt-24 pb-32 overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.jpg)', backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#373737]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold tracking-wider uppercase mb-4 shadow-lg">
              <FaCompass /> Hành trình của bạn
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 pb-8 drop-shadow-lg">
              Tìm Kiếm Chuyến Đi Hoàn Hảo
            </h1>
            {/* <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl tracking-tight">
              Tìm Kiếm Chuyến Đi Hoàn Hảo
            </h1> */}
          </div>

          {/* Filter Section bọc trong Glassmorphism */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-4 rounded-[2rem] shadow-2xl mx-auto max-w-5xl">
            <div className="bg-white rounded-[1.5rem] p-4 shadow-inner">
              <TourFilterSection showAdvancedFilters={true} defaultValues={queryParams} />
            </div>
          </div>
        </div>
      </div>

      {/* VÙNG MIỀN (Pill Navigation) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex flex-wrap gap-2 justify-center items-center">
          <button
            onClick={() => handleRegionClick(undefined)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
              queryParams.region === undefined || queryParams.region === ''
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                : 'bg-transparent text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Tất cả điểm đến
          </button>
          {uniqueRegions.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionClick(region)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                queryParams.region === region
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-transparent text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH TOURS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {tours.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tours.map((tour: Tour) => (
                    <div key={tour.tourID} className="h-full">
                      <TourCard tour={tour} />
                    </div>
                  ))}
                </div>

                {/* PHÂN TRANG (Pagination Premium) */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-16">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center"
                    >
                      <FaChevronLeft />
                    </Button>

                    <div className="bg-white border border-gray-200 shadow-sm px-6 py-3 rounded-full font-bold text-gray-700">
                      Trang <span className="text-blue-600">{currentPage + 1}</span> / {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage + 1 >= totalPages}
                      className="!rounded-full w-12 h-12 !p-0 flex items-center justify-center"
                    >
                      <FaChevronRight />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100 max-w-3xl mx-auto mt-10">
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png"
                  alt="Empty"
                  className="w-64 mx-auto mb-6 opacity-80"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 mb-6">
                  Chúng tôi không tìm thấy tour nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi
                  điểm đến hoặc thời gian nhé!
                </p>
                <Button onClick={() => handleRegionClick(undefined)} className="mx-auto">
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
