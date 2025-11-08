import React from "react";
import {
  FaGraduationCap,
  FaMedal,
  FaShieldAlt,
  FaStar,
  FaTags,
  FaTrophy,
  FaUsers,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Data Cứng cho các phần tử
const milestones = [
  {
    value: "10+",
    label: "Năm kinh nghiệm",
    icon: FaStar,
    color: "text-white",
    bg: "bg-white/20",
  },
  {
    value: "50,000+",
    label: "Khách hàng hài lòng",
    icon: FaUsers,
    color: "text-white",
    bg: "bg-red-700",
  },
  {
    value: "200+",
    label: "Tour du lịch",
    icon: FaTags,
    color: "text-white",
    bg: "bg-yellow-700",
  },
  {
    value: "4.9/5",
    label: "Đánh giá trung bình",
    icon: FaStar,
    color: "text-white",
    bg: "bg-green-700",
  },
];

const missionVision = [
  {
    title: "Sứ Mệnh",
    desc: "Mang đến những chuyến du lịch an toàn, chất lượng và đáng nhớ, góp phần quảng bá văn hóa và vẻ đẹp đất nước Việt Nam tới bạn bè quốc tế.",
    icon: FaShieldAlt,
    color: "text-blue-600",
  },
  {
    title: "Tầm Nhìn",
    desc: "Trở thành công ty du lịch hàng đầu Việt Nam, được khách hàng tin tưởng lựa chọn hàng đầu khi khám phá vẻ đẹp và văn hóa Việt Nam.",
    icon: FaUsers,
    color: "text-red-500",
  },
];

const coreValues = [
  {
    title: "An Toàn",
    desc: "Đảm bảo an toàn tuyệt đối cho hành khách trong suốt chuyến đi.",
  },
  {
    title: "Chất Lượng",
    desc: "Cam kết cung cấp dịch vụ chất lượng cao với đội ngũ chuyên nghiệp.",
  },
  {
    title: "Tận Tâm",
    desc: "Phục vụ khách hàng với sự nhiệt huyết và tinh thần trách nhiệm cao nhất.",
  },
];

const leaders = [
  {
    name: "Nguyễn Văn An",
    title: "Thành viên sáng lập & CEO",
    desc: "Chuyên gia Du lịch Top 10",
    image: "/uifaces-human-avatar.jpg",
  },
  {
    name: "Trần Thị Bình",
    title: "Trưởng phòng Marketing",
    desc: "Chiến lược Digital Marketing",
    image: "/uifaces-human-avatar (3).jpg",
  },
  {
    name: "Lê Minh Cường",
    title: "Trưởng phòng Tour",
    desc: "Chuyên gia thiết kế Tour",
    image: "/uifaces-human-avatar (2).jpg",
  },
  {
    name: "Phạm Thị Dung",
    title: "Trưởng phòng Chăm sóc Khách hàng",
    desc: "Tận tâm, chu đáo với khách hàng",
    image: "/uifaces-human-avatar (1).jpg",
  },
];

const awards = [
  { icon: FaTrophy, label: "Top 10", desc: "Công ty du lịch tốt nhất 2025" },
  { icon: FaMedal, label: "ISO 9001", desc: "Chứng nhận chất lượng quốc tế" },
  { icon: FaStar, label: "VITA", desc: "Giải thưởng VITA uy tín" },
  { icon: FaGraduationCap, label: "5 Sao", desc: "Đạt chuẩn 5 sao dịch vụ" },
];

// --- Các Component nhỏ ---

const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  color?: string;
}> = ({ title, subtitle, color = "text-gray-900" }) => (
  <div className="text-center mb-12">
    <h2 className={`text-4xl font-bold ${color} mb-4`}>{title}</h2>
    {subtitle && (
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);

const MilestoneCard: React.FC<{ data: (typeof milestones)[number] }> = ({
  data,
}) => (
  <div className="text-center p-6">
    <div
      className={`w-20 h-20 mx-auto rounded-full ${data.bg} flex items-center justify-center mb-4`}
    >
      <data.icon className={`${data.color} text-4xl`} />
    </div>
    <p className={`text-4xl font-bold ${data.color} mb-1`}>{data.value}</p>
    <p className="text-white-700 font-semibold">{data.label}</p>
  </div>
);

const MissionVisionCard: React.FC<{ data: (typeof missionVision)[number] }> = ({
  data,
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600 space-y-4">
    <data.icon className={`${data.color} text-4xl`} />
    <h3 className="text-2xl font-bold text-gray-900">{data.title}</h3>
    <p className="text-gray-700">{data.desc}</p>
  </div>
);

// FIX LỖI: Cập nhật kiểu dữ liệu để nhận prop `index`
interface CoreValueCardProps {
  data: (typeof coreValues)[number];
  index: number;
}

const CoreValueCard: React.FC<CoreValueCardProps> = ({ data, index }) => {
  // Sử dụng FaHeart thay cho FaVenusMars vì FaVenusMars không có trong imports và Core Values thường dùng các icon chung
  const iconMap = [FaShieldAlt, FaStar, FaHeart];
  const colorMap = ["text-green-600", "text-blue-600", "text-red-600"];
  const Icon = iconMap[index % iconMap.length];
  const color = colorMap[index % colorMap.length];
  return (
    <div className="text-center p-6 space-y-3">
      <div
        className={`w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3`}
      >
        <Icon className={`${color} text-3xl`} />
      </div>
      <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
      <p className="text-gray-600">{data.desc}</p>
    </div>
  );
};

const LeaderCard: React.FC<{ data: (typeof leaders)[number] }> = ({ data }) => (
  <div className="text-center p-4">
    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-200">
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-full object-cover"
      />
    </div>
    <h4 className="text-lg font-bold text-gray-800">{data.name}</h4>
    <p className="text-blue-600 font-medium">{data.title}</p>
    <p className="text-sm text-gray-500">{data.desc}</p>
  </div>
);

const AwardCard: React.FC<{ data: (typeof awards)[number]; index: number }> = ({
  data,
  index,
}) => {
  const colorMap = [
    "bg-yellow-100 text-yellow-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
  ];
  const color = colorMap[index % colorMap.length];
  return (
    <div className="text-center p-4">
      <div
        className={`w-12 h-12 mx-auto rounded-full ${color} flex items-center justify-center mb-3`}
      >
        <data.icon className="text-xl" />
      </div>
      <h4 className="text-lg font-bold text-gray-800">{data.label}</h4>
      <p className="text-sm text-gray-500">{data.desc}</p>
    </div>
  );
};

// --- Màn hình chính ---
export default function AboutScreen() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION: Về TripBee */}
      <div
        className="relative min-h-[40vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: "url(/hero.jpg)", // Sử dụng ảnh nền giả định
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="relative z-10 text-center p-8">
          <h1 className="text-5xl font-bold mb-2">Về TripBee</h1>
          <p className="text-xl">
            Đồng hành cùng bạn khám phá vẻ đẹp Việt Nam từ năm 2014
          </p>
        </div>
      </div>

      {/* 2. CÂU CHUYỆN CỦA CHÚNG TÔI */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                title="Câu Chuyện Của Chúng Tôi"
                color="text-blue-600"
              />
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                TripBee được thành lập vào năm 2014 với niềm đam mê bất tận với
                du lịch và mong muốn giới thiệu vẻ đẹp của Việt Nam đến bạn bè
                quốc tế và du khách trong nước. Chúng tôi tin rằng mỗi chuyến đi
                không chỉ là sự di chuyển mà còn là một hành trình khám phá bản
                thân và văn hóa.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến những
                dịch vụ chất lượng, an toàn và chuyên nghiệp nhất. Đội ngũ
                TripBee luôn làm việc tận tâm để mỗi chuyến đi của khách hàng
                đều là những trải nghiệm tuyệt vời và khó quên.
              </p>
              <Link
                to="/contact" // Dùng Link hoặc Button nếu cần
                className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Liên hệ với chúng tôi
              </Link>
            </div>
            <div className="h-96 rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Đội ngũ TripBee"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. THÀNH TỰU CỦA CHÚNG TÔI (MILESTONES) */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Thành Tựu Của Chúng Tôi" color="text-white" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} data={milestone} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. SỨ MỆNH & TẦM NHÌN */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Sứ Mệnh & Tầm Nhìn"
            subtitle="Định hướng phát triển của chúng tôi"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionVision.map((item, index) => (
              <MissionVisionCard key={index} data={item} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. GIÁ TRỊ CỐT LÕI */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Giá Trị Cốt Lõi"
            subtitle="Những nguyên tắc không thay đổi định hình văn hóa TripBee"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((item, index) => (
              <CoreValueCard key={index} data={item} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. ĐỘI NGŨ LÃNH ĐẠO */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Đội Ngũ Lãnh Đạo"
            subtitle="Những người dẫn dắt và tạo ra các trải nghiệm du lịch tuyệt vời"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <LeaderCard key={index} data={leader} />
            ))}
          </div>
        </div>
      </div>

      {/* 7. GIẢI THƯỞNG & CHỨNG NHẬN */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Giải Thưởng & Chứng Nhận"
            subtitle="Sự công nhận cho nỗ lực không ngừng của đội ngũ TripBee"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <AwardCard key={index} data={award} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* 8. CALL TO ACTION (CTA) */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn Sàng Bắt Đầu Cuộc Phiêu Lưu?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Hãy để TripBee đồng hành cùng bạn khám phá những điều tuyệt vời nhất
            mà thế giới mang lại.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/tours"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Khám Phá Tour
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Liên Hệ Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
