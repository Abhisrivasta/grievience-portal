import { useEffect, useState } from "react";
import { 
  Building2, Plus, Power, LayoutGrid, 
  Search, ChevronLeft, ChevronRight, Loader2, 
  AlertCircle, CheckCircle2 
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
} from "../../api/department.api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadDepartments = async () => {
    try {
      setFetching(true);
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {
      setError("Unable to sync department records.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { loadDepartments(); }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !category) return setError("Department name and category are mandatory.");
    
    setLoading(true);
    try {
      await createDepartment({ name, category });
      setName("");
      setCategory("");
      setSuccess("Department added to registry successfully.");
      loadDepartments();
      setCurrentPage(1);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register department.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (dept) => {
    try {
      await updateDepartment(dept._id, { isActive: !dept.isActive });
      loadDepartments();
    } catch {
      setError("Operation failed. Try again.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Building2 className="text-indigo-600" size={32} />
              Departments
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Infrastructure Management</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
             <LayoutGrid size={16} className="text-indigo-500" />
             <span className="text-xs font-bold text-slate-600">Total Units: {departments.length}</span>
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
          
          {/* --- LEFT: CREATE FORM --- */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-10">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Plus size={16} className="text-indigo-600" /> New Registry
            </h4>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Urban Infrastructure"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Domain Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="Road">🛣️ Road & Transport</option>
                  <option value="Water">💧 Water Resources</option>
                  <option value="Electricity">⚡ Electricity & Power</option>
                  <option value="Sanitation">🧹 Sanitation & Health</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Commit Record <Plus size={16}/></>}
              </button>
            </form>
          </div>

          {/* --- RIGHT: DATA LIST --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-6 text-left">Entity</th>
                      <th className="px-8 py-6 text-left">Domain</th>
                      <th className="px-8 py-6 text-left">Status</th>
                      <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fetching ? (
                      <tr><td colSpan="4" className="p-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing...</td></tr>
                    ) : currentItems.map((d) => (
                      <tr key={d._id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner ${d.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                              {d.name.charAt(0)}
                            </div>
                            <span className="text-sm font-black text-slate-800">{d.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{d.category}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            d.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}>
                            {d.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => toggleActive(d)}
                            className={`p-3 rounded-2xl transition-all shadow-sm ${
                              d.isActive 
                              ? "bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50" 
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            <Power size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Registry Page {currentPage} / {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                        currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Departments;