import api from "./axios";

export const createInquiry = (data) => api.post("/inquiries", data);
export const getAllInquiries = () => api.get("/inquiries");
export const updateInquiry = (id, data) => api.put(`/inquiries/${id}`, data);
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);