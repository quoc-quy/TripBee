import React from 'react';
import { LayoutDashboard, Map, Users, Calendar, Settings, Tag, MessageSquare } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tour', label: 'Quản lý Tour', icon: Map },
    { id: 'promotion', label: 'Quản lý Khuyến mãi', icon: Tag },
    { id: 'user', label: 'Quản lý Người dùng', icon: Users },
    { id: 'destination', label: 'Quản lý Điểm đến', icon: Map },
    { id: 'booking', label: 'Quản lý Booking', icon: Calendar },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'contact-message', label: 'Tin nhắn liên hệ', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Quản trị viên</h2>
        <p className="text-sm text-gray-500 mt-1">Hệ thống quản lý tour</p>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeMenu === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;