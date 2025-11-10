import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { tourTypeApi } from "../../../apis/tourType.api";
import { destinationAdminApi } from "../../apis/destinationAdmin.api";
import { tourAdminApi } from "../../apis/tourAdmin.api";

import type { TourDetailAdmin } from "../../types/tourAdmin";

// ==== Types local ====

type TourType = {
  tourTypeID: string;
  nameType: string;
};

type DestinationAdmin = {
  destinationID: string;
  nameDes: string;
  region: string;
};

type TourForm = {
  title: string;
  startDate: string;
  endDate: string;
  priceAdult: number | "";
  priceChild: number | "";
  minGuests: number | "";
  maxGuests: number | "";
  imageURL: string;
  durationDays: number | "";
  durationNights: number | "";
  description: string;
  tourTypeId: string;
  status: string;
  region: string;
  destinationId: string; // select tạm
};

type FormErrors = {
  [K in keyof TourForm]?: string;
} & { form?: string };

const REGION_OPTIONS = [
  { value: "Miền Bắc", label: "Miền Bắc" },
  { value: "Miền Trung", label: "Miền Trung" },
  { value: "Miền Nam", label: "Miền Nam" },
];

const inputBase =
  "w-full border border-gray-300 rounded-xl px-3 py-3 text-base " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

// ==== helpers VND ====

const parseVND = (raw: string): number | "" => {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits);
};

const formatVND = (value: number | ""): string => {
  if (value === "" || isNaN(Number(value))) return "";
  return Number(value).toLocaleString("vi-VN");
};

// ==== component ====

