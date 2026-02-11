import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../common/LogoutButton";
import NotificationBell from "../common/NotificationBell";

function Navbar() {
  const { user } = useAuth();

  // User ke naam se initials nikalne ke liye (e.g., "John Doe" -> "JD")
  const getInitials = (name) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
            Grievance Portal
          </span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            {user?.role} Dashboard
          </span>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative group">
          <NotificationBell />
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 leading-none">
              {user?.name}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              {user?.email}
            </span>
          </div>

          {/* User Avatar Circle */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
            {getInitials(user?.name)}
          </div>
        </div>

        {/* Logout (Styled differently for Navbar) */}
        <div className="border-l border-slate-200 pl-4 hidden sm:block">
           <LogoutButton collapsed={true} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;