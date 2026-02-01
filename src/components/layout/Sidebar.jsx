import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menus = {
    citizen: [
      { path: "/citizen", label: "Dashboard" },
      { path: "/citizen/complaints", label: "My Complaints" },
      { path: "/citizen/new", label: "New Complaint" },
    ],
    officer: [
      { path: "/officer", label: "Dashboard" },
      { path: "/officer/assigned", label: "Assigned Complaints" },
    ],
    admin: [
      { path: "/admin", label: "Dashboard" },
      { path: "/admin/departments", label: "Departments" },
      { path: "/admin/officers", label: "Officers" },
      { path: "/admin/reports", label: "Reports" },
      { path: "/admin/audit", label: "Audit Logs" },
    ],
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <ul className="p-4 space-y-2">
        {menus[user.role]?.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
