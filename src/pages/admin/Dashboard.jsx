import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getOverviewMetrics } from "../../api/report.api";
import {
  FileText,
  Clock,
  Loader,
  CheckCircle,
  Star,
} from "lucide-react";

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

  const cards = [
    {
      title: "Total Complaints",
      value: metrics?.totalComplaints,
      icon: FileText,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Pending",
      value: metrics?.pendingComplaints,
      icon: Clock,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "In Progress",
      value: metrics?.inProgressComplaints,
      icon: Loader,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Resolved",
      value: metrics?.resolvedComplaints,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Avg Rating",
      value: metrics?.averageRating ?? "—",
      icon: Star,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            👋 Welcome Admin
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor complaints, track performance, and manage system efficiently.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-slate-500 animate-pulse">
            Loading dashboard...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {/* CARDS */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${card.color} hover:scale-105 transition`}
                >
                  <div className="flex items-center justify-between">
                    <Icon size={28} />
                    <span className="text-sm opacity-80">
                      {card.title}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold mt-4">
                    {card.value ?? 0}
                  </h2>
                </div>
              );
            })}
          </div>
        )}

        {/* INFO CARD */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-6 max-w-3xl shadow">
          <h3 className="text-lg font-semibold text-slate-800">
            📊 System Overview
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            This dashboard provides insights into grievance handling across departments.
            Monitor pending cases, track resolutions, and evaluate citizen satisfaction
            to improve transparency and efficiency.
          </p>
        </div>

      </div>
    </MainLayout>
  );
}

export default AdminDashboard;