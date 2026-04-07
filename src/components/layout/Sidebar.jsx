import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarLinks } from "../../utils/sidebarLinks";
import { ChevronLeft, ChevronRight, User, ShieldCheck } from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  if (!user) return null;

  const base = "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 my-1 mx-2";
  const active = "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20";
  const inactive = "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0f172a] border-r border-slate-800 z-50 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="text-indigo-500" size={20} />
            <span className="text-xs font-black text-white uppercase tracking-widest">Portal</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all ${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* PROFILE CARD */}
      {!collapsed && (
        <div className="p-4 animate-in slide-in-from-left-2">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
               {user.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* NAV LINKS */}
      <nav className="mt-4 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        <NavLink to="/profile" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          <User size={18} />
          {!collapsed && <span className="text-xs font-bold uppercase tracking-widest">My Profile</span>}
        </NavLink>

        <div className="my-4 border-t border-slate-800/50 mx-4" />

        {sidebarLinks[user.role]?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            {item.icon && <item.icon size={18} />}
            {!collapsed && <span className="text-xs font-bold uppercase tracking-widest truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;