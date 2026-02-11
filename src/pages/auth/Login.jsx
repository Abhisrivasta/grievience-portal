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
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      login(res);

      if (res.user.role === "citizen") navigate("/citizen");
      else if (res.user.role === "officer") navigate("/officer");
      else if (res.user.role === "admin") navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 flex items-center justify-center px-6">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* LEFT INFO PANEL */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
          <h2 className="text-4xl font-extrabold mb-4">
            Welcome Back
          </h2>

          <p className="text-blue-100 mb-8">
            Login to track your grievances, communicate with departments,
            and receive real-time updates.
          </p>

          <ul className="space-y-4 text-blue-100">
            <li>✔ Track complaint progress</li>
            <li>✔ Officer communication</li>
            <li>✔ Notifications & updates</li>
            <li>✔ Secure & role-based access</li>
          </ul>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="p-8 md:p-10">
          <h3 className="text-3xl font-bold text-gray-800">
            Login to your account
          </h3>
          <p className="text-gray-500 mt-1">
            Enter your credentials to continue
          </p>

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
