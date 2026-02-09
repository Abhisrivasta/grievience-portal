import api from "./axios";

export const getOfficers = async () => {
  const res = await api.get("/officers");
  return res.data;
};

export const upsertOfficerProfile = async (data) => {
  const res = await api.post(
    "/officers/profile",
    data
  );
  return res.data;
};
