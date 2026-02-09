import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarLinks } from "../../utils/sidebarLinks";

function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside
      style={{
        width: "220px",
        borderRight: "1px solid #ddd",
        padding: "16px",
      }}
    >
      <nav>
        <Link to="/profile">My Profile</Link>
        <hr />

        {sidebarLinks[user.role]?.map((item) => (
          <div key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
