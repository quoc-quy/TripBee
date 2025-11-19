import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../../apis/booking.api";
import { formatCurrency } from "../../utils/utils";
import { ArrowLeft, CheckCircle, Copy, CreditCard, Loader2, Home } from "lucide-react";
import Button from "../../components/Button";
import { useEffect } from "react";
import { toast } from "react-toastify"; // Nếu dự án có react-toastify

export default function PaymentScreen() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Lấy thông tin Booking & TỰ ĐỘNG CẬP NHẬT (Polling)
    const { data: bookingData, isLoading } = useQuery({
        queryKey: ["booking", id],
        queryFn: () => bookingApi.getBookingById(id as string),
        enabled: !!id,
        // [QUAN TRỌNG] Logic Polling: Tự động gọi lại API mỗi 3 giây
        refetchInterval: (query) => {
            const status = query.state.data?.data?.status;
            // Nếu đã thanh toán xong (CONFIRMED) thì dừng polling
            if (status === "CONFIRMED" || status === "CANCELLED") return false;
            return 3000; // 3000ms = 3 giây
        },
    });

    const booking = bookingData?.data;

    // Hiển thị thông báo khi thanh toán thành công
    useEffect(() => {
        if (booking?.status === "CONFIRMED") {
            // Bạn có thể dùng toast hoặc alert tùy dự án
            // toast.success("Thanh toán thành công!");
        }
    }, [booking?.status]);

    // 2. Cấu hình mã QR (VietQR / SePay)
    const MY_BANK_ID = "MB"; // [TODO] Thay bằng ngân hàng của bạn (VD: MB, VCB)
    const MY_ACCOUNT_NO = "05139667799"; // [TODO] Thay bằng số tài khoản thật
    const TEMPLATE = "compact2";

    // Nội dung chuyển khoản = Booking ID (để Backend Webhook nhận diện)
    const transferContent = booking?.bookingID;
    const amount = booking?.finalAmount;

    // Link tạo QR động
    const qrUrl = `https://img.vietqr.io/image/${MY_BANK_ID}-${MY_ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${transferContent}&accountName=TRIPBEE`;

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    if (!booking)
        return (
            <div className="text-center pt-20 text-lg text-gray-500">Không tìm thấy đơn hàng.</div>
        );

    // GIAO DIỆN KHI THANH TOÁN THÀNH CÔNG
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

    // GIAO DIỆN THANH TOÁN (QR CODE)
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
                            <p className="text-gray-600 mb-4">
                                Vui lòng thanh toán để hoàn tất thủ tục đặt tour. Đơn hàng sẽ tự
                                động xác nhận sau khi thanh toán.
                            </p>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-mono font-bold text-blue-700">
                                        {booking.bookingID}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className="font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-sm animate-pulse">
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
                                <p className="text-gray-500 text-sm mb-4 text-center">
                                    Sử dụng App ngân hàng (Mobile Banking)
                                </p>

                                {/* Mã QR */}
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

                                {/* Thông tin chuyển khoản thủ công */}
                                <div className="w-full bg-gray-50 p-3 rounded-lg text-sm space-y-2 border border-dashed border-gray-300">
                                    <p className="font-semibold text-gray-700 text-center mb-1">
                                        Thông tin chuyển khoản:
                                    </p>
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
                                        <Loader2 className="animate-spin mr-1" size={14} />
                                        Đang chờ xác nhận thanh toán...
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
