import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getAuditLogs } from "../../services/auditService";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    action: "",
    performedBy: "",
    fromDate: "",
    toDate: "",
  });

  const fetchLogs = async (pageNo = 1) => {
    try {
      const res = await getAuditLogs({
        ...filters,
        page: pageNo,
      });
      setLogs(res.data);
      setTotalPages(res.totalPages);
      setPage(pageNo);
    } catch {
      alert("Failed to load audit logs");
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    fetchLogs(1);
  };

  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-6">
        Audit Logs
      </h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-4">
        <input
          name="action"
          placeholder="Action"
          value={filters.action}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        />
        <input
          name="performedBy"
          placeholder="User ID"
          value={filters.performedBy}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-1 rounded col-span-4"
        >
          Apply Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Action
              </th>
              <th className="p-3">
                User
              </th>
              <th className="p-3">
                Complaint
              </th>
              <th className="p-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                className="border-t"
              >
                <td className="p-3">
                  {log.action}
                </td>
                <td className="p-3 text-center">
                  {log.performedBy?.email ||
                    "System"}
                </td>
                <td className="p-3 text-center">
                  {log.complaint?.title ||
                    "-"}
                </td>
                <td className="p-3 text-center">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() =>
            fetchLogs(page - 1)
          }
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() =>
            fetchLogs(page + 1)
          }
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </PageWrapper>
  );
}
