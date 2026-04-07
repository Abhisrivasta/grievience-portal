import { useEffect, useState } from "react";
import { 
  Users, Building2, Send, RefreshCw, 
  Search, ShieldAlert, CheckCircle2, 
  Loader2, AlertCircle, Ticket
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllComplaints, assignComplaint } from "../../api/complaint.api";
import { getDepartments } from "../../api/department.api";
import { getOfficers } from "../../api/officer.api";

function AssignComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedData, setSelectedData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const complaintsData = await getAllComplaints();
      const deptRes = await getDepartments();
      const officerRes = await getOfficers();

      // Backend response logic handle kar rahe hain (data array check)
      const rawComplaints = Array.isArray(complaintsData) ? complaintsData : complaintsData.data || [];
      setComplaints(rawComplaints.filter((c) => !c.assignedOfficer));
      
      setDepartments(deptRes.data || []);
      setOfficers(officerRes.data || []);
    } catch {
      setError("Failed to load assignment queue. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSelectChange = (id, field, value) => {
    setSelectedData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleAssign = async (complaintId) => {
    const { officerId, departmentId } = selectedData[complaintId] || {};

    if (!officerId || !departmentId) {
      alert("⚠️ Select both Officer and Department to proceed.");
      return;
    }

    try {
      await assignComplaint(complaintId, { officerId, departmentId });
      // Success visual feedback ke liye hum local state se turant remove karenge
      setComplaints(prev => prev.filter(c => c._id !== complaintId));
      const newSelections = { ...selectedData };
      delete newSelections[complaintId];
      setSelectedData(newSelections);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-indigo-600" size={32} />
              Assignment Queue
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               Queue Status: <span className="text-blue-600 font-black">{complaints.length} Pending Tasks</span>
            </p>
          </div>
          
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Queue
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3 italic">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Secure Records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
            {complaints.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner shadow-emerald-100">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Queue is Clear</h3>
                <p className="text-sm text-slate-500 font-medium italic">"No unassigned grievances found in the system. High Five! ✋"</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div key={c._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row lg:items-center gap-8 group hover:border-indigo-200 transition-all duration-500">
                  
                  {/* Complaint Snapshot */}
                  <div className="flex-1 space-y-3 lg:border-r border-slate-100 lg:pr-8">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-widest">
                        {c.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">#{c._id.slice(-6)}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{c.title}</h4>
                    <p className="text-xs font-medium text-slate-500 italic line-clamp-1">"{c.description}"</p>
                  </div>

                  {/* Assignment Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-end gap-4 lg:w-[60%]">
                    
                    {/* Officer Dropdown */}
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Users size={10} className="text-indigo-500" /> Dispatch To Officer
                      </label>
                      <select 
                        value={selectedData[c._id]?.officerId || ""}
                        onChange={(e) => handleSelectChange(c._id, "officerId", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Official</option>
                        {officers.map((o) => (
                          <option key={o._id} value={o._id}>{o.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Department Dropdown */}
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Building2 size={10} className="text-indigo-500" /> Unit Domain
                      </label>
                      <select 
                        value={selectedData[c._id]?.departmentId || ""}
                        onChange={(e) => handleSelectChange(c._id, "departmentId", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Dept</option>
                        {departments.map((d) => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAssign(c._id)}
                      className="bg-indigo-600 hover:bg-[#0f172a] text-white py-3 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 shadow-xl shadow-indigo-100 active:scale-95 group/btn"
                    >
                      Assign <Send size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AssignComplaints;