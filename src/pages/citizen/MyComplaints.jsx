/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getMyComplaints } from "../../api/complaint.api";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 NEW STATES
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // 📌 Fetch Data
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await getMyComplaints({
        page,
        limit: 5,
        status,
        sortBy: "createdAt",
        order: sortOrder,
      });

      setComplaints(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, status, sortOrder]);

  // 🎯 UI
  return (
    <MainLayout>
      <div className="px-6 py-6 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-full">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            My Complaints
          </h2>
          <p className="text-sm text-slate-600">
            View and track all grievances submitted by you.
          </p>
        </div>

        {/* 🔥 FILTERS */}
        <div className="flex gap-4 mb-6 flex-wrap">
          
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="in-progress">In Progress</option>
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setPage(1);
              setSortOrder(e.target.value);
            }}
            className="border px-3 py-2 rounded-md text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* STATES */}
        {loading && <p className="text-sm">Loading...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {!loading && complaints.length === 0 && (
          <p className="text-sm">No complaints found.</p>
        )}

        {/* LIST */}
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
                  to={`/citizen/complaints/${c._id}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  View Details
                </Link>
              </div>

              <div className="mt-4 flex gap-3 text-sm">
                <span className="px-2.5 py-1 rounded-md bg-slate-100">
                  Status: {c.status}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100">
                  Priority: {c.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 PAGINATION */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>
    </MainLayout>
  );
}

export default MyComplaints;