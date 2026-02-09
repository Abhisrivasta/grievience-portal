import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getDepartments } from "../../api/department.api";
import { getOfficers } from "../../api/officer.api";
import { getAllComplaints, assignComplaint } from "../../api/complaint.api";

function AssignComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const complaintsRes = await getAllComplaints();
      const deptRes = await getDepartments();
      const officerRes = await getOfficers();

      // only unassigned complaints
      setComplaints(
        complaintsRes.data.data.filter(
          (c) => !c.assignedOfficer
        )
      );
      setDepartments(deptRes.data);
      setOfficers(officerRes.data);
    } catch {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (
    complaintId,
    officerId,
    departmentId
  ) => {
    try {
      await assignComplaint(complaintId, {
        officerId,
        departmentId,
      });
      loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Assignment failed"
      );
    }
  };

  return (
    <MainLayout>
      <h2>Assign Complaints</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {complaints.length === 0 && (
        <p>No unassigned complaints.</p>
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

          <select id={`officer-${c._id}`}>
            <option value="">Select Officer</option>
            {officers.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>

          <select id={`dept-${c._id}`}>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              handleAssign(
                c._id,
                document.getElementById(
                  `officer-${c._id}`
                ).value,
                document.getElementById(
                  `dept-${c._id}`
                ).value
              )
            }
          >
            Assign
          </button>
        </div>
      ))}
    </MainLayout>
  );
}

export default AssignComplaints;
