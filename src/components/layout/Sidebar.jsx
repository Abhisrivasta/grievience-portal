import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarLinks } from "../../utils/sidebarLinks";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  if (!user) return null;

  const base =
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150";

  const active =
    "bg-blue-900 text-white font-medium";

  const inactive =
    "text-blue-200 hover:bg-blue-900/60 hover:text-white";

  return (
    <aside
      className={`shrink-0 h-auto
      bg-blue-950 border-r border-blue-900
      transition-all duration-300
      ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-blue-900">
        {!collapsed && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-blue-300">
              Government Portal
            </p>
            <h1 className="text-sm font-semibold text-white">
              Grievance System
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-blue-300 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 space-y-1 text-sm">
        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <User size={18} />
          {!collapsed && <span>My Profile</span>}
        </NavLink>

        <div className="my-4 border-t border-blue-900" />

        {/* Role based links */}
        {sidebarLinks[user.role]?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            {item.icon && <item.icon size={18} />}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
