import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../../apis/booking.api";
import { formatCurrency } from "../../utils/utils";
import { ArrowLeft, CheckCircle, Copy, CreditCard, Loader2, Home, ClockAlert } from "lucide-react";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PaymentScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState(false);

    // 1. Lấy thông tin Booking & TỰ ĐỘNG CẬP NHẬT (Polling)
    const { data: bookingData, isLoading } = useQuery({
        queryKey: ["booking", id],
        queryFn: () => bookingApi.getBookingById(id as string),
        enabled: !!id && !isExpired, // Ngừng polling nếu đã hết hạn
        refetchInterval: (query) => {
            const status = query.state.data?.data?.status;
            // Nếu CONFIRMED, CANCELLED hoặc đã hết hạn thì dừng
            if (status === "CONFIRMED" || status === "CANCELLED" || isExpired) return false;
            return 3000;
        },
    });

    const booking = bookingData?.data;

    // 2. Logic ĐẾM NGƯỢC 3 PHÚT
    useEffect(() => {
        if (!booking || booking.status === "CONFIRMED") return;

        // Tính thời gian hết hạn: Thời gian tạo + 3 phút
        const bookingTime = new Date(booking.bookingDate).getTime(); // Đảm bảo bookingDate là chuỗi ISO chuẩn
        const expireTime = bookingTime + 1 * 60 * 1000; // 3 phút = 180000ms

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = Math.floor((expireTime - now) / 1000);

            if (distance <= 0) {
                setTimeLeft(0);
                setIsExpired(true);
                clearInterval(interval);
            } else {
                setTimeLeft(distance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [booking]);

    // Format giây thành mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );

    // TRƯỜNG HỢP: Không tìm thấy hoặc Hết hạn
    if (!booking || isExpired || booking.status === "CANCELLED") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ClockAlert className="text-red-600 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đơn hàng hết hạn!</h2>
                    <p className="text-gray-600 mb-6">
                        Thời gian thanh toán (3 phút) đã kết thúc. Đơn hàng <b>{id}</b> đã bị hủy tự
                        động.
                    </p>
                    <Button
                        onClick={() => navigate("/")}
                        className="w-full bg-gray-600 hover:bg-gray-700"
                    >
                        <Home className="mr-2" size={18} /> Về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    // TRƯỜNG HỢP: Thanh toán thành công
    if (booking.status === "CONFIRMED") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Thanh toán thành công!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Cảm ơn bạn đã đặt tour. Mã đơn hàng <b>{booking.bookingID}</b> đã được xác
                        nhận.
                    </p>
                    <Button onClick={() => navigate("/")} className="w-full">
                        <Home className="mr-2" size={18} /> Về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    // Cấu hình QR
    const MY_BANK_ID = "MB";
    const MY_ACCOUNT_NO = "05139667799";
    const TEMPLATE = "compact2";
    const transferContent = booking.bookingID;
    const amount = booking.finalAmount;
    const qrUrl = `https://img.vietqr.io/image/${MY_BANK_ID}-${MY_ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${transferContent}&accountName=TRIPBEE`;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
                >
                    <ArrowLeft size={20} className="mr-2" /> Quay về trang chủ
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CỘT TRÁI: Thông tin đơn hàng */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <CreditCard className="text-blue-600 mr-2" />
                                Thông tin thanh toán
                            </h2>

                            {/* ĐỒNG HỒ ĐẾM NGƯỢC */}
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center animate-pulse">
                                <p className="text-red-700 font-medium mb-1">
                                    Vui lòng thanh toán trong vòng
                                </p>
                                <div className="text-4xl font-bold text-red-600">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-mono font-bold text-blue-700">
                                        {booking.bookingID}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-sm">
                                        Đang chờ thanh toán...
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">
                                Chi tiết dịch vụ
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tour du lịch</span>
                                    <span className="font-medium text-gray-900 text-right w-2/3">
                                        {booking.tourName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Ngày đặt</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Số lượng</span>
                                    <span className="font-medium text-gray-900">
                                        {booking.numAdults} Người lớn, {booking.numChildren} Trẻ em
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tổng tiền</span>
                                    <span className="font-bold text-blue-700 text-lg">
                                        {formatCurrency(booking.finalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: Quét mã QR */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden sticky top-6">
                            <div className="bg-blue-600 p-4 text-white text-center">
                                <h3 className="font-bold text-lg flex justify-center items-center">
                                    Quét mã QR để thanh toán
                                </h3>
                            </div>
                            <div className="p-6 flex flex-col items-center">
                                <div className="bg-white p-2 border rounded-lg shadow-inner mb-4">
                                    <img
                                        src={qrUrl}
                                        alt="QR Payment"
                                        className="w-full h-auto max-w-[250px] object-contain"
                                    />
                                </div>
                                <div className="text-center mb-6">
                                    <p className="text-gray-500 text-sm">Số tiền thanh toán</p>
                                    <p className="text-3xl font-bold text-blue-700">
                                        {formatCurrency(booking.finalAmount)}
                                    </p>
                                </div>
                                <div className="w-full bg-gray-50 p-3 rounded-lg text-sm space-y-2 border border-dashed border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Ngân hàng:</span>
                                        <span className="font-medium">{MY_BANK_ID}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Số TK:</span>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2">
                                                {MY_ACCOUNT_NO}
                                            </span>
                                            <Copy
                                                size={14}
                                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                onClick={() =>
                                                    navigator.clipboard.writeText(MY_ACCOUNT_NO)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Nội dung:</span>
                                        <span className="font-bold text-red-600">
                                            {transferContent}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 w-full text-center">
                                    <div className="flex items-center justify-center text-xs text-blue-600">
                                        <Loader2 className="animate-spin mr-1" size={14} /> Đang chờ
                                        xác nhận thanh toán...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
