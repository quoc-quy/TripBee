import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { userAdminApi } from "../../apis/userAdmin.api";
import type { UserAdmin, UserAdminListParams } from "../../types/userAdmin.type";
import { Eye, Edit3 } from "lucide-react";

export default function ManageUserScreen() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const size = 10;

  const queryParams: UserAdminListParams = {
    page,
    size,
    search: search.trim() || undefined,
  };

  // LẤY LIST USERS
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", queryParams],
    queryFn: () => userAdminApi.getAllUsers(queryParams).then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const pageData = data;
  const users: UserAdmin[] = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const currentPage = pageData?.number || 0;

  // === LẤY THỐNG KÊ NGƯỜI DÙNG ===
  // const { data:  } = useQuery({
  //   queryKey: ["user-stats-summary"],
  //   queryFn: () => userAdminApi.getUserStatsSummary().then((res) => res.data),
  // });
const { data: statsData } = useQuery({
  queryKey: ["userStats"],
  queryFn: () => userAdminApi.getUserStats().then(res => res.data)
});

  const stats = statsData || {};

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
          <p className="text-gray-500 mt-1">Danh sách người dùng trong hệ thống</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setPage(0);
          }}
        />
      </div>

      {/* THỐNG KÊ NGƯỜI DÙNG */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        {/* Tổng người dùng */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 border border-gray-200">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20h5v-2a3 3 0 00-5.356-1.857M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold">{stats?.totalUsers ?? 0}</p>
            <p className="text-gray-600">Tổng người dùng</p>
          </div>
        </div>

        {/* Người dùng mới tháng này */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 border border-gray-200">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9l-6 6-3-3"/>
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold">{stats.newUsersThisMonth ?? 0}</p>
            <p className="text-gray-600">Mới tháng này</p>
          </div>
        </div>

        {/* Hoạt động */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 border border-gray-200">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold">{stats.activeUsers ?? 0}</p>
            <p className="text-gray-600">Đang hoạt động</p>
          </div>
        </div>

        {/* Đã khóa */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 border border-gray-200">
          <div className="p-4 bg-red-100 text-red-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.597 0 1.083-.49 1.083-1.083v-.834A1.083 1.083 0 0012 8a1.083 1.083 0 00-1.083 1.083v.834c0 .593.486 1.083 1.083 1.083zm0 8c-.597 0-1.083-.49-1.083-1.083v-.834c0-.593.486-1.083 1.083-1.083s1.083.49 1.083 1.083v.834c0 .593-.486 1.083-1.083 1.083zM19 15V9a7 7 0 10-14 0v6a7 7 0 0014 0z"/>
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold">{stats.lockedUsers ?? 0}</p>
            <p className="text-gray-600">Đã khóa</p>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-5 py-3 font-bold text-black">Tên</th>
              <th className="px-5 py-3 font-bold text-black">Email</th>
              {/* <th className="px-5 py-3 font-bold text-black">SĐT</th> */}
              <th className="px-5 py-3 font-bold text-black text-center">Trạng thái</th>
              <th className="px-5 py-3 font-bold text-black text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Không tìm thấy người dùng
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.userID} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-4">{u.name}</td>
                  <td className="px-5 py-4">{u.email}</td>
                  {/* <td className="px-5 py-4">{u.phoneNumber || "N/A"}</td> */}

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.locked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.locked ? "Đã khóa" : "Hoạt động"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/${u.userID}`)}
                        className="border border-gray-400 text-gray-600 rounded-lg p-2 hover:bg-gray-50"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => navigate(`/admin/users/${u.userID}/edit`)}
                        className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            ←
          </button>

          <span>Trang {currentPage + 1} / {totalPages}</span>

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}


// import React, { useState } from "react";
// import {
//     useQuery,
//     useMutation,
//     useQueryClient,
//     keepPreviousData
// } from "@tanstack/react-query";

// import { userAdminApi } from "../../apis/userAdmin.api";
// import type { UserAdmin, UserAdminListParams } from "../../types/userAdmin.type";

// import { FaSearch, FaEllipsisV } from "react-icons/fa";
// import { toast } from "react-toastify";
// import Button from "../../../components/Button";

// export default function ManageUserScreen() {
//     const queryClient = useQueryClient();
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(0);
//     const size = 10;

//     const queryParams: UserAdminListParams = {
//         page,
//         size,
//         search: search.trim() || undefined
//     };

//     const { data, isLoading } = useQuery({
//         queryKey: ["adminUsers", queryParams],
//         queryFn: () => userAdminApi.getAllUsers(queryParams),
//         placeholderData: keepPreviousData,
//     });

//     const pageData = data?.data;

//     const users: UserAdmin[] =
//         pageData?.content?.map((u) => ({
//             ...u,
//             isLocked: u.locked
//         })) || [];

//     const totalPages = pageData?.totalPages || 0;
//     const currentPage = pageData?.number || 0;

//     const lockMutation = useMutation({
//         mutationFn: ({ userId, lock }: { userId: string; lock: boolean }) =>
//             userAdminApi.lockOrUnlockUser(userId, { lock }),

//         onSuccess: (data, variables) => {
//             queryClient.invalidateQueries({
//                 queryKey: ["adminUsers"],
//             });

//             const action = variables.lock ? "khóa" : "mở khóa";
//             toast.success(`Đã ${action} tài khoản thành công!`);
//         },

//         onError: (error) => {
//             toast.error(`Thao tác thất bại: ${(error as any).message}`);
//         },
//     });

//     const handleLock = (user: UserAdmin) => {
//         const newState = !user.isLocked;
//         if (
//             window.confirm(
//                 `Bạn chắc chắn muốn ${newState ? "KHÓA" : "MỞ KHÓA"} tài khoản ${user.email}?`
//             )
//         ) {
//             lockMutation.mutate({
//                 userId: user.userID,
//                 lock: newState
//             });
//         }
//     };

//     return (
//         <div className="p-8 bg-gray-50 min-h-screen">
//             <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>

//             {/* SEARCH */}
//             <form
//                 onSubmit={(e) => {
//                     e.preventDefault();
//                     setPage(0);
//                 }}
//                 className="flex gap-3 mb-6"
//             >
//                 <input
//                     type="text"
//                     className="border p-2 rounded w-full"
//                     placeholder="Tìm tên hoặc email..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Button>
//                     <FaSearch />
//                 </Button>
//             </form>

//             {/* TABLE */}
//             <div className="bg-white rounded shadow overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                     <thead className="bg-gray-200 text-sm">
//                         <tr>
//                             <th className="px-4 py-2">Tên</th>
//                             <th className="px-4 py-2">Email</th>
//                             <th className="px-4 py-2">SĐT</th>
//                             <th className="px-4 py-2">Trạng thái</th>
//                             <th className="px-4 py-2 text-right">Thao tác</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {isLoading ? (
//                             <tr>
//                                 <td colSpan={5} className="text-center p-4">
//                                     Đang tải...
//                                 </td>
//                             </tr>
//                         ) : users.length === 0 ? (
//                             <tr>
//                                 <td colSpan={5} className="text-center p-4 text-gray-500">
//                                     Không tìm thấy người dùng nào
//                                 </td>
//                             </tr>
//                         ) : (
//                             users.map((u) => (
//                                 <tr key={u.userID} className="border-t hover:bg-gray-50">
//                                     <td className="px-4 py-2">{u.name}</td>
//                                     <td className="px-4 py-2">{u.email}</td>
//                                     <td className="px-4 py-2">
//                                         {u.phoneNumber || "N/A"}
//                                     </td>

//                                     {/* STATUS */}
//                                     <td className="px-4 py-2">
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                                 u.isLocked
//                                                     ? "bg-red-100 text-red-700"
//                                                     : "bg-green-100 text-green-700"
//                                             }`}
//                                         >
//                                             {u.isLocked ? "Đã khóa" : "Hoạt động"}
//                                         </span>
//                                     </td>

//                                     {/* ACTION MENU */}
//                                     <td className="px-4 py-2 text-right relative group">

//                                         <button className="p-2 rounded hover:bg-gray-200">
//                                             <FaEllipsisV />
//                                         </button>

//                                         {/* MENU DROPDOWN */}
//                                         <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-md border w-40 z-20">

//                                             <button
//                                                 onClick={() => handleLock(u)}
//                                                 className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                                             >
//                                                 {u.isLocked ? "Mở khóa" : "Khóa tài khoản"}
//                                             </button>

//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//                 <div className="flex justify-center gap-4 mt-5">
//                     <Button
//                         variant="outline"
//                         disabled={currentPage === 0}
//                         onClick={() => setPage(currentPage - 1)}
//                     >
//                         Trang trước
//                     </Button>

//                     <span>
//                         Trang {currentPage + 1} / {totalPages}
//                     </span>

//                     <Button
//                         variant="outline"
//                         disabled={currentPage + 1 >= totalPages}
//                         onClick={() => setPage(currentPage + 1)}
//                     >
//                         Trang sau
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// }
