import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../common/LogoutButton";
import NotificationBell from "../common/NotificationBell";

function Navbar() {
  const { user } = useAuth();

  const getInitials = (name) =>
    name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <header
      className={`sticky top-0 z-40 h-16 flex items-center justify-between px-6 
      bg-white/80 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300`}
    >

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow">
          <span className="text-white font-bold">GP</span>
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-lg font-semibold text-slate-900">
            Grievance Portal
          </span>
          <span className="text-xs text-blue-600 uppercase tracking-wide">
            {user?.role || "User"} Dashboard
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <NotificationBell />

        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-800">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-slate-500 truncate max-w-[150px]">
            {user?.email}
          </span>
        </div>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow">
          {getInitials(user?.name)}
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;