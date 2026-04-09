import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, Home as HomeIcon } from "lucide-react";
import "../index.css"

function NotFound() {
  const { user } = useAuth();
  
  // ✅ Dashboard redirection logic
  const dashboardPath = user ? `/${user.role}` : "/";

  return (
    <section className="page_404 min-h-screen flex items-center bg-white font-['Arvo']">
      <div className="container mx-auto">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              
              {/* Jumping Animation Area */}
              <div className="four_zero_four_bg">
                <h1 className="text-center font-black text-slate-800">404</h1>
              </div>

              {/* Content Area */}
              <div className="contant_box_404 -mt-12">
                <h3 className="text-3xl font-bold mb-2">
                  Look like you're lost
                </h3>
                <p className="text-slate-500 mb-6">
                  The page you are looking for is not available!
                </p>

                {/* ✅ Dynamic Redirect Link */}
                <Link to={dashboardPath} className="link_404 flex items-center justify-center gap-2 max-w-xs mx-auto">
                  {user ? <LayoutDashboard size={18} /> : <HomeIcon size={18} />}
                  {user ? "Back to Dashboard" : "Go to Home"}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;