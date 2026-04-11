import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../common/LogoutButton";
import NotificationBell from "../common/NotificationBell";
import { User, ShieldCheck } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
//navbar
function Navbar() {
  const { user } = useAuth();

  const getInitials = (name) =>
    name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <header
      className="sticky top-0 z-40 h-20 flex items-center justify-between px-8 
      bg-white/70 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300"
    >
      {/* --- LEFT SECTION --- */}
      <div className="flex items-center gap-4 group cursor-default">
        {/* Modern Logo Icon */}
        <div className="relative">
          <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg shadow-slate-200 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <ShieldCheck className="text-indigo-400" size={20} />
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">
            Grievance<span className="text-indigo-600 italic">.</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {user?.role || "Citizen"} Portal
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className="flex items-center gap-6">
        
        {/* Activity Icons */}
        <div className="flex items-center gap-2 border-r border-slate-200 pr-6 mr-2">
          <NotificationBell />
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="hidden md:flex flex-col text-right leading-tight">
            <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {user?.name || "Anonymous"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {user?.location?.city || "Location Pending"}
            </span>
          </div>

          {/* Avatar Container */}
          <div className="relative">
            <div className="h-11 w-11 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center transition-all group-hover:shadow-md group-hover:border-indigo-100">
              {user?.profilePhoto ? (
                <img
                  src={`${BASE_URL}${user.profilePhoto}`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-slate-400 font-black text-sm tracking-tighter">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="border-l border-slate-200 pl-4">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

export default Navbar;