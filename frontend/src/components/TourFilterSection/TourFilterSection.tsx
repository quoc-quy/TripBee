// frontend-demo/src/components/TourFilterSection/TourFilterSection.tsx

import { useEffect, useRef, useCallback } from "react";
import type { TourListParams } from "../../types/tour";
import { useQuery } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";
import { tourTypeApi } from "../../apis/tourType.api";
import { destinationApi } from "../../apis/destination";
import { omitBy, isUndefined, isEqual, debounce } from "lodash";

// (CẬP NHẬT) Đổi tên trường sang snake_case
type FormData = {
    search?: string;
    destination_id?: string;
    tour_type_id?: string;
    sort?: string;
};

interface Props {
    showAdvancedFilters?: boolean;
    defaultValues?: FormData;
}

export default function TourFilterSection({ showAdvancedFilters = false, defaultValues }: Props) {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, watch } = useForm<FormData>({
        defaultValues: defaultValues,
    });

    const watchedValues = watch();
    const isMounted = useRef(false);

    const { data: destinationsData } = useQuery({
        queryKey: ["destinations"],
        queryFn: destinationApi.getPopularDestinations,
    });

    const { data: tourTypesData } = useQuery({
        queryKey: ["tourTypes"],
        queryFn: tourTypeApi.getTourTypes,
    });

    useEffect(() => {
        if (!isEqual(defaultValues, watch())) {
            reset(defaultValues);
        }
    }, [defaultValues, reset, watch]);

    const debouncedNavigate = useCallback(
        debounce((newParams: TourListParams) => {
            navigate({
                pathname: "/tours",
                search: createSearchParams(newParams as any).toString(),
            });
        }, 500),
        [navigate]
    );

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            const initialCleanParams = omitBy(watchedValues, (v) => isUndefined(v) || v === "");
            const defaultCleanParams = omitBy(defaultValues, (v) => isUndefined(v) || v === "");
            if (isEqual(initialCleanParams, defaultCleanParams)) {
                return;
            }
        }
        const params: TourListParams = omitBy(
            { ...watchedValues },
            (value) => isUndefined(value) || value === ""
        );
        debouncedNavigate(params);
        return () => {
            debouncedNavigate.cancel();
        };
    }, [watchedValues, debouncedNavigate, defaultValues]);

    const onSubmit: SubmitHandler<FormData> = (data) => {
        const params: TourListParams = omitBy(
            { ...data },
            (value) => isUndefined(value) || value === ""
        );
        debouncedNavigate.cancel();
        navigate({
            pathname: "/tours",
            search: createSearchParams(params as any).toString(),
        });
    };

    const handleResetFilters = () => {
        // (CẬP NHẬT) Đổi tên trường sang snake_case
        reset({
            search: "",
            destination_id: "",
            tour_type_id: "",
            sort: "",
        });
        debouncedNavigate.cancel();
        navigate("/tours");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col md:flex-row gap-2">
                <input
                    {...register("search")}
                    type="text"
                    placeholder="Tìm kiếm điểm đến, tour..."
                    className="flex-grow p-3 rounded-lg text-gray-900 shadow-sm bg-white"
                />
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold shadow-sm"
                >
                    Tìm kiếm
                </button>
            </div>

            {showAdvancedFilters && (
                <div className="mt-4 p-4 bg-white/90 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label
                                htmlFor="destination_id"
                                className="text-sm font-medium text-gray-700 mb-1"
                            >
                                Điểm đến
                            </label>
                            <select
                                // (CẬP NHẬT) Đổi tên trường
                                {...register("destination_id")}
                                id="destination_id"
                                className="p-2 border border-gray-500 rounded-md text-gray-900"
                            >
                                <option value="">Tất cả</option>
                                {destinationsData?.data.map((dest) => (
                                    <option key={dest.destinationID} value={dest.destinationID}>
                                        {dest.nameDes}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="tour_type_id"
                                className="text-sm font-medium text-gray-700 mb-1"
                            >
                                Loại hình
                            </label>
                            <select
                                // (CẬP NHẬT) Đổi tên trường
                                {...register("tour_type_id")}
                                id="tour_type_id"
                                className="p-2 border border-gray-500 rounded-md text-gray-900"
                            >
                                <option value="">Tất cả</option>
                                {tourTypesData?.data.map((type) => (
                                    <option key={type.tourTypeID} value={type.tourTypeID}>
                                        {type.nameType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label
                                htmlFor="sort"
                                className="text-sm font-medium text-gray-700 mb-1"
                            >
                                Sắp xếp theo
                            </label>
                            <select
                                {...register("sort")}
                                id="sort"
                                className="p-2 border border-gray-500 rounded-md text-gray-900"
                            >
                                <option value="">Nổi bật (Ranking)</option>
                                {/* (FIX) Đổi lại thành priceAdult */}
                                <option value="priceAdult,asc">Giá tăng dần</option>
                                <option value="priceAdult,desc">Giá giảm dần</option>
                                <option value="startDate,asc">Ngày đi gần nhất</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="text-sm text-gray-600 hover:text-orange-500 cursor-pointer"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
