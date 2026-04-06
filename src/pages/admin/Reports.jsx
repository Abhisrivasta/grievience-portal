/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  getComplaintAnalytics,
  exportComplaintsCSV,
  getOfficerPerformance,
} from "../../api/report.api";

function Reports() {
  const [analytics, setAnalytics] = useState([]);
  const [officerReport, setOfficerReport] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    fromDate: "",
    toDate: "",
  });

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, officerRes] = await Promise.all([
        getComplaintAnalytics(filters),
        getOfficerPerformance({ page, limit: 5 }),
      ]);

      setAnalytics(analyticsRes.data);
      setOfficerReport(officerRes.data);
    } catch (err) {
      setError("Failed to fetch reporting data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, page]);

  /* ================= EXPORT ================= */
  const handleExport = async () => {
    const res = await exportComplaintsCSV(filters);
    const blob = new Blob([res.data], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `report-${Date.now()}.csv`;
    a.click();
  };

  /* ================= UI ================= */
  return (
    <MainLayout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-white to-blue-100">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              📊 Reports Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Track complaints & performance insights
            </p>
          </div>

          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-lg"
          >
            ⬇ Export CSV
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3">

          <select
            className="border p-2 rounded"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="In Progress">In Progress</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={filters.fromDate}
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={filters.toDate}
            onChange={(e) =>
              setFilters({ ...filters, toDate: e.target.value })
            }
          />

          <button
            onClick={() =>
              setFilters({ status: "", fromDate: "", toDate: "" })
            }
            className="bg-red-500 text-white px-3 rounded"
          >
            Reset
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <p className="text-center py-10 animate-pulse">
            Loading dashboard...
          </p>
        ) : (
          <>
            {/* ANALYTICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {analytics.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-xl shadow-lg p-5 hover:scale-105 transition"
                >
                  <p className="text-xs text-slate-400 uppercase">
                    {a._id}
                  </p>
                  <h2 className="text-3xl font-bold text-indigo-600">
                    {a.count}
                  </h2>
                </div>
              ))}
            </div>

            {/* OFFICER TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b font-semibold">
                🏆 Officer Performance
              </div>

              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Officer</th>
                    <th className="p-3">Resolved</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {officerReport.map((o) => (
                    <tr key={o.officerId} className="border-t">
                      <td className="p-3">
                        <p className="font-semibold">
                          {o.officerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {o.officerEmail}
                        </p>
                      </td>

                      <td className="p-3 text-center">
                        {o.resolvedCount}
                      </td>

                      <td className="p-3 text-center">
                        {o.avgResolutionTime.toFixed(1)}d
                      </td>

                      <td className="p-3 text-center">
                        ⭐ {o.averageRating.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="flex justify-center gap-3 p-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-slate-200 rounded"
                >
                  Prev
                </button>

                <span>{page}</span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 bg-slate-200 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Reports;