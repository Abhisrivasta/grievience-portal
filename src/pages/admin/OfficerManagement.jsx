import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getOfficers, updateOfficer } from "../../services/officerService";
import { getDepartments } from "../../services/departmentService";

export default function OfficerManagement() {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchData = async () => {
    try {
      const [offRes, deptRes] = await Promise.all([
        getOfficers(),
        getDepartments(),
      ]);
      setOfficers(offRes.data);
      setDepartments(deptRes.data.filter(d => d.isActive));
    } catch {
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDepartmentChange = async (
    officerId,
    departmentId
  ) => {
    try {
      await updateOfficer(officerId, {
        department: departmentId,
      });
      fetchData();
    } catch {
      alert("Failed to update officer");
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-6">
        Officer Management
      </h2>

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Name
              </th>
              <th className="p-3">
                Email
              </th>
              <th className="p-3">
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {officers.map((o) => (
              <tr
                key={o._id}
                className="border-t"
              >
                <td className="p-3">
                  {o.name}
                </td>
                <td className="p-3 text-center">
                  {o.email}
                </td>
                <td className="p-3 text-center">
                  <select
                    value={o.department?._id || ""}
                    onChange={(e) =>
                      handleDepartmentChange(
                        o._id,
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">
                      Unassigned
                    </option>
                    {departments.map((d) => (
                      <option
                        key={d._id}
                        value={d._id}
                      >
                        {d.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
