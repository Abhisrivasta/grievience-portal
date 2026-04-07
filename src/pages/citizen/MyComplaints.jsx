/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Search, RotateCcw, ChevronLeft, ChevronRight, 
  Calendar, LayoutGrid, AlertCircle, Tag, ArrowUpRight
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getMyComplaints } from "../../api/complaint.api";

const LIMIT = 6;

const StatusBadge = ({ status = "" }) => {
  const s = status.toLowerCase();
  const styles = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-200/50",
    resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    "in progress": "bg-indigo-500/10 text-indigo-600 border-indigo-200/50",
    rejected: "bg-rose-500/10 text-rose-600 border-rose-200/50",
  };
  return (
    <span className={`px-3 py-1 text-[9px] uppercase tracking-[0.15em] rounded-full border font-black ${styles[s] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
      {status || "Unknown"}
    </span>
  );
};

function MyComplaints() {
  const [complaints, setComplaints] = useState([]); // Default empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "createdAt",
    order: "desc"
  });

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await getMyComplaints({
        page,
        limit: LIMIT,
        ...filters
      });

      // 🔥 FIX: Check if res.data exists or if res is the array itself
      const fetchedData = res.data || res; 
      setComplaints(Array.isArray(fetchedData) ? fetchedData : []);
      
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalCount(res.pagination?.total || (Array.isArray(fetchedData) ? fetchedData.length : 0));
      
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const resetFilters = () => {
    setFilters({ search: "", status: "", sortBy: "createdAt", order: "desc" });
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* HERO SECTION */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black tracking-tight uppercase">My Complaints</h1>
                  <p className="text-slate-400 mt-2 text-sm font-medium">Track and manage your submitted grievances</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md flex items-center gap-4">
                   <div className="p-3 bg-indigo-600 rounded-2xl"><LayoutGrid size={24} /></div>
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Reports</p>
                      <p className="text-2xl font-black">{totalCount}</p>
                   </div>
                </div>
            </div>
        </div>

        {/* FILTERS PANEL */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-[2rem] shadow-lg flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="flex-1 md:w-40 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button onClick={resetFilters} className="p-3.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-2xl transition-all">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />
            ))
          ) : error ? (
            <div className="col-span-full py-20 text-center bg-rose-50 rounded-[3rem] border border-rose-100">
              <AlertCircle className="mx-auto text-rose-500 mb-3" size={40} />
              <p className="text-rose-600 font-bold uppercase tracking-widest text-xs">{error}</p>
            </div>
          ) : complaints.length > 0 ? (
            complaints.map((c) => (
              <Link
                key={c._id}
                to={`/citizen/complaints/${c._id}`}
                className="group bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={c.status} />
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                    {c.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Tag size={12} className="text-indigo-500" /> {c.category}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.priority || 'Normal'} Priority</span>
                  <span className="text-[10px] font-bold text-indigo-600">ID: #{c._id.slice(-6)}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
              <LayoutGrid size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-slate-800 font-black text-xl">No complaints found</h3>
              <p className="text-slate-500 text-sm mt-2">Start by filing a new grievance report.</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 py-6">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-black text-slate-800 tracking-widest">{page} / {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-600 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyComplaints;