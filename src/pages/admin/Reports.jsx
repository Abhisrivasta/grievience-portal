import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getOfficerPerformance,
  exportComplaintsCSV,
} from "../../services/reportService";

export default function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficerPerformance()
      .then((res) => {
        setReport(res.data);
      })
      .catch(() => {
        alert("Failed to load report");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      const res = await exportComplaintsCSV();
      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        "complaints-report.csv"
      );
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Export failed");
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Reports
        </h2>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Officer
                </th>
                <th className="p-3">
                  Email
                </th>
                <th className="p-3">
                  Resolved
                </th>
                <th className="p-3">
                  Avg Days
                </th>
                <th className="p-3">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {report.map((r) => (
                <tr
                  key={r.officerId}
                  className="border-t"
                >
                  <td className="p-3">
                    {r.officerName}
                  </td>
                  <td className="p-3 text-center">
                    {r.officerEmail}
                  </td>
                  <td className="p-3 text-center">
                    {r.resolvedCount}
                  </td>
                  <td className="p-3 text-center">
                    {r.avgResolutionTime.toFixed(1)}
                  </td>
                  <td className="p-3 text-center">
                    {r.averageRating.toFixed(1)}
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
