import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-xl text-sm font-medium ${
    isActive ? "bg-[#e9edff] text-gray-900" : "text-gray-600 hover:bg-gray-100"
  }`;

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="text-2xl font-bold text-gray-900 mb-10">Hirezy</div>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/jobs" className={linkClass}>
          Jobs
        </NavLink>
        <NavLink to="/candidates" className={linkClass}>
          Candidates
        </NavLink>
        <NavLink to="/analytics" className={linkClass}>
          Analytics
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
