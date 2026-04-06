import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";


function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

   const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Navbar collapsed={collapsed} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;