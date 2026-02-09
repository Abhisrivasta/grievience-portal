import { useEffect, useState } from "react";
import { getMyComplaints } from "../../api/complaint.api";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await getMyComplaints();
        setComplaints(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load complaints"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <MainLayout>
      <h2>My Complaints</h2>

      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {!loading && complaints.length === 0 && (
        <p>No complaints filed yet.</p>
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

          <Link to={`/citizen/complaints/${c._id}`}>
            View Details
          </Link>
        </div>
      ))}
    </MainLayout>
  );
}

export default MyComplaints;
