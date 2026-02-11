import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function LogoutButton({ collapsed = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Adding a small confirmation for better UX
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        flex items-center gap-3 w-full px-4 py-3 
        text-slate-600 hover:text-red-600 
        hover:bg-red-50 rounded-xl transition-all duration-200 
        group active:scale-95
      `}
    >
      {/* Logout Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>

      {/* Label - hidden if collapsed is true (useful for sidebars) */}
      {!collapsed && (
        <span className="font-semibold text-sm">Sign Out</span>
      )}
    </button>
  );
}

export default LogoutButton;