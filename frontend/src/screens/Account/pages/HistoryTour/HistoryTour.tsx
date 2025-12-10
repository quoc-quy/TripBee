import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { bookingApi } from "../../../../apis/booking.api";
import { formatCurrency } from "../../../../utils/utils";
import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ReviewButton } from "../../../../components/ReviewButton/ReviewButton";
import { Button } from "../../../../components/ui/button";

const StatusBadge = ({ status }: { status: string }) => {
    let classes = "";
    let text = "";

    switch (status) {
        case "COMPLETED":
            classes = "bg-green-100 text-green-700";
            text = "Hoàn thành";
            break;
        case "CONFIRMED":
            classes = "bg-blue-100 text-blue-700";
            text = "Đã xác nhận";
            break;
        case "PROCESSING":
            classes = "bg-yellow-100 text-yellow-700";
            text = "Đang xử lý";
            break;
        case "CANCELED":
            classes = "bg-red-100 text-red-700";
            text = "Đã hủy";
            break;
        case "CANCELLATION_REQUESTED":
            classes = "bg-orange-100 text-orange-700";
            text = "Chờ duyệt hủy";
            break;
        default:
            classes = "bg-gray-100 text-gray-500";
            text = "Không rõ";
    }

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>
    );
};

export default function HistoryTour() {
    const [confirmBookingId, setConfirmBookingId] = useState<string | null>(null);

    const {
        data: historyData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["bookingHistory"],
        queryFn: bookingApi.getBookingHistory,
    });

    const bookings = historyData?.data || [];

    if (isLoading) {
        return (
            <div className="text-center p-8">
                <span className="text-gray-600">Đang tải lịch sử đặt tour...</span>
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 text-center p-8">Lỗi khi tải lịch sử đặt tour</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 border-b pb-3">
                Lịch sử đặt Tour ({bookings.length})
            </h3>

            {bookings.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                    <FaCalendarAlt size={32} className="mx-auto mb-4" />
                    Bạn chưa có lịch sử đặt tour nào
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.bookingID}
                            className="border rounded-xl overflow-hidden md:flex"
                        >
                            <div className="md:w-1/4 h-48">
                                <img
                                    src={booking.tourImageURL}
                                    alt={booking.tourTitle}
                                    onError={(e) =>
                                        (e.currentTarget.src =
                                            "https://placehold.co/400x300?text=Tour")
                                    }
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4 md:w-3/4 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xl font-bold mb-2">
                                        <Link
                                            to={`/tours/${booking.tourID}`}
                                            className="hover:text-blue-600"
                                        >
                                            {booking.tourTitle}
                                        </Link>
                                    </h4>

                                    <div className="flex text-sm text-gray-600 gap-4">
                                        <div className="flex items-center gap-1">
                                            <FaCalendarAlt />
                                            {booking.bookingDate}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaUsers />
                                            {booking.numAdults} Lớn, {booking.numChildren} Bé
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t pt-3 mt-3">
                                    <div>
                                        <div className="text-sm text-gray-500">Tổng tiền</div>
                                        <div className="text-xl font-bold text-red-600">
                                            {formatCurrency(booking.finalAmount)}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {booking.bookingID}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={booking.status} />

                                        {(booking.status === "PROCESSING" ||
                                            booking.status === "CONFIRMED") && (
                                            <Button
                                                variant="destructive"
                                                className="text-white"
                                                size="sm"
                                                onClick={() =>
                                                    setConfirmBookingId(booking.bookingID)
                                                }
                                            >
                                                Hủy Tour
                                            </Button>
                                        )}

                                        <ReviewButton
                                            tourId={booking.tourID}
                                            tourTitle={booking.tourTitle}
                                            status={booking.status}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL XÁC NHẬN HỦY */}
            {confirmBookingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl w-[360px] p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Xác nhận hủy tour</h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Bạn có chắc muốn yêu cầu hủy tour này không
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setConfirmBookingId(null)}>
                                Không
                            </Button>

                            <Button
                                variant="destructive"
                                className="text-white"
                                onClick={async () => {
                                    await bookingApi.requestCancelBooking(confirmBookingId);
                                    setConfirmBookingId(null);
                                    refetch();
                                }}
                            >
                                Đồng ý hủy
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
