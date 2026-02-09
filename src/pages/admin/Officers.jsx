import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getOfficers, upsertOfficerProfile } from "../../api/officer.api";
import { getDepartments } from "../../api/department.api";

function Officers() {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [designation, setDesignation] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const officersRes = await getOfficers();
      const deptRes = await getDepartments();
      setOfficers(officersRes.data);
      setDepartments(deptRes.data);
    } catch {
      setError("Failed to load officers");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedOfficer || !selectedDept) {
      setError("Officer and department required");
      return;
    }

    try {
      await upsertOfficerProfile({
        officerId: selectedOfficer._id,
        department: selectedDept,
        designation,
      });
      setSelectedOfficer(null);
      setSelectedDept("");
      setDesignation("");
      loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save profile"
      );
    }
  };

  return (
    <MainLayout>
      <h2>Officers</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Assign Officer */}
      <form onSubmit={handleAssign}>
        <h4>Assign / Update Officer</h4>

        <select
          onChange={(e) =>
            setSelectedOfficer(
              officers.find(
                (o) => o._id === e.target.value
              )
            )
          }
          value={selectedOfficer?._id || ""}
        >
          <option value="">Select Officer</option>
          {officers.map((o) => (
            <option key={o._id} value={o._id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>

        <select
          value={selectedDept}
          onChange={(e) =>
            setSelectedDept(e.target.value)
          }
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) =>
            setDesignation(e.target.value)
          }
        />

        <button type="submit">
          Save Profile
        </button>
      </form>

      <hr />

      {/* Officer List */}
      <h4>Officer List</h4>

      {officers.map((o) => (
        <div
          key={o._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p>
            <strong>{o.name}</strong> ({o.email})
          </p>

          {o.profile ? (
            <>
              <p>
                Department:{" "}
                {o.profile.department?.name}
              </p>
              <p>
                Designation:{" "}
                {o.profile.designation}
              </p>
            </>
          ) : (
            <p>No profile assigned</p>
          )}
        </div>
      ))}
    </MainLayout>
  );
}

export default Officers;
