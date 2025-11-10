// frontend-demo/src/components/TourBookingSection/TourBookingSection.tsx

// (1. THÊM) Import useState
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Calendar, Users, DollarSign, Heart } from "lucide-react";
import type { TourDetails } from "../..//types/tour";
import { formatCurrency } from "../..//utils/utils";
import Button from "../..//components/Button";
// (2. THÊM) Import Modal
import BookingModal from "../BookingModal";

interface Props {
    tour: TourDetails;
}

interface BookingFormData {
    adults: number;
    children: number;
    totalPrice: number;
}

export default function TourBookingSection({ tour }: Props) {
    // (3. THÊM) State để quản lý modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // (Giữ nguyên) react-hook-form
    const {
        control,
        watch,
        setValue,
        // (4. SỬA) không cần handleSubmit ở đây nữa
        // handleSubmit,
        getValues, // Dùng getValues để lấy dữ liệu cho modal
        formState: { errors },
    } = useForm<BookingFormData>({
        defaultValues: {
            adults: 1,
            children: 0,
            totalPrice: tour.finalPriceAdult,
        },
    });

    const adults = watch("adults");
    const children = watch("children");
    const totalPrice = watch("totalPrice"); // (5. THÊM) Theo dõi totalPrice

    useEffect(() => {
        const adultPrice = tour.finalPriceAdult || 0;
        const childPrice = tour.finalPriceChild || 0;
        const total = adults * adultPrice + children * childPrice;
        setValue("totalPrice", total);
    }, [adults, children, tour.finalPriceAdult, tour.finalPriceChild, setValue]);

    // (6. SỬA) Xóa hàm onSubmit cũ

    // (7. THÊM) Hàm mở modal
    const handleOpenBookingModal = () => {
        // Kiểm tra lỗi trước khi mở
        // (Đây là một cách đơn giản, bạn có thể triggerValidate nếu muốn)
        if (errors.adults || errors.children) {
            return;
        }
        setIsModalOpen(true);
    };

    const handleFavorite = () => {
        console.log("Tour added to favorites:", tour.tourID);
    };

    const maxParticipants = tour.maxParticipants || 20;

    return (
        // (8. SỬA) Bỏ thẻ <form> và onSubmit
        <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Đặt tour ngay</h2>

            {/* ... (Tất cả các phần input, giá tiền, tổng cộng... giữ nguyên) ... */}
            <div className="mb-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                        <Users size={18} className="mr-2 text-blue-500" />
                        Giá người lớn:
                    </span>
                    <span className="font-semibold text-lg text-gray-900">
                        {formatCurrency(tour.finalPriceAdult)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                        <Users size={16} className="mr-2 text-blue-500" />
                        Giá trẻ em:
                    </span>
                    <span className="font-semibold text-lg text-gray-900">
                        {formatCurrency(tour.finalPriceChild)}
                    </span>
                </div>
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

            {/* Chọn số lượng khách (Giữ nguyên) */}
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

            {(errors.adults || errors.children) && (
                <div className="mb-4 text-sm text-red-600">
                    {errors.adults?.message || errors.children?.message}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khởi hành
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md flex items-center text-gray-700">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    {tour.startDate} (còn {tour.maxParticipants - (adults + children)} chỗ)
                </div>
            </div>

            <div className="flex justify-between items-center mb-5 p-4 bg-blue-50 rounded-lg">
                <span className="text-lg font-semibold text-gray-700 flex items-center">
                    <DollarSign size={20} className="mr-2" />
                    Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalPrice)}
                </span>
            </div>

            <div className="space-y-3">
                {/* (9. SỬA) Nút Đặt Tour giờ sẽ mở Modal */}
                <Button
                    type="button" // Sửa thành type="button"
                    className="w-full text-lg font-semibold py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-300 ease-in-out"
                    disabled={!!errors.adults || !!errors.children}
                    onClick={handleOpenBookingModal} // Thêm onClick
                >
                    Đặt Tour
                </Button>

                {/* Nút Yêu thích (Giữ nguyên) */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full text-lg py-3"
                    onClick={handleFavorite}
                >
                    <Heart size={20} className="mr-2" />
                    Yêu Thích
                </Button>
            </div>

            {/* (10. THÊM) Render Modal (nó sẽ ở trạng thái ẩn cho đến khi isOpen={true}) */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tour={tour}
                bookingDetails={{
                    adults: adults,
                    children: children,
                    totalPrice: totalPrice,
                }}
            />
        </div>
    );
}
