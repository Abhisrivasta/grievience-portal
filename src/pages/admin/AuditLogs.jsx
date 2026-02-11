import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAuditLogs } from "../../api/audit.api";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Load logs function ko simplify kiya
  const loadLogs = async () => {
    setLoading(true);
    setError(""); // Purana error clear karein
    try {
      const res = await getAuditLogs(page); // page state se direct uthayega
      setLogs(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  // 2. Page change hone par auto-fetch
  useEffect(() => {
    loadLogs();
    // Scroll to top jab page badle
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const getActionColor = (action) => {
    const a = action.toLowerCase();
    if (a.includes('create') || a.includes('add')) return 'text-green-600 bg-green-50 border-green-100';
    if (a.includes('update') || a.includes('edit')) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (a.includes('delete') || a.includes('reject')) return 'text-red-600 bg-red-50 border-red-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  return (
    <MainLayout>
      <div className="px-6 py-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Audit Logs</h2>
            <p className="text-slate-500 mt-1">Real-time activity tracking for platform security.</p>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total Pages: {totalPages}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm mb-6">
            {error}
          </div>
        )}

        {/* Timeline Logic */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-500 font-medium">Fetching records...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400">No audit logs found for this page.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all shadow-sm flex items-start gap-4"
                >
                  <div className={`h-12 w-12 shrink-0 rounded-xl border flex items-center justify-center font-black text-lg ${getActionColor(log.action)}`}>
                    {log.action.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed">
                      <span className="font-bold text-slate-900">{log.performedBy?.name || 'System'}</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-xs font-bold text-blue-600 uppercase">{log.performedBy?.role}</span>
                      <span className="ml-2 text-slate-500 italic">initiated this event.</span>
                    </p>

                    {log.complaint && (
                      <div className="mt-3 flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                         <p className="text-xs font-semibold text-blue-700 underline cursor-pointer truncate">
                           Ref: {log.complaint.title}
                         </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && logs.length > 0 && (
          <div className="mt-10 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 border rounded-xl transition-all active:scale-95"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
               {/* Current Page Indicator */}
               <div className="h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-200">
                  {page}
               </div>
               <span className="text-slate-400 font-medium">of</span>
               <div className="h-8 w-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">
                  {totalPages}
               </div>
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 border rounded-xl transition-all active:scale-95"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AuditLogs;