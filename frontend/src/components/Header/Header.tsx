import React from "react";
import { Link, NavLink } from "react-router-dom";
import Popover from "../Popover";

export default function Header() {
    return (
        <div className="flex justify-around items-center w-full bg-white text-black px-3 py-3 border">
            <Link to="/" className="hover:text-[#2663ec]">
                <img src="Logo-TripBee.png" alt="" className="w-16" />
            </Link>
            <div className="flex gap-10 font-semibold">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "text-[#2663ec]" : "hover:text-[#2663ec]"
                    }
                >
                    Trang chủ
                </NavLink>
                <NavLink
                    to="/tours"
                    className={({ isActive }) =>
                        isActive ? "text-[#2663ec]" : "hover:text-[#2663ec]"
                    }
                >
                    Tours
                </NavLink>
                <NavLink
                    to="/destinations"
                    className={({ isActive }) =>
                        isActive ? "text-[#2663ec]" : "hover:text-[#2663ec]"
                    }
                >
                    Điểm đến
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        isActive ? "text-[#2663ec]" : "hover:text-[#2663ec]"
                    }
                >
                    Về chúng tôi
                </NavLink>
                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        isActive ? "text-[#2663ec]" : "hover:text-[#2663ec]"
                    }
                >
                    Liên hệ
                </NavLink>
                <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                        isActive ? "text-[#2663ec]" : "hover:text-[#2663ec]"
                    }
                >
                    Admin
                </NavLink>
            </div>
            <div>
                <div className="flex gap-10">
                    <div className="col-span-1 justify-self-start">
                        <Popover
                            renderPopover={
                                <div className="bg-white relative shadow-md rounded-sm border border-gray-200 w-48 text-md">
                                    <div className="flex flex-col gap-2 text-left mt-2 mb-2">
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Đăng ký
                                        </Link>
                                        <div className="border-t border-gray-200 my-2"></div>
                                        <Link
                                            to="/account"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Hồ sơ
                                        </Link>
                                        <Link
                                            to="/tours"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            Đặc tour
                                        </Link>
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex hover:text-[#2663ec] font-semibold gap-2 cursor-pointer items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                    />
                                </svg>
                                Tài khoản
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    );
}
