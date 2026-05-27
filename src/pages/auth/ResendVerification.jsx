import { useState } from "react";
import { resendVerification } from "../../api/auth.api"; 
import toast from "react-hot-toast";

function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      return toast.error("Enter your email");
    }

    setLoading(true);

    try {
      toast.loading("Sending verification email...", { id: "resend" });

      await resendVerification(email);

      toast.success("Verification email sent 📩", {
        id: "resend",
      });

      setEmail(""); // optional reset input

    } catch (err) {
      toast.error(
        err.message || "Failed to send email",
        { id: "resend" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-md text-center">

        <h2 className="text-2xl font-bold mb-4">
          Resend Verification 📩
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white mb-4 outline-none"
        />

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>

      </div>
    </div>
  );
}

export default ResendVerification;