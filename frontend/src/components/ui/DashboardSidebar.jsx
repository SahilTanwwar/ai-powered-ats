import { NavLink, Link } from "react-router-dom";

export default function DashboardSidebar({ title, items, footer }) {
  return (
    <aside className="w-full lg:w-72 shrink-0 bg-dark-bg border-r border-border p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-head text-lg font-semibold text-white">{title}</h2>
        <Link to="/" className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors" title="Back to Home">
          ←
        </Link>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-inner" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <IconComponent size={18} />
            <span>{item.label}</span>
          </NavLink>
        )})}
      </nav>
      {footer && <div className="mt-6">{footer}</div>}
    </aside>
  );
}
