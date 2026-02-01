import { useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import UpdateStatusModal from "./UpdateStatus";

const mockComplaints = [
  {
    id: 101,
    title: "Water leakage in Sector 5",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 102,
    title: "Broken street light",
    priority: "Medium",
    status: "Pending",
  },
];

const AssignedComplaints = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  return (
    <PageWrapper title="Assigned Complaints">
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Title</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {mockComplaints.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-4">{c.title}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                    ${
                      c.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.priority}
                  </span>
                </td>

                <td>
                  <Badge status={c.status} />
                </td>

                <td>
                  <Button
                    onClick={() => setSelectedComplaint(c)}
                  >
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <UpdateStatusModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </PageWrapper>
  );
};

export default AssignedComplaints;
