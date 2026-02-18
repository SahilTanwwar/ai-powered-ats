import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-8">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
