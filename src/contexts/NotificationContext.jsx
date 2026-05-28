/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

const getNotificationAPI = () => import("../api/notification.api");

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { getNotifications } = await getNotificationAPI();
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      const { getUnreadCount } = await getNotificationAPI();
      const res = await getUnreadCount();
      setUnreadCount(res.count || 0);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const refreshNotifications = async () => {
    if (!user) return;

    await Promise.all([loadNotifications(), loadUnreadCount()]);
  };

  const readNotification = async (id) => {
    if (!user) return;

    try {
      const { markAsRead } = await getNotificationAPI();
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true, read: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    if (!user) return;

    try {
      const { deleteNotification } = await getNotificationAPI();
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );

      await loadUnreadCount();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loadNotifications,
        loadUnreadCount,
        refreshNotifications,
        readNotification,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);