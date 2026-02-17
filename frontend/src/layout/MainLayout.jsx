import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
