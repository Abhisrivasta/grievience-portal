import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
} from "../../api/department.api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (err) {
      setError("Failed to load departments");
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !category) {
      setError("Name and category are required");
      return;
    }

    setLoading(true);
    try {
      await createDepartment({ name, category });
      setName("");
      setCategory("");
      loadDepartments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create department"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (dept) => {
    try {
      await updateDepartment(dept._id, {
        isActive: !dept.isActive,
      });
      loadDepartments();
    } catch {
      alert("Failed to update department");
    }
  };

  return (
    <MainLayout>
      <h2>Departments</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Create Department */}
      <form onSubmit={handleCreate}>
        <h4>Create Department</h4>

        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">Select Category</option>
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Electricity">
            Electricity
          </option>
          <option value="Sanitation">
            Sanitation
          </option>
        </select>

        <button type="submit" disabled={loading}>
          Create
        </button>
      </form>

      <hr />

      {/* Department List */}
      <h4>Existing Departments</h4>

      {departments.map((d) => (
        <div
          key={d._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p>
            <strong>{d.name}</strong> (
            {d.category})
          </p>
          <p>Status: {d.isActive ? "Active" : "Inactive"}</p>

          <button onClick={() => toggleActive(d)}>
            {d.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </MainLayout>
  );
}

export default Departments;
