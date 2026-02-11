import api from "./axios";

/* =======================
   CITIZEN
======================= */

export const getMyComplaints = async () => {
  const res = await api.get("/complaints/my");
  return res.data;
};

export const getComplaintById = async (id) => {
  const res = await api.get(`/complaints/${id}`);
  return res.data;
};

export const createComplaint = async (data) => {
  const res = await api.post("/complaints", data);
  return res.data;
};

/* =======================
   OFFICER
======================= */

export const getAssignedComplaints = async () => {
  const res = await api.get("/complaints/assigned");
  return res.data;
};

export const updateComplaintStatus = async (id, data) => {
  const res = await api.put(`/complaints/${id}/status`, data);
  return res.data;
};

/* =======================
   ADMIN
======================= */

export const getAllComplaints = async () => {
  const res = await api.get("/complaints");
  return res.data.data; // ONLY complaints array
};

export const assignComplaint = async (id, data) => {
  const res = await api.put(`/complaints/${id}/assign`, data);
  return res.data;
};


// Officer complaint detail
export const getComplaintForOfficer = async (id) => {
  const res = await api.get(`/complaints/officer/${id}`);
  return res.data;
};
