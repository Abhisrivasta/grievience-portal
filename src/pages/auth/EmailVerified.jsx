import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function EmailVerified() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="absolute w-[300px] h-[300px] bg-green-500/30 blur-[120px]"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center shadow-2xl">

        <h1 className="text-3xl font-bold text-green-400">
          ✅ Email Verified!
        </h1>

        <p className="text-gray-400 mt-3">
          Redirecting to login in 3 seconds...
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:scale-105 transition"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
}

export default EmailVerified;