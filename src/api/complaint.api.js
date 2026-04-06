import api from "./axios";

// 👤 CITIZEN

// Get my complaints (with filters, pagination)
export const getMyComplaints = async (params = {}) => {
  const res = await api.get("/complaints/my", { params });
  return res.data;
};

// Get single complaint (UPDATED ROUTE)
export const getComplaintById = async (id) => {
  const res = await api.get(`/complaints/citizen/${id}`);
  return res.data;
};

// Create complaint
export const createComplaint = async (data) => {
  const res = await api.post("/complaints", data);
  return res.data;
};


// 👨‍💼 OFFICER

// Get assigned complaints (with filters, search, pagination)
export const getAssignedComplaints = async (params = {}) => {
  const res = await api.get("/complaints/assigned", { params });
  return res.data;
};

// Get single complaint (officer view)
export const getComplaintForOfficer = async (id) => {
  const res = await api.get(`/complaints/officer/${id}`);
  return res.data;
};

// Update complaint status
export const updateComplaintStatus = async (id, data) => {
  const res = await api.put(`/complaints/${id}/status`, data);
  return res.data;
};


// 👑 ADMIN

// Get all complaints (FULL POWER API)
export const getAllComplaints = async (params = {}) => {
  const res = await api.get("/complaints", { params });
  return res.data;
};

// Assign complaint to officer
export const assignComplaint = async (id, data) => {
  const res = await api.put(`/complaints/${id}/assign`, data);
  return res.data;
};