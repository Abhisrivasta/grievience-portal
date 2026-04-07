/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { 
  Star, Search, Filter, RotateCcw, 
  User, Calendar, ChevronLeft, ChevronRight, 
  MessageSquare, Loader2, Quote, Mail,
  ChevronFirst, ChevronLast, RefreshCw, AlertCircle
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllFeedback } from "../../api/feedback.api";

const LIMIT = 6;

// ─── Debounce Hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Star Rating Display (Executive Style) ───────────────────────────────────
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={`${star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`}
        />
      ))}
      <span className="ml-1 text-[10px] font-black text-slate-700 tracking-tighter">{rating}/5</span>
    </div>
  );
};

// ─── Feedback Card (Modern Quote Look) ────────────────────────────────────────
const FeedbackCard = ({ f }) => {
  const ratingTheme = {
    5: "border-t-emerald-500 shadow-emerald-100/20",
    4: "border-t-indigo-500 shadow-indigo-100/20",
    3: "border-t-amber-500 shadow-amber-100/20",
    2: "border-t-orange-500 shadow-orange-100/20",
    1: "border-t-rose-500 shadow-rose-100/20",
  }[f.rating] || "border-t-slate-200 shadow-slate-100/20";

  return (
    <div className={`group bg-white rounded-[2rem] border border-slate-200 border-t-4 ${ratingTheme} p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-xl relative overflow-hidden`}>
      <Quote className="absolute -top-2 -right-2 text-slate-50 w-20 h-20 -z-0 opacity-50 group-hover:text-indigo-50 transition-colors" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
              {f.complaint?.category || "General"}
            </span>
            <h3 className="font-black text-slate-800 text-sm mt-2 leading-tight truncate">
              {f.complaint?.title || "No Subject"}
            </h3>
          </div>
          <StarRating rating={f.rating} />
        </div>

        {/* Comment Section */}
        <p className="text-xs font-medium text-slate-500 leading-relaxed italic mb-6 line-clamp-4 flex-1">
          {f.comment ? `"${f.comment}"` : <span className="opacity-40 italic">No detailed feedback provided.</span>}
        </p>

        {/* Footer Info */}
        <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0f172a] text-indigo-400 flex items-center justify-center font-black text-xs shadow-lg shrink-0">
            {f.citizen?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">
              {f.citizen?.name || "Citizen User"}
            </p>
            <div className="flex items-center gap-1 opacity-50 text-[9px] font-bold text-slate-400 truncate uppercase tracking-tighter">
               <Calendar size={10} /> {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const debouncedSearch = useDebounce(search, 500);

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: LIMIT, sort };
      if (debouncedSearch) params.search = debouncedSearch;
      if (rating) params.rating = rating;

      const res = await getAllFeedback(params);
      setFeedbacks(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      setError("Failed to synchronize citizen feedback registry.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, rating, sort]);

  useEffect(() => { loadFeedback(); }, [loadFeedback]);

  const isFiltered = search || rating || sort !== "-createdAt";
  const resetFilters = () => {
    setSearch(""); setRating(""); setSort("-createdAt"); setPage(1);
  };

  const pageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i);
    return pages;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700 pb-20">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Star className="text-amber-500 fill-amber-500" size={32} />
              Public Feedback
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {loading ? "Processing..." : `Satisfaction Audit: ${totalCount} Records`}
            </p>
          </div>
          <button
            onClick={loadFeedback}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh List
          </button>
        </div>

        {/* --- SMART FILTERS --- */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search feedback registry..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>

          <select
            value={rating}
            onChange={(e) => { setRating(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer"
          >
            <option value="">Rating: All Levels</option>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star Rating</option>)}
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer"
          >
            <option value="-createdAt">Order: Newest First</option>
            <option value="createdAt">Order: Oldest First</option>
            <option value="-rating">Order: Highest Rating</option>
            <option value="rating">Order: Lowest Rating</option>
          </select>

          <button
            onClick={resetFilters}
            disabled={!isFiltered}
            className={`p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-inner ${
              isFiltered ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white" : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl px-6 py-4 text-xs font-bold flex items-center gap-3 italic">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* --- GRID & CARDS --- */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(LIMIT)].map((_, i) => (
              <div key={i} className="h-64 bg-white border border-slate-100 rounded-[2rem] p-6 animate-pulse space-y-4">
                 <div className="h-4 bg-slate-100 rounded w-1/4" />
                 <div className="h-10 bg-slate-100 rounded w-full" />
                 <div className="h-20 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 p-24 text-center shadow-xl">
             <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Feedback entries found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((f) => (
                <FeedbackCard key={f._id} f={f} />
              ))}
            </div>

            {/* --- DARK THEME PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-[#0f172a] px-8 py-6 rounded-[2.5rem] shadow-2xl text-white mt-10">
                <div className="flex gap-2">
                  <button onClick={() => setPage(1)} disabled={page === 1} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-slate-900 disabled:opacity-20 transition-all">
                    <ChevronFirst size={18} />
                  </button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 disabled:opacity-20 transition-all">
                    Prev
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {pageNumbers().map((p) => (
                    <button
                      key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                        p === page ? "bg-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-white/5 border border-white/10 hover:bg-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 disabled:opacity-20 transition-all">
                    Next
                  </button>
                  <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-slate-900 disabled:opacity-20 transition-all">
                    <ChevronLast size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminFeedback;