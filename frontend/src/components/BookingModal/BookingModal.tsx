import { createPortal } from "react-dom";
import { useContext, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Users, Baby, CreditCard, Store, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingApi } from "../../apis/booking.api";
import { getProfile } from "../../apis/auth.api";
import { toast } from "react-toastify"; // [MỚI] Import toast

import type { TourDetails } from "../../types/tour";
import type { BookingFormData } from "../../types/booking.type";
import { formatCurrency } from "../../utils/utils";
import Button from "../Button";
import { AppContext } from "../../contexts/app.context";

// --- Validation Schemas ---
const phoneRegex = /^[0-9]{10}$/;
const cccdRegex = /^[0-9]{12}$/;

const participantSchema = yup.object({
    name: yup.string().min(2, "Tên phải có ít nhất 2 ký tự").required("Họ tên là bắt buộc"),
    gender: yup.string().oneOf(["Nam", "Nữ", "Khác"]).required("Giới tính là bắt buộc"),
    phone: yup.string(),
    cccd: yup.string(),
});

const childParticipantSchema = participantSchema.shape({
    phone: yup
        .string()
        .matches(phoneRegex, { message: "SĐT phải đúng 10 số", excludeEmptyString: true })
        .optional(),
    cccd: yup
        .string()
        .matches(cccdRegex, { message: "CCCD phải đúng 12 số", excludeEmptyString: true })
        .optional(),
});

const adultParticipantSchema = participantSchema.shape({
    phone: yup.string().matches(phoneRegex, "SĐT phải đúng 10 số").required("SĐT là bắt buộc"),
    cccd: yup.string().matches(cccdRegex, "CCCD phải đúng 12 số").required("CCCD là bắt buộc"),
});

const bookingFormSchema = yup.object({
    bookerName: yup.string().min(2, "Tên phải có ít nhất 2 ký tự").required("Họ tên là bắt buộc"),
    bookerPhone: yup
        .string()
        .matches(phoneRegex, "SĐT phải đúng 10 số")
        .required("SĐT là bắt buộc"),
    bookerEmail: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
    note: yup.string().optional(),
    otherAdults: yup.array().of(adultParticipantSchema),
    children: yup.array().of(childParticipantSchema),
    // [MỚI] Validate phương thức thanh toán
    paymentMethod: yup
        .string()
        .oneOf(["QR", "COUNTER"])
        .required("Vui lòng chọn phương thức thanh toán"),
});

// --- Props cho Modal ---
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tour: TourDetails;
    bookingDetails: {
        adults: number;
        children: number;
        totalPrice: number;
    };
}

// --- Component Input Tùy Chỉnh ---
type FormInputProps = {
    label: string;
    id: string;
    register: ReturnType<(typeof useForm<BookingFormData>)["register"]>;
    error?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
};

