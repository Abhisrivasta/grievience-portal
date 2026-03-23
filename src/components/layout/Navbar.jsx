import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../common/LogoutButton";
import NotificationBell from "../common/NotificationBell";

function Navbar() {
  const { user } = useAuth();

  const getInitials = (name) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm">

      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <span className="text-white font-bold">GP</span>
        </div>

        <div className="flex flex-col">
          <span className="text-lg font-bold text-slate-900">
            Grievance Portal
          </span>
          <span className="text-xs text-blue-600 uppercase">
            {user?.role || "User"} Dashboard
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">

        <NotificationBell />

        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-800">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-slate-500">
            {user?.email}
          </span>
        </div>

        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {getInitials(user?.name)}
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;
