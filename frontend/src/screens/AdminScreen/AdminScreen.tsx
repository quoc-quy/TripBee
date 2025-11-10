import React, { useEffect, useState } from "react";
import Sidebar from "../../admin/components/SiideBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const getMenuFromPath = (path: string): string => {
  if (path.startsWith("/admin/manage-tour") || path.startsWith("/admin/tours"))
    return "tour";
  if (path.startsWith("/admin/manage-destination"))
    return "destination";
  
  return "dashboard";
};

export default function AdminScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState(
    getMenuFromPath(location.pathname)
  );

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);

    if (menu === "dashboard") navigate("/admin/dashboard");
    else if (menu === "tour") navigate("/admin/manage-tour");
    else if (menu === "destination") navigate("/admin/manage-destination");
   
  };

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    const currentMenu = getMenuFromPath(location.pathname);
    if (currentMenu !== activeMenu) {
      setActiveMenu(currentMenu);
    }
  }, [location.pathname, navigate, activeMenu]);

  return (
    <div className="flex">
      <Sidebar activeMenu={activeMenu} setActiveMenu={handleMenuChange} />
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
