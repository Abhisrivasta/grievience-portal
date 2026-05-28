import { useEffect, useRef, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    refreshNotifications,
    readNotification,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleRead = async (notification) => {
    if (!notification?.isRead && !notification?.read) {
      await readNotification(notification._id);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-900">
              Notifications
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications.map((notification) => {
                const isUnread = !notification.isRead && !notification.read;

                return (
                  <div
                    key={notification._id}
                    onClick={() => handleRead(notification)}
                    className={`group flex cursor-pointer gap-3 border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 ${
                      isUnread ? "bg-indigo-50/60" : "bg-white"
                    }`}
                  >
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        isUnread ? "bg-indigo-500" : "bg-slate-300"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {notification.title || "Notification"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {notification.message || notification.body}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 size={15} className="text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center text-sm text-slate-400">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;