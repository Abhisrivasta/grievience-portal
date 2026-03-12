/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllComplaints, assignComplaint } from "../../api/complaint.api";
import { getDepartments } from "../../api/department.api";
import { getOfficers } from "../../api/officer.api";

function AdminComplaints() {

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assignments, setAssignments] = useState({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  /* ---------------------------
     LOAD COMPLAINTS
  --------------------------- */

  const loadComplaints = async () => {
    try {

      const res = await getAllComplaints(page, limit);

      setComplaints(res.data);
      setTotalPages(res.totalPages);

    } catch (err) {
      setError("Failed to load complaints");
      console.log(err);
    }
  };

  /* ---------------------------
     LOAD STATIC DATA
  --------------------------- */

  const loadStaticData = async () => {
    try {

      const departmentsRes = await getDepartments();
      const officersRes = await getOfficers();

      setDepartments(departmentsRes.data);
      setOfficers(officersRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------------------
     INITIAL LOAD
  --------------------------- */

  useEffect(() => {

    const init = async () => {
      setLoading(true);

      await Promise.all([
        loadStaticData(),
        loadComplaints()
      ]);

      setLoading(false);
    };

    init();

  }, []);



  useEffect(() => {
    loadComplaints();
  }, [page]);


  const handleInputChange = (complaintId, field, value) => {

    setAssignments(prev => ({
      ...prev,
      [complaintId]: {
        ...prev[complaintId],
        [field]: value
      }
    }));

  };

 

  const handleAssign = async (complaintId) => {

    const { officerId, departmentId } = assignments[complaintId] || {};

    if (!officerId || !departmentId) {
      alert("Select both officer and department");
      return;
    }

    try {

      await assignComplaint(complaintId, { officerId, departmentId });

      setAssignments(prev => {
        const next = { ...prev };
        delete next[complaintId];
        return next;
      });

      loadComplaints();

    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }

  };



  const getStatusColor = (status) => {

    switch (status?.toLowerCase()) {

      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";

      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";

      case "in progress":
        return "bg-blue-100 text-blue-700 border-blue-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";

    }

  };

  return (

    <MainLayout>

      <div className="px-6 py-8 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Admin Complaints Control
          </h2>
          <p className="text-slate-500 text-sm">
            Review incoming complaints and delegate tasks to officers.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading complaints...
          </div>
        ) : (

          <>
            <div className="grid gap-6">

              {complaints.map(c => (

                <div
                  key={c._id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>

                      <h4 className="font-bold text-lg mt-2">
                        {c.title}
                      </h4>

                      <p className="text-sm text-slate-600 mt-1">
                        Citizen: {c.citizen?.name}
                      </p>

                    </div>

                    <div className="w-64 space-y-2">

                      {c.assignedOfficer ? (

                        <p className="text-green-600 font-semibold">
                          Assigned to {c.assignedOfficer.name}
                        </p>

                      ) : (

                        <>
                          <select
                            className="w-full border rounded p-2 text-sm"
                            value={assignments[c._id]?.officerId || ""}
                            onChange={(e) =>
                              handleInputChange(c._id, "officerId", e.target.value)
                            }
                          >
                            <option value="">Select Officer</option>
                            {officers.map(o => (
                              <option key={o._id} value={o._id}>
                                {o.name}
                              </option>
                            ))}
                          </select>

                          <select
                            className="w-full border rounded p-2 text-sm"
                            value={assignments[c._id]?.departmentId || ""}
                            onChange={(e) =>
                              handleInputChange(c._id, "departmentId", e.target.value)
                            }
                          >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                              <option key={d._id} value={d._id}>
                                {d.name}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleAssign(c._id)}
                            className="w-full bg-blue-600 text-white py-2 rounded"
                          >
                            Assign
                          </button>

                        </>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>


            <div className="flex justify-center gap-4 mt-10">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-slate-200 rounded disabled:opacity-40"
              >
                Prev
              </button>

              <span className="font-semibold">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-slate-200 rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </>
        )}

      </div>

    </MainLayout>

  );

}

export default AdminComplaints;