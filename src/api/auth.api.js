import api from "./axios";

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(
    "/auth/profile"
  );
  return response.data;
};


// src/api/auth.api.js
export const updateProfile = async (formData) => {
  const response = await api.put(
    "/auth/update-profile", // Yahan dhyan dein: update-profile (hyphen)
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};