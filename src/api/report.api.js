import api from "./axios";

export const getOverviewMetrics = async () => {
  const res = await api.get("/reports/overview");
  return res.data;
};


export const getComplaintAnalytics = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/reports/complaints?${query}`);
  return res.data;
};

export const exportComplaintsCSV = async () => {
  const res = await api.get("/reports/export/csv", {
    responseType: "blob",
  });
  return res;
};


export const getOfficerPerformance = async () => {
  const res = await api.get(
    "/reports/officers/performance"
  );
  return res.data;
};
