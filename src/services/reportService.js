import api from "./api";

export const getOverviewMetrics = async () => {
  const response = await api.get(
    "/reports/overview"
  );
  return response.data;
};

export const getComplaintAnalytics = async () => {
  const response = await api.get(
    "/reports/complaints"
  );
  return response.data;
};


export const getOfficerPerformance = async () => {
  const response = await api.get(
    "/reports/officers/performance"
  );
  return response.data;
};

export const exportComplaintsCSV = async () => {
  const response = await api.get(
    "/reports/export/csv",
    { responseType: "blob" }
  );
  return response;
};