export default function FormTourScreen() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const {
    data: tourTypes = [],
    isLoading: loadingTypes,
  } = useQuery<TourType[]>({
    queryKey: ["tourTypes"],
    queryFn: () => tourTypeApi.getTourTypes().then((res) => res.data),
  });

  const {
    data: tourDetail,
    isLoading: loadingTour,
  } = useQuery<TourDetailAdmin>({
    queryKey: ["tour-detail", id],
    queryFn: () =>
      tourAdminApi.getTourById(id as string).then((res) => res.data),
    enabled: isEdit && !!id,
  });

  const [form, setForm] = useState<TourForm>({
    title: "",
    startDate: "",
    endDate: "",
    priceAdult: "",
    priceChild: "",
    minGuests: "",
    maxGuests: "",
    imageURL: "",
    durationDays: "",
    durationNights: "",
    description: "",
    tourTypeId: "",
    status: "ACTIVE",
    region: "",
    destinationId: "",
  });

  const [selectedDestinations, setSelectedDestinations] = useState<
    DestinationAdmin[]
  >([]);

  const [errors, setErrors] = useState<FormErrors>({});

  const {
    data: destinations = [],
    isLoading: loadingDestinations,
    error: destinationsError,
  } = useQuery<DestinationAdmin[]>({
    queryKey: ["admin-destinations", form.region],
    queryFn: () =>
      destinationAdminApi
        .getDestinations(form.region || undefined)
        .then((res: any) => res.data),
    enabled: !!form.region,
  });

  useEffect(() => {
    if (!tourDetail) return;

    const tourDestinations = tourDetail.tourDestinations || [];
    const firstDes = tourDestinations[0]?.destination;

    const mappedDestinations: DestinationAdmin[] = tourDestinations
      .map((td) => td.destination)
      .filter(
        (d): d is { id: string; nameDes: string; region: string } => !!d
      )
      .map((d) => ({
        destinationID: d.id,
        nameDes: d.nameDes,
        region: d.region,
      }));

    setForm({
      title: tourDetail.title ?? "",
      startDate: tourDetail.startDate ?? "",
      endDate: tourDetail.endDate ?? "",
      priceAdult:
        typeof tourDetail.priceAdult === "number"
          ? tourDetail.priceAdult
          : "",
      priceChild:
        typeof tourDetail.priceChild === "number"
          ? tourDetail.priceChild
          : "",
      minGuests:
        typeof tourDetail.minParticipants === "number"
          ? tourDetail.minParticipants
          : "",
      maxGuests:
        typeof tourDetail.maxParticipants === "number"
          ? tourDetail.maxParticipants
          : "",
      imageURL: tourDetail.imageURL ?? "",
      durationDays:
        typeof tourDetail.durationDays === "number"
          ? tourDetail.durationDays
          : "",
      durationNights:
        typeof tourDetail.durationNights === "number"
          ? tourDetail.durationNights
          : "",
      description: tourDetail.description ?? "",
      tourTypeId: tourDetail.tourType?.id ?? "",
      status: tourDetail.status?.toUpperCase() ?? "ACTIVE",
      region: firstDes?.region ?? "",
      destinationId: "",
    });

    setSelectedDestinations(mappedDestinations);
    setErrors({});
  }, [tourDetail]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const priceFields = ["priceAdult", "priceChild"];
    const numericFields = [
      "minGuests",
      "maxGuests",
      "durationDays",
      "durationNights",
    ];

    if (priceFields.includes(name)) {
      const numeric = parseVND(value);
      setForm((prev) => ({
        ...prev,
        [name]: numeric,
      }));
    } else if (numericFields.includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;

    setForm((prev) => ({
      ...prev,
      region,
      destinationId: "",
    }));

    setErrors((prev) => ({
      ...prev,
      region: undefined,
      destinationId: undefined,
      form: undefined,
    }));
  };

  const handleDestinationSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;

    setForm((prev) => ({
      ...prev,
      destinationId: id,
    }));

    setErrors((prev) => ({
      ...prev,
      destinationId: undefined,
      form: undefined,
    }));

    if (!id) return;

    const found = destinations.find((d) => d.destinationID === id);
    if (!found) return;

    setSelectedDestinations((prev) => {
      const exists = prev.some((d) => d.destinationID === id);
      if (exists) return prev;
      return [...prev, found];
    });
  };

  const handleRemoveDestination = (id: string) => {
    setSelectedDestinations((prev) =>
      prev.filter((d) => d.destinationID !== id)
    );
    setForm((prev) => ({
      ...prev,
      destinationId: prev.destinationId === id ? "" : prev.destinationId,
    }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) newErrors.title = "Không được để trống";
    if (!form.description.trim())
      newErrors.description = "Không được để trống";

    if (!form.tourTypeId) newErrors.tourTypeId = "Chọn loại tour";
    if (!form.region) newErrors.region = "Chọn miền";

    if (selectedDestinations.length === 0) {
      newErrors.destinationId = "Chọn ít nhất một điểm đến";
    }

    const checkPositive = (
      value: number | "",
      field: keyof TourForm,
      label: string
    ) => {
      if (value === "" || Number(value) <= 0) {
        newErrors[field] = `${label} phải > 0`;
      }
    };

    checkPositive(form.priceAdult, "priceAdult", "Giá người lớn");
    checkPositive(form.priceChild, "priceChild", "Giá trẻ em");
    checkPositive(form.minGuests, "minGuests", "Số lượng tối thiểu");
    checkPositive(form.maxGuests, "maxGuests", "Số lượng tối đa");
    checkPositive(form.durationDays, "durationDays", "Số ngày");
    checkPositive(form.durationNights, "durationNights", "Số đêm");

    if (!form.startDate) newErrors.startDate = "Chọn ngày khởi hành";

    if (!form.endDate) {
      newErrors.endDate = "Chọn ngày kết thúc";
    } else if (form.startDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày khởi hành";
      }
    }

    if (!form.imageURL.trim()) {
      newErrors.imageURL = "Không được để trống";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      durationDays: Number(form.durationDays),
      durationNights: Number(form.durationNights),
      priceAdult: Number(form.priceAdult),
      priceChild: Number(form.priceChild),
      minGuests: Number(form.minGuests),
      maxGuests: Number(form.maxGuests),
      imageURL: form.imageURL.trim(),
      status: form.status,
      tourTypeId: form.tourTypeId,
      destinationIds: selectedDestinations.map((d) => d.destinationID),
    };

    console.log("submit payload", payload);

    try {
      if (isEdit && id) {
        await tourAdminApi.updateTour(id, payload);
      } else {
        await tourAdminApi.createTour(payload);
      }
      navigate("/admin/manage-tour");
    } catch (error: any) {
      console.log(error?.response?.data || error);
      setErrors((prev) => ({
        ...prev,
        form: "Lỗi lưu tour. Kiểm tra lại dữ liệu hoặc thử lại",
      }));
    }
  };

  if (isEdit && loadingTour) {
    return (
      <div className="p-8 text-base">
        Đang tải dữ liệu tour
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-base">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa tour" : "Tạo tour mới"}
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Nhập đầy đủ thông tin để hiển thị tour rõ ràng.
          </p>
        </div>
      </div>

      {errors.form && (
        <div className="mb-4 text-sm text-red-500">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên tour
              </label>
              {errors.title && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.title}
                </p>
              )}
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ví dụ: Hà Nội - Hạ Long - Sapa 5N4Đ"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Loại tour
              </label>
              {errors.tourTypeId && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.tourTypeId}
                </p>
              )}
              <select
                name="tourTypeId"
                value={form.tourTypeId}
                onChange={handleChange}
                className={inputBase}
              >
                <option value="">
                  {loadingTypes ? "Đang tải" : "Chọn loại tour"}
                </option>
                {tourTypes.map((type) => (
                  <option key={type.tourTypeID} value={type.tourTypeID}>
                    {type.nameType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Lịch trình & thời lượng */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Lịch trình & thời lượng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ngày khởi hành
              </label>
              {errors.startDate && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.startDate}
                </p>
              )}
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ngày kết thúc
              </label>
              {errors.endDate && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.endDate}
                </p>
              )}
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số ngày
              </label>
              {errors.durationDays && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.durationDays}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="durationDays"
                value={form.durationDays}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số đêm
              </label>
              {errors.durationNights && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.durationNights}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="durationNights"
                value={form.durationNights}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* Giá & số lượng */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Giá & số lượng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá người lớn (VNĐ)
              </label>
              {errors.priceAdult && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.priceAdult}
                </p>
              )}
              <input
                type="text"
                name="priceAdult"
                value={formatVND(form.priceAdult)}
                onChange={handleChange}
                className={inputBase}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá trẻ em (VNĐ)
              </label>
              {errors.priceChild && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.priceChild}
                </p>
              )}
              <input
                type="text"
                name="priceChild"
                value={formatVND(form.priceChild)}
                onChange={handleChange}
                className={inputBase}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số lượng tối thiểu
              </label>
              {errors.minGuests && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.minGuests}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="minGuests"
                value={form.minGuests}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số lượng tối đa
              </label>
              {errors.maxGuests && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.maxGuests}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="maxGuests"
                value={form.maxGuests}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* Khu vực & điểm đến */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Khu vực & điểm đến
          </h2>

          {destinationsError && (
            <p className="text-sm text-red-500">Lỗi tải điểm đến</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Miền
              </label>
              {errors.region && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.region}
                </p>
              )}
              <select
                name="region"
                value={form.region}
                onChange={handleRegionChange}
                className={inputBase}
              >
                <option value="">Chọn miền</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Điểm đến
              </label>
              {errors.destinationId && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.destinationId}
                </p>
              )}
              <select
                name="destinationId"
                value={form.destinationId}
                onChange={handleDestinationSelect}
                className={inputBase}
                disabled={!form.region || loadingDestinations}
              >
                <option value="">
                  {!form.region
                    ? "Chọn miền trước"
                    : loadingDestinations
                    ? "Đang tải điểm đến"
                    : destinations.length === 0
                    ? "Không có điểm đến phù hợp"
                    : "Chọn điểm đến để thêm"}
                </option>
                {destinations.map((d) => (
                  <option key={d.destinationID} value={d.destinationID}>
                    {d.nameDes}
                  </option>
                ))}
              </select>

              {selectedDestinations.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                      Lộ trình điểm đến
                    </p>
                  </div>

                  <div className="space-y-2">
                    {selectedDestinations.map((d, index) => (
                      <div
                        key={d.destinationID}
                        className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {d.nameDes}
                            </span>
                            <span className="text-xs text-gray-500">
                              {d.region}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveDestination(d.destinationID)
                          }
                          className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Hình ảnh & trạng thái */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Hình ảnh & trạng thái
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Hình ảnh (URL)
              </label>
              {errors.imageURL && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.imageURL}
                </p>
              )}
              <input
                name="imageURL"
                value={form.imageURL}
                onChange={handleChange}
                placeholder="Dán link ảnh bìa tour"
                className={inputBase}
              />
              {form.imageURL && !errors.imageURL && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Xem trước
                  </p>
                  <img
                    src={form.imageURL}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputBase}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="PAUSE">Tạm dừng</option>
                <option value="SOLD_OUT">Hết chỗ</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
          </div>
        </section>

        {/* Mô tả */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Mô tả tour
          </h2>
          {errors.description && (
            <p className="text-xs text-red-500 mb-1">
              {errors.description}
            </p>
          )}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Điểm nổi bật, lịch trình tóm tắt, dịch vụ bao gồm"
            className={inputBase + " min-h-[160px] resize-y"}
          />
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-tour")}
            className="px-6 py-3 rounded-xl border border-gray-300 text-base text-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-blue-600 text-base text-white font-semibold"
          >
            {isEdit ? "Lưu thay đổi" : "Tạo tour"}
          </button>
        </div>
      </form>
    </div>
  );
}
