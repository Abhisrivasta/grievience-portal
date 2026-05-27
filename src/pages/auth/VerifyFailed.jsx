import { useNavigate } from "react-router-dom";

function VerifyFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="absolute w-[300px] h-[300px] bg-red-500/30 blur-[120px]"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center shadow-2xl">

        <h1 className="text-3xl font-bold text-red-400">
          ❌ Verification Failed
        </h1>

        <p className="text-gray-400 mt-3">
          Invalid or expired link.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold hover:scale-105 transition"
        >
          Register Again
        </button>

      </div>
    </div>
  );
}

export default VerifyFailed;