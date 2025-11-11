  import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tourAdminApi } from "../../apis/tourAdmin.api";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { omitBy, isUndefined } from "lodash";
import { tourTypeApi } from "../../../apis/tourType.api";
import type { TourListAdminParams } from "../../../types/tour";

// Nếu chưa có type TourType riêng thì dùng tạm:
type TourType = {
  tourTypeID: string;
  nameType: string;
};

// ==== Kiểu dữ liệu cho query param ====
type ParsedTourParams = {
  page: number;
  size: number;
  search?: string;
  tour_type_id?: string;
  status?: string;
};

// ==== Map trạng thái sang tiếng Việt ====
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  PAUSE: "Tạm dừng",
  SOLD_OUT: "Hết chỗ",
  COMPLETED: "Hoàn thành",
};

// ==== Màu trạng thái ====
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSE: "bg-yellow-100 text-yellow-700",
  SOLD_OUT: "bg-red-100 text-red-700",
  COMPLETED: "bg-gray-200 text-gray-700",
};

// ==== Hàm parse URLSearchParams -> object ====
const parseSearchParams = (searchParams: URLSearchParams): ParsedTourParams => {
  const params = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    size: searchParams.get("size") ? Number(searchParams.get("size")) : 10,
    search: searchParams.get("search") || undefined,
    tour_type_id: searchParams.get("tour_type_id") || undefined,
    status: searchParams.get("status") || undefined,
  };
  return omitBy(params, isUndefined) as ParsedTourParams;
};

export default function ManageTourScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = parseSearchParams(searchParams);
  const navigate = useNavigate();

  // === Lấy danh sách tour admin ===
  const { data, isLoading } = useQuery({
    queryKey: ["admin-tours", queryParams],
    queryFn: () =>
      tourAdminApi
        .getAllTours(queryParams as TourListAdminParams)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  // === Lấy danh sách loại tour cho combobox ===
  const {
    data: tourTypes,
    isLoading: isLoadingTypes,
  } = useQuery<TourType[]>({
    queryKey: ["tourTypes"],
    queryFn: () => tourTypeApi.getTourTypes().then((res) => res.data),
  });

  const tours = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number || 0;

  // thay đổi trang
  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page };
    setSearchParams(newParams as any);
  };

  const handleCreate = () => {
    navigate("/admin/tours/new"); // đường dẫn form tạo mới
  };

  const handleEdit = (tourId: string) => {
    navigate(`/admin/tours/${tourId}/edit`); // đường dẫn form edit
  };

  const handleDetail = (tourId: string) => {
    navigate(`/admin/tours/details/${tourId}`); // hoặc route detail mà bạn đang dùng
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tour</h1>
          <p className="text-gray-500 mt-1">
            Danh sách tour hiện có trong hệ thống
          </p>
        </div>
        <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all active:scale-95">
          + Tạo tour mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        {/* Search theo tên tour */}
        <input
          type="text"
          placeholder="Tìm kiếm tour..."
          defaultValue={queryParams.search || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const newParams = {
                ...queryParams,
                search: e.currentTarget.value || undefined,
                page: 0,
              };
              setSearchParams(newParams as any);
            }
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Filter theo loại tour */}
        <select
          className="border border-gray-300 rounded-lg p-2 min-w-[180px]"
          value={queryParams.tour_type_id || ""}
          onChange={(e) => {
            const raw = e.target.value;
            const value = raw || undefined;

            const newParams = omitBy(
              {
                ...queryParams,
                tour_type_id: value,
                page: 0,
              },
              (v) => v === undefined || v === ""
            );

            setSearchParams(newParams as any);
          }}
        >
          <option value="">Tất cả loại tour</option>
          {isLoadingTypes && <option disabled>Đang tải loại tour...</option>}
          {!isLoadingTypes &&
            tourTypes?.map((type) => (
              <option key={type.tourTypeID} value={type.tourTypeID}>
                {type.nameType}
              </option>
            ))}
        </select>


        {/* Filter theo trạng thái */}
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 min-w-[180px]"
          value={queryParams.status || ""}
          onChange={(e) => {
            const raw = e.target.value;
            const value = raw || undefined;

            const newParams = omitBy(
              {
                ...queryParams,
                status: value,
                page: 0,
              },
              (v) => v === undefined || v === ""
            );

            setSearchParams(newParams as any);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="PAUSE">Tạm dừng</option>
          <option value="SOLD_OUT">Hết chỗ</option>
          <option value="COMPLETED">Hoàn thành</option>
        </select>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-center font-bold text-black">
                Tour
              </th>
              <th className="px-5 py-3 font-bold text-black">Điểm đến</th>
              <th className="px-5 py-3 text-center font-bold text-black">
                Giá
              </th>
              <th className="px-5 py-3 text-center font-bold text-black">
                Thời gian
              </th>
              <th className="px-5 py-3 text-center font-bold text-black">
                Trạng thái
              </th>
              <th className="px-5 py-3 text-center font-bold text-black">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              tours.map((tour: any) => {
                const label =
                  STATUS_LABELS[tour.status] || tour.status;
                const color =
                  STATUS_COLORS[tour.status] ||
                  "bg-gray-100 text-gray-700";
                return (
                  <tr
                    key={tour.tourID}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={tour.imageURL}
                          alt={tour.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {tour.title}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {tour.tourTypeName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {tour.destinationName}
                    </td>
                    <td className="px-5 py-4 text-center text-sm">
                      <div className="font-semibold text-gray-900 text-sm">
                        {tour.priceAdult?.toLocaleString()}đ
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-sm">
                      {tour.durationDays} ngày{" "}
                      {tour.durationNights} đêm
                    </td>
                    <td className="px-5 py-4 text-center text-sm">
                      <span
                        className={`px-3 py-1.5 rounded-full font-medium ${color}`}
                      >
                        {label}
                      </span>
                    </td>

                    {/* Xem chi tiết */}
                    <td className="px-5 py-4 text-center text-sm">
                      <div className="inline-flex gap-2">
                        
                        <button
                          onClick={() => handleDetail(tour.tourID)}
                          className="border border-gray-400 text-gray-600 rounded-lg p-2 hover:bg-gray-50"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Chỉ hiện nút sửa nếu chưa COMPLETED */}
                        {tour.status !== "COMPLETED" && (
                          <button
                            onClick={() => handleEdit(tour.tourID)}
                            className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}

                        {/* Xóa (tùy rule, nếu cũng muốn khóa khi COMPLETED thì thêm điều kiện tương tự) */}
                        {/* <button className="border border-red-500 text-red-500 rounded-lg p-2 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>

          <span className="text-gray-700 font-medium">
            Trang {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
