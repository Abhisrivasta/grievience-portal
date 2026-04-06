import api from "./axios";

/* =========================================================
   🔹 Helper: Clean Query Builder
========================================================= */
const buildQueryString = (params = {}) => {
  const cleanParams = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];

    // remove empty values
    if (value !== "" && value !== null && value !== undefined) {
      cleanParams[key] = value;
    }
  });

  return new URLSearchParams(cleanParams).toString();
};

/* =========================================================
   🔹 Overview Metrics
   GET /reports/overview
========================================================= */
export const getOverviewMetrics = async () => {
  try {
    const res = await api.get("/reports/overview");
    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to fetch overview metrics" };
  }
};


export const getComplaintAnalytics = async (params = {}) => {
  try {
    const query = buildQueryString(params);

    const res = await api.get(`/reports/complaints?${query}`);

    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to fetch complaint analytics" };
  }
};


export const exportComplaintsCSV = async (params = {}) => {
  try {
    const query = buildQueryString(params);

    const res = await api.get(`/reports/export/csv?${query}`, {
      responseType: "blob",
    });

    return res;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to export CSV" };
  }
};


export const getOfficerPerformance = async (params = {}) => {
  try {
    const query = buildQueryString(params);

    const res = await api.get(
      `/reports/officers/performance?${query}`
    );

    return res.data;
  } catch (error) {
    throw error?.response?.data || { message: "Failed to fetch officer performance" };
  }
};

export const downloadCSV = (response, filename = "report.csv") => {
  try {
    const blob = new Blob([response.data], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV download failed:", error);
  }
};