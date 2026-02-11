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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, officerRes] = await Promise.all([
        getComplaintAnalytics(),
        getOfficerPerformance(),
      ]);
      setAnalytics(analyticsRes.data);
      setOfficerReport(officerRes.data);
    } catch (err) {
      setError("Failed to fetch reporting data");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = async () => {
    try {
      const res = await exportComplaintsCSV();
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `complaints-report-${new Date().toLocaleDateString()}.csv`;
      a.click();
    } catch {
      alert("Export failed");
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-8 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
            <p className="text-slate-500 text-sm">Monitor system performance and officer efficiency.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-green-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV Report
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 animate-pulse">Loading Analytics Data...</div>
        ) : (
          <div className="space-y-10">
            
            {/* Top Row: Quick Stats (Complaint Status) */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                Complaint Status Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.map((a) => (
                  <div key={a._id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{a._id}</p>
                    <p className="text-3xl font-bold text-slate-900">{a.count}</p>
                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Row: Officer Performance Table */}
            <section>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                Officer Performance Leaderboard
              </h3>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Officer Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Resolved</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Avg. Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {officerReport.map((o) => (
                      <tr key={o.officerId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 text-sm">{o.officerName}</p>
                          <p className="text-xs text-slate-500">{o.officerEmail}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {o.resolvedCount} Cases
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {o.avgResolutionTime.toFixed(1)} days
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-sm font-bold text-slate-900">{o.averageRating.toFixed(1)}</span>
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Reports;