import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth.api"; // ✅ use API layer
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      toast.loading("Resetting password...", { id: "reset" });

      // ✅ clean API usage
      await resetPassword(token, password);

      toast.success("Password updated successfully ✅", {
        id: "reset",
      });

      setPassword("");

      // redirect after success
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      toast.error(
        err.message || "Invalid or expired link",
        { id: "reset" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-white/10 rounded-xl w-full max-w-md">

        <h2 className="text-2xl mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-white/5 rounded outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 py-3 rounded disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;