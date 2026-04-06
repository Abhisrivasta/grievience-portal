
import api from "./axios";

export const getHomePage = async () => {
  const res = await api.get("/home");
  return res.data;
};

export const upsertHomePage = async (data) => {
  const res = await api.post("/home", data);
  return res.data;
};