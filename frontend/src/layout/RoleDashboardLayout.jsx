import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/ui/DashboardSidebar";

export default function RoleDashboardLayout({ title, items }) {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-inner">
        <div className="bg-transparent rounded-xl overflow-hidden lg:flex">
          <DashboardSidebar title={title} items={items} />
          <main className="flex-1 p-4 lg:p-6">
            <div className="card-modern">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
