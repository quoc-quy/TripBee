import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

// Dữ liệu mẫu cho Văn phòng
const officeLocations = [
  {
    city: "Văn phòng Chính - TP.HCM",
    address: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    phone: "+84 28 1234 5678",
    email: "info@tripbee.com",
    isMain: true,
  },
  {
    city: "Hà Nội",
    address: "Tầng 3, Tòa nhà ABC, Hoàn Kiếm, Hà Nội",
    phone: "+84 24 9876 5432",
    email: "hanoi@tripbee.com",
    isMain: false,
  },
  {
    city: "Đà Nẵng",
    address: "Đường Võ Nguyên Giáp, Quận Sơn Trà, Đà Nẵng",
    phone: "+84 236 4567 8901",
    email: "danang@tripbee.com",
    isMain: false,
  },
  {
    city: "Cần Thơ",
    address: "159 Trần Văn Khéo, Quận Ninh Kiều, Cần Thơ",
    phone: "+84 292 234 5678",
    email: "cantho@tripbee.com",
    isMain: false,
  },
];

// Dữ liệu mẫu cho Câu hỏi thường gặp
const faqs = [
  {
    question: "Làm thế nào để đặt tour?",
    answer:
      "Quý khách có thể đặt tour trực tiếp trên website, qua điện thoại hoặc đến trực tiếp văn phòng của chúng tôi. Đội ngũ tư vấn sẽ hỗ trợ bạn chọn tour phù hợp nhất.",
  },
  {
    question: "Chính sách hủy tour như thế nào?",
    answer:
      "Chính sách hủy tour được linh hoạt: Hoàn tiền 100% nếu hủy trước 7 ngày, 50% nếu hủy trước 3 ngày, và 0% nếu hủy sau 3 ngày.",
  },
  {
    question: "Tour có bao gồm bảo hiểm không?",
    answer:
      "Tất cả tour của chúng tôi đều bao gồm bảo hiểm du lịch cơ bản. Khách hàng có thể mua thêm bảo hiểm mở rộng nếu có nhu cầu.",
  },
  {
    question: "Có thể tùy chỉnh lịch trình tour không?",
    answer:
      "Chúng tôi có các tour tùy chọn cho nhóm từ 6 người trở lên. Liên hệ với chúng tôi để được tư vấn chi tiết.",
  },
];

// Component hiển thị thông tin chung
function GeneralContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center text-gray-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ContactInfoCard
        icon={FaMapMarkerAlt}
        title="Địa chỉ"
        detail="123 Đường Lê Lợi, Quận 1, TP.HCM"
      />
      <ContactInfoCard
        icon={FaPhoneAlt}
        title="Điện thoại"
        detail="+84 901 234 567"
      />
      <ContactInfoCard
        icon={FaEnvelope}
        title="Email"
        detail="info@tripbee.com"
      />
      <ContactInfoCard
        icon={FaClock}
        title="Giờ làm việc"
        detail="T2-T7, 8:00 - 18:00"
      />
    </div>
  );
}

// Component cho từng card thông tin
function ContactInfoCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
      <Icon className="text-blue-600 text-3xl mb-3" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm">{detail}</p>
    </div>
  );
}

// Component cho Form và Văn phòng
function ContactFormAndOffices() {
  // Tạm thời dùng state/handle submit giả định
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // URL Google Maps nhúng
  const mapEmbedSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4679.932060222481!2d106.69700687572787!3d10.772434959265976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f56a3de55%3A0x7c6107f1253d69c9!2zMTIzIEzDqiBM4bujaSwgUGjGsOG7nW5nIELhur9uIFRow6BuaCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e1!3m2!1svi!2s!4v1762439308541!5m2!1svi!2s";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Tin nhắn của bạn đã được gửi thành công!");
      // Thêm logic reset form thực tế
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Cột trái: Form Gửi Tin Nhắn */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Gửi Tin Nhắn Cho Chúng Tôi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ và tên *
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Điện thoại *
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="tourType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Chọn chủ đề *
              </label>
              <select
                id="tourType"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Chọn chủ đề</option>
                <option value="booking">Đặt tour</option>
                <option value="cancellation">Hủy/Đổi tour</option>
                <option value="feedback">Góp ý/Khiếu nại</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tin nhắn của bạn *
            </label>
            <textarea
              id="message"
              rows={5}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          >
            <FaPaperPlane />
            {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
          </button>
        </form>
      </div>

      {/* Cột phải: Văn phòng & Bản đồ */}
      <div className="space-y-6">
        {/* Bản đồ (Sử dụng iframe) */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Văn Phòng Chính
          </h2>
          <div className="relative h-96 w-full rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>

        {/* Các Văn phòng Khác */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
            Các Văn phòng Khác
          </h2>
          <div className="space-y-4">
            {officeLocations
              .filter((loc) => !loc.isMain)
              .map((loc) => (
                <div
                  key={loc.city}
                  className="border-l-4 border-orange-500 pl-3"
                >
                  <h3 className="font-semibold text-gray-800">{loc.city}</h3>
                  <p className="text-sm text-gray-600">
                    Địa chỉ: {loc.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Điện thoại: {loc.phone}
                  </p>
                  <p className="text-sm text-gray-600">Email: {loc.email}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component cho Câu hỏi thường gặp
function FAQSection() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Câu Hỏi Thường Gặp
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component chính
export default function ContactScreen() {
  return (
    <div className="bg-white">
      {/* Banner/Header */}
      <div
        className="relative h-64 flex items-center justify-center text-white"
        style={{
          backgroundImage: "url(/hero.jpg)", // Thay thế bằng ảnh nền phù hợp
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-2">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-xl">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho chuyến đi của bạn
          </p>
        </div>
      </div>

      {/* Phần Nội dung */}
      <div className="py-12 bg-gray-50">
        <GeneralContactInfo />
      </div>

      <ContactFormAndOffices />

      <FAQSection />
    </div>
  );
}
