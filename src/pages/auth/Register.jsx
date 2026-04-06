import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    state: "",
    city: "",
    ward: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        location: {
          state: form.state,
          city: form.city,
          ward: form.ward,
        },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
      <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* 🔙 Home Link */}
        <Link
          to="/"
          className="text-sm text-gray-300 hover:text-white transition"
        >
          ← Back to Home
        </Link>

        <h2 className="text-3xl font-bold mt-4">
          Create Account 🚀
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          Join the grievance system and raise your voice
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500 text-red-300 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Location */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400 mb-2">Location (Optional)</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
              <input
                type="text"
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="Ward"
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;