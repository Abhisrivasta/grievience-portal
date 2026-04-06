import api from "./axios";
const handleError = (err) => {
  throw err?.response?.data?.message || err.message || "Something went wrong";
};

//  LOGIN
export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data.data; 
  } catch (err) {
    handleError(err);
  }
};

//  REGISTER
export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data.data; // keep consistent
  } catch (err) {
    handleError(err);
  }
};

//  GET PROFILE
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