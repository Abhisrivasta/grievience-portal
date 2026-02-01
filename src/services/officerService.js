import api from "./api";

export const getOfficers = async () => {
  const response = await api.get("/officers");
  return response.data;
};

export const updateOfficer = async (
  id,
  data
) => {
  const response = await api.put(
    `/officers/${id}`,
    data
  );
  return response.data;
};
