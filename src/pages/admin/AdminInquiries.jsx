/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { 
  Mail, User, MessageSquare, Calendar, 
  Trash2, Search, Filter, Loader2, AlertCircle 
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inquiries");
      // Backend response: { success: true, data: [...] }
      setInquiries(res.data.data || res.data); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries(inquiries.filter((iq) => iq._id !== id));
    } catch (err) {
      alert("Failed to delete inquiry");
    }
  };

  // Filter Logic
  const filteredInquiries = inquiries.filter(iq => 
    iq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iq.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MessageSquare className="text-indigo-600" size={28} />
              User Inquiries
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Manage messages and support requests from citizens
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 md:w-80 shadow-sm"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <Filter size={18} />
            </button>
          </div>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3 italic">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Inquiries...</p>
            </div>
          ) : filteredInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-6 text-left">Citizen Details</th>
                    <th className="px-8 py-6 text-left">Subject</th>
                    <th className="px-8 py-6 text-left">Message</th>
                    <th className="px-8 py-6 text-left">Date Received</th>
                    <th className="px-8 py-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInquiries.map((iq) => (
                    <tr key={iq._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                            {iq.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{iq.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={10} /> {iq.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                          {iq.subject}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-medium text-slate-500 max-w-xs italic leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                          "{iq.message}"
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                          <Calendar size={12} className="text-indigo-400" />
                          {new Date(iq.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          onClick={() => handleDelete(iq._id)}
                          className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                <MessageSquare size={40} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Inquiries Found</p>
            </div>
          )}
        </div>

        {/* --- PAGINATION (DUMMY) --- */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-[2rem]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {filteredInquiries.length} results
            </p>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase cursor-not-allowed">Prev</button>
               <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-slate-900/20">Next</button>
            </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default AdminInquiries;