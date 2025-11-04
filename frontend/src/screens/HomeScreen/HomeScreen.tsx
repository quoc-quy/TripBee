// (Cập nhật) Thêm useState để dùng cho carousel
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tourApi } from "../../apis/tour"; // (Sửa đường dẫn nếu cần)
import { destinationApi } from "../../apis/destination"; // (Sửa đường dẫn nếu cần)
import { formatCurrency } from "../../utils/utils";
import type { Tour } from "../../types/tour"; // (Sửa đường dẫn nếu cần)
// (Sửa đường dẫn nếu cần)
// (Sửa đường dẫn nếu cần)
import type { Destination } from "../../types/destination"; // (Sửa đường dẫn nếu cần)
// (Sửa đường dẫn nếu cần)
import { Link } from "react-router-dom";

// Import icons
import {
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaSearch,
    FaShieldAlt,
    FaTag,
    FaHeadset,
    FaSyncAlt,
    FaUserGraduate,
    FaQuoteLeft,
    FaChevronRight,
    // (Mới) Thêm icons cho các section mới
    FaArrowRight,
    FaArrowLeft,
    FaRegStar, // Icon sao rỗng
    FaCheckCircle,
    FaThumbsUp,
    FaUserFriends,
    FaLeaf, // Icon cho Experience
    FaBookOpen, // Icon cho Blog
    FaEnvelope, // (Cập nhật) Thay cho PaperPlane
    FaGift, // (Cập nhật) Icon cho Newsletter
    FaBell, // (Cập nhật) Icon cho Newsletter
} from "react-icons/fa";

