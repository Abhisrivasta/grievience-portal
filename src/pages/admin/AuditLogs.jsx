import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAuditLogs } from "../../api/audit.api";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = async (p) => {
    setLoading(true);
    try {
      const res = await getAuditLogs(p);
      setLogs(res.data);
      setTotalPages(res.totalPages);
      setPage(p);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1);
  }, []);

  return (
    <MainLayout>
      <h2>Audit Logs</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {logs.map((log) => (
        <div
          key={log._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p><strong>Action:</strong> {log.action}</p>
          <p>
            <strong>By:</strong>{" "}
            {log.performedBy?.name} (
            {log.performedBy?.role})
          </p>
          {log.complaint && (
            <p>
              <strong>Complaint:</strong>{" "}
              {log.complaint.title}
            </p>
          )}
          <small>
            {new Date(
              log.createdAt
            ).toLocaleString()}
          </small>
        </div>
      ))}

      <div style={{ marginTop: "16px" }}>
        <button
          disabled={page <= 1}
          onClick={() => loadLogs(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => loadLogs(page + 1)}
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}

export default AuditLogs;
