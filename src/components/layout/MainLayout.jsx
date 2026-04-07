import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { ShieldCheck, Mail, Info, Phone, Heart, Globe, Lock } from "lucide-react";

function MainLayout({ children, isPublic = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // Condition: Sidebar aur Navbar sirf tab dikhenge jab page public NA HO aur user login HO.
  const showDashboardUI = !isPublic && user;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1 overflow-x-hidden">
        
        {/* 1. SIDEBAR: Sirf Dashboard pages par dikhega */}
        {showDashboardUI && (
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}

        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 
          ${showDashboardUI ? (collapsed ? "ml-20" : "ml-64") : "ml-0"}`}>
          
          {/* 2. NAVBAR: Sirf Dashboard pages par dikhega (Sign Out bug fix) */}
          {showDashboardUI && <Navbar />}

          {/* 3. MAIN CONTENT */}
          <main className={`flex-1 ${isPublic ? "" : "p-4 md:p-10"}`}>
            <div className={`${isPublic ? "" : "max-w-7xl mx-auto"} min-h-[calc(100vh-400px)]`}>
              {children}
            </div>
          </main>

          {/* 4. PREMIUM FOOTER: Har page par dikhega lekin links Role-Based honge */}
          <footer className="bg-[#0f172a] text-slate-400 pt-16 pb-8 px-6 md:px-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                
                {/* Column 1: Portal Identity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="text-indigo-500" size={24} />
                    <span className="font-black uppercase tracking-tighter text-lg">Grievance.</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium opacity-70">
                    Empowering citizens through transparent digital governance and 
                    accountable grievance redressal mechanisms.
                  </p>
                </div>

                {/* Column 2: Quick Navigation */}
                <div className="space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Platform</h4>
                  <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                    <li><Link to="/" className="hover:text-indigo-400 transition-all">Home</Link></li>
                    {user ? (
                      <li><Link to={`/${user.role}/dashboard`} className="hover:text-indigo-400 transition-all">My Dashboard</Link></li>
                    ) : (
                      <li><Link to="/login" className="hover:text-indigo-400 transition-all">Citizen Login</Link></li>
                    )}
                  </ul>
                </div>

                {/* Column 3: Information (BUG FIX: Admin restriction) */}
                <div className="space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Information</h4>
                  <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                    <li><Link to="/about" className="hover:text-indigo-400 transition-all flex items-center gap-2"><Info size={14}/> About Us</Link></li>
                    
                    {/* 🔥 Admin Bug Fix: Admin ko contact us nahi dikhana */}
                    {user?.role !== "admin" && (
                      <li><Link to="/contact" className="hover:text-indigo-400 transition-all flex items-center gap-2"><Mail size={14}/> Contact Support</Link></li>
                    )}
                    
                    <li className="opacity-50 flex items-center gap-2 text-slate-600"><Lock size={12}/> Privacy Policy</li>
                  </ul>
                </div>

                {/* Column 4: Help Desk */}
                <div className="space-y-4">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Emergency</h4>
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Helpline</p>
                    <p className="text-sm font-black text-white flex items-center gap-2 leading-none">
                      <Phone size={14} /> 1800-111-222
                    </p>
                  </div>
                </div>

              </div>

              {/* Copyright Section */}
              <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                  © {new Date().getFullYear()} Smart Grievance • Digital India Initiative
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                   <Globe size={12} /> Serving across 28 States & 8 UTs
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;