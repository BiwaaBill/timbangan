import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100">
          {/* Outlet digunakan untuk merender komponen anak dari router */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
