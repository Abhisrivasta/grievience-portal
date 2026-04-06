import { useEffect, useState, useCallback } from "react";
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

// ─── Star Rating Display ──────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-semibold text-slate-700">{rating}/5</span>
    </div>
  );
};

// ─── Feedback Card ────────────────────────────────────────────────────────────
const FeedbackCard = ({ f }) => {
  const ratingColor = {
    5: "border-t-emerald-400",
    4: "border-t-blue-400",
    3: "border-t-amber-400",
    2: "border-t-orange-400",
    1: "border-t-red-400",
  }[f.rating] || "border-t-slate-300";

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 border-t-4 ${ratingColor} p-5 hover:shadow-md transition-shadow duration-200 flex flex-col`}>

      {/* Top */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-base leading-snug truncate">
            {f.complaint?.title || "No Title"}
          </h3>
          {f.complaint?.category && (
            <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {f.complaint.category}
            </span>
          )}
        </div>
        <StarRating rating={f.rating} />
      </div>

      {/* Comment */}
      <p className="text-sm text-slate-600 line-clamp-3 flex-1">
        {f.comment || <span className="italic text-slate-400">No comment provided</span>}
      </p>

      {/* Divider */}
      <div className="border-t border-slate-100 my-3" />

      {/* Citizen Info */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
          {f.citizen?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">
            {f.citizen?.name || "Unknown"}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {f.citizen?.email || ""}
          </p>
        </div>
        {f.createdAt && (
          <span className="ml-auto text-xs text-slate-400 shrink-0">
            {new Date(f.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-100 border-t-4 border-t-slate-200 p-5 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-20" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-200 rounded" />
      <div className="h-3 bg-slate-200 rounded" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
    <div className="border-t border-slate-100 my-3" />
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-slate-200 rounded-full" />
      <div className="space-y-1 flex-1">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-2 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  </div>
);

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

  // Debounce search — API call 500ms baad
  const debouncedSearch = useDebounce(search, 500);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadFeedback = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: LIMIT, sort };
      if (debouncedSearch) params.search = debouncedSearch;
      if (rating) params.rating = rating;

      const res = await getAllFeedback(params);

      // res = { data: [], totalPages, total, currentPage }
      setFeedbacks(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, rating, sort]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isFiltered = search || rating || sort !== "-createdAt";

  const resetFilters = () => {
    setSearch("");
    setRating("");
    setSort("-createdAt");
    setPage(1);
  };

  const pageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="min-h-screen px-4 md:px-6 py-8 bg-slate-50">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Citizen Feedback</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? "Loading..." : `${totalCount} total feedback${totalCount !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={loadFeedback}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full border border-slate-200 pl-8 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
              />
            </div>

            {/* Rating */}
            <select
              value={rating}
              onChange={(e) => { setRating(e.target.value); setPage(1); }}
              className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 bg-white"
            >
              <option value="">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Star</option>
              <option value="4">⭐⭐⭐⭐ 4 Star</option>
              <option value="3">⭐⭐⭐ 3 Star</option>
              <option value="2">⭐⭐ 2 Star</option>
              <option value="1">⭐ 1 Star</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 bg-white"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-rating">Highest Rating</option>
              <option value="rating">Lowest Rating</option>
            </select>

            {/* Reset */}
            <button
              onClick={resetFilters}
              disabled={!isFiltered}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isFiltered
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-5 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : feedbacks.length === 0 ? (

          /* Empty State */
          <div className="bg-white rounded-xl border border-slate-100 p-14 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-slate-500 font-medium">No feedback found</p>
            <p className="text-slate-400 text-sm mt-1">
              {isFiltered ? "Try changing or resetting your filters." : "No feedback has been submitted yet."}
            </p>
            {isFiltered && (
              <button onClick={resetFilters} className="mt-3 text-blue-600 text-sm hover:underline">
                Reset Filters
              </button>
            )}
          </div>

        ) : (
          <>
            {/* Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {feedbacks.map((f) => (
                <FeedbackCard key={f._id} f={f} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >«</button>

                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >Prev</button>

                {pageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >{p}</button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >Next</button>

                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >»</button>
              </div>
            )}

            {/* Page Info */}
            <p className="text-center text-xs text-slate-400 mt-2">
              Page {page} of {totalPages} — showing {feedbacks.length} of {totalCount}
            </p>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminFeedback;