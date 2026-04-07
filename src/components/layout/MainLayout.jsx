import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Sidebar (Fixed) */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 2. Content Area (Fixed Margin Logic) */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 
        ${collapsed ? "ml-20" : "ml-64"}`} 
      >
        <Navbar />
        <main className="p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;