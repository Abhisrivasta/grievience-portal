import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getOverviewMetrics,
  getComplaintAnalytics,
} from "../../services/reportService";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOverviewMetrics(),
      getComplaintAnalytics(),
    ])
      .then(([metricsRes, analyticsRes]) => {
        setMetrics(metricsRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch(() => {
        alert("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading dashboard...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-6">
        Admin Dashboard
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Kpi title="Total Complaints" value={metrics.totalComplaints} />
        <Kpi title="Pending" value={metrics.pending} />
        <Kpi title="Resolved" value={metrics.resolved} />
        <Kpi title="Avg Rating" value={metrics.avgRating || 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">
            Complaints by Status
          </h3>
          <BarChart data={analytics.byStatus} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">
            Complaints Over Time
          </h3>
          <LineChart data={analytics.byDate} />
        </div>
      </div>
    </PageWrapper>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
