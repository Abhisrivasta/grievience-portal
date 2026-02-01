import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getComplaintDetails,
  updateComplaintStatus,
} from "../../services/complaintService";

export default function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getComplaintDetails(id)
      .then((res) => {
        setComplaint(res.data);
        setStatus(res.data.status);
      })
      .catch(() => {
        alert("Failed to load complaint");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateComplaintStatus(id, {
        status,
        remark,
      });
      navigate("/officer/assigned");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-4">
        Update Complaint Status
      </h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>Title:</strong>{" "}
          {complaint.title}
        </p>
        <p>
          <strong>Current Status:</strong>{" "}
          {complaint.status}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4 max-w-lg"
      >
        <div>
          <label className="block mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border px-3 py-2 rounded w-full"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Remark
          </label>
          <textarea
            value={remark}
            onChange={(e) =>
              setRemark(e.target.value)
            }
            className="border px-3 py-2 rounded w-full"
            placeholder="Work started / Issue resolved etc."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving
            ? "Updating..."
            : "Update Status"}
        </button>
      </form>
    </PageWrapper>
  );
}
