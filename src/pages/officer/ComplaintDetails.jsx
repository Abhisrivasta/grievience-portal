import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import {
  updateComplaintStatus,
  getComplaintForOfficer,
} from "../../api/complaint.api";

function OfficerComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaint = async () => {
    try {
      const res = await getComplaintForOfficer(id);
      setComplaint(res.data);
      setStatus(res.data.status);
      setPriority(res.data.priority);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (complaint.status === "Resolved") return;

    try {
      await updateComplaintStatus(id, {
        status,
        priority,
        remark,
      });

      alert("Complaint updated successfully");
      setRemark("");
      fetchComplaint();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Update failed"
      );
    }
  };

  return (
    <MainLayout>
      {/* Page Background */}
      <div className="px-6 py-6   bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-full">

        {/* States */}
        {loading && (
          <p className="text-slate-600 text-sm">
            Loading complaint…
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {!loading && complaint && (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {complaint.title}
              </h2>
              <p className="text-sm text-slate-600">
                Complaint details and officer actions
              </p>
            </div>

            {/* Complaint Info */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
              <p className="text-sm text-slate-700 mb-3">
                <span className="font-medium">Description:</span>{" "}
                {complaint.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Citizen:</span>{" "}
                  {complaint.citizen?.name}
                </p>

                <p>
                  <span className="font-medium">Current Status:</span>{" "}
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Update Section */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 max-w-lg">

              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Update Complaint
              </h3>

              {complaint.status === "Resolved" && (
                <p className="text-sm text-green-600 mb-4">
                  This complaint has been resolved and is locked.
                </p>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={complaint.status === "Resolved"}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={complaint.status === "Resolved"}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Remark */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Remark
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={3}
                    disabled={complaint.status === "Resolved"}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Submit */}
                {complaint.status !== "Resolved" && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium text-white
                      bg-blue-600 hover:bg-blue-700"
                  >
                    Update Complaint
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default OfficerComplaintDetails;
