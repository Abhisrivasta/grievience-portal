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
      {/* Page Background */}
      <div className="min-h-full bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">
        <div className="px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              System-wide overview of grievances, resolution progress, and citizen feedback.
            </p>
          </div>

          {/* States */}
          {loading && (
            <p className="text-slate-600 text-sm">
              Loading dashboard data…
            </p>
          )}

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          {/* Metrics Cards */}
          {metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
                <p className="text-sm text-slate-600">
                  Total Complaints
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.totalComplaints}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
                <p className="text-sm text-slate-600">
                  Pending
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.pendingComplaints}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
                <p className="text-sm text-slate-600">
                  In Progress
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.inProgressComplaints}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
                <p className="text-sm text-slate-600">
                  Resolved
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.resolvedComplaints}
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-5">
                <p className="text-sm text-slate-600">
                  Average Rating
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {metrics.averageRating ?? "—"}
                </p>
              </div>

            </div>
          )}

          {/* Info Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-6 max-w-3xl">
            <h3 className="font-medium text-slate-900 mb-1">
              Administrative Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This dashboard provides a consolidated view of grievance handling
              across departments. Administrators can monitor workload, resolution
              efficiency, and overall citizen satisfaction to ensure transparency
              and accountability.
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;
