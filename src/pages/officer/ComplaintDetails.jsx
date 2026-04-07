import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, MapPin, Tag, Shield, 
  User, CheckCircle, AlertCircle, Save, 
  Image as ImageIcon, Loader2, Info,Calendar
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { updateComplaintStatus, getComplaintForOfficer } from "../../api/complaint.api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function OfficerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchComplaint = async () => {
    try {
      const res = await getComplaintForOfficer(id);
      const data = res.data || res;
      setComplaint(data);
      setStatus(data.status);
      setPriority(data.priority || "Medium");
    } catch (err) {
      setError(err.message || "Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaint(); }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (complaint.status === "Resolved") return;
    
    try {
      setUpdating(true);
      await updateComplaintStatus(id, { status, priority, remark });
      setRemark("");
      fetchComplaint();
      // Optional: Success toast logic here
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Data...</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Review Grievance</h1>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  complaint?.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>{complaint?.status}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.2em]">Ref ID: #{id?.slice(-8)}</p>
            </div>
          </div>
        </div>

        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 flex items-center gap-2 italic"><AlertCircle size={16}/> {error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: COMPLAINT DOSSIER --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* EVIDENCE IMAGE */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ImageIcon size={14} className="text-indigo-500" /> Ground Evidence
              </h3>
              {complaint.image ? (
                <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-slate-200 aspect-video">
                  <img src={`${BASE_URL}/${complaint.image.replace(/\\/g, "/")}`} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="bg-slate-100 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                  <ImageIcon size={40} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">No visual evidence provided by citizen</p>
                </div>
              )}
            </div>

            {/* SUBJECT & DETAILS */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{complaint.title}</h2>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-slate-600 text-sm italic font-medium leading-relaxed">
                  "{complaint.description}"
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Citizen</p>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-2"><User size={14} className="text-indigo-500" /> {complaint.citizen?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Area</p>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-2 truncate"><MapPin size={14} className="text-indigo-500" /> {complaint.location?.area || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-2"><Tag size={14} className="text-indigo-500" /> {complaint.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: ACTION CONTROL PANEL --- */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500 rounded-2xl"><Shield size={20}/></div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Resolution Control</h3>
                </div>

                {complaint.status === "Resolved" ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl flex items-start gap-3">
                    <CheckCircle className="text-emerald-400 shrink-0" size={18} />
                    <p className="text-[11px] font-bold text-emerald-100 leading-relaxed uppercase tracking-wider">
                      This grievance has been resolved. Action controls are now locked for auditing.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Update Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Set Priority</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High Priority</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-xs">Official Remark</label>
                      <textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={3} placeholder="Add specific action taken..." className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-4 text-xs font-medium outline-none focus:border-indigo-500 transition-all resize-none shadow-inner" required />
                    </div>

                    <button type="submit" disabled={updating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-[0.98]">
                      {updating ? <Loader2 className="animate-spin" size={18} /> : <>Commit Update <Save size={16} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* TIMELINE PREVIEW */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" /> Action Log
              </h3>
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:h-[calc(100%-12px)] before:w-0.5 before:bg-slate-100">
                {complaint.timeline?.slice().reverse().map((t, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 z-10" />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{t.status}</p>
                      <p className="text-[10px] text-slate-500 font-medium italic">"{t.remark || 'Status updated by official.'}"</p>
                      <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest pt-1 flex items-center gap-1">
                         <Calendar size={10} /> {new Date(t.date).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default OfficerComplaintDetails;