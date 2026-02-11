import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { sendBulkNotification } from "../../api/notification.api";
import { getDepartments } from "../../api/department.api";

function BulkNotifications() {
  const [target, setTarget] = useState("all");
  const [departmentId, setDepartmentId] = useState("");
  const [message, setMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data);
      } catch (err) {
        setError("Failed to fetch departments");
        console.error(err)
      }
    };
    loadDepartments();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
      setError("Please enter a message to broadcast.");
      return;
    }

    setLoading(true);
    try {
      await sendBulkNotification({
        target,
        departmentId: target === "department" ? departmentId : undefined,
        message,
      });

      setMessage("");
      setSuccess("Broadcast sent successfully to " + target.replace("_", " "));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-8  bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Bulk Notifications</h2>
          <p className="text-slate-500 text-sm">Send important updates or alerts to multiple users at once.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-center gap-2">
              <span className="font-bold">Success:</span> {success}
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h4 className="font-semibold text-slate-800">New Broadcast Message</h4>
            </div>

            <form onSubmit={handleSend} className="p-6 space-y-6">
              {/* Target Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Recipient Group
                  </label>
                  <select
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  >
                    <option value="all">All Registered Users</option>
                    <option value="officers">All Department Officers</option>
                    <option value="department">Specific Department</option>
                  </select>
                </div>

                {target === "department" && (
                  <div className="animate-in fade-in slide-in-from-left-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Target Department
                    </label>
                    <select
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                    >
                      <option value="">Choose Department...</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Message Area */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Broadcast Message
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Type your announcement here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                />
                <p className="mt-2 text-[11px] text-slate-400 italic">
                  Note: This message will be sent immediately as a push notification or system alert.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {loading ? "Sending..." : "Send Broadcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default BulkNotifications;