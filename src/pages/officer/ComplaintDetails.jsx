import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import {
  getComplaintById,
  updateComplaintStatus,
} from "../../api/complaint.api";

function OfficerComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await getComplaintById(id);
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

    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateComplaintStatus(id, {
        status,
        priority,
        remark,
      });

      alert("Complaint updated successfully");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Update failed"
      );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p>Loading...</p>
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

      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Citizen:</strong> {complaint.citizen?.name}</p>

      <hr />

      <h3>Update Complaint</h3>

      <form onSubmit={handleUpdate}>
        <div>
          <label>Status</label><br />
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label>Priority</label><br />
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Remark</label><br />
          <textarea
            value={remark}
            onChange={(e) =>
              setRemark(e.target.value)
            }
            rows={3}
          />
        </div>

        <br />

        <button type="submit">
          Update Complaint
        </button>
      </form>
    </MainLayout>
  );
}

export default OfficerComplaintDetails;
