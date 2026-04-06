import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarLinks } from "../../utils/sidebarLinks";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 flex items-center justify-center text-gray-400">
        Loading...
      </aside>
    );
  }

  const base =
    "group relative flex items-center gap-3 px-3 py-2 rounded-lg transition";

  const active =
    "bg-slate-800 text-white";

  const inactive =
    "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col 
      bg-slate-900 border-r border-slate-800
      transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        {!collapsed && (
          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-wide">
              Government Portal
            </p>
            <h1 className="text-sm font-semibold text-white">
              Grievance System
            </h1>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-slate-800 text-white"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* PROFILE */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-lg bg-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {user.name?.[0] || "U"}
          </div>

          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {user.role}
            </p>
          </div>
        </div>
      )}

      {/* NAV */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 text-sm">

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <User size={18} />
          {!collapsed && <span>My Profile</span>}
        </NavLink>

        <div className="my-3 border-t border-slate-800" />

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
      </div>

      {/* FOOTER */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800">
          <div className="rounded-lg bg-slate-800 p-3 text-xs text-slate-400">
            <p className="font-medium text-white">Version 1.0</p>
            <p className="mt-1 text-sm font-semibold text-white">
              Smart Grievance System
            </p>
            <p className="text-[11px] mt-1">
              Fast • Transparent • Reliable
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;