import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { getAboutContent } from "../api/about.api";
import { useAuth } from "../contexts/AuthContext";
function AboutUs() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ✅ Dashboard path logic: User ke role ke hisab se link banega
  const dashboardPath = user ? `/${user.role}` : "/";

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAboutContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to load About page:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ Loading State (UI intact)
  if (loading) return (
    <MainLayout isPublic={true}>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </MainLayout>
  );

  // ✅ Empty Content State
  if (!content) return (
    <MainLayout isPublic={true}>
      <div className="text-center py-20 text-slate-500">
        <p className="mb-4">About content not available.</p>
        <Link to={dashboardPath} className="text-indigo-600 font-bold hover:underline">
           {user ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout isPublic={true}>
      <div className="max-w-7xl mx-auto p-4 md:p-12 space-y-16 animate-in fade-in duration-700">
        
        {/* HERO */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full border border-indigo-100">
            <LucideIcons.Users size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Our Mission</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            {content.heroTitle} <br />
            <span className="text-indigo-600 font-black">{content.heroSubtitle}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
            {content.heroDescription}
          </p>

          {/* 🏠 DYNAMIC REDIRECT BUTTON - UI Unchanged */}
          <div className="pt-4">
            <Link 
              to={dashboardPath} 
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:shadow-lg"
            >
              <LucideIcons.LayoutDashboard size={18} />
              {user ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features?.map((f, i) => {
            const IconComponent = LucideIcons[f.iconName] || LucideIcons.HelpCircle;
            return (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-6">
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* COMMITMENT SECTION */}
        <div className="bg-[#0f172a] rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tight">Fast. Reliable. <br/>Digitally Secure.</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Our platform uses advanced encryption and tracking mechanisms to ensure that 
                        no grievance goes unnoticed. We believe in a digital democracy.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {["End-to-End Tracking", "Official Auditing", "Citizen Feedback"].map((tag, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                <LucideIcons.CheckCircle size={12} className="text-indigo-400" /> {tag}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:flex bg-indigo-500/20 aspect-square rounded-[3rem] border border-white/5 items-center justify-center">
                     <LucideIcons.ShieldCheck size={180} className="text-indigo-400/20" />
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AboutUs;