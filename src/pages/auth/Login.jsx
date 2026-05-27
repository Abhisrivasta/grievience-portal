import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, googleLogin } from "../../api/auth.api";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

// Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ================= NORMAL LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    setLoading(true);

    try {
      toast.loading("Logging in...", { id: "login" });

      const data = await loginUser({ email, password });

      login(data);

      const role = data.user.role;

      toast.success("Login successful 🚀", { id: "login" });

      if (role === "citizen") navigate("/citizen");
      else if (role === "officer") navigate("/officer");
      else if (role === "admin") navigate("/admin/complaints");
      else navigate("/");

    } catch (err) {
      toast.error(
        err.message || "Login failed",
        { id: "login" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    try {
      toast.loading("Connecting Google...", { id: "google" });

      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();

      const data = await googleLogin(firebaseToken);

      login(data);

      toast.success("Google login successful 🚀", { id: "google" });

      const role = data.user.role;

      if (role === "citizen") navigate("/citizen");
      else if (role === "officer") navigate("/officer");
      else if (role === "admin") navigate("/admin/complaints");
      else navigate("/");

    } catch (err) {
      console.log(err);
      toast.error("Google login failed", { id: "google" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-black text-white overflow-hidden">

      {/* 🔥 Background */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/30 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/30 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* 🔥 Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        <Link to="/" className="text-sm text-gray-300 hover:text-white">
          ← Back to Home
        </Link>

        <h2 className="text-3xl font-bold mt-4">Welcome Back 👋</h2>

        <p className="text-gray-400 text-sm mt-1">
          Login to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black py-3 rounded-lg"
          >
            Continue with Google
          </button>

        </form>

        {/* 🔥 Resend Verification */}
        <p className="text-center text-sm text-gray-400 mt-3">
          Didn’t receive verification email?{" "}
          <Link
            to="/resend-verification"
            className="text-blue-400 hover:underline"
          >
            Resend
          </Link>
        </p>

        {/* Register */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;