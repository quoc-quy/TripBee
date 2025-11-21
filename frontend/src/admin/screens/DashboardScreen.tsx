import { useEffect, useState } from "react";
import { dashboardApi } from "../apis/dashboard.api";
import type { DashboardStats } from "../types/dashboard.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Đảm bảo bạn đã có component Button
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from "recharts";
import {
    DollarSign,
    Users,
    ShoppingBag,
    MessageSquareWarning,
    Loader2,
    Download,
    TrendingUp,
} from "lucide-react";

// Màu sắc cho biểu đồ tròn
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardScreen() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardApi.getStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Hàm xử lý xuất báo cáo
    const handleExportReport = async () => {
        try {
            setIsExporting(true);
            const response = await dashboardApi.exportBookings();

            // Tạo url giả để trình duyệt tải file về
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Bao_cao_Booking_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export report:", error);
            alert("Có lỗi xảy ra khi xuất báo cáo!");
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) return <div>Không có dữ liệu</div>;

    // Chuyển đổi dữ liệu Booking Status từ Object sang Array cho Recharts
    const bookingStatusData = Object.keys(stats.bookingStatusStats).map((key) => ({
        name: key,
        value: stats.bookingStatusStats[key],
    }));

    return (
        <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
            {/* HEADER: Tiêu đề + Nút Export */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                        Dashboard Tổng quan
                    </h2>
                </div>
                <Button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Xuất Báo Cáo (.csv)
                </Button>
            </div>

            {/* 1. SECTION: CÁC THẺ SỐ LIỆU (METRIC CARDS) - Đã thêm màu sắc */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Doanh thu - Gradient Xanh dương */}
                <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">
                            Tổng Doanh Thu
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalRevenue.toLocaleString("vi-VN")} ₫
                        </div>
                        <p className="text-xs text-blue-100 mt-1 opacity-80">
                            Đã thanh toán thành công
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Đơn hàng - Gradient Tím */}
                <Card className="border-none shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-100">
                            Đơn Đặt Tour
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-purple-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                        <p className="text-xs text-purple-100 mt-1 opacity-80">
                            Tổng số booking toàn hệ thống
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: Khách hàng - Gradient Cam */}
                <Card className="border-none shadow-md bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-100">
                            Khách Hàng
                        </CardTitle>
                        <Users className="h-4 w-4 text-orange-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-orange-100 mt-1 flex items-center gap-1 opacity-90">
                            <TrendingUp className="h-3 w-3" /> +{stats.newUsersThisMonth} khách hàng
                            mới tháng này
                        </p>
                    </CardContent>
                </Card>

                {/* Card 4: Cần xử lý - Gradient Hồng/Đỏ */}
                <Card className="border-none shadow-md bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-pink-100">
                            Cần Xử Lý
                        </CardTitle>
                        <MessageSquareWarning className="h-4 w-4 text-pink-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingContactMessages}</div>
                        <p className="text-xs text-pink-100 mt-1 opacity-80">
                            Tin nhắn liên hệ chưa đọc
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. SECTION: BIỂU ĐỒ (CHARTS) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Biểu đồ Miền: Xu hướng doanh thu (Chiếm 4 cột) */}
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Xu Hướng Doanh Thu (Năm nay)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={stats.revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={(value) => `T${value}`}
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value: number) => `${value / 1000000}M`}
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        value.toLocaleString("vi-VN") + " ₫"
                                    }
                                    labelFormatter={(label) => `Tháng ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Doanh thu"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Biểu đồ Tròn: Trạng thái Booking (Chiếm 3 cột) */}
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Tỷ Lệ Trạng Thái Đơn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={bookingStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {bookingStatusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* 3. SECTION: BIỂU ĐỒ CỘT (Full width) */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Top 5 Tour Doanh Thu Cao Nhất</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.topSellingTours}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="tourName"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value: string) =>
                                    value.length > 20 ? `${value.substring(0, 20)}...` : value
                                }
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value: number) => `${value / 1000000}M`}
                            />
                            <Tooltip
                                formatter={(value: number) => value.toLocaleString("vi-VN") + " ₫"}
                                cursor={{ fill: "transparent" }}
                            />
                            <Bar
                                dataKey="totalRevenue"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                name="Doanh thu"
                                barSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
