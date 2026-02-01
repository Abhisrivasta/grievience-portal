import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyComplaints } from "../../services/complaintService";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyComplaints()
      .then((res) => {
        setComplaints(res.data);
      })
      .catch(() => {
        alert("Failed to load complaints");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-4">
        My Complaints
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr
                  key={c._id}
                  className="border-t"
                >
                  <td className="p-3">
                    {c.title}
                  </td>
                  <td className="p-3 text-center">
                    {c.category}
                  </td>
                  <td className="p-3 text-center">
                    {c.priority}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusColor[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/citizen/complaints/${c._id}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}
