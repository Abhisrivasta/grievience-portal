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
        setComplaints(res.data || []);
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

  // 🎯 Status Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "in progress":
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "resolved":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <MainLayout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Assigned Complaints 📌
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and resolve complaints assigned to you
          </p>
        </div>

        {/* STATES */}
        {loading && (
          <div className="text-center text-slate-500">
            Loading complaints...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            No complaints assigned 🚫
          </div>
        )}

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white/80 backdrop-blur-xl border rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-800 text-lg">
                  {c.title}
                </h3>

                <Link
                  to={`/officer/complaints/${c._id}`}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Open →
                </Link>
              </div>

              {/* CATEGORY */}
              <p className="text-sm text-slate-500 mt-1">
                {c.category}
              </p>

              {/* DESCRIPTION (SHORT) */}
              {c.description && (
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  {c.description}
                </p>
              )}

              {/* BADGES */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                  {c.priority}
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                  {c.citizen?.name || "Unknown"}
                </span>
              </div>

              {/* DATE */}
              <p className="text-xs text-slate-400 mt-4">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default AssignedComplaints;