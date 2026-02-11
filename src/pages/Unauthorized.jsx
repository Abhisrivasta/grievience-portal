import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        
        {/* Animated Shield/Lock Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl scale-150 opacity-50" />
          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-red-50">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-20 w-20 text-red-500 animate-pulse" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Code & Message */}
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-slate-200 select-none">403</h1>
          <h2 className="text-2xl font-bold text-slate-900 -mt-10 relative">
            Access Denied
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
            Sorry, you don't have the required permissions to view this page. Please contact your administrator if you think this is a mistake.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)} // Go back to previous page
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all"
          >
            Go Back
          </button>
        </div>

        {/* Footer Support */}
        <p className="mt-8 text-xs text-slate-400">
          Security ID: <span className="font-mono text-[10px] uppercase">err_unauthorized_403</span>
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;