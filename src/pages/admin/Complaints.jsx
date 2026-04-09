/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  User,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
  Loader2,
  ShieldCheck,
  Mail,
  ChevronFirst,
  ChevronLast,
  Hash,
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllComplaints, assignComplaint } from "../../api/complaint.api";
import { getDepartments } from "../../api/department.api";
import { getOfficers } from "../../api/officer.api";

const LIMIT = 8;

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [assignments, setAssignments] = useState({}); // Local state for dropdowns

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 500);

  // 1. Static Data Load (Departments & Officers)
  const fetchStaticData = async () => {
    try {
      const [deptRes, officerRes] = await Promise.all([
        getDepartments(),
        getOfficers(),
      ]);
      setDepartments(deptRes.data || []);
      setOfficers(officerRes.data || []);
    } catch (err) {
      console.error("Error loading registry data", err);
    }
  };

  useEffect(() => {
    fetchStaticData();
  }, []);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: LIMIT,
        search: debouncedSearch,
        status: filters.status,
        department: filters.department,
        sortBy: filters.sortBy,
        order: filters.order,
      };

      const res = await getAllComplaints(params);

      setComplaints(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // 3. Logic Fix: Assignment Input Handler
  const handleInputChange = (complaintId, field, value) => {
    setAssignments((prev) => ({
      ...prev,
      [complaintId]: { ...prev[complaintId], [field]: value },
    }));
  };

  // 4. Assignment Submission Logic
  const handleAssign = async (complaintId) => {
    const selection = assignments[complaintId];
    if (!selection?.officerId || !selection?.departmentId) {
      alert("⚠️ Select both Officer and Department");
      return;
    }

    try {
      await assignComplaint(complaintId, {
        officerId: selection.officerId,
        departmentId: selection.departmentId,
      });
      // Clear specific assignment state and refresh
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[complaintId];
        return next;
      });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment Failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
        {/* --- EXECUTIVE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-indigo-600" size={32} />
              Authority Console
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Central Grievance Management Registry •{" "}
              <span className="text-indigo-600">{totalCount} Records</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search ticket registry..."
                className="bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 w-64 md:w-80 transition-all shadow-sm"
                value={filters.search}
                onChange={(e) => {
                  setPage(1);
                  setFilters((p) => ({ ...p, search: e.target.value }));
                }}
              />
            </div>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  status: "",
                  department: "",
                  sortBy: "createdAt",
                  order: "desc",
                })
              }
              className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm active:scale-90"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* --- SMART FILTER ROW --- */}
        <div className="bg-slate-100/50 p-4 rounded-[2rem] border border-slate-200 flex flex-wrap gap-4 items-center">
          <select
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer"
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((p) => ({ ...p, status: e.target.value }));
            }}
          >
            <option value="">Lifecycle: All</option>
            <option value="pending">Pending</option>
            <option value="in progress">Active</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer"
            value={filters.department}
            onChange={(e) =>
              setFilters((p) => ({ ...p, department: e.target.value }))
            }
          >
            <option value="">Unit: All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Complaint Identity</th>
                  <th className="px-8 py-6">Citizen & Unit</th>
                  <th className="px-8 py-6">Lifecycle</th>
                  <th className="px-8 py-6">Security Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(LIMIT)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-8 py-10 bg-slate-50/30" />
                    </tr>
                  ))
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-24 text-center">
                      <ShieldCheck
                        size={48}
                        className="mx-auto text-slate-200 mb-4"
                      />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        No Records Detected in Registry
                      </p>
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                            {c.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Hash size={10} className="text-indigo-400" />{" "}
                              {c._id.slice(-6)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />{" "}
                              {new Date(c.createdAt).toLocaleDateString(
                                "en-GB",
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0f172a] text-indigo-400 flex items-center justify-center font-black text-xs shadow-lg">
                            {c.citizen?.name?.[0]}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">
                              {c.citizen?.name}
                            </p>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                              {c.department?.name || "General"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm
                          ${
                            c.status === "pending"
                              ? "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50"
                              : c.status === "resolved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50"
                                : "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        {c.assignedOfficer ? (
                          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl w-fit">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate max-w-[140px]">
                              {c.assignedOfficer.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none cursor-pointer"
                              value={assignments[c._id]?.officerId || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  c._id,
                                  "officerId",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Authority</option>
                              {officers.map((o) => (
                                <option key={o._id} value={o._id}>
                                  {o.name}
                                </option>
                              ))}
                            </select>
                            <select
                              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-tight outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none cursor-pointer"
                              value={assignments[c._id]?.departmentId || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  c._id,
                                  "departmentId",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Unit</option>
                              {departments.map((d) => (
                                <option key={d._id} value={d._id}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssign(c._id)}
                              className="bg-indigo-600 hover:bg-slate-900 text-white p-2.5 rounded-xl transition-all shadow-xl shadow-indigo-200 active:scale-90"
                              title="Commit Assignment"
                            >
                              <Zap size={14} fill="currentColor" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PREMIUM NAVIGATION --- */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between bg-[#0f172a] px-8 py-6 rounded-[2.5rem] shadow-2xl text-white">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Registry Page <span className="text-indigo-500">{page}</span> of{" "}
                {totalPages}
              </p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Showing {complaints.length} of {totalCount} records
              </p>
            </div>

            <div className="flex gap-2">
              {/* First Page */}
              <button
                onClick={() => setPage(1)}
                disabled={page === 1 || loading}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-slate-900 disabled:opacity-10 transition-all shadow-lg"
              >
                <ChevronFirst size={18} />
              </button>

              {/* Previous */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 disabled:opacity-10 transition-all"
              >
                <ChevronLeft size={16} className="inline mr-1" /> Prev
              </button>

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 disabled:opacity-10 transition-all"
              >
                Next <ChevronRight size={16} className="inline ml-1" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || loading}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-slate-900 disabled:opacity-10 transition-all shadow-lg"
              >
                <ChevronLast size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminComplaints;
