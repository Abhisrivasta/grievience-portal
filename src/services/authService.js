import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );
  return response.data;
};


export const getMyComplaints = async () => {
  const response = await api.get("/complaints/my");
  return response.data;
};
