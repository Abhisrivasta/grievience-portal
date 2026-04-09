import api from "./axios";

// Public: Get About Page data
export const getAboutContent = async () => {
  const res = await api.get("/about");
  return res.data;
};

// Admin Only: Update About Page data
export const updateAboutContent = async (formData) => {
  const res = await api.put("/about", formData);
  return res.data;
};