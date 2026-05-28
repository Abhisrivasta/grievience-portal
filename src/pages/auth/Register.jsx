import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name?.trim()) return toast.error("Enter your name");
    if (!form.email?.trim()) return toast.error("Enter your email");
    if (!form.password) return toast.error("Enter password");

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      toast.loading("Creating account...", { id: "register" });

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

      toast.success("Verification email sent! Check your inbox", {
        id: "register",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        id: "register",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 py-10 text-white">
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-18px) rotate(5deg);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(28px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.45;
              transform: scale(1);
            }
            50% {
              opacity: 0.85;
              transform: scale(1.08);
            }
          }

          @keyframes shine {
            from {
              transform: translateX(-120%);
            }
            to {
              transform: translateX(120%);
            }
          }

          .animate-float {
            animation: float 5s ease-in-out infinite;
          }

          .animate-fade-up {
            animation: fadeUp 0.75s ease-out both;
          }

          .animate-pulse-glow {
            animation: pulseGlow 6s ease-in-out infinite;
          }

          .btn-shine::before {
            content: "";
            position: absolute;
            inset: 0;
            width: 45%;
            transform: translateX(-120%);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.35),
              transparent
            );
          }

          .btn-shine:hover::before {
            animation: shine 0.8s ease;
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.28),transparent_36%)]" />
        <div className="absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px] animate-pulse-glow" />

        <div className="absolute -left-16 top-24 h-28 w-28 rounded-full border border-white/10 bg-white/5 animate-float" />
        <div className="absolute right-12 top-32 h-20 w-20 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 rotate-12 animate-float" />
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-2xl border border-purple-300/20 bg-purple-400/10 -rotate-12 animate-float" />
      </div>

      <div className="relative z-10 w-full max-w-lg animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400" />

        <Link
          to="/"
          className="inline-flex text-sm text-slate-300 transition hover:-translate-x-1 hover:text-white"
        >
          ← Back to Home
        </Link>

        <h2 className="mt-5 text-3xl font-bold">Create Account</h2>

        <p className="mt-2 text-sm text-slate-400">
          Join the grievance system and raise your voice
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
          />

          <div className="border-t border-white/10 pt-5">
            <p className="mb-3 text-sm font-medium text-slate-400">
              Location Optional
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
              />

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
              />

              <input
                type="text"
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="Ward"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-cyan-300/30 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-shine relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-medium text-cyan-300 transition hover:text-cyan-200 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;