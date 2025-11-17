import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userAdminApi } from "../../apis/userAdmin.api";
import { toast } from "react-toastify";

export default function UserEditAdminScreen() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phoneNumber: "",
        locked: false
    });

    // GET USER DETAIL
    const { data, isLoading } = useQuery({
        queryKey: ["admin-user-detail", id],
        queryFn: () => userAdminApi.getUserDetail(id).then((res) => res.data),
    });

    // Gán dữ liệu vào form khi load API xong
    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                phoneNumber: data.phoneNumber || "",
                locked: data.locked || false,
            });
        }
    }, [data]);

    // UPDATE USER
    const updateMutation = useMutation({
        mutationFn: (payload: any) =>
            userAdminApi.updateUser(id, payload).then((res) => res.data),

        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            navigate("/admin/users");
        },

        onError: () => {
            toast.error("Cập nhật thất bại!");
        },
    });

    const handleUpdate = () => {
        updateMutation.mutate({
            name: form.name,
            phoneNumber: form.phoneNumber,
            locked: form.locked,
        });
    };

    if (isLoading || !data) {
        return (
            <div className="p-6">
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <button className="text-blue-500" onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Chỉnh sửa người dùng</h1>

                <div className="space-y-6">

                    {/* TÊN */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Tên</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    {/* SĐT */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Số điện thoại</label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2"
                            value={form.phoneNumber}
                            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        />
                    </div>

                    {/* TRẠNG THÁI */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Trạng thái</label>
                        <select
                            className="w-full border rounded-lg px-4 py-2"
                            value={form.locked ? "true" : "false"}
                            onChange={(e) =>
                                setForm({ ...form, locked: e.target.value === "true" })
                            }
                        >
                            <option value="false">Hoạt động</option>
                            <option value="true">Khóa tài khoản</option>
                        </select>
                    </div>

                    {/* NÚT LƯU */}
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

// import React, { useEffect, useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { userAdminApi } from "../../apis/userAdmin.api";
// import { toast } from "react-toastify";

// export default function UserEditAdminScreen() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["user-detail", id],
//     queryFn: () => userAdminApi.getUserDetail(id!),
//   });

//   const user = data?.data;

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     locked: false,
//     role: "",
//     createdAt: "",
//     updatedAt: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setForm({
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber || "",
//         locked: user.locked,
//         role: user.role,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       });
//     }
//   }, [user]);

//   const mutation = useMutation({
//     mutationFn: () =>
//       userAdminApi.updateUser(id!, {
//         name: form.name,
//         phoneNumber: form.phoneNumber,
//         locked: form.locked,
//       }),

//     onSuccess: () => {
//       queryClient.invalidateQueries(["user-detail"]);
//       queryClient.invalidateQueries(["adminUsers"]);
//       toast.success("Cập nhật thành công!");
//       navigate(-1);
//     },

//     onError: () => toast.error("Cập nhật thất bại!"),
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutation.mutate();
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen text-sm">
//       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6">
//         <ArrowLeft size={18} />
//         Quay lại
//       </button>

//       <div className="bg-white p-6 rounded-2xl shadow max-w-2xl mx-auto">
//         <h1 className="text-xl font-semibold mb-4">Chỉnh sửa người dùng</h1>

//         {isLoading ? (
//           <p>Đang tải...</p>
//         ) : (
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* NAME */}
//             <div>
//               <label className="block font-medium mb-1">Tên</label>
//               <input
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="border px-3 py-2 rounded-lg w-full"
//               />
//             </div>

//             {/* EMAIL (readonly) */}
//             <div>
//               <label className="block font-medium mb-1">Email</label>
//               <input
//                 value={form.email}
//                 disabled
//                 className="border px-3 py-2 rounded-lg w-full bg-gray-100"
//               />
//             </div>

//             {/* PHONE */}
//             <div>
//               <label className="block font-medium mb-1">SĐT</label>
//               <input
//                 value={form.phoneNumber}
//                 onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//                 className="border px-3 py-2 rounded-lg w-full"
//               />
//             </div>

//             {/* LOCKED */}
//             <div>
//               <label className="block font-medium mb-1">Trạng thái</label>
//               <select
//                 value={form.locked ? "locked" : "active"}
//                 onChange={(e) =>
//                   setForm({ ...form, locked: e.target.value === "locked" })
//                 }
//                 className="border px-3 py-2 rounded-lg w-full"
//               >
//                 <option value="active">Hoạt động</option>
//                 <option value="locked">Đã khóa</option>
//               </select>
//             </div>

//             {/* ROLE readonly */}
//             <div>
//               <label className="block font-medium mb-1">Vai trò</label>
//               <input
//                 value={form.role}
//                 disabled
//                 className="border px-3 py-2 rounded-lg w-full bg-gray-100"
//               />
//             </div>

//             {/* CREATED AT */}
//             <div>
//               <label className="block font-medium mb-1">Ngày tạo</label>
//               <input
//                 value={form.createdAt}
//                 disabled
//                 className="border px-3 py-2 rounded-lg w-full bg-gray-100"
//               />
//             </div>

//             {/* UPDATED AT */}
//             <div>
//               <label className="block font-medium mb-1">Ngày cập nhật</label>
//               <input
//                 value={form.updatedAt}
//                 disabled
//                 className="border px-3 py-2 rounded-lg w-full bg-gray-100"
//               />
//             </div>

//             <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
//               Lưu thay đổi
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
