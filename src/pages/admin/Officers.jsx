import { useEffect, useState } from "react";
import { 
  Users, UserPlus, ShieldCheck, Mail, 
  Briefcase, ChevronLeft, ChevronRight, 
  Loader2, AlertCircle, CheckCircle2 
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getOfficers, upsertOfficerProfile } from "../../api/officer.api";
import { getDepartments } from "../../api/department.api";

function Officers() {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      setFetching(true);
      const [officersRes, deptRes] = await Promise.all([
        getOfficers(),
        getDepartments()
      ]);
      setOfficers(officersRes.data);
      setDepartments(deptRes.data);
    } catch {
      setError("Failed to synchronize officer database.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedOfficer || !selectedDept) return setError("Officer and Department selection is mandatory.");

    setLoading(true);
    try {
      await upsertOfficerProfile({
        officerId: selectedOfficer._id,
        department: selectedDept,
        designation,
      });
      setSuccess(`${selectedOfficer.name}'s profile updated successfully.`);
      setSelectedOfficer(null);
      setSelectedDept("");
      setDesignation("");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Internal update failure.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOfficers = officers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(officers.length / itemsPerPage);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Users className="text-indigo-600" size={32} />
              Officer Registry
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authority & Department Allocation</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
             <ShieldCheck size={18} className="text-indigo-500" />
             <span className="text-xs font-bold text-slate-600 tracking-tight">Active Forces: {officers.length}</span>
          </div>
        </div>

        {/* --- ALERTS --- */}
        {(error || success) && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2 border ${
            error ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}>
            {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {error || success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* --- LEFT: ASSIGNMENT PANEL --- */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                <UserPlus size={18} />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Update Profile</h4>
            </div>
            
            <form onSubmit={handleAssign} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Officer</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                  onChange={(e) => setSelectedOfficer(officers.find((o) => o._id === e.target.value))}
                  value={selectedOfficer?._id || ""}
                >
                  <option value="">Search officer name...</option>
                  {officers.map((o) => (
                    <option key={o._id} value={o._id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assign Department</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Select Domain...</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Engineer"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Commit Changes <ShieldCheck size={16}/></>}
              </button>
            </form>
          </div>

          {/* --- RIGHT: OFFICER LIST --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid gap-4">
              {fetching ? (
                <div className="p-20 text-center animate-pulse flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-slate-200 animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                </div>
              ) : currentOfficers.map((o) => (
                <div key={o._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:border-indigo-200 transition-all shadow-xl shadow-slate-200/40 group">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-[#0f172a] text-indigo-400 flex items-center justify-center font-black text-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                        {o.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 text-lg leading-tight">{o.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={12} className="text-slate-300" />
                          <p className="text-xs font-bold text-slate-400">{o.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 self-start md:self-center">
                      {o.profile ? (
                        <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.1em] border border-indigo-100">
                          Active Profile
                        </span>
                      ) : (
                        <span className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.1em] border border-slate-100">
                          Pending Setup
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Building2 size={10} className="text-indigo-400" /> Allocated Unit
                      </div>
                      <p className="text-sm font-black text-slate-700">
                        {o.profile?.department?.name || "Unassigned"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Briefcase size={10} className="text-indigo-400" /> Official Rank
                      </div>
                      <p className="text-sm font-black text-slate-700">
                        {o.profile?.designation || "Not Set"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                        currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Internal Icon Fix (Missing in Lucide import but used in render)
const Building2 = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);

export default Officers;