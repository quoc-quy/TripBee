import http from "../../utils/http";
import type { DashboardStats } from "../types/dashboard.type";

export const dashboardApi = {
    getStats: () => http.get<DashboardStats>("/admin/dashboard/stats"),

    // API mới để xuất báo cáo (trả về Blob/File)
    exportBookings: () =>
        http.get("/admin/dashboard/export", {
            responseType: "blob",
        }),
};
