import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, FileDown } from "lucide-react";
import Select from "react-select";

import { tourAdminApi } from "../../apis/tourAdmin.api";
import { bookingAdminApi } from "../../apis/bookingAdmin.api";

import type { BookingStatus } from "@/types/booking.type";
import type { SimpleTour, TourParticipants } from "@/admin/types/tourAdmin";

const statusLabelMap: Record<BookingStatus, string> = {
  PROCESSING: "Đang xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};

const genderLabelMap: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const participantTypeLabelMap: Record<string, string> = {
  ADULT: "Người lớn",
  CHILD: "Trẻ em",
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN");

const TourParticipantsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTourId, setSelectedTourId] = useState<string>("");

  // 1. Lấy danh sách tour đang mở cho combobox
  const { data: toursRes, isLoading: loadingTours, refetch: refetchTours } =
    useQuery({
      queryKey: ["admin-open-tours-simple"],
      queryFn: async () => {
        const res = await tourAdminApi.getOpenToursSimple();
        return res.data as SimpleTour[];
      },
    });

  const tours = toursRes || [];

  // Map tour -> option cho react-select
  const tourOptions = useMemo(
    () =>
      tours.map((t) => ({
        value: t.tourId,
        label: t.title,
      })),
    [tours]
  );

  // 2. Lấy danh sách participant theo tour
  const {
    data: tourParticipants,
    isLoading: loadingParticipants,
    refetch: refetchParticipants,
  } = useQuery({
    queryKey: ["admin-tour-participants", selectedTourId],
    enabled: !!selectedTourId,
    queryFn: async () => {
      const res = await bookingAdminApi.getParticipantsByTour(selectedTourId);
      return res.data as TourParticipants;
    },
  });

  const handleBack = () => navigate("/admin/manage-booking");

  const handleRefresh = () => {
    refetchTours();
    if (selectedTourId) {
      refetchParticipants();
    }
  };

  const handleExport = async () => {
  if (!selectedTourId) {
    alert("Vui lòng chọn tour trước khi xuất file.");
    return;
  }

  try {
    const res = await bookingAdminApi.exportParticipantsByTour(selectedTourId);

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    const fileName =
      "danh-sach-khach-" +
      (tourParticipants?.tourName?.replace(/[\/\\:*?"<>|]/g, "_") || "tour") +
      ".pdf";

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Xuất file PDF thất bại.");
  }
};

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Xem khách theo tour
            </h1>
            <p className="text-sm text-gray-500">
              Chọn tour để xem danh sách toàn bộ khách tham gia (Participant)
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500 text-blue-600 text-sm font-medium bg-white hover:bg-blue-50 transition"
          >
            <FileDown size={16} />
            Xuất file
          </button>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Combobox chọn tour (searchable ngay trong khung) */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn tour
        </label>

        <Select
          isClearable
          isSearchable
          options={tourOptions}
          placeholder={
            loadingTours ? "Đang tải danh sách tour..." : "— Chọn tour —"
          }
          value={
            tourOptions.find((opt) => opt.value === selectedTourId) || null
          }
          onChange={(opt) => setSelectedTourId(opt?.value || "")}
          classNamePrefix="react-select"
          className="min-w-[260px] text-sm"
        />
      </div>

      {/* Bảng danh sách participant */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loadingParticipants && selectedTourId ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Đang tải danh sách khách...
          </div>
        ) : !selectedTourId ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Vui lòng chọn một tour để xem danh sách khách.
          </div>
        ) : tourParticipants && tourParticipants.participants.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            Chưa có khách nào tham gia tour này.
          </div>
        ) : tourParticipants ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                Tour:{" "}
                <span className="font-semibold text-gray-900">
                  {tourParticipants.tourName || "—"}
                </span>{" "}
                · {tourParticipants.participants.length} khách tham gia
              </p>
            </div>

            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-5 py-3">Khách tham gia</th>
                  <th className="px-5 py-3">Liên hệ</th>
                  <th className="px-5 py-3">Giấy tờ</th>
                  <th className="px-5 py-3">Giới tính</th>
                  <th className="px-5 py-3">Loại khách</th>
                  <th className="px-5 py-3">Booking</th>
                  <th className="px-5 py-3">Ngày đặt</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {tourParticipants.participants.map((p) => (
                  <tr
                    key={p.participantId}
                    className="border-b border-gray-100"
                  >
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">
                        {p.fullName}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-sm">
                      <div>{p.phone || "-"}</div>
                    </td>

                    <td className="px-5 py-3 text-sm">
                      {p.identification || "-"}
                    </td>

                    <td className="px-5 py-3 text-sm">
                      {p.gender
                        ? genderLabelMap[p.gender] || p.gender
                        : "-"}
                    </td>

                    <td className="px-5 py-3 text-sm">
                      {p.participantType
                        ? participantTypeLabelMap[p.participantType] ||
                          p.participantType
                        : "-"}
                    </td>

                    <td className="px-5 py-3 text-sm">{p.bookingId}</td>

                    <td className="px-5 py-3 text-sm">
                      {formatDateTime(p.bookingDate)}
                    </td>

                    <td className="px-5 py-3 text-sm">
                      {statusLabelMap[p.bookingStatus]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">
            Không tải được dữ liệu.
          </div>
        )}
      </div>
    </div>
  );
};

export default TourParticipantsScreen;
