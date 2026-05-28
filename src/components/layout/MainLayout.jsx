import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ShieldCheck, Mail, Info, Phone, Globe, Lock } from "lucide-react";

const Sidebar = lazy(() => import("./Sidebar"));
const Navbar = lazy(() => import("./Navbar"));

function MainLayout({ children, isPublic = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const showDashboardUI = !isPublic && user;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1 overflow-x-hidden">
        {showDashboardUI && (
          <Suspense fallback={null}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </Suspense>
        )}

        <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
            showDashboardUI ? (collapsed ? "ml-20" : "ml-64") : "ml-0"
          }`}
        >
          {showDashboardUI && (
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
          )}

          <main className={`flex-1 ${isPublic ? "" : "p-4 md:p-10"}`}>
            <div
              className={`${
                isPublic ? "" : "mx-auto max-w-7xl"
              } min-h-[calc(100vh-400px)]`}
            >
              {children}
            </div>
          </main>

          <footer className="border-t border-slate-800 bg-[#0f172a] px-6 pb-8 pt-16 text-slate-400 md:px-12">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="text-indigo-500" size={24} />
                    <span className="text-lg font-black uppercase tracking-tighter">
                      Grievance.
                    </span>
                  </div>

                  <p className="text-xs font-medium leading-relaxed opacity-70">
                    Transparent digital governance and accountable grievance
                    redressal mechanisms for all citizens.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Platform
                  </h4>

                  <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                    <li>
                      <Link to="/" className="transition-all hover:text-indigo-400">
                        Home
                      </Link>
                    </li>

                    {user ? (
                      <li>
                        <Link
                          to={`/${user.role}`}
                          className="transition-all hover:text-indigo-400"
                        >
                          My Dashboard
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link
                          to="/login"
                          className="transition-all hover:text-indigo-400"
                        >
                          Citizen Login
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Information
                  </h4>

                  <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight">
                    <li>
                      <Link
                        to="/about"
                        className="flex items-center gap-2 transition-all hover:text-indigo-400"
                      >
                        <Info size={14} /> About Us
                      </Link>
                    </li>

                    {user?.role !== "admin" && (
                      <li>
                        <Link
                          to="/contact"
                          className="flex items-center gap-2 transition-all hover:text-indigo-400"
                        >
                          <Mail size={14} /> Contact Support
                        </Link>
                      </li>
                    )}

                    <li className="flex items-center gap-2 text-slate-600 opacity-50">
                      <Lock size={12} /> Privacy Policy
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Emergency
                  </h4>

                  <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      Helpline
                    </p>

                    <p className="flex items-center gap-2 text-sm font-black leading-none text-white">
                      <Phone size={14} /> 1800-111-222
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/50 pt-8 md:flex-row">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                  © {new Date().getFullYear()} Smart Grievance • Digital India
                  Initiative
                </p>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <Globe size={12} /> Unified Portal Bihar
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