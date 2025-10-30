import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"; // Cần cài đặt react-icons: npm install react-icons

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "Tất cả Tours", href: "#" },
        { name: "Điểm đến hot", href: "#" },
        { name: "Hướng dẫn đặt tour", href: "#" },
        { name: "Cẩm nang du lịch", href: "#" },
        { name: "Khuyến mãi", href: "#" },
    ];

    const supportLinks = [
        { name: "Liên hệ", href: "#" },
        { name: "Câu hỏi thường gặp", href: "#" },
        { name: "Điều khoản dịch vụ", href: "#" },
        { name: "Chính sách bảo mật", href: "#" },
        { name: "Chính sách hoàn tiền", href: "#" },
    ];

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img src="Logo-TripBee.png" alt="" className="w-20" />
                        </div>
                        <p className="text-sm text-gray-400">
                            Khám phá vẻ đẹp Việt Nam cùng chúng tôi. Chúng tôi cung cấp những tour
                            du lịch chất lượng cao với dịch vụ tận tâm và giá cả hợp lý.
                        </p>
                        <div className="flex space-x-3 mt-4">
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300"
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 transition duration-300"
                                aria-label="Twitter"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 transition duration-300"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition duration-300"
                                aria-label="Youtube"
                            >
                                <FaYoutube />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm">
                            {supportLinks.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-start">
                                <svg
                                    className="h-5 w-5 mr-3 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0zM12 13a3 3 0 100-6 3 3 0 000 6z"
                                    />
                                </svg>
                                <p>123 Đường Lê Lợi, Quận 1, TP.HCM, Việt Nam</p>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="h-5 w-5 mr-3 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-3.957c-1.398 0-2.67-1.144-4.123-2.616C8.204 15.658 6 12.593 6 8.5V5a2 2 0 012-2z"
                                    />
                                </svg>
                                <p>+84 901 234 567</p>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="h-5 w-5 mr-3 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h14a2 2 0 012 2z"
                                    />
                                </svg>
                                <p>info@travelviet.com</p>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="h-5 w-5 mr-3 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p>24/7 hỗ trợ khách hàng</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-400">
                    <p>&copy; {currentYear} TravelViet. Tất cả quyền được bảo lưu</p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <p>Made with Readdy</p>
                        <div className="flex space-x-2">
                            <div className="bg-white p-1 rounded">
                                <span className="text-gray-900 font-bold text-xs">VISA</span>
                            </div>
                            <div className="bg-white p-1 rounded">
                                <span className="text-gray-900 font-bold text-xs">MASTER</span>
                            </div>
                            <div className="bg-white p-1 rounded">
                                <span className="text-gray-900 font-bold text-xs">MOMO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
