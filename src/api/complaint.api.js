/* eslint-disable no-unused-vars */
import api from "./axios";

/**
 * Utility: Clean params (Filters empty/null values)
 */
const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
};

/**
 * Centralized Request Handler
 */
const handleRequest = async (request) => {
  try {
    const res = await request;
    return res.data; // Backend se hamesha { success, data, message } aana chahiye
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "An unexpected error occurred";
    
    console.error("API Error:", errorMessage);
    throw { message: errorMessage, status: error.response?.status };
  }
};

// --- 👤 CITIZEN SERVICES ---

// 1. Nayi Shikayat (With Image)
export const createComplaint = (formData) => 
  handleRequest(api.post("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }));

// 2. List of My Complaints
export const getMyComplaints = (params = {}) => 
  handleRequest(api.get("/complaints/my", { params: cleanParams(params) }));

// 3. 🔍 COMPLAINT DETAILS API (Citizen View)
export const getComplaintById = (id) => {
  if (!id) return Promise.reject({ message: "Complaint ID is required" });
  return handleRequest(api.get(`/complaints/citizen/${id}`));
};


// --- 👨‍💼 OFFICER SERVICES ---

// 4. Assigned List
export const getAssignedComplaints = (params = {}) => 
  handleRequest(api.get("/complaints/assigned", { params: cleanParams(params) }));

// 5. 🔍 COMPLAINT DETAILS API (Officer View)
export const getComplaintForOfficer = (id) => {
  if (!id) return Promise.reject({ message: "Complaint ID is required" });
  return handleRequest(api.get(`/complaints/officer/${id}`));
};

// 6. Update Status/Remarks
export const updateComplaintStatus = (id, data) => {
  if (!id) return Promise.reject({ message: "Complaint ID is required" });
  return handleRequest(api.put(`/complaints/${id}/status`, data));
};


// --- 👑 ADMIN SERVICES ---

// 7. Global List
export const getAllComplaints = (params = {}) => 
  handleRequest(api.get("/complaints", { params: cleanParams(params) }));

// 8. Assign to Officer
export const assignComplaint = (id, data) => {
  if (!id) return Promise.reject({ message: "Complaint ID is required" });
  return handleRequest(api.put(`/complaints/${id}/assign`, data));
};


export const updateComplaint = (id, formData) => 
  handleRequest(api.put(`/complaints/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }));

// Saare functions ko ek saath export kar rahe hain
export default {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAssignedComplaints,
  getComplaintForOfficer,
  updateComplaintStatus,
  getAllComplaints,
  assignComplaint,
  updateComplaint
};