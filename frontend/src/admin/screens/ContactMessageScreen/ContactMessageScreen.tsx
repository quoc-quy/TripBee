import React, { useState, useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search, Mail, Phone, Calendar, User } from "lucide-react";
import { contactAdminApi } from "../../apis/contactAdmin.api";
import { debounce } from "lodash"; // Import debounce từ lodash

// Helper để lấy ID an toàn
const getMessageId = (msg: any) => msg.contactMessId || msg.id || "";

const ContactMessageScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // State riêng cho input để gõ mượt hơn
  const [page, setPage] = useState(0);
  const SIZE = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-contact-messages", page, searchTerm],
    queryFn: () =>
      contactAdminApi
        .getAllMessages({
          page,
          size: SIZE,
          search: searchTerm,
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const messages = useMemo(() => {
    const list = data?.content || [];
    return [...list].sort((a, b) => {
      const idA = getMessageId(a);
      const idB = getMessageId(b);
      return idA.localeCompare(idB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [data]);

  const totalPages = data?.totalPages || 0;

  // (CẬP NHẬT) Sử dụng debounce của lodash để tối ưu việc gọi API
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(0);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Cập nhật UI ngay lập tức
    debouncedSearch(value); // Trì hoãn việc set searchTerm (gọi API)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tin nhắn liên hệ</h1>
        <p className="text-gray-500">
          Quản lý danh sách tin nhắn từ khách hàng
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={inputValue} // Bind vào state inputValue
            placeholder="Tìm theo ID, email, phone..."
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b border-gray-200 uppercase text-gray-600 text-xs font-bold">
              <tr>
                <th className="px-4 py-4 w-24 whitespace-nowrap">ID</th>
                <th className="px-4 py-4 w-64">Liên hệ (Email / Phone)</th>
                <th className="px-4 py-4 w-32">User ID</th>
                <th className="px-4 py-4">Nội dung tin nhắn</th>
                <th className="px-4 py-4 w-48 whitespace-nowrap">
                  Thời gian gửi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không có tin nhắn nào.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={getMessageId(msg) || Math.random()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID Column */}
                    <td className="px-4 py-4 font-bold text-gray-700">
                      {getMessageId(msg) || (
                        <span className="text-red-400 text-xs">(Null)</span>
                      )}
                    </td>

                    {/* Email & Phone */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div
                          className="flex items-center gap-2 text-gray-700"
                          title={msg.email}
                        >
                          <Mail
                            size={14}
                            className="text-blue-500 flex-shrink-0"
                          />
                          <span className="truncate max-w-[180px]">
                            {msg.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone
                            size={14}
                            className="text-green-500 flex-shrink-0"
                          />
                          <span>{msg.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* User ID / Type */}
                    <td className="px-4 py-4 text-gray-600">
                      {msg.email.toLowerCase().startsWith("guest") ? (
                        <span className="text-gray-400 italic text-xs bg-gray-100 px-2 py-1 rounded-md">
                          Khách vãng lai
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-max text-xs font-medium">
                          <User size={12} />
                          <span>Thành viên</span>
                        </div>
                      )}
                    </td>

                    {/* Content */}
                    <td className="px-4 py-4">
                      <p
                        className="text-gray-800 line-clamp-2 text-sm"
                        title={msg.message}
                      >
                        {msg.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="flex-shrink-0" />
                        <span className="text-xs">
                          {msg.sentAt
                            ? new Date(msg.sentAt).toLocaleString("vi-VN")
                            : "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>
          <span className="text-gray-700 font-medium">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactMessageScreen;
