import { useState } from "react";
import toast from "react-hot-toast";
import {forgotPassword} from "../../api/auth.api"

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return toast.error("Enter email");

    setLoading(true);

    try {
      toast.loading("Sending reset link...", { id: "forgot" });

      // ✅ clean API call
      await forgotPassword(email);

      toast.success("Reset link sent 📩 Check your email", {
        id: "forgot",
      });

      setEmail(""); // optional reset input

    } catch (err) {
      toast.error(err.message || "Something went wrong", {
        id: "forgot",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-white/10 rounded-xl w-full max-w-md">

        <h2 className="text-2xl mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email} // ✅ controlled input
          onChange={(e) => setEmail(e.target.value.trim())}
          className="w-full p-3 mb-4 bg-white/5 rounded outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 py-3 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;