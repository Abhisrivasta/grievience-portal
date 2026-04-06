import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Email and password are required");
    }

    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (!res || !res.user) {
        throw new Error("Invalid response from server");
      }

      login(res);

      const role = res.user.role;

      if (role === "citizen") navigate("/citizen");
      else if (role === "officer") navigate("/officer");
      else if (role === "admin") navigate("/admin/complaints");
      else navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-black text-white overflow-hidden">

      {/* 🔥 Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/30 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/30 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* 🔥 Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* 🔙 Back to Home */}
        <Link
          to="/"
          className="text-sm text-gray-300 hover:text-white transition"
        >
          ← Back to Home
        </Link>

        <h2 className="text-3xl font-bold mt-4">
          Welcome Back 👋
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          Login to continue to your dashboard
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500 text-red-300 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;