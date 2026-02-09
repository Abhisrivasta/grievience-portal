import api from "./axios";

export const getOverviewMetrics = async () => {
  const res = await api.get("/reports/overview");
  return res.data;
};