const FormInput = ({
    label,
    id,
    register,
    error,
    type = "text",
    placeholder,
    required = false,
}: FormInputProps) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            {...register(id as any)}
            className={`w-full p-2.5 border rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 outline-none`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

type FormSelectProps = {
    label: string;
    id: string;
    register: ReturnType<(typeof useForm<BookingFormData>)["register"]>;
    error?: string;
    required?: boolean;
};

const FormSelect = ({ label, id, register, error, required = false }: FormSelectProps) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={id}
            {...register(id as any)}
            className={`w-full p-2.5 border rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
        >
            <option value="">Chọn...</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// --- Component Modal Chính ---
export default function BookingModal({ isOpen, onClose, tour, bookingDetails }: BookingModalProps) {
    const { isAuthenticated } = useContext(AppContext);
    const navigate = useNavigate();

    // Lấy thông tin user để điền sẵn vào form
    const { data: profileData } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getProfile,
        enabled: isAuthenticated,
    });
    const user = profileData?.data;

    // [MỚI] Cập nhật mutation để xử lý logic rẽ nhánh
    const createBookingMutation = useMutation({
        // mutationFn nhận vào payload chứa cả apiBody và paymentMethod (để dùng ở onSuccess)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (params: { apiBody: any; paymentMethod: string }) =>
            bookingApi.createBooking(params.apiBody),

        onSuccess: (response, variables) => {
            const bookingID = response.data.bookingID;
            const { paymentMethod } = variables;

            // 1. Đóng modal
            onClose();

            // 2. Xử lý theo phương thức thanh toán
            if (paymentMethod === "QR") {
                // Chuyển hướng sang trang thanh toán
                navigate(`/payment/${bookingID}`);
            } else {
                // Thanh toán tại quầy: Chỉ hiện thông báo thành công
                toast.success(
                    "Đặt tour thành công! Vui lòng đến quầy TripBee để hoàn tất thanh toán."
                );
                navigate("/account/historyTour"); // Có thể chuyển về lịch sử hoặc giữ nguyên trang
            }
        },
        onError: (error) => {
            console.error("Lỗi đặt tour:", error);
            toast.error("Đặt tour thất bại. Vui lòng kiểm tra lại thông tin hoặc thử lại sau!");
        },
    });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: yupResolver(bookingFormSchema),
        defaultValues: {
            bookerName: "",
            bookerPhone: "",
            bookerEmail: "",
            note: "",
            otherAdults: [],
            children: [],
            paymentMethod: "QR", // Mặc định chọn QR
        },
    });

    const {
        fields: adultFields,
        append: appendAdult,
        remove: removeAdults,
    } = useFieldArray({
        control,
        name: "otherAdults",
    });

    const {
        fields: childrenFields,
        append: appendChild,
        remove: removeChildren,
    } = useFieldArray({
        control,
        name: "children",
    });

    // Điền thông tin user vào form nếu đã đăng nhập
    useEffect(() => {
        if (user) {
            setValue("bookerName", user.name || "");
            setValue("bookerPhone", user.phoneNumber || "");
            setValue("bookerEmail", user.email || "");
        }
    }, [user, setValue]);

    // Logic cập nhật số lượng form người tham gia
    useEffect(() => {
        if (isOpen) {
            const requiredOtherAdults = Math.max(0, bookingDetails.adults - 1);
            const currentOtherAdults = adultFields.length;
            if (requiredOtherAdults > currentOtherAdults) {
                for (let i = 0; i < requiredOtherAdults - currentOtherAdults; i++) {
                    appendAdult({ name: "", cccd: "", gender: "", phone: "" });
                }
            } else if (requiredOtherAdults < currentOtherAdults) {
                removeAdults(
                    Array.from(
                        { length: currentOtherAdults - requiredOtherAdults },
                        (_, i) => i + requiredOtherAdults
                    )
                );
            }

            const requiredChildren = bookingDetails.children;
            const currentChildren = childrenFields.length;
            if (requiredChildren > currentChildren) {
                for (let i = 0; i < requiredChildren - currentChildren; i++) {
                    appendChild({ name: "", gender: "", cccd: "", phone: "" });
                }
            } else if (requiredChildren < currentChildren) {
                removeChildren(
                    Array.from(
                        { length: currentChildren - requiredChildren },
                        (_, i) => i + requiredChildren
                    )
                );
            }
        }
    }, [
        isOpen,
        bookingDetails.adults,
        bookingDetails.children,
        appendAdult,
        removeAdults,
        appendChild,
        removeChildren,
        adultFields.length,
    ]);

    // Khóa cuộn trang khi mở modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen]);

    const onSubmit = (data: BookingFormData) => {
        // Tách paymentMethod ra khỏi dữ liệu gửi API (nếu API backend không nhận trường này)
        const { paymentMethod, ...restData } = data;

        const apiBody = {
            tourID: tour.tourID,
            numAdults: bookingDetails.adults,
            numChildren: bookingDetails.children,
            totalPrice: bookingDetails.totalPrice,
            ...restData, // bookerName, otherAdults, children, note
        };

        // Gọi mutation với params chứa cả apiBody và paymentMethod
        createBookingMutation.mutate({ apiBody, paymentMethod });
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Thông tin đặt tour
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex-1 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                {/* 1. Thông tin người đặt */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <User size={20} className="mr-2 text-blue-600" />
                                        Thông tin người đặt (1 người lớn)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput
                                            label="Họ và tên"
                                            id="bookerName"
                                            register={register}
                                            error={errors.bookerName?.message}
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                        <FormInput
                                            label="Số điện thoại"
                                            id="bookerPhone"
                                            register={register}
                                            error={errors.bookerPhone?.message}
                                            placeholder="0912345678"
                                            required
                                        />
                                        <div className="md:col-span-2">
                                            <FormInput
                                                label="Email"
                                                id="bookerEmail"
                                                register={register}
                                                error={errors.bookerEmail?.message}
                                                type="email"
                                                placeholder="nguyenvana@gmail.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Người lớn đi cùng */}
                                {adultFields.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <Users size={20} className="mr-2 text-green-600" />
                                            Thông tin người lớn đi cùng
                                        </h3>
                                        <div className="space-y-5">
                                            {adultFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="p-3 bg-gray-50 rounded-md border"
                                                >
                                                    <p className="font-medium mb-3">
                                                        Người lớn {index + 2}
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormInput
                                                            label="Họ tên"
                                                            id={`otherAdults.${index}.name`}
                                                            register={register}
                                                            error={
                                                                errors.otherAdults?.[index]?.name
                                                                    ?.message
                                                            }
                                                            required
                                                        />
                                                        <FormSelect
                                                            label="Giới tính"
                                                            id={`otherAdults.${index}.gender`}
                                                            register={register}
                                                            error={
                                                                errors.otherAdults?.[index]?.gender
                                                                    ?.message
                                                            }
                                                            required
                                                        />
                                                        <FormInput
                                                            label="CCCD/CMND"
                                                            id={`otherAdults.${index}.cccd`}
                                                            register={register}
                                                            error={
                                                                errors.otherAdults?.[index]?.cccd
                                                                    ?.message
                                                            }
                                                            placeholder="12 số"
                                                            required
                                                        />
                                                        <FormInput
                                                            label="Số điện thoại"
                                                            id={`otherAdults.${index}.phone`}
                                                            register={register}
                                                            error={
                                                                errors.otherAdults?.[index]?.phone
                                                                    ?.message
                                                            }
                                                            placeholder="10 số"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Trẻ em đi cùng */}
                                {childrenFields.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <Baby size={20} className="mr-2 text-yellow-600" />
                                            Thông tin trẻ em
                                        </h3>
                                        <div className="space-y-5">
                                            {childrenFields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="p-3 bg-gray-50 rounded-md border"
                                                >
                                                    <p className="font-medium mb-3">
                                                        Trẻ em {index + 1}
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormInput
                                                            label="Họ tên"
                                                            id={`children.${index}.name`}
                                                            register={register}
                                                            error={
                                                                errors.children?.[index]?.name
                                                                    ?.message
                                                            }
                                                            required
                                                        />
                                                        <FormSelect
                                                            label="Giới tính"
                                                            id={`children.${index}.gender`}
                                                            register={register}
                                                            error={
                                                                errors.children?.[index]?.gender
                                                                    ?.message
                                                            }
                                                            required
                                                        />
                                                        <FormInput
                                                            label="CCCD/CMND"
                                                            id={`children.${index}.cccd`}
                                                            register={register}
                                                            error={
                                                                errors.children?.[index]?.cccd
                                                                    ?.message
                                                            }
                                                            placeholder="(Tùy chọn)"
                                                        />
                                                        <FormInput
                                                            label="Số điện thoại"
                                                            id={`children.${index}.phone`}
                                                            register={register}
                                                            error={
                                                                errors.children?.[index]?.phone
                                                                    ?.message
                                                            }
                                                            placeholder="(Tùy chọn)"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Ghi chú */}
                                <div>
                                    <label
                                        htmlFor="note"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Ghi chú
                                    </label>
                                    <textarea
                                        id="note"
                                        rows={3}
                                        placeholder="Yêu cầu đặc biệt (nếu có)"
                                        {...register("note")}
                                        className="w-full p-2.5 border rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    ></textarea>
                                </div>

                                {/* [MỚI] 4. Phương thức thanh toán */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <CreditCard size={20} className="mr-2 text-purple-600" />
                                        Phương thức thanh toán
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {/* Option 1: QR */}
                                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                            <input
                                                type="radio"
                                                value="QR"
                                                {...register("paymentMethod")}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3 flex items-center">
                                                <QrCode className="text-gray-600 mr-2" size={20} />
                                                <span className="text-gray-800 font-medium">
                                                    Thanh toán bằng mã QR
                                                </span>
                                            </div>
                                        </label>

                                        {/* Option 2: Counter */}
                                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                            <input
                                                type="radio"
                                                value="COUNTER"
                                                {...register("paymentMethod")}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3 flex items-center">
                                                <Store className="text-gray-600 mr-2" size={20} />
                                                <span className="text-gray-800 font-medium">
                                                    Thanh toán tại quầy TripBee
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.paymentMethod && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {errors.paymentMethod.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer: Tổng tiền & Nút submit */}
                            <div className="p-6 bg-gray-50 border-t flex-shrink-0">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Chi tiết đặt tour
                                </h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Tour:</span>
                                        <span className="font-medium text-right">{tour.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Khởi hành:</span>
                                        <span className="font-medium">{tour.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Số khách:</span>
                                        <span className="font-medium">
                                            {bookingDetails.adults} Người lớn
                                            {bookingDetails.children > 0 &&
                                                `, ${bookingDetails.children} Trẻ em`}
                                        </span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold">Tổng tiền:</span>
                                        <span className="font-bold text-blue-600 text-xl">
                                            {formatCurrency(bookingDetails.totalPrice)}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full text-lg font-semibold py-3 mt-4"
                                    disabled={createBookingMutation.isPending}
                                >
                                    {createBookingMutation.isPending ? (
                                        "Đang xử lý..."
                                    ) : (
                                        <>
                                            <CreditCard size={20} className="mr-2 inline-block" />
                                            Xác nhận đặt tour
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
