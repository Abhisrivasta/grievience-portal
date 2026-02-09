import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAssignedComplaints } from "../../api/complaint.api";
import { Link } from "react-router-dom";

function AssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await getAssignedComplaints();
        setComplaints(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load assigned complaints"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssigned();
  }, []);

  return (
    <MainLayout>
      <h2>Assigned Complaints</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && complaints.length === 0 && (
        <p>No complaints assigned.</p>
      )}

      {complaints.map((c) => (
        <div
          key={c._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h4>{c.title}</h4>
          <p>Category: {c.category}</p>
          <p>Status: {c.status}</p>
          <p>Priority: {c.priority}</p>
          <p>
            Citizen: {c.citizen?.name}
          </p>

          <Link to={`/officer/complaints/${c._id}`}>
            View & Update
          </Link>
        </div>
      ))}
    </MainLayout>
  );
}

export default AssignedComplaints;
