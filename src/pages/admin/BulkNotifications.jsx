/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { 
  Bell, Send, Users, Shield, 
  Building2, MessageSquare, AlertCircle, 
  CheckCircle2, Loader2, Info, Radio 
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { sendBulkNotification } from "../../api/notification.api";
import { getDepartments } from "../../api/department.api";

function BulkNotifications() {
  const [target, setTarget] = useState("all");
  const [departmentId, setDepartmentId] = useState("");
  const [message, setMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data || []);
      } catch (err) {
        setError("Failed to fetch department registry.");
      }
    };
    loadDepartments();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
      setError("Please compose a message before broadcasting.");
      return;
    }

    setLoading(true);
    try {
      await sendBulkNotification({
        target,
        departmentId: target === "department" ? departmentId : undefined,
        message,
      });

      setMessage("");
      setSuccess(`Broadcast successfully dispatched to ${target.replace("_", " ")}.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Transmission failed. System error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-12 space-y-10 animate-in fade-in duration-700 pb-20">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="text-center space-y-3 relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full border border-indigo-100 shadow-sm">
            <Bell size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transmission Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Bulk <span className="text-indigo-600">Notifications.</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl mx-auto leading-relaxed italic">
            Dispatch critical alerts, policy updates, or system-wide announcements to verified recipient groups.
          </p>
        </div>

        {/* --- STATUS ALERTS --- */}
        {(error || success) && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2 border ${
            error ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}>
            {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {error || success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* --- LEFT: BROADCAST CONFIG --- */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-600" /> New Broadcast Session
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Channel: Secured
                </div>
              </div>

              <form onSubmit={handleSend} className="p-8 md:p-12 space-y-10">
                
                {/* 1. Recipient Selector */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Select Target Recipient Group
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "all", label: "All Users", icon: Users, color: "blue" },
                      { id: "officers", label: "Officers Only", icon: Shield, color: "indigo" },
                      { id: "department", label: "Specific Unit", icon: Building2, color: "purple" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTarget(item.id)}
                        className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all duration-300 active:scale-95 ${
                          target === item.id 
                          ? `border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-xl shadow-indigo-100` 
                          : `border-slate-100 bg-white text-slate-400 grayscale opacity-60 hover:grayscale-0 hover:opacity-100`
                        }`}
                      >
                        <item.icon size={28} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Department Selection (Conditional) */}
                {target === "department" && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-500">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Department Unit</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none cursor-pointer"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                    >
                      <option value="">Search Domain Registry...</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Message Body */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Content</label>
                    <span className={`text-[10px] font-bold ${message.length > 500 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {message.length} characters
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] px-8 py-8 text-sm font-medium leading-relaxed outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner"
                    placeholder="Compose the announcement details here. Be clear and concise."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                  />
                  <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    <Info size={16} className="text-indigo-500 shrink-0" />
                    <p className="text-[10px] font-bold text-indigo-600/80 leading-relaxed uppercase tracking-tight">
                      Security Protocol: Broadcaster ID will be logged. Recipients will receive this as an official high-priority alert.
                    </p>
                  </div>
                </div>

                {/* 4. Action Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full md:w-auto md:px-16 bg-[#0f172a] hover:bg-indigo-600 text-white py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center gap-3">
                       {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                       {loading ? "Transmitting Signal..." : "Dispatch Broadcast"}
                    </div>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default BulkNotifications;