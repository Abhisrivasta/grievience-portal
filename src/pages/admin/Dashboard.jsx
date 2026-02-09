import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getOverviewMetrics } from "../../api/report.api";

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getOverviewMetrics();
        setMetrics(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <MainLayout>
      <h2>Admin Dashboard</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {metrics && (
        <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
          <div style={{ border: "1px solid #ddd", padding: "16px" }}>
            <h4>Total Complaints</h4>
            <p>{metrics.totalComplaints}</p>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "16px" }}>
            <h4>Pending</h4>
            <p>{metrics.pendingComplaints}</p>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "16px" }}>
            <h4>In Progress</h4>
            <p>{metrics.inProgressComplaints}</p>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "16px" }}>
            <h4>Resolved</h4>
            <p>{metrics.resolvedComplaints}</p>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "16px" }}>
            <h4>Average Rating</h4>
            <p>{metrics.averageRating}</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default AdminDashboard;
