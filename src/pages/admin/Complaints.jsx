/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllComplaints, assignComplaint } from "../../api/complaint.api";
import { getDepartments } from "../../api/department.api";
import { getOfficers } from "../../api/officer.api";

const LIMIT = 5;

// ─── Debounce Hook ───────────────────────────────────────────────────────────
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    resolved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "in progress": "bg-blue-100 text-blue-700 border border-blue-200",
  };
  const cls = styles[status?.toLowerCase()] || "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${cls}`}>
      {status || "Unknown"}
    </span>
  );
};

// ─── Complaint Card ───────────────────────────────────────────────────────────
const ComplaintCard = ({ c, officers, departments, assignment, onInputChange, onAssign }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-start gap-4 hover:shadow-md transition-shadow duration-200">
      
      {/* Left — Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <StatusBadge status={c.status} />
          <span className="text-xs text-slate-400">
            {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            }) : ""}
          </span>
        </div>

        <h3 className="font-semibold text-slate-800 text-base leading-snug truncate">
          {c.title}
        </h3>

        {c.description && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {c.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          {c.citizen?.name && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {c.citizen.name}
            </span>
          )}
          {c.department?.name && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {c.department.name}
            </span>
          )}
        </div>
      </div>

      {/* Right — Assign */}
      <div className="w-full md:w-56 shrink-0">
        {c.assignedOfficer ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm">
            <p className="text-xs text-emerald-600 font-medium mb-0.5">Assigned Officer</p>
            <p className="font-semibold text-emerald-800">{c.assignedOfficer.name}</p>
            {c.assignedOfficer.email && (
              <p className="text-xs text-emerald-600 truncate">{c.assignedOfficer.email}</p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-slate-500 mb-1">Assign Complaint</p>

            <select
              className="w-full border border-slate-200 bg-white text-sm p-1.5 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={assignment?.officerId || ""}
              onChange={(e) => onInputChange(c._id, "officerId", e.target.value)}
            >
              <option value="">Select Officer</option>
              {officers.map((o) => (
                <option key={o._id} value={o._id}>{o.name}</option>
              ))}
            </select>

            <select
              className="w-full border border-slate-200 bg-white text-sm p-1.5 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={assignment?.departmentId || ""}
              onChange={(e) => onInputChange(c._id, "departmentId", e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>

            <button
              onClick={() => onAssign(c._id)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-1.5 rounded-md transition-colors duration-150"
            >
              Assign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [assignments, setAssignments] = useState({});

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
    assignedOfficer: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce search so API doesn't fire on every keystroke
  const debouncedSearch = useDebounce(filters.search, 500);

  // ── Fetch static data once ─────────────────────────────────────────────────
  const fetchStaticData = async () => {
    try {
      const [deptRes, officerRes] = await Promise.all([
        getDepartments(),
        getOfficers(),
      ]);
      setDepartments(deptRes.data || []);
      setOfficers(officerRes.data || []);
    } catch (err) {
      console.error("Static data fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStaticData();
  }, []);

  // ── Fetch complaints ───────────────────────────────────────────────────────
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: LIMIT,
        search: debouncedSearch,
        status: filters.status,
        department: filters.department,
        assignedOfficer: filters.assignedOfficer,
        sortBy: filters.sortBy,
        order: filters.order,
      };

      // Remove empty params so backend doesn't get empty strings
      Object.keys(params).forEach((k) => {
        if (params[k] === "" || params[k] === null || params[k] === undefined) {
          delete params[k];
        }
      });

      const res = await getAllComplaints(params);

      // res = { success, data, totalPages, total, currentPage }
      setComplaints(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error("Fetch complaints failed:", err);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    filters.status,
    filters.department,
    filters.assignedOfficer,
    filters.sortBy,
    filters.order,
  ]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ── Filter handlers ────────────────────────────────────────────────────────
  const handleFilterChange = (field, value) => {
    setPage(1); // reset to page 1 on filter change
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setPage(1);
    setFilters({
      search: "",
      status: "",
      department: "",
      assignedOfficer: "",
      sortBy: "createdAt",
      order: "desc",
    });
  };

  const isFiltered =
    filters.search || filters.status || filters.department ||
    filters.assignedOfficer || filters.sortBy !== "createdAt" || filters.order !== "desc";

  // ── Assignment handlers ────────────────────────────────────────────────────
  const handleInputChange = (id, field, value) => {
    setAssignments((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleAssign = async (id) => {
    const { officerId, departmentId } = assignments[id] || {};
    if (!officerId || !departmentId) {
      return alert("Please select both an officer and a department.");
    }
    try {
      await assignComplaint(id, { officerId, departmentId });
      setAssignments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed. Please try again.");
    }
  };

  // ── Pagination ─────────────────────────────────────────────────────────────
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
      <div className="p-4 md:p-6 min-h-screen bg-slate-50">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Complaints</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {loading ? "Loading..." : `${totalCount} total complaint${totalCount !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">

            {/* Search */}
            <div className="relative lg:col-span-2">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search title, description..."
                className="w-full border border-slate-200 pl-8 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Status */}
            <select
              className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 bg-white"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Department */}
            <select
              className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 bg-white"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>

            {/* Officer */}
            <select
              className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 bg-white"
              value={filters.assignedOfficer}
              onChange={(e) => handleFilterChange("assignedOfficer", e.target.value)}
            >
              <option value="">All Officers</option>
              {officers.map((o) => (
                <option key={o._id} value={o._id}>{o.name}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 bg-white"
              value={`${filters.sortBy}_${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split("_");
                setPage(1);
                setFilters((prev) => ({ ...prev, sortBy, order }));
              }}
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="status_asc">Status A→Z</option>
              <option value="status_desc">Status Z→A</option>
            </select>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isFiltered
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!isFiltered}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(LIMIT)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                  </div>
                  <div className="w-52 space-y-2">
                    <div className="h-8 bg-slate-200 rounded" />
                    <div className="h-8 bg-slate-200 rounded" />
                    <div className="h-8 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-500 font-medium">No complaints found</p>
            <p className="text-slate-400 text-sm mt-1">
              {isFiltered ? "Try changing or resetting your filters." : "No complaints have been submitted yet."}
            </p>
            {isFiltered && (
              <button onClick={resetFilters} className="mt-3 text-blue-600 text-sm hover:underline">
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Complaint Cards */}
            <div className="space-y-4">
              {complaints.map((c) => (
                <ComplaintCard
                  key={c._id}
                  c={c}
                  officers={officers}
                  departments={departments}
                  assignment={assignments[c._id]}
                  onInputChange={handleInputChange}
                  onAssign={handleAssign}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="First page"
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>

                {pageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Last page"
                >
                  »
                </button>
              </div>
            )}

            {/* Page info */}
            <p className="text-center text-xs text-slate-400 mt-2">
              Page {page} of {totalPages} — showing {complaints.length} of {totalCount}
            </p>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminComplaints;