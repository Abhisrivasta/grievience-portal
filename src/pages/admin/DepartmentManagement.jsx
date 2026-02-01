import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
} from "../../services/departmentService";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDepartments = () => {
    getDepartments()
      .then((res) => {
        setDepartments(res.data);
      })
      .catch(() => {
        alert("Failed to load departments");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      await createDepartment({ name });
      setName("");
      fetchDepartments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create department"
      );
    }
  };

  const toggleStatus = async (dept) => {
    try {
      await updateDepartment(dept._id, {
        isActive: !dept.isActive,
      });
      fetchDepartments();
    } catch {
      alert("Failed to update department");
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-6">
        Department Management
      </h2>

      {/* Create Department */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded shadow mb-6 flex gap-4 max-w-lg"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department name"
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </form>

      {/* Department List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Name
                </th>
                <th className="p-3">
                  Status
                </th>
                <th className="p-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr
                  key={d._id}
                  className="border-t"
                >
                  <td className="p-3">
                    {d.name}
                  </td>
                  <td className="p-3 text-center">
                    {d.isActive ? (
                      <span className="text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        toggleStatus(d)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {d.isActive
                        ? "Disable"
                        : "Enable"}
                    </button>
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
