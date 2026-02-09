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
        setError(err.response?.data?.message || "Failed to load complaint");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p>Loading complaint...</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p style={{ color: "red" }}>{error}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h2>{complaint.title}</h2>

      <p>
        <strong>Description:</strong> {complaint.description}
      </p>
      <p>
        <strong>Category:</strong> {complaint.category}
      </p>
      <p>
        <strong>Status:</strong> {complaint.status}
      </p>
      <p>
        <strong>Priority:</strong> {complaint.priority}
      </p>

      {complaint.department && (
        <p>
          <strong>Department:</strong> {complaint.department.name}
        </p>
      )}

      {complaint.assignedOfficer && (
        <p>
          <strong>Officer:</strong> {complaint.assignedOfficer.name}
        </p>
      )}

      <hr />

      <h3>Complaint Timeline</h3>
      {complaint.status === "Resolved" && (
        <FeedbackForm
          complaintId={complaint._id}
          onSubmitted={() => alert("Feedback submitted successfully")}
        />
      )}

      {complaint.timeline.length === 0 && <p>No timeline updates.</p>}

      {complaint.timeline.map((t, index) => (
        <div
          key={index}
          style={{
            borderLeft: "3px solid #1976d2",
            paddingLeft: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>Status:</strong> {t.status}
          </p>
          {t.remark && <p>{t.remark}</p>}
          <small>
            Updated by {t.updatedBy} on {new Date(t.date).toLocaleString()}
          </small>
        </div>
      ))}
    </MainLayout>
  );
}

export default ComplaintDetails;
