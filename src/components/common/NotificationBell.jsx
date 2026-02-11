import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../contexts/NotificationContext";

function NotificationBell() {
  const { notifications, unreadCount, readNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Icon & Unread Badge */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all active:scale-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
              {unreadCount} New
            </span>
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && readNotification(n._id)}
                  className={`
                    px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors
                    ${n.isRead ? "bg-white opacity-70" : "bg-blue-50/50 hover:bg-blue-50"}
                  `}
                >
                  <div className="flex gap-3">
                    {!n.isRead && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 shrink-0"></div>
                    )}
                    <div className="flex-1">
                      <p className={`text-sm leading-snug ${n.isRead ? "text-slate-600" : "text-slate-900 font-medium"}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        {new Date(n.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 transition-colors uppercase tracking-wider">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;