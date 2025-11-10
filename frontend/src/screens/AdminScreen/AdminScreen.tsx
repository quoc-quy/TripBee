import React, { useEffect, useState } from "react";
import Sidebar from "../../admin/components/SiideBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminScreen() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "dashboard") navigate("/admin/dashboard");
    else if (menu === "tour") navigate("/admin/manage-tour");
    else if (menu === "destination") navigate("/admin/manage-destination");
  };

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex">
      <Sidebar activeMenu={activeMenu} setActiveMenu={handleMenuChange} />
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
