import { useAuth } from "../../contexts/AuthContext";
import LogoutButton from "../common/LogoutButton";
import NotificationBell from "../common/NotificationBell";

function Navbar() {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: "60px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <h3>Grievance Portal</h3>

      <div style={{ display: "flex", gap: "12px" }}>
        <NotificationBell />
        <span>{user?.name}</span>
        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;
