import { createContext, useContext, useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../api/notification.api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!user) return;
    const res = await getNotifications();
    setNotifications(res.data);
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    const res = await getUnreadCount();
    setUnreadCount(res.count);
  };

  const readNotification = async (id) => {
    await markAsRead(id);
    loadNotifications();
    loadUnreadCount();
  };

  useEffect(() => {
    (async () => {
      await loadNotifications();
      await loadUnreadCount();
    })();
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        readNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
