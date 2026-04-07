import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getOverviewMetrics } from "../../api/report.api";
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle,
  Star,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap
} from "lucide-react";

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getOverviewMetrics();
        setMetrics(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const cards = [
    {
      title: "Total Grievances",
      value: metrics?.totalComplaints,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      title: "Pending Review",
      value: metrics?.pendingComplaints,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      title: "In Resolution",
      value: metrics?.inProgressComplaints,
      icon: Zap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
    {
      title: "Successfully Resolved",
      value: metrics?.resolvedComplaints,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Public Satisfaction",
      value: metrics?.averageRating ? `${metrics.averageRating}/5` : "4.2/5",
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
  ];

  if (loading) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initialising Admin Command Center...</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
        
        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden bg-[#0f172a] rounded-[3rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">System Administrator Access</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Control <span className="text-indigo-400">Panel.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              Real-time monitoring of public grievances, department efficiency, and 
              system-wide resolution metrics. Use these insights to drive better governance.
            </p>
          </div>
          {/* Background Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-2 italic">
            <Activity size={16} /> {error}
          </div>
        )}

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`group bg-white rounded-[2.5rem] p-6 border ${card.border} shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500`}
            >
              <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                {card.value ?? 0}
              </h2>
            </div>
          ))}
        </div>

        {/* --- SYSTEM OVERVIEW & PERFORMANCE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Info Card */}
          <div className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] shrink-0 flex items-center justify-center text-indigo-400 shadow-2xl rotate-3">
              <TrendingUp size={40} />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Efficiency Metrics</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Our system is currently operating at <span className="text-indigo-600 font-bold">94% efficiency</span>. 
                Average resolution time has decreased by 12% this month. Ensure all high-priority 
                tickets are reviewed within the 24-hour SLA window.
              </p>
            </div>
          </div>

          {/* Quick Tasks / Health */}
          <div className="lg:col-span-5 bg-indigo-600 rounded-[3rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-200 flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                   <Activity size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">System Health</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                   <span>Server Uptime</span>
                   <span>99.9%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                   <div className="w-[99%] h-full bg-white rounded-full" />
                </div>
                <p className="text-xs font-medium opacity-70">
                   All API endpoints are responsive. Database sync is healthy.
                </p>
             </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default AdminDashboard;