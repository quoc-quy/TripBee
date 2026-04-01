import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Popover from '../Popover'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../../apis/auth.api'
import userImage from '../../assets/user.png'

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hiệu ứng đổi màu header khi scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  const handleLogout = () => logoutMutation.mutate()
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm py-2'
          : 'bg-white border-b border-gray-100 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* --- Logo --- */}
        <Link
          to="/"
          className="flex items-center gap-2 group transform transition-transform hover:scale-105"
        >
          <img src="/Logo-TripBee.png" alt="TripBee Logo" className="w-16 drop-shadow-sm" />
        </Link>

        {/* --- Menu Điều Hướng (Desktop) --- */}
        <div className="hidden lg:flex items-center gap-2 font-medium">
          {[
            { path: '/', label: 'Trang chủ' },
            { path: '/tours', label: 'Tours' },
            { path: '/about', label: 'Về chúng tôi' },
            { path: '/contact', label: 'Liên hệ' }
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* --- Account/Auth & Mobile Toggle --- */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <Popover
                renderPopover={
                  <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 w-64 text-sm overflow-hidden transform transition-all p-2">
                    <div className="flex flex-col gap-1 text-left">
                      <Link
                        to="/account/profile"
                        className="flex gap-3 items-center px-4 py-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300 mb-2"
                      >
                        <img
                          src={userImage}
                          alt="User avatar"
                          className="w-11 h-11 object-cover rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-bold text-gray-900 truncate">
                            {profile?.userID || 'User'}
                          </span>
                          <span className="text-xs text-gray-500 truncate">{profile?.email}</span>
                        </div>
                      </Link>
                      <Link
                        to="/account/profile"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 cursor-pointer font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                }
              >
                <img
                  src={userImage}
                  alt="User avatar"
                  className="w-10 h-10 cursor-pointer object-cover rounded-full ring-2 ring-gray-100 hover:ring-blue-500 transition-all shadow-sm"
                />
              </Popover>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-expanded={isMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

        {/* --- Mobile Menu --- */}
        <div
          className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-xl lg:hidden transition-all duration-300 origin-top ${
            isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col p-4 space-y-2 font-medium">
            {[
              { path: '/', label: 'Trang chủ' },
              { path: '/tours', label: 'Tours' },
              { path: '/destinations', label: 'Điểm đến' },
              { path: '/about', label: 'Về chúng tôi' },
              { path: '/contact', label: 'Liên hệ' }
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="border-t border-gray-100 my-2"></div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account/profile"
                  onClick={toggleMenu}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block text-center px-4 py-3 rounded-xl bg-gray-50 text-gray-800 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="block text-center px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
