import api from "./axios";

export const getAuditLogs = async (page = 1, limit = 10) => {
  const res = await api.get(
    `/audit?page=${page}&limit=${limit}`
  );
  return res.data;
};
