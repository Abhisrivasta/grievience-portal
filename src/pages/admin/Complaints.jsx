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

  // Local state for assignments
  const [assignments, setAssignments] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const complaintsData = await getAllComplaints();
      const departmentsRes = await getDepartments();
      const officersRes = await getOfficers();

      setComplaints(complaintsData);
      setDepartments(departmentsRes.data);
      setOfficers(officersRes.data);
    } catch (err) {
      setError("Failed to load complaints");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (complaintId, field, value) => {
    setAssignments((prev) => ({
      ...prev,
      [complaintId]: {
        ...prev[complaintId],
        [field]: value,
      },
    }));
  };

  const handleAssign = async (complaintId) => {
    const { officerId, departmentId } = assignments[complaintId] || {};

    if (!officerId || !departmentId) {
      alert("Please select both an officer and a department");
      return;
    }

    try {
      await assignComplaint(complaintId, { officerId, departmentId });
      // Reset assignment local state for this complaint
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[complaintId];
        return next;
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "resolved": return "bg-green-100 text-green-700 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-8  bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Complaints Control</h2>
          <p className="text-slate-500 text-sm">Review incoming complaints and delegate tasks to officers.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-slate-400 font-medium">
            Fetching complaints queue...
          </div>
        ) : (
          <div className="grid gap-6">
            {complaints.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500">
                No complaints currently in the queue.
              </div>
            ) : (
              complaints.map((c) => (
                <div key={c._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center">
                    
                    {/* Left: Info Section */}
                    <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                        <span className="text-slate-300 text-xs">|</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase">{c.category}</span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{c.title}</h4>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600">
                          <span className="font-bold text-slate-400 uppercase text-[10px] mr-2">Citizen:</span>
                          {c.citizen?.name} <span className="text-slate-400 text-xs italic">({c.citizen?.email})</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Action Section */}
                    <div className="p-6 md:w-1/3 bg-slate-50/50 flex flex-col justify-center">
                      {c.assignedOfficer ? (
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Assignment</p>
                          <p className="text-green-600 font-bold flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            {c.assignedOfficer.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <select 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={assignments[c._id]?.officerId || ""}
                            onChange={(e) => handleInputChange(c._id, "officerId", e.target.value)}
                          >
                            <option value="">Select Officer</option>
                            {officers.map((o) => (
                              <option key={o._id} value={o._id}>{o.name}</option>
                            ))}
                          </select>

                          <select 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={assignments[c._id]?.departmentId || ""}
                            onChange={(e) => handleInputChange(c._id, "departmentId", e.target.value)}
                          >
                            <option value="">Select Department</option>
                            {departments.map((d) => (
                              <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleAssign(c._id)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                          >
                            Assign Task
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminComplaints;