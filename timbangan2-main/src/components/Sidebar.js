import React from "react";
import {
  faHome,
  faUsers,
  faDolly,
  faScaleBalanced,
  faTruck,
  faClipboardList,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const role = localStorage.getItem("role"); // Ambil role dari localStorage 

  // Daftar menu 
  const menus = [
    { role: "all", href: "/Homepage", icon: faHome, label: "Home" },
    {
      role: "admin",
      href: "/Penimbangan",
      icon: faScaleBalanced,
      label: "Penimbangan",
    },
    {
      role: "admin",
      href: "/master-product",
      icon: faDolly,
      label: "Master Product",
    },
    {
      role: "admin",
      href: "/customer",
      icon: faUsers,
      label: "Suplier / Customer",
    },
    { role: "admin", href: "/transporter", icon: faList, label: "Transporter" },
    {
      role: "admin",
      href: "/kendaraan",
      icon: faTruck,
      label: "Check Kendaraan",
    },
    {
      role: "admin",
      href: "/laporan",
      icon: faClipboardList,
      label: "Laporan",
    },
    {
      role: "operator",
      href: "/Penimbangan",
      icon: faScaleBalanced,
      label: "Penimbangan",
    },
    {
      role: "operator",
      href: "/kendaraan",
      icon: faTruck,
      label: "Check Kendaraan",
    },
    {
      role: "operator",
      href: "/laporan",
      icon: faClipboardList,
      label: "Laporan",
    },
    
  ];

  return (
    <div className="bg-white text-white w-64 space-y-6 py-7 px-2">
      <nav className="space-y-1">
        {menus
          .filter((menu) => menu.role === role || menu.role === "all") // Filter menu berdasarkan role 
          .map((menu, index) => (
        <a
          key={index}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-700 hover:text white rounded-md"
          href={menu.href}
        >
          <FontAwesomeIcon icon={menu.icon} className="w-6" />
          <span className="ml-3">{menu.label}</span>
        </a> 
          ))}
      </nav>
    </div>
  );
};

export default Sidebar; 