import { Link } from "react-router-dom";
import { 
  PlusCircle, 
  ListChecks, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare,
  Activity
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

function CitizenDashboard() {
  // Ye cards hum future mein backend stats se replace karenge
  const stats = [
    { label: "Total Filed", value: "12", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", value: "08", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Progress", value: "04", icon: ListChecks, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden bg-[#0f172a] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30">
                <ShieldCheck size={16} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Verified Citizen Account</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Welcome to <span className="text-indigo-400">Grievance.</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                Empowering citizens with a transparent, fast, and accountable system to resolve public grievances.
              </p>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 shrink-0">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md text-center min-w-[100px]">
                  <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={20} />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Abstract Background element */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* --- QUICK ACTIONS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Raise Grievance */}
          <Link to="/citizen/create-complaint" className="group bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <PlusCircle size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Raise a Grievance</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Submit new complaints related to public infrastructure, water, or electricity.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              Get Started <ArrowRight size={14} />
            </div>
          </Link>

          {/* Track Complaints */}
          <Link to="/citizen/complaints" className="group bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <ListChecks size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Track Progress</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Monitor the live status and officer assignments of your filed complaints.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              View History <ArrowRight size={14} />
            </div>
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className="group bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
              <Bell size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Notifications</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Receive official updates, remarks, and push alerts from concerned authorities.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
              Check Alerts <ArrowRight size={14} />
            </div>
          </Link>

        </div>

        {/* --- COMMITMENT / INFO SECTION --- */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl shrink-0 flex items-center justify-center text-indigo-400">
             <MessageSquare size={32} />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Our Commitment to Transparency</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              This grievance portal ensures fairness, accountability, and timely resolution. Each complaint is securely recorded and monitored by the concerned authorities to maintain transparency and public trust. We strive to provide a seamless bridge between the government and its people.
            </p>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default CitizenDashboard;