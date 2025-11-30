import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { omitBy, isUndefined } from "lodash";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { tourTypeAdminApi1 } from "../../apis/tourTypeAdmin.api";
import type {
  TourTypeAdmin,
  TourTypeAdminListParams,
} from "../../types/tourTypeAdmin";

type ParsedTourTypeParams = {
  page: number;
  size: number;
  search?: string;
};

const parseSearchParams = (
  searchParams: URLSearchParams
): ParsedTourTypeParams => {
  const params = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    size: searchParams.get("size") ? Number(searchParams.get("size")) : 10,
    search: searchParams.get("search") || undefined,
  };
  return omitBy(params, isUndefined) as ParsedTourTypeParams;
};

const ManageTourTypeScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParams = parseSearchParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tour-types", queryParams],
    queryFn: () =>
      tourTypeAdminApi1
        .getAdminTourTypes(queryParams as TourTypeAdminListParams)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const tourTypes: TourTypeAdmin[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number ?? 0;

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page };
    setSearchParams(newParams as any);
  };

  const updateParams = (patch: Partial<ParsedTourTypeParams>) => {
    const merged = omitBy(
      {
        ...queryParams,
        ...patch,
      },
      (v) => v === undefined || v === ""
    );
    setSearchParams(merged as any);
  };

  const handleCreate = () => {
    navigate("/admin/tour-types/new");
  };

  const handleDetail = (id: string) => {
    navigate(`/admin/tour-types/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/tour-types/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại tour này?")) return;
    try {
      await tourTypeAdminApi1.deleteTourType(id);
      // reload current page
      updateParams({ page: currentPage });
    } catch (err) {
      alert("Xóa không thành công. Kiểm tra ràng buộc dữ liệu (đang có tour dùng loại này?).");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý loại tour
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Danh sách loại tour trong hệ thống
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
        >
          + Thêm loại tour
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên loại tour..."
          defaultValue={queryParams.search || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams({
                search: e.currentTarget.value || undefined,
                page: 0,
              });
            }
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-200 text-gray-600 uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-bold text-black">Tên loại tour</th>
              <th className="px-5 py-3 font-bold text-black">
                Mô tả ngắn
              </th>
              <th className="px-5 py-3 font-bold text-black text-center">
                Số tour dùng loại này
              </th>
              <th className="px-5 py-3 font-bold text-black text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tourTypes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  Không có loại tour phù hợp.
                </td>
              </tr>
            ) : (
              tourTypes.map((t) => (
                <tr
                  key={t.tourTypeID}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {t.nameType}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-700 line-clamp-2">
                    {t.description || "-"}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {t.totalTours}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleDetail(t.tourTypeID)}
                        className="border border-gray-400 text-gray-600 rounded-lg p-2 hover:bg-gray-50"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(t.tourTypeID)}
                        className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                     
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 text-sm">
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageTourTypeScreen;
