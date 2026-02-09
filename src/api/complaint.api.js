import api from "./axios";

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


export const getAssignedComplaints = async () => {
  const res = await api.get("/complaints/assigned");
  return res.data;
};


export const updateComplaintStatus = async (id, data) => {
  const res = await api.put(
    `/complaints/${id}/status`,
    data
  );
  return res.data;
};
