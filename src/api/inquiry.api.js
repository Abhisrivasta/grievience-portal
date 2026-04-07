import api from "./axios";

export const getAllInquiries = () => api.get("/inquiries");
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);