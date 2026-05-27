import api from "./axios";

const handleError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Something went wrong";
  throw new Error(message);
};

// LOGIN
export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data.data;
  } catch (err) {
    handleError(err);
  }
};

// REGISTER
export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  } catch (err) {
    handleError(err);
  }
};

// GET PROFILE
export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile");
    return res.data.data;
  } catch (err) {
    handleError(err);
  }
};

// UPDATE PROFILE
export const updateProfile = async (formData) => {
  try {
    const res = await api.put("/auth/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (err) {
    handleError(err);
  }
};

// GOOGLE LOGIN
export const googleLogin = async (idToken) => {
  try {
    const res = await api.post(
      "/auth/google",
      { idToken },
      {
        withCredentials: true, 
      }
    );
    return res.data.data;
  } catch (err) {
    handleError(err);
  }
};