import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarLinks } from "../../utils/sidebarLinks";
import {
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) { 
   const { user } = useAuth();

  if (!user) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-64 bg-black flex items-center justify-center text-gray-400">
        Loading...
      </aside>
    );
  }

  const base =
    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300";

  const active =
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.02]";

  const inactive =
    "text-gray-300 hover:bg-white/10 hover:text-white";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col 
      bg-black/80 backdrop-blur-2xl border-r border-white/10
      transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400">
              Government Portal
            </p>
            <h1 className="text-sm font-semibold text-white">
              Grievance System
            </h1>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* 🔥 PROFILE */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold shadow">
            {user.name?.[0] || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-blue-400 capitalize">
              {user.role}
            </p>
          </div>
        </div>
      )}

      {/* 🔥 NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 text-sm">

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <User size={18} />

          {!collapsed && <span>My Profile</span>}

          {/* Tooltip */}
          {collapsed && (
            <span className="absolute left-14 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              My Profile
            </span>
          )}
        </NavLink>

        <div className="my-3 border-t border-white/10" />

        {/* Dynamic Links */}
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

            {/* Tooltip */}
            {collapsed && (
              <span className="absolute left-14 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* 🔥 FOOTER */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-3 text-xs text-gray-300">
            <p className="font-medium">🚀 Version 1.0</p>
            <p className="mt-1 text-white text-sm font-semibold">
              Smart Grievance System
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Fast • Transparent • Reliable
            </p>
          </div>
        </div>
      )}

      {/* Collapsed Footer */}
      {collapsed && (
        <div className="p-3 text-center text-blue-400 text-lg">
          🚀
        </div>
      )}
    </aside>
  );
}

export default Sidebar;