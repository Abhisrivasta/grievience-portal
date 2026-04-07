import { Link } from "react-router-dom";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  FileText,
  Activity,
  Calendar
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

function OfficerDashboard() {
  // Officer Stats (Inhe baad mein API se connect karenge)
  const stats = [
    { label: "Assigned", value: "24", icon: ClipboardList, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Pending", value: "07", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Resolved", value: "17", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* --- OFFICER HERO SECTION --- */}
        <div className="relative overflow-hidden bg-[#0f172a] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30">
                <ShieldCheck size={16} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Official Duty: Active</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Officer <span className="text-indigo-400">Dashboard.</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                Manage assigned grievances, track resolution progress, and maintain public accountability through timely actions.
              </p>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 shrink-0">
              {stats.map((stat, i) => (
                <div key={i} className={`border border-white/10 p-5 rounded-[2rem] backdrop-blur-md text-center min-w-[110px] ${stat.bg}`}>
                  <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* --- ACTION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Assigned Complaints */}
          <Link to="/officer/complaints" className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <ClipboardList size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Assigned List</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Access the complete dossier of grievances currently assigned to your desk.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              Review Workload <ArrowRight size={14} />
            </div>
          </Link>

          {/* Pending Actions */}
          <div className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-amber-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Clock size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Pending Review</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Identify complaints that are exceeding the SLA or require immediate attention.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
              Priority Tasks <Activity size={14} />
            </div>
          </div>

          {/* Reports & Updates */}
          <div className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <FileText size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Logs & Reports</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Generate weekly performance reports and review resolution history.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Check Analytics <ArrowRight size={14} />
            </div>
          </div>

        </div>

        {/* --- RESPONSIBILITY BANNER --- */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row items-center gap-12">
          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] shrink-0 flex items-center justify-center text-indigo-400 shadow-2xl rotate-3">
             <Calendar size={40} />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Officer Protocol & Accountability</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Every action taken on a grievance is logged with a timestamp and digital signature. 
              Timely coordination with field departments and transparent remarks are mandatory 
              for maintaining public trust and system integrity.
            </p>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default OfficerDashboard;