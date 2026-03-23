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


export const updateProfile = async (formData) => {
  const response = await api.put(
    "/auth/update-profile", 
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};