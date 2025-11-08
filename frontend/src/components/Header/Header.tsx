import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Popover from "../Popover";
import { AppContext } from "../../contexts/app.context";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../apis/auth.api";

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } =
    useContext(AppContext);
  // Thêm state cho mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="top-0 fixed z-50 flex justify-between items-center w-full bg-white text-black px-4 lg:px-12 py-3 border border-b-gray-300">
      {/* --- Logo --- */}
      <Link to="/" className="hover:text-[#2663ec]">
        <img src="Logo-TripBee.png" alt="" className="w-16" />
      </Link>

      {/* --- Menu Điều Hướng (Chỉ hiển thị trên màn hình lớn) --- */}
      <div className="hidden lg:flex gap-10 font-semibold">
        {/* NavLinks giữ nguyên */}
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

      {/* --- Account/Auth & Mobile Menu Toggle --- */}
      <div className="flex items-center gap-4">
        {/* Popover cho User/Auth (Luôn hiển thị) */}
        <div className="hidden lg:block">
          {" "}
          {/* Ẩn Popover trên mobile, chỉ hiện icon */}
          <div className="col-span-1 justify-self-start">
            {/* ... giữ nguyên logic Popover cho isAuthenticated và !isAuthenticated ... */}
            {isAuthenticated && (
              <Popover
                renderPopover={
                  <div className="bg-white relative shadow-md rounded-sm border border-gray-200 w-60 text-md">
                    <div className="flex flex-col gap-2 text-left mt-2 mb-2">
                      <Link
                        to="/me"
                        className="flex gap-2 items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <img
                          src="src/assets/user.png"
                          alt=""
                          className="w-10 h-10 cursor-pointer object-cover"
                        />
                        <div className="flex flex-col min-w-0 w-40">
                          <span className="font-bold line-clamp-1">
                            {profile?.userID}
                          </span>
                          <span className="line-clamp-1 block max-w-full">
                            {profile?.email}
                          </span>
                        </div>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <Link
                        to="/me"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Hồ sơ
                      </Link>
                      <Link
                        to="/tours"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Đặt tour
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="block text-left px-4 py-2 cursor-pointer font-semibold text-red-500 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                }
              >
                <img
                  src="src/assets/user.png"
                  alt=""
                  className="w-10 h-10 cursor-pointer object-cover rounded-full" // Thay đổi kích thước và thêm `rounded-full` cho đẹp hơn
                />
              </Popover>
            )}
            {!isAuthenticated && (
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
            )}
          </div>
        </div>

        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>
      <div
        id="mobile-menu"
        className={`absolute top-[68px] left-0 w-full bg-white border-b border-gray-200 mt-5 shadow-lg lg:hidden z-50 ${isMenuOpen ? "block" : "hidden"
          }`}
      >
        <div className="flex flex-col p-4 space-y-2 font-semibold">
          <NavLink
            to="/"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive
                ? "bg-[#2663ec] text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/tours"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive
                ? "bg-[#2663ec] text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Tours
          </NavLink>
          <NavLink
            to="/destinations"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive
                ? "bg-[#2663ec] text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Điểm đến
          </NavLink>
          <NavLink
            to="/about"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive
                ? "bg-[#2663ec] text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Về chúng tôi
          </NavLink>
          <NavLink
            to="/contact"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive
                ? "bg-[#2663ec] text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Liên hệ
          </NavLink>
          <NavLink
            to="/admin"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${isActive
                ? "bg-[#2663ec] text-white"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Admin
          </NavLink>

          <div className="border-t border-gray-200 pt-2 mt-2"></div>

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-full text-left px-3 py-2 rounded-md cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              Đăng xuất
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block text-center px-3 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block text-center px-3 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
