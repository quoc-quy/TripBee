import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="flex justify-around items-center w-full bg-white text-black px-3 py-3 border">
            <Link to="/" className="hover:text-[#2663ec]">
                <img src="Logo-TripBee.png" alt="" className="w-20" />
            </Link>
            <div className="flex gap-10 font-semibold">
                <Link to="/" className="hover:text-[#2663ec]">
                    Trang chủ
                </Link>
                <Link to="/tours" className="hover:text-[#2663ec]">
                    Tours
                </Link>
                <Link to="/destinations" className="hover:text-[#2663ec]">
                    Điểm đến
                </Link>
                <Link to="/about" className="hover:text-[#2663ec]">
                    Về chúng tôi
                </Link>
                <Link to="/contact" className="hover:text-[#2663ec]">
                    Liên hệ
                </Link>
                <Link to="/admin" className="hover:text-[#2663ec]">
                    Admin
                </Link>
            </div>
            <div>
                <div className="flex gap-10">
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 hover:stroke-[#2663ec] cursor-pointer"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
