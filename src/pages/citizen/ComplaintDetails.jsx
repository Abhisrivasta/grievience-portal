import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, MapPin, Tag, Shield, 
  Calendar, CheckCircle, Info, Image as ImageIcon 
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getComplaintById } from "../../api/complaint.api";
import FeedbackForm from "../../components/common/FeedbackForm";

// 🔥 FIX: Check if env variable exists, else fallback to hardcoded backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await getComplaintById(id);
        // Backend se data key check karein
        setComplaint(res.data || res); 
      } catch (err) {
        setError(err.message || "Failed to load complaint");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  // Helper function to clean image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    // Replace backslashes with forward slashes for URL safety
    const cleanPath = path.replace(/\\/g, "/");
    // Ensure the path starts with a slash
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${BASE_URL}${formattedPath}`;
  };

  if (loading) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest">Fetching Details...</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Complaint Information</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 tracking-[0.2em]">Ticket ID: #{id?.slice(-6)}</p>
            </div>
          </div>
          
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            complaint?.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
            complaint?.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
            {complaint?.status}
          </div>
        </div>

        {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 italic">{error}</div>}

        {complaint && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- LEFT: MAIN INFO --- */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* IMAGE SECTION */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <ImageIcon size={14} className="text-indigo-500" /> Evidence Attached
                </h3>
                {complaint.image ? (
                  <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-slate-200 aspect-video group">
                    <img 
                      src={getImageUrl(complaint.image)} 
                      alt="Complaint Evidence" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/600x400?text=Image+Loading+Error";
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                    <ImageIcon size={40} className="mb-2 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-tight">No image evidence provided</p>
                  </div>
                )}
              </div>

              {/* DESCRIPTION CARD */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800 mb-2">{complaint.title}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium italic">"{complaint.description}"</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2"><Tag size={12} className="text-indigo-500"/> {complaint.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority Level</p>
                    <p className={`text-xs font-bold flex items-center gap-2 ${
                      complaint.priority === 'High' ? 'text-rose-600' : 'text-indigo-600'
                    }`}><Info size={12}/> {complaint.priority}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Area</p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2 truncate"><MapPin size={12} className="text-indigo-500"/> {complaint.location?.area || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* FEEDBACK SECTION */}
              {complaint.status === "Resolved" && (
                <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle size={24} />
                    <h3 className="text-lg font-bold">Issue Resolved - Share Your Experience</h3>
                  </div>
                  <div className="bg-white rounded-3xl p-2 text-slate-800">
                    <FeedbackForm
                      complaintId={complaint._id}
                      onSubmitted={() => alert("Feedback submitted successfully")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* --- RIGHT: SIDEBAR INFO & TIMELINE --- */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Official Assignment</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700 font-bold">
                      {complaint.assignedOfficer?.name?.[0] || <Shield size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{complaint.assignedOfficer?.name || "Pending Assignment"}</p>
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{complaint.department?.name || "District Cell"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" /> Resolution Timeline
                </h3>
                
                <div className="space-y-8 relative before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100">
                  {complaint.timeline?.map((t, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white border-4 border-indigo-600 z-10 shadow-sm" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-800">{t.status}</p>
                          <p className="text-[10px] font-bold text-slate-400">{new Date(t.date).toLocaleDateString('en-GB')}</p>
                        </div>
                        <p className="text-xs text-slate-500 font-medium italic">"{t.remark || 'No specific remark provided.'}"</p>
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest pt-1 flex items-center gap-1">
                           <Shield size={10} /> {t.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ComplaintDetails;