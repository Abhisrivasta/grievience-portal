import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarLinks } from "../../utils/sidebarLinks";
import { 
  ChevronLeft, ChevronRight, User, ShieldCheck, 
  LayoutDashboard, FileText, Settings, Users, 
  MessageSquare, Bell, Database, HardDrive 
} from "lucide-react";

// Icons Map (Taaki sidebarLinks ke labels ke hisab se icon dikhe)
const iconMap = {
  "Dashboard": LayoutDashboard,
  "Home Page": Settings,
  "Inquiry Page": MessageSquare,
  "Departments": Database,
  "Officers": Users,
  "Assign Complaints": ShieldCheck,
  "Reports": FileText,
  "Audit Logs": HardDrive,
  "Complaints": FileText,
  "Bulk Notifications": Bell,
  "Feedback": MessageSquare,
  "My Complaints": FileText,
  "New Complaint": ShieldCheck
};

function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  if (!user) return null;

  const base = "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 my-1 mx-2";
  const active = "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20";
  const inactive = "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0f172a] border-r border-slate-800 z-50 transition-all duration-300 flex flex-col
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="text-indigo-500" size={20} />
            <span className="text-xs font-black text-white uppercase tracking-widest">Grievance</span>
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
        <div className="p-4 animate-in slide-in-from-left-2 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg uppercase">
               {user.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate uppercase tracking-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* NAV LINKS */}
      <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto custom-scrollbar pb-6">
        <NavLink to="/profile" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          <User size={18} />
          {!collapsed && <span className="text-xs font-bold uppercase tracking-widest">My Profile</span>}
        </NavLink>

        <div className="my-4 border-t border-slate-800/50 mx-4" />

        {sidebarLinks[user.role]?.map((item) => {
          // Icon mapping logic
          const Icon = iconMap[item.label] || FileText; 
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-xs font-bold uppercase tracking-widest truncate">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;