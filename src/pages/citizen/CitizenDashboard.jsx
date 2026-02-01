import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyComplaints } from "../../services/complaintService";

export default function CitizenDashboard() {
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

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Citizen Dashboard
        </h2>
        <button
          onClick={() => navigate("/citizen/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Complaint
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Kpi title="Total" value={total} />
        <Kpi title="Pending" value={pending} />
        <Kpi title="In Progress" value={inProgress} />
        <Kpi title="Resolved" value={resolved} />
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded shadow">
        <h3 className="font-semibold p-4 border-b">
          Recent Complaints
        </h3>

        {loading ? (
          <p className="p-4">Loading...</p>
        ) : complaints.length === 0 ? (
          <p className="p-4">
            No complaints submitted yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Title
                </th>
                <th className="p-3">
                  Category
                </th>
                <th className="p-3">
                  Status
                </th>
                <th className="p-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints
                .slice(0, 5)
                .map((c) => (
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
                      <StatusBadge
                        status={c.status}
                      />
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
        )}
      </div>
    </PageWrapper>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "In Progress"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";

  return (
    <span
      className={`px-2 py-1 rounded text-xs ${color}`}
    >
      {status}
    </span>
  );
}
