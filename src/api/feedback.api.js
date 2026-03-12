import api from "./axios";

export const submitFeedback = async (data) => {
  const res = await api.post("/feedback", data);
  return res.data;
};

export const getAllFeedback = async () => {
  const res = await api.get("/feedback");
  return res.data;
};