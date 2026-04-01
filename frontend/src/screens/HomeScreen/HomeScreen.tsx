import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tourApi } from '../../apis/tour'
import { destinationApi } from '../../apis/destination'
import type { Tour } from '../../types/tour'
import type { Destination } from '../../types/destination'
import { Link, useNavigate } from 'react-router-dom'

// Import các component UI
import Button from '../../components/Button'
import TourCard from '../../components/TourCard'
import DestinationCard from '../../components/DestinationCard'

// Import icons
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaShieldAlt,
  FaTag,
  FaHeadset,
  FaSyncAlt,
  FaUserGraduate,
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaUserFriends,
  FaLeaf,
  FaEnvelope,
  FaCompass
} from 'react-icons/fa'

// === PHẦN 1: HERO SECTION (PREMIUM GLASSMORPHISM) ===
function HeroSection() {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useState({
    destination: '',
    startDate: '',
    duration: '',
    guests: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchParams.destination.trim()) params.append('search', searchParams.destination.trim())
    if (searchParams.startDate) params.append('startDate', searchParams.startDate)
    if (searchParams.duration) params.append('duration', searchParams.duration)
    if (searchParams.guests) params.append('guests', searchParams.guests)
    navigate(`/tours?${params.toString()}`)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center z-20 overflow-hidden">
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
        style={{ backgroundImage: 'url(/hero.jpg)' }}
      />
      {/* Lớp phủ Gradient mượt mà hơn */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <div className="relative z-10 flex flex-col items-center text-center p-4 w-full max-w-6xl mt-10">
        <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium tracking-wider uppercase mb-6 shadow-lg">
          Khám phá thế giới cùng TripBee
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight">
          Hành Trình Chạm Đến
        </h1>
        <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 pb-8 drop-shadow-lg">
          Những Giấc Mơ
        </h2>
        <p className="text-lg md:text-xl text-gray-200 max-w-3xl mb-12 drop-shadow-md font-light">
          Hơn 10,000+ điểm đến tuyệt đẹp đang chờ đón. Hãy để chúng tôi đồng hành cùng bạn trên mọi
          nẻo đường khám phá đất nước hình chữ S.
        </p>

        {/* Thanh tìm kiếm Glassmorphism */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <form
            className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-3"
            onSubmit={handleSubmitSearch}
          >
            <div className="lg:col-span-3 bg-white rounded-2xl p-2 flex flex-col justify-center transition-all focus-within:ring-2 focus-within:ring-blue-500">
              <label
                htmlFor="destination"
                className="text-xs font-bold text-gray-500 uppercase ml-9 mb-1"
              >
                Điểm đến
              </label>
              <div className="relative flex items-center">
                <FaMapMarkerAlt className="absolute left-3 text-blue-500 text-lg" />
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="Bạn muốn đi đâu?"
                  className="w-full pl-10 pr-3 py-1 bg-transparent border-none outline-none text-gray-800 font-medium placeholder-gray-400"
                  value={searchParams.destination}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-2 flex flex-col justify-center transition-all focus-within:ring-2 focus-within:ring-blue-500">
              <label htmlFor="date" className="text-xs font-bold text-gray-500 uppercase ml-9 mb-1">
                Khởi hành
              </label>
              <div className="relative flex items-center">
                <FaCalendarAlt className="absolute left-3 text-blue-500 text-lg" />
                <input
                  type="date"
                  id="date"
                  name="startDate"
                  className="w-full pl-10 pr-3 py-1 bg-transparent border-none outline-none text-gray-800 font-medium cursor-pointer"
                  value={searchParams.startDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-2 flex flex-col justify-center transition-all focus-within:ring-2 focus-within:ring-blue-500">
              <label
                htmlFor="duration"
                className="text-xs font-bold text-gray-500 uppercase ml-3 mb-1"
              >
                Thời gian
              </label>
              <select
                id="duration"
                name="duration"
                className="w-full px-3 py-1 bg-transparent border-none outline-none text-gray-800 font-medium cursor-pointer"
                value={searchParams.duration}
                onChange={handleInputChange}
              >
                <option value="">Tất cả thời gian</option>
                <option value="1-3">1 - 3 ngày</option>
                <option value="4-6">4 - 6 ngày</option>
                <option value="7+">Trên 7 ngày</option>
              </select>
            </div>

            <div className="lg:col-span-1 bg-white rounded-2xl p-2 flex flex-col justify-center transition-all focus-within:ring-2 focus-within:ring-blue-500">
              <label
                htmlFor="guests"
                className="text-xs font-bold text-gray-500 uppercase ml-3 mb-1"
              >
                Khách
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                placeholder="02"
                min="1"
                className="w-full px-3 py-1 bg-transparent border-none outline-none text-gray-800 font-medium"
                value={searchParams.guests}
                onChange={handleInputChange}
              />
            </div>

            <div className="lg:col-span-2 flex">
              <button
                type="submit"
                className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <FaSearch />
                Khám Phá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// === PHẦN 2: TOURS NỔI BẬT ===
function FeaturedTours() {
  const { data: toursData, isLoading } = useQuery({
    queryKey: ['featuredTours'],
    queryFn: tourApi.getFeaturedTours
  })

  const tours = toursData?.data.content || []

  return (
    <div className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-100 px-4 py-1.5 rounded-full mb-4 flex items-center gap-2">
            <FaCompass /> Top Đề Cử
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">
            Tour Du Lịch Nổi Bật
          </h2>
          <p className="text-lg text-gray-500 text-center max-w-2xl">
            Những hành trình được yêu thích nhất với chất lượng dịch vụ hàng đầu, hứa hẹn mang lại
            trải nghiệm không thể nào quên.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour: Tour) => (
              <div
                key={tour.tourID}
                className="group hover:-translate-y-2 transition-transform duration-300"
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <Button
            as="link"
            to="/tours"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2"
          >
            Xem tất cả lịch trình <FaArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

// === PHẦN 3: ĐIỂM ĐẾN PHỔ BIẾN ===
function PopularDestinations() {
  const { data: destinationsData, isLoading } = useQuery({
    queryKey: ['popularDestinations'],
    queryFn: destinationApi.getPopularDestinations
  })

  const destinations = destinationsData?.data || []

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm bg-orange-100 px-4 py-1.5 rounded-full mb-4 inline-block">
              Điểm Đến Hot
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Khám Phá Việt Nam
            </h2>
            <p className="text-lg text-gray-500">
              Lựa chọn điểm đến tiếp theo cho hành trình của bạn từ những địa danh nổi tiếng nhất.
            </p>
          </div>
          <Link
            to="/tours"
            className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
          >
            Xem tất cả điểm đến{' '}
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest: Destination) => (
              <div
                key={dest.destinationID}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
              >
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// === PHẦN 4: TẠI SAO CHỌN CHÚNG TÔI ===
const features = [
  {
    icon: FaShieldAlt,
    title: 'An Toàn Tuyệt Đối',
    desc: 'Chuyến đi được bảo vệ và hỗ trợ rủi ro 24/7.',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    icon: FaTag,
    title: 'Giá Tốt Nhất',
    desc: 'Cam kết không phát sinh chi phí ẩn, giá cả minh bạch.',
    gradient: 'from-green-500 to-emerald-400'
  },
  {
    icon: FaHeadset,
    title: 'Hỗ Trợ Tận Tâm',
    desc: 'Đội ngũ chuyên gia luôn sẵn sàng giải đáp mọi thắc mắc.',
    gradient: 'from-purple-500 to-indigo-400'
  },
  {
    icon: FaSyncAlt,
    title: 'Lịch Trình Đa Dạng',
    desc: 'Tùy biến linh hoạt theo nhu cầu riêng của bạn.',
    gradient: 'from-orange-500 to-amber-400'
  },
  {
    icon: FaUserGraduate,
    title: 'HDV Chuyên Nghiệp',
    desc: 'Am hiểu sâu sắc văn hóa, lịch sử và địa phương.',
    gradient: 'from-pink-500 to-rose-400'
  },
  {
    icon: FaStar,
    title: 'Trải Nghiệm Đẳng Cấp',
    desc: 'Lưu trú và dịch vụ chuẩn sao mang đến sự thoải mái nhất.',
    gradient: 'from-yellow-400 to-orange-400'
  }
]

function WhyChooseUs() {
  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Tại Sao Chọn TripBee?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Chúng tôi không chỉ tổ chức tour, chúng tôi thiết kế những kỷ niệm đáng nhớ bằng sự tử
            tế và chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-6 shadow-lg`}
              >
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// === PHẦN 5: TRẢI NGHIỆM ĐỘC ĐÁO ===
function UniqueExperience() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Bộ Sưu Tập Trải Nghiệm
          </h2>
          <p className="text-lg text-gray-500">Khám phá Việt Nam theo cách riêng của bạn</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/tours"
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          >
            <img
              src="./dulichmaohiem.avif"
              alt="Du Lịch Mạo Hiểm"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />
            <div className="absolute bottom-8 left-8 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
              <div className="bg-white/20 backdrop-blur-md text-white rounded-full p-3 mb-4 inline-flex border border-white/30">
                <FaLeaf size={24} />
              </div>
              <h3 className="text-4xl font-bold mb-2">Thiên Nhiên Kỳ Vĩ</h3>
              <p className="text-gray-200 text-lg flex items-center gap-2">
                Tìm về bản ngã, hòa mình vào đất trời{' '}
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </Link>

          <Link
            to="/tours"
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          >
            <img
              src="./khamphaamthuc.avif"
              alt="Khám Phá Ẩm Thực"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />
            <div className="absolute bottom-8 left-8 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
              <div className="bg-amber-500/80 backdrop-blur-md text-white rounded-full p-3 mb-4 inline-flex border border-amber-400/50">
                <FaUserFriends size={24} />
              </div>
              <h3 className="text-4xl font-bold mb-2">Văn Hóa & Ẩm Thực</h3>
              <p className="text-gray-200 text-lg flex items-center gap-2">
                Thưởng thức tinh hoa ngàn năm{' '}
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

// === PHẦN 6: BLOG DU LỊCH ===
const blogPosts = [
  {
    id: 1,
    image: './blog-01.avif',
    date: '25/10/2025',
    category: 'Kinh nghiệm',
    title: '10 địa điểm không thể bỏ qua khi đến Hà Giang mùa lúa chín',
    link: '/blog/1'
  },
  {
    id: 2,
    image: './blog-02.jpg',
    date: '20/10/2025',
    category: 'Cẩm nang',
    title: 'Review chi tiết lịch trình khám phá đảo ngọc Phú Quốc 4N3Đ',
    link: '/blog/2'
  },
  {
    id: 3,
    image: './blog-03.avif',
    date: '15/10/2025',
    category: 'Ẩm thực',
    title: 'Bản đồ ẩm thực đường phố Sài Gòn: Ăn sập chợ Bến Thành',
    link: '/blog/3'
  }
]

function TravelBlog() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-purple-600 font-bold tracking-wider uppercase text-sm bg-purple-100 px-4 py-1.5 rounded-full mb-4 inline-block">
              Cảm hứng du lịch
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Góc Sẻ Chia</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
            >
              <Link to={post.link} className="block relative h-60 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                  {post.category}
                </div>
              </Link>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <FaCalendarAlt /> {post.date}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  <Link to={post.link}>{post.title}</Link>
                </h3>
                <Link
                  to={post.link}
                  className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Đọc tiếp <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// === PHẦN 7: KHÁCH HÀNG NÓI GÌ ===
const testimonialData = [
  {
    id: 1,
    quote:
      'Một trải nghiệm tuyệt vời ngoài sức tưởng tượng. Mọi thứ từ xe đưa đón, khách sạn đến bữa ăn đều được TripBee chuẩn bị vô cùng chu đáo. Hướng dẫn viên siêu nhiệt tình!',
    image: 'https://i.pravatar.cc/150?img=12',
    name: 'Nguyễn Minh Anh',
    tour: 'Tour Hạ Long Bay Luxury 3N2Đ'
  },
  {
    id: 2,
    quote:
      'Gia đình tôi đã có một kỷ niệm đáng nhớ tại Hội An. Lịch trình thiết kế rất hợp lý cho cả người già và trẻ em. Chắc chắn sẽ tiếp tục ủng hộ TripBee trong các chuyến đi tới.',
    image: 'https://i.pravatar.cc/150?img=11',
    name: 'Trần Văn Hùng',
    tour: 'Tour Đà Nẵng - Hội An 4N3Đ'
  }
]

function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full mb-4 inline-block">
            Đánh giá thực tế
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Khách Hàng Nói Gì?</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-14 text-center shadow-2xl min-h-[350px] flex flex-col justify-center">
            <FaQuoteLeft className="text-6xl text-white/20 absolute top-8 left-8" />

            {testimonialData.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 absolute inset-0 translate-y-4 pointer-events-none'}`}
              >
                <p className="text-xl md:text-2xl italic text-gray-100 leading-relaxed mb-8 px-4 md:px-12">
                  "{item.quote}"
                </p>
                <div className="flex flex-col items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-xl mb-4"
                  />
                  <h4 className="text-xl font-bold text-white mb-1">{item.name}</h4>
                  <p className="text-blue-300 font-medium">{item.tour}</p>
                  <div className="flex text-yellow-400 mt-2 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:-mx-6">
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev === 0 ? testimonialData.length - 1 : prev - 1))
                }
                className="bg-white/20 hover:bg-white/40 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev === testimonialData.length - 1 ? 0 : prev + 1))
                }
                className="bg-white/20 hover:bg-white/40 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// === PHẦN 8: NHẬN THÔNG TIN ===
function Newsletter() {
  return (
    <div className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <FaEnvelope className="text-5xl text-blue-200 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Sẵn Sàng Cho Chuyến Đi Tiếp Theo?
            </h2>
            <p className="text-lg text-blue-100 mb-10">
              Để lại email để nhận ngay voucher giảm giá 15% cho tour đầu tiên và các cẩm nang du
              lịch độc quyền.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-xl">
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                className="bg-transparent flex-grow px-6 py-3 text-white placeholder-blue-200 focus:outline-none min-w-0"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-md whitespace-nowrap"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// === COMPONENT CHÍNH ===
export default function HomeScreen() {
  return (
    <div className="bg-white w-full overflow-hidden">
      <HeroSection />
      <FeaturedTours />
      <PopularDestinations />
      <WhyChooseUs />
      <UniqueExperience />
      <TravelBlog />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
