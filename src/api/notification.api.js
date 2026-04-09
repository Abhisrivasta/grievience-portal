import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get(
    "/notifications/unread-count"
  );
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await api.put(
    `/notifications/${id}/read`
  );
  return res.data;
};


export const sendBulkNotification = async (data) => {
  const res = await api.post(
    "/notifications/bulk",
    data
  );
  return res.data;
};


export const sendSingleNotification = async (data) => {
  const res = await api.post("/notifications/single", data);
  return res.data;
};


export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};