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
      {/* Page Background */}
      <div className="px-6 py-6  bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-full">

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Assigned Complaints
          </h2>
          <p className="text-sm text-slate-600">
            View and take action on grievances assigned to you.
          </p>
        </div>

        {/* States */}
        {loading && (
          <p className="text-slate-600 text-sm">
            Loading assigned complaints…
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}

        {!loading && complaints.length === 0 && (
          <p className="text-slate-600 text-sm">
            No complaints assigned at the moment.
          </p>
        )}

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">
                    {c.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Category: {c.category}
                  </p>
                </div>

                <Link
                  to={`/officer/complaints/${c._id}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  View & Update
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  Status: {c.status}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  Priority: {c.priority}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  Citizen: {c.citizen?.name || "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default AssignedComplaints;
