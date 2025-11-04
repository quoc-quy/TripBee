import { useState } from "react"; // (Mới) Thêm useState
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // (Mới) Thêm icons

const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/tours", label: "Tours" },
    { to: "/destinations", label: "Điểm đến" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/contact", label: "Liên hệ" },
];

export default function Header() {
    // (Mới) State để quản lý menu mobile
    const [isOpen, setIsOpen] = useState(false);

    const activeClass = "text-primary font-semibold";
    const inactiveClass = "text-gray-700 hover:text-primary transition-colors";

    return (
        // (Tối ưu) Thêm 'sticky top-0 z-50' để fix lỗi bị đè
        <header className="bg-white py-4 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" onClick={() => setIsOpen(false)}>
                        <img src="/Logo-TripBee.png" alt="TripBee Logo" className="h-12" />
                    </Link>

                    {/* Nav Links (Desktop) */}
                    <nav className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    isActive ? activeClass : inactiveClass
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-primary font-medium transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Đăng ký
                        </Link>
                    </div>

                    {/* (Mới) Nút Hamburger (Mobile) */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-800 focus:outline-none"
                            aria-label="Mở menu"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* (Mới) Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out transform ${
                    isOpen
                        ? "translate-y-0 opacity-100 visible"
                        : "-translate-y-4 opacity-0 invisible"
                } z-40`} // z-40 để nằm dưới header (z-50) nhưng trên mọi thứ khác
            >
                <nav className="flex flex-col p-4">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `py-3 px-3 rounded-md text-lg ${
                                    isActive ? activeClass : inactiveClass
                                }`
                            }
                            onClick={() => setIsOpen(false)} // Tự động đóng khi click
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                {/* Auth Buttons (Mobile) */}
                <div className="flex flex-col gap-3 p-4 border-t border-gray-100">
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center bg-gray-100 text-gray-800 px-5 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Đăng ký
                    </Link>
                </div>
            </div>
        </header>
    );
}
