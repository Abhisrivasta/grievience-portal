import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { getComplaintById } from "../../api/complaint.api";
import FeedbackForm from "../../components/common/FeedbackForm";

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await getComplaintById(id);
        setComplaint(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load complaint"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  return (
    <MainLayout>
      {/* Page Wrapper */}
      <div className="px-6 py-6  bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-full">

        {/* States */}
        {loading && (
          <p className="text-slate-600 text-sm">
            Loading complaint details…
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
                Complaint details and status information
              </p>
            </div>

            {/* Complaint Info Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
              <p className="text-sm text-slate-700 mb-3">
                <span className="font-medium">Description:</span>{" "}
                {complaint.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {complaint.category}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Priority:</span>{" "}
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.priority}
                  </span>
                </p>

                {complaint.department && (
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {complaint.department.name}
                  </p>
                )}

                {complaint.assignedOfficer && (
                  <p>
                    <span className="font-medium">Assigned Officer:</span>{" "}
                    {complaint.assignedOfficer.name}
                  </p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Complaint Timeline
              </h3>

              {complaint.timeline.length === 0 && (
                <p className="text-sm text-slate-600">
                  No timeline updates available.
                </p>
              )}

              <div className="space-y-4">
                {complaint.timeline.map((t, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-lg p-4"
                  >
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {t.status}
                    </p>

                    {t.remark && (
                      <p className="text-sm text-slate-700 mt-1">
                        {t.remark}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 mt-2">
                      Updated by {t.updatedBy} on{" "}
                      {new Date(t.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {complaint.status === "Resolved" && (
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Share Your Feedback
                </h3>
                <FeedbackForm
                  complaintId={complaint._id}
                  onSubmitted={() =>
                    alert("Feedback submitted successfully")
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default ComplaintDetails;
