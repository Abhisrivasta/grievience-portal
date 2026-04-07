/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { 
  BarChart3, Download, Calendar, Filter, 
  RotateCcw, Trophy, Clock, Star, 
  ChevronLeft, ChevronRight, Loader2, FileSpreadsheet
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import {
  getComplaintAnalytics,
  exportComplaintsCSV,
  getOfficerPerformance,
} from "../../api/report.api";

function Reports() {
  const [analytics, setAnalytics] = useState([]);
  const [officerReport, setOfficerReport] = useState([]);
  const [filters, setFilters] = useState({ status: "", fromDate: "", toDate: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

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
      setError("Failed to synchronize reporting metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filters, page]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await exportComplaintsCSV(filters);
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `official-report-${Date.now()}.csv`;
      a.click();
    } catch (err) {
      alert("Export failed. Try again later.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <BarChart3 className="text-indigo-600" size={32} />
              Insights & Analytics
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Comprehensive System Performance Audit</p>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-3 bg-emerald-600 hover:bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="animate-spin" size={16} /> : <FileSpreadsheet size={16} />}
            {exporting ? "Generating..." : "Export CSV Data"}
          </button>
        </div>

        {/* --- SMART FILTERS --- */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-wrap items-end gap-6">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Filter size={12} /> Status Filter
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Lifecycle Status</option>
              <option value="Pending">Pending Assignment</option>
              <option value="Resolved">Resolved Cases</option>
              <option value="In Progress">Active Investigations</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar size={12} /> From Date
            </label>
            <input
              type="date"
              className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar size={12} /> To Date
            </label>
            <input
              type="date"
              className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>

          <button
            onClick={() => setFilters({ status: "", fromDate: "", toDate: "" })}
            className="p-3.5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all shadow-inner"
            title="Reset Filters"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Crunching Live Data...</p>
          </div>
        ) : (
          <>
            {/* ANALYTICS SUMMARY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {analytics.map((a) => (
                <div key={a._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-2 transition-all duration-500">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-600 transition-colors">
                    {a._id || "Unclassified"}
                  </p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
                      {a.count}
                    </h2>
                    <span className="text-[10px] font-bold text-slate-300 uppercase mb-2">Total</span>
                  </div>
                </div>
              ))}
            </div>

            {/* PERFORMANCE LEADERBOARD */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <Trophy className="text-amber-500" size={20} /> Officer Efficiency Index
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-6">Official Identity</th>
                      <th className="px-8 py-6 text-center">Resolved</th>
                      <th className="px-8 py-6 text-center">Avg. Duration</th>
                      <th className="px-8 py-6 text-center">Satisfaction</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {officerReport.map((o) => (
                      <tr key={o.officerId} className="hover:bg-slate-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center font-black">
                              {o.officerName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800">{o.officerName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{o.officerEmail}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
                            {o.resolvedCount}
                          </span>
                        </td>

                        <td className="px-8 py-6 text-center">
                           <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-slate-700 tracking-tight flex items-center gap-1">
                                <Clock size={12} className="text-slate-300" /> {o.avgResolutionTime.toFixed(1)} Days
                              </span>
                           </div>
                        </td>

                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-black">
                            <Star size={12} fill="currentColor" /> {o.averageRating.toFixed(1)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between p-8 bg-slate-50/50">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Registry Page {page}
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <ChevronRight size={18} />
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