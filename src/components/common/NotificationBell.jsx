import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../contexts/NotificationContext";

function NotificationBell() {
  const { notifications, unreadCount, readNotification } =
    useNotifications();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <button onClick={() => setOpen((o) => !o)}>
        🔔 {unreadCount > 0 && `(${unreadCount})`}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "300px",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px",
            zIndex: 100,
          }}
        >
          {notifications.length === 0 && (
            <p>No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              style={{
                padding: "6px",
                marginBottom: "4px",
                background: n.isRead
                  ? "#f9f9f9"
                  : "#eef6ff",
                cursor: "pointer",
              }}
              onClick={() =>
                !n.isRead &&
                readNotification(n._id)
              }
            >
              <p>{n.message}</p>
              <small>
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