// === PHẦN 1: HERO SECTION ===
// (Không thay đổi)
function HeroSection() {
    return (
        <div
            // (Tối ưu) Thêm z-20 để nằm trên Testimonials (z-10)
            className="relative min-h-screen-nav flex items-center justify-center text-white z-20"
            style={{
                backgroundImage: "url(/hero.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Lớp phủ mờ */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col items-center text-center p-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow-2xs">
                    Khám Phá Vẻ Đẹp
                </h1>
                <h2 className="text-5xl md:text-7xl font-bold text-primary-light mb-6 text-[#f7c34a]">
                    Việt Nam Cùng Chúng Tôi
                </h2>
                <p className="text-2xl max-w-4xl mb-12 text-shadow-lg">
                    Trải nghiệm những chuyến du lịch độc đáo, khám phá văn hóa đậm đà và cảnh đẹp
                    thiên nhiên tuyệt vời của đất nước hình chữ S
                </p>

                {/* Thanh tìm kiếm */}
                <div className="bg-white text-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-5xl">
                    <form className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">
                        {/* Điểm đến */}
                        <div className="lg:col-span-3">
                            <label
                                htmlFor="destination"
                                className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                                Điểm đến
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="destination"
                                    placeholder="Bạn muốn đi đâu?"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        {/* Ngày khởi hành */}
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="date"
                                className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                                Ngày khởi hành
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    id="date"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        {/* Thời gian */}
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="duration"
                                className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                                Thời gian
                            </label>
                            <select
                                id="duration"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            >
                                <option>Tất cả</option>
                                <option>1-3 ngày</option>
                                <option>4-6 ngày</option>
                                <option>7+ ngày</option>
                            </select>
                        </div>
                        {/* Số khách */}
                        <div className="lg:col-span-1">
                            <label
                                htmlFor="guests"
                                className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                                Số khách
                            </label>
                            <input
                                type="number"
                                id="guests"
                                placeholder="2"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        {/* Nút tìm kiếm */}
                        <div className="lg:col-span-2 flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                            >
                                <FaSearch />
                                Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// === PHẦN 2: TOURS NỔI BẬT ===
// (Không thay đổi)
function TourCard({ tour }: { tour: Tour }) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="relative">
                <Link to={`/tours/${tour.tourID}`} className="block h-64">
                    <img
                        src={tour.imageURL}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                {tour.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Giảm {tour.discountPercentage}%
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-primary text-secondary-dark text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {tour.tourTypeName?.toLowerCase().replace("tour ", "")}
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                        <FaStar className="text-primary" />
                        <span className="font-medium">{tour.averageRating}</span>
                        <span className="text-gray-500">({tour.reviewCount} đánh giá)</span>
                    </div>
                    <span>{`${tour.durationDays} ngày ${tour.durationNights} đêm`}</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-dark mb-2 h-14 line-clamp-2">
                    <Link to={`/tours/${tour.tourID}`} className="hover:text-blue-600 transition">
                        {tour.title}
                    </Link>
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {tour.destinationName}
                </div>
                <div className="flex items-baseline justify-end gap-2">
                    {tour.finalPrice < tour.priceAdult && (
                        <span className="text-gray-500 line-through text-md">
                            {formatCurrency(tour.priceAdult)}
                        </span>
                    )}
                    <span className="text-2xl font-bold text-red-600">
                        {formatCurrency(tour.finalPrice)}
                    </span>
                </div>
                <div className="flex gap-3 mt-5">
                    <Link
                        to={`/tours/${tour.tourID}`}
                        className="flex-1 text-center bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition"
                    >
                        Xem chi tiết
                    </Link>
                    <button className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
// (Không thay đổi)
function FeaturedTours() {
    const { data: toursData, isLoading } = useQuery({
        queryKey: ["featuredTours"],
        queryFn: tourApi.getFeaturedTours,
    });

    const tours = toursData?.data.content || [];

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-secondary-dark mb-4">
                    Tours Nổi Bật
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Khám phá những điểm đến tuyệt vời nhất Việt Nam với các tour được lựa chọn kỹ
                    lưỡng
                </p>
                {isLoading ? (
                    <div className="text-center">Đang tải...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((tour) => (
                            <TourCard key={tour.tourID} tour={tour} />
                        ))}
                    </div>
                )}
                <div className="text-center mt-12">
                    <Link
                        to="/tours"
                        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Xem tất cả tours
                    </Link>
                </div>
            </div>
        </div>
    );
}

// === PHẦN 3: ĐIỂM ĐẾN PHỔ BIẾN ===
// (Không thay đổi)
function DestinationCard({ destination }: { destination: Destination }) {
    return (
        <Link
            to={`/tours?destination_id=${destination.destinationID}`}
            className="relative rounded-lg overflow-hidden h-96 shadow-lg group"
        >
            <img
                src={destination.imageURLs[0]}
                alt={destination.nameDes}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-4 right-4 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                {destination.tourCount} tours
            </div>
            <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-bold mb-1">{destination.nameDes}</h3>
                <p className="text-lg">{destination.tourCount} tours có sẵn</p>
            </div>
            <div className="absolute bottom-6 right-6 bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <FaChevronRight size={20} />
            </div>
        </Link>
    );
}
// (Không thay đổi)
function PopularDestinations() {
    const { data: destinationsData, isLoading } = useQuery({
        queryKey: ["popularDestinations"],
        queryFn: destinationApi.getPopularDestinations,
    });

    const destinations = destinationsData?.data || [];

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-secondary-dark mb-4">
                    Điểm Đến Phổ Biến
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Khám phá những vùng đất đẹp nhất Việt Nam với hàng trăm tour đa dạng
                </p>
                {isLoading ? (
                    <div className="text-center">Đang tải...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.slice(0, 6).map((dest) => (
                            <DestinationCard key={dest.destinationID} destination={dest} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// === PHẦN 4: TẠI SAO CHỌN CHÚNG TÔI (CẬP NHẬT) ===
// (Không thay đổi)
const features = [
    {
        icon: FaShieldAlt,
        title: "Đảm Bảo Chất Lượng",
        desc: "Cam kết cung cấp dịch vụ và tour chất lượng cao, chuyên nghiệp.",
        background: "#dbeafe", // bg-blue-100
        color: "#2563eb", // text-blue-600
    },
    {
        icon: FaTag,
        title: "Giá Cả Hợp Lý",
        desc: "Mức giá cạnh tranh và minh bạch, không phát sinh chi phí ẩn.",
        background: "#dcfce7", // bg-green-100
        color: "#16a34a", // text-green-600
    },
    {
        icon: FaHeadset,
        title: "Hỗ Trợ 24/7",
        desc: "Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
        background: "#e0e7ff", // bg-indigo-100
        color: "#4f46e5", // text-indigo-600
    },
    {
        icon: FaSyncAlt,
        title: "Lịch Trình Linh Hoạt",
        desc: "Thiết kế tour linh hoạt, có thể thay đổi theo yêu cầu của khách hàng.",
        background: "#fef3c7", // bg-amber-100
        color: "#d97706", // text-amber-700
    },
    {
        icon: FaUserGraduate,
        title: "Đội Ngũ Chuyên Nghiệp",
        desc: "Hướng dẫn viên địa phương am hiểu, giàu kinh nghiệm và nhiệt tình.",
        background: "#f1f5f9", // bg-slate-100
        color: "#475569", // text-slate-600
    },
    {
        icon: FaStar,
        title: "Trải Nghiệm Đáng Nhớ",
        desc: "Tạo ra những kỷ niệm đẹp và trải nghiệm khó quên cho chuyến đi.",
        background: "#fce7f3", // bg-pink-100
        color: "#db2777", // text-pink-600
    },
];

// (Không thay đổi)
const stats = [
    {
        icon: FaRegStar,
        value: "10+",
        label: "Năm kinh nghiệm",
        background: "#dbeafe",
        color: "#2563eb",
    },
    {
        icon: FaCheckCircle,
        value: "98%",
        label: "Khách hàng hài lòng",
        background: "#dcfce7",
        color: "#16a34a",
    },
    {
        icon: FaUserGraduate,
        value: "50+",
        label: "Hướng dẫn viên",
        background: "#f3e8ff",
        color: "#9333ea",
    },
    {
        icon: FaTag,
        value: "25+",
        label: "Giải thưởng",
        background: "#ffedd5",
        color: "#ea580c",
    },
];

// (Không thay đổi)
function WhyChooseUs() {
    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-secondary-dark mb-4">
                    Tại Sao Chọn Chúng Tôi?
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những trải nghiệm tuyệt
                    vời nhất
                </p>

                {/* 6 Lợi ích với màu động */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center"
                        >
                            <div
                                className="rounded-full p-4 mb-5 inline-flex"
                                style={{
                                    backgroundColor: feature.background,
                                    color: feature.color,
                                }}
                            >
                                <feature.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-secondary-dark mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Thanh thống kê với màu động */}
                <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center">
                                <div
                                    className="rounded-full p-4 mb-4 inline-flex"
                                    style={{
                                        backgroundColor: stat.background,
                                        color: stat.color,
                                    }}
                                >
                                    <stat.icon size={28} />
                                </div>
                                <span className="text-4xl font-bold" style={{ color: stat.color }}>
                                    {stat.value}
                                </span>
                                <p className="text-gray-600 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// === PHẦN 5: TRẢI NGHIỆM ĐỘC ĐÁO (MỚI) ===
// (Không thay đổi)
function UniqueExperience() {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-secondary-dark mb-4">
                    Trải Nghiệm Độc Đáo
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Chúng tôi không chỉ bán tour, chúng tôi mang đến những trải nghiệm
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <Link
                        to="/tours"
                        className="relative h-96 rounded-lg overflow-hidden shadow-lg group"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                            alt="Du Lịch Mạo Hiểm"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <div className="bg-blue-600 text-white rounded-full p-3 mb-3 inline-flex">
                                <FaLeaf size={24} />
                            </div>
                            <h3 className="text-3xl font-bold mb-1">Du Lịch Mạo Hiểm</h3>
                            <p className="text-lg">Khám phá giới hạn của bản thân</p>
                        </div>
                    </Link>
                    {/* Card 2 */}
                    <Link
                        to="/tours"
                        className="relative h-96 rounded-lg overflow-hidden shadow-lg group"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop"
                            alt="Khám Phá Ẩm Thực"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <div className="bg-primary bg-amber-500 text-secondary-dark rounded-full p-3 mb-3 inline-flex">
                                <FaUserFriends size={24} />
                            </div>
                            <h3 className="text-3xl font-bold mb-1">Khám Phá Ẩm Thực</h3>
                            <p className="text-lg">Thưởng thức hương vị địa phương</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// === PHẦN 6: BLOG DU LỊCH (MỚI) ===
// (Không thay đổi)
const blogPosts = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop",
        date: "25 Tháng 10, 2025",
        title: "10 địa điểm không thể bỏ qua khi đến Hà Giang",
        link: "/blog/1",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop",
        date: "20 Tháng 10, 2025",
        title: "Kinh nghiệm du lịch Phú Quốc từ A đến Z",
        link: "/blog/2",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop",
        date: "15 Tháng 10, 2025",
        title: "Ẩm thực đường phố Sài Gòn: Ăn gì, ở đâu?",
        link: "/blog/3",
    },
];

// (Không thay đổi)
function BlogCard({
    post,
}: {
    post: { id: number; image: string; date: string; title: string; link: string };
}) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <Link to={post.link} className="block h-56">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </Link>
            <div className="p-5">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-secondary-dark mb-4 h-14 line-clamp-2">
                    <Link to={post.link} className="hover:text-blue-600 transition">
                        {post.title}
                    </Link>
                </h3>
                <Link
                    to={post.link}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-2"
                >
                    Đọc thêm <FaArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

// (Không thay đổi)
function TravelBlog() {
    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-secondary-dark mb-4">
                    Blog Du Lịch
                </h2>
                <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Cập nhật những tin tức, cẩm nang và kinh nghiệm du lịch mới nhất
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// === PHẦN 7: KHÁCH HÀNG NÓI GÌ ===
// (Không thay đổi)
const testimonialData = [
    {
        id: 1,
        quote: "Tour Hạ Long cực kỳ tuyệt vời! Dịch vụ chu đáo, hướng dẫn viên nhiệt tình. Chắc chắn sẽ quay lại!",
        image: "https://i.pravatar.cc/100?img=12",
        name: "Nguyễn Minh Anh",
        tour: "Tour Hạ Long Bay Luxury Cruise",
    },
    {
        id: 2,
        quote: "Chuyến đi Đà Nẵng - Hội An rất ưng ý. Khách sạn đẹp, đồ ăn ngon, lịch trình hợp lý. Cảm ơn TripBee.",
        image: "https://i.pravatar.cc/100?img=5",
        name: "Trần Văn Hùng",
        tour: "Tour Đà Nẵng - Hội An 4N3Đ",
    },
    {
        id: 3,
        quote: "Mình đã đặt tour đi Phú Quốc cho cả gia đình. Ai cũng hài lòng. Dịch vụ của các bạn rất chuyên nghiệp.",
        image: "https://i.pravatar.cc/100?img=32",
        name: "Lê Thị Bích",
        tour: "Tour Phú Quốc 3N2Đ",
    },
];

// (Không thay đổi)
const testimonialStats = [
    {
        icon: FaRegStar,
        value: "4.8/5",
        label: "Đánh giá trung bình",
    },
    {
        icon: FaSyncAlt,
        value: "85%",
        label: "Khách hàng quay lại",
    },
    {
        icon: FaThumbsUp,
        value: "92%",
        label: "Giới thiệu bạn bè",
    },
];

// (Không thay đổi)
function Testimonials() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? testimonialData.length - 1 : currentSlide - 1);
    };

    const nextSlide = () => {
        setCurrentSlide(currentSlide === testimonialData.length - 1 ? 0 : currentSlide + 1);
    };

    return (
        <div
            className="relative py-20 bg-gray-800 text-white z-10"
            style={{
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1531685253026-700b907f9011?q=80&w=2070&auto=format&fit=crop)",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
            }}
        >
            <div className="absolute inset-0 bg-gray-900/70" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-4">
                    Khách Hàng Nói Gì Về Chúng Tôi
                </h2>
                <p className="text-lg text-center text-gray-300 mb-12 max-w-2xl mx-auto">
                    Những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch vụ của chúng tôi
                </p>
                <div className="bg-white text-gray-800 max-w-3xl mx-auto rounded-lg shadow-xl p-10 md:p-12 text-center relative overflow-hidden min-h-[420px]">
                    {/* Nút lùi */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition z-10"
                        aria-label="Đánh giá trước"
                    >
                        <FaArrowLeft />
                    </button>
                    {/* Nút tới */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition z-10"
                        aria-label="Đánh giá kế tiếp"
                    >
                        <FaArrowRight />
                    </button>

                    {/* Nội dung Testimonial */}
                    {testimonialData.map((item, index) => (
                        <div
                            key={item.id}
                            className={`transition-opacity duration-500 ease-in-out ${
                                index === currentSlide ? "opacity-100" : "opacity-0 absolute"
                            }`}
                        >
                            {index === currentSlide && (
                                <>
                                    <FaQuoteLeft className="text-5xl text-gray-200 mb-6 mx-auto" />
                                    <p className="text-xl md:text-2xl italic text-gray-700 leading-relaxed min-h-[100px]">
                                        "{item.quote}"
                                    </p>
                                    <div className="mt-8">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200"
                                        />
                                        <h4 className="text-xl font-bold text-secondary-dark">
                                            {item.name}
                                        </h4>
                                        <p className="text-gray-500">{item.tour}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Dấu chấm */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                        {testimonialData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full ${
                                    index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                                } transition`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* (Mới) Thống kê Testimonial */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12 text-center">
                    {testimonialStats.map((stat) => (
                        <div key={stat.label}>
                            <div className="text-blue-400 mb-3 inline-flex">
                                <stat.icon size={36} />
                            </div>
                            <span className="block text-4xl font-bold text-white">
                                {stat.value}
                            </span>
                            <p className="text-gray-300 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// === (CẬP NHẬT) PHẦN 8: NHẬN THÔNG TIN ===

// (Mới) Dữ liệu cho 3 lợi ích của Newsletter
const newsletterBenefits = [
    {
        icon: FaGift,
        title: "Ưu đãi độc quyền",
        desc: "Nhận các ưu đãi đặc biệt chỉ dành cho thành viên đăng ký.",
    },
    {
        icon: FaBell,
        title: "Thông báo sớm",
        desc: "Biết thông tin về các tour mới và khuyến mãi trước bất kỳ ai.",
    },
    {
        icon: FaBookOpen,
        title: "Cẩm nang du lịch",
        desc: "Những bài viết, mẹo vặt và cẩm nang hữu ích cho chuyến đi.",
    },
];

// (Cập nhật) Toàn bộ component Newsletter
function Newsletter() {
    return (
        <div
            className="py-20 bg-blue-600 text-white relative overflow-hidden"
            // (Mới) Thêm hình ảnh núi mờ làm nền
            // Bạn cần thêm ảnh 'mountain-silhouette.png' vào thư mục /public/
            style={{
                backgroundImage: "url('/hero.jpg')",
                backgroundPosition: "bottom center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% auto",
            }}
        >
            {/* (Mới) Lớp phủ màu xanh để đảm bảo text đọc được và che ảnh nền */}
            <div className="absolute inset-0 bg-blue-500/85" />

            {/* Container nội dung */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* (Cập nhật) Icon Envelope trong vòng tròn */}
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <FaEnvelope size={32} />
                </div>

                <h2 className="text-4xl font-bold mb-4">Nhận Thông Tin Tours Mới Nhất</h2>
                <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                    Đăng ký nhận bản tin để không bỏ lỡ những tour du lịch hấp dẫn và ưu đãi đặc
                    biệt từ chúng tôi
                </p>

                {/* (Cập nhật) Form đăng ký */}
                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        placeholder="Nhập email của bạn..."
                        // (Cập nhật) Nền trắng, bo tròn, chữ đen
                        className="bg-white flex-grow px-5 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-primary-light focus:outline-none min-w-0"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 flex-shrink-0"
                    >
                        Đăng ký
                    </button>
                </form>

                {/* (Mới) Disclaimer */}
                <p className="text-xs text-blue-100 mt-4 max-w-xl mx-auto">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <Link to="/privacy" className="font-semibold underline hover:text-white">
                        Chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi.
                </p>

                {/* (Mới) 3 Lợi ích */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
                    {newsletterBenefits.map((item) => (
                        <div key={item.title} className="flex flex-col items-center p-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                                <item.icon size={22} />
                            </div>
                            <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                            <p className="text-blue-100 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// === COMPONENT CHÍNH: HOMESCREEN (CẬP NHẬT THỨ TỰ) ===
export default function HomeScreen() {
    return (
        <div className="bg-white">
            <HeroSection />
            <FeaturedTours />
            <PopularDestinations />
            <WhyChooseUs />
            {/* (Mới) */}
            <UniqueExperience />
            {/* (Mới) */}
            <TravelBlog />
            <Testimonials />
            <Newsletter />
        </div>
    );
}
