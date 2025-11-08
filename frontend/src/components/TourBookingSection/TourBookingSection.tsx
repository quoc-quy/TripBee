// frontend-demo/src/components/TourBookingSection/TourBookingSection.tsx

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Calendar, Users, DollarSign, CheckCircle } from "lucide-react";
import type { TourDetails } from "../..//types/tour";
import { formatCurrency } from "../..//utils/utils";
import Button from "../..//components/Button";

interface Props {
    tour: TourDetails;
}

interface BookingFormData {
    adults: number;
    children: number;
    totalPrice: number;
}

export default function TourBookingSection({ tour }: Props) {
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<BookingFormData>({
        defaultValues: {
            adults: 1,
            children: 0,
            totalPrice: tour.finalPriceAdult, // <-- (CẬP NHẬT) Đặt giá trị mặc định là giá cuối cùng
        },
    });

    const adults = watch("adults");
    const children = watch("children");

    // (CẬP NHẬT) Sử dụng finalPriceAdult và finalPriceChild để tính toán
    useEffect(() => {
        const adultPrice = tour.finalPriceAdult || 0;
        const childPrice = tour.finalPriceChild || 0;
        const total = adults * adultPrice + children * childPrice;
        setValue("totalPrice", total);
    }, [adults, children, tour.finalPriceAdult, tour.finalPriceChild, setValue]);

    const onSubmit = (data: BookingFormData) => {
        console.log("Booking data:", data);
        // TODO: Xử lý logic đặt tour, ví dụ: gọi API, chuyển trang
    };

    const maxParticipants = tour.maxParticipants || 20; // Giả sử mặc định 20 nếu API không trả về

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-xl sticky top-24"
        >
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Đặt tour ngay</h2>

            {/* Hiển thị giá */}
            <div className="mb-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                        <Users size={18} className="mr-2 text-blue-500" />
                        Giá người lớn:
                    </span>
                    {/* (CẬP NHẬT) Hiển thị finalPriceAdult */}
                    <span className="font-semibold text-lg text-gray-900">
                        {formatCurrency(tour.finalPriceAdult)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                        <Users size={16} className="mr-2 text-blue-500" />
                        Giá trẻ em:
                    </span>
                    {/* (CẬP NHẬT) Hiển thị finalPriceChild */}
                    <span className="font-semibold text-lg text-gray-900">
                        {formatCurrency(tour.finalPriceChild)}
                    </span>
                </div>
                {/* Hiển thị giá gốc nếu có khuyến mãi */}
                {tour.priceAdult > tour.finalPriceAdult && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Giá gốc (người lớn):</span>
                        <span className="text-gray-500 line-through">
                            {formatCurrency(tour.priceAdult)}
                        </span>
                    </div>
                )}
            </div>

            <hr className="my-4" />

            {/* Chọn số lượng khách */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="adults"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Người lớn
                    </label>
                    <Controller
                        name="adults"
                        control={control}
                        rules={{
                            min: { value: 1, message: "Phải có ít nhất 1 người lớn" },
                            validate: (value) =>
                                value + children <= maxParticipants ||
                                `Tổng số khách không vượt quá ${maxParticipants}`,
                        }}
                        render={({ field }) => (
                            <input
                                type="number"
                                id="adults"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                min="1"
                                max={maxParticipants}
                            />
                        )}
                    />
                </div>
                <div>
                    <label
                        htmlFor="children"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Trẻ em
                    </label>
                    <Controller
                        name="children"
                        control={control}
                        rules={{
                            min: { value: 0, message: "Số lượng không thể âm" },
                            validate: (value) =>
                                adults + value <= maxParticipants ||
                                `Tổng số khách không vượt quá ${maxParticipants}`,
                        }}
                        render={({ field }) => (
                            <input
                                type="number"
                                id="children"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                min="0"
                                max={maxParticipants - adults}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Hiển thị lỗi */}
            {(errors.adults || errors.children) && (
                <div className="mb-4 text-sm text-red-600">
                    {errors.adults?.message || errors.children?.message}
                </div>
            )}

            {/* Hiển thị ngày (chỉ hiển thị, không cho chọn) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khởi hành
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md flex items-center text-gray-700">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    {tour.startDate} (còn {tour.maxParticipants - (adults + children)} chỗ)
                </div>
            </div>

            {/* Tổng cộng */}
            <div className="flex justify-between items-center mb-5 p-4 bg-blue-50 rounded-lg">
                <span className="text-lg font-semibold text-gray-700 flex items-center">
                    <DollarSign size={20} className="mr-2" />
                    Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(watch("totalPrice"))}
                </span>
            </div>

            {/* Nút đặt tour */}
            <Button
                type="submit"
                className="w-full text-lg font-semibold py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
                disabled={!!errors.adults || !!errors.children}
            >
                Đặt Tour
            </Button>
        </form>
    );
}
