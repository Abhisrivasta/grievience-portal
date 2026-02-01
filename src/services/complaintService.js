import api from "./api";

export const createComplaint = async (data) => {
  const response = await api.post(
    "/complaints",
    data
  );
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await api.get(
    "/complaints/my"
  );
  return response.data;
};

export const getComplaintDetails = async (
  id
) => {
  const response = await api.get(
    `/complaints/${id}`
  );
  return response.data;
};


export const submitFeedback = async (data) => {
  const response = await api.post(
    "/feedback",
    data
  );
  return response.data;
};


export const getAssignedComplaints = async () => {
  const response = await api.get(
    "/complaints/assigned"
  );
  return response.data;
};


export const updateComplaintStatus = async (
  id,
  data
) => {
  const response = await api.put(
    `/complaints/${id}/status`,
    data
  );
  return response.data;
};

