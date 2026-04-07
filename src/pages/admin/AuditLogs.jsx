/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { 
  ShieldCheck, History, User, Activity, 
  ExternalLink, ChevronLeft, ChevronRight, 
  Loader2, AlertCircle, Clock
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getAuditLogs } from "../../api/audit.api";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = async () => {
    setLoading(true);
    setError(""); 
    try {
      const res = await getAuditLogs(page);  
      setLogs(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Internal server error. Unable to sync logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const getActionTheme = (action) => {
    const a = action.toLowerCase();
    if (a.includes('create') || a.includes('add')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (a.includes('update') || a.includes('edit') || a.includes('assign')) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    if (a.includes('delete') || a.includes('reject') || a.includes('remove')) return 'text-rose-600 bg-rose-50 border-rose-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <History className="text-indigo-600" size={32} />
              System Audit
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               Real-time activity logs for <span className="text-indigo-600">Platform Integrity</span>
            </p>
          </div>
          <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Total Pages: {totalPages}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3 italic animate-in slide-in-from-top-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decrypting Ledger Records...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center space-y-4">
              <ShieldCheck size={48} className="mx-auto text-slate-200" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No audit trails detected for this period.</p>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:left-11 before:top-4 before:h-[calc(100%-32px)] before:w-0.5 before:bg-slate-100">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="relative group bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:border-indigo-200 transition-all shadow-xl shadow-slate-200/30 flex items-start gap-6 ml-4"
                >
                  {/* Action Icon Wrapper */}
                  <div className={`h-14 w-14 shrink-0 rounded-2xl border-2 flex items-center justify-center font-black text-xl shadow-lg group-hover:rotate-6 transition-transform z-10 ${getActionTheme(log.action)}`}>
                    {log.action.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getActionTheme(log.action)}`}>
                        {log.action}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Clock size={12} className="text-slate-300" />
                        {new Date(log.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 text-sm">
                      <div className="h-6 w-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase">
                        {log.performedBy?.name?.[0] || 'S'}
                      </div>
                      <p className="text-slate-700 font-medium">
                        <span className="font-black text-slate-900">{log.performedBy?.name || 'System'}</span>
                        <span className="text-slate-400 mx-2 uppercase text-[10px] font-black tracking-widest">({log.performedBy?.role || 'Service'})</span>
                        <span className="text-slate-400 italic">initiated a process on the platform.</span>
                      </p>
                    </div>

                    {log.complaint && (
                      <div className="inline-flex items-center gap-3 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 group/link cursor-pointer hover:bg-indigo-600 transition-all">
                         <Activity size={14} className="text-indigo-400 group-hover/link:text-white" />
                         <p className="text-[11px] font-black text-indigo-700 group-hover/link:text-white truncate max-w-md">
                           Ref: {log.complaint.title}
                         </p>
                         <ExternalLink size={12} className="text-indigo-300 group-hover/link:text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- REFINED PAGINATION --- */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between bg-[#0f172a] px-8 py-6 rounded-[2.5rem] shadow-2xl text-white">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 disabled:opacity-20 transition-all active:scale-95"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="flex items-center gap-4">
               <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-black text-xs shadow-xl shadow-indigo-500/20">
                  {page}
               </div>
               <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">of {totalPages}</span>
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 disabled:opacity-20 transition-all active:scale-95"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AuditLogs;