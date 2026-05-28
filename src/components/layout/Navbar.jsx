import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../common/LogoutButton";
import NotificationBell from "../common/NotificationBell";
import { ShieldCheck, ChevronDown } from "lucide-react";

function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ INITIALS
  const getInitials = (name) =>
    name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-slate-200/60">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg rotate-3 hover:rotate-0 transition">
            <ShieldCheck className="text-indigo-400" size={20} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        <div>
          <h1 className="text-lg font-black text-slate-900">
            Grievance<span className="text-indigo-600 italic">.</span>
          </h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {user.role} Portal
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATIONS */}
        <div className="border-r pr-6">
          <NotificationBell />
        </div>

        {/* USER */}
        <div ref={dropdownRef} className="relative">

          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* AVATAR */}
            <div className="relative">
              <div className="h-11 w-11 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <span className="text-slate-500 font-bold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>

              {/* ONLINE DOT */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* NAME */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800">
                {user.name}
              </span>
              <span className="text-xs text-slate-400">
                {user.location?.city || "No Location"}
              </span>
            </div>

            <ChevronDown size={16} className="text-slate-500" />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-xl border p-3 animate-fadeIn">

              {/* USER INFO */}
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-800">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400">
                  {user.email}
                </p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">
                  {user.role}
                </p>
              </div>

              <div className="border-t my-2"></div>

              {/* LOGOUT */}
              <LogoutButton />

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;