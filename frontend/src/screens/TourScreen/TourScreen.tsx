// frontend-demo/src/screens/TourScreen/TourScreen.tsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { tourApi } from "../../apis/tour";
import TourCard from "../../components/TourCard";
import TourFilterSection from "../../components/TourFilterSection";
import type { Tour, TourListParams } from "../../types/tour";
import { omitBy, isUndefined } from "lodash";
import Button from "../../components/Button";

// (CẬP NHẬT) Đổi tên trường sang snake_case
type ParsedTourParams = {
    page: number;
    size: number;
    sort?: string;
    search?: string;
    destination_id?: string;
    tour_type_id?: string;
    priceMin?: number;
    priceMax?: number;
};

// (CẬP NHẬT) Đổi tên trường sang snake_case
const parseSearchParams = (searchParams: URLSearchParams): ParsedTourParams => {
    const params = {
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
        size: searchParams.get("size") ? Number(searchParams.get("size")) : 12,
        sort: searchParams.get("sort") || undefined,
        search: searchParams.get("search") || undefined,
        destination_id: searchParams.get("destination_id") || undefined,
        tour_type_id: searchParams.get("tour_type_id") || undefined,
        priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
        priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    };

    return omitBy(params, isUndefined) as ParsedTourParams;
};

export default function TourScreen() {
    const [searchParams, setSearchParams] = useSearchParams();

    const queryParams = parseSearchParams(searchParams);

    const { data: toursData, isLoading } = useQuery({
        queryKey: ["tours", queryParams],
        queryFn: () => tourApi.getTours(queryParams as TourListParams),
        placeholderData: keepPreviousData,
    });

    const tours = toursData?.data.content || [];
    const totalPages = toursData?.data.totalPages || 0;
    const currentPage = toursData?.data.number || 0;

    const handlePageChange = (page: number) => {
        const newParams = { ...queryParams, page: page };
        setSearchParams(newParams as any);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div
                className="relative bg-cover bg-center py-12"
                style={{ backgroundImage: "url(/hero.jpg)" }}
            >
                <div className="absolute inset-0 bg-black opacity-50" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-6">Tìm kiếm Tour</h1>

                    <TourFilterSection showAdvancedFilters={true} defaultValues={queryParams} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="text-center text-gray-700">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        {tours.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tours.map((tour: Tour) => (
                                        <TourCard key={tour.tourID} tour={tour} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-10">
                                        <Button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                        >
                                            Trang trước
                                        </Button>
                                        <span className="text-gray-700">
                                            Trang {currentPage + 1} / {totalPages}
                                        </span>
                                        <Button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage + 1 >= totalPages}
                                        >
                                            Trang sau
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-700 text-xl">
                                Không tìm thấy tour nào phù hợp với yêu cầu của bạn.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
