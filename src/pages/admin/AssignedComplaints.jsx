import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllComplaints, assignComplaint } from "../../api/complaint.api";
import { getDepartments } from "../../api/department.api";
import { getOfficers } from "../../api/officer.api";

function AssignComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Track selections for each complaint ID
  const [selectedData, setSelectedData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const complaintsData = await getAllComplaints();
      const deptRes = await getDepartments();
      const officerRes = await getOfficers();

      // Only unassigned complaints filter
      setComplaints(complaintsData.filter((c) => !c.assignedOfficer));
      setDepartments(deptRes.data);
      setOfficers(officerRes.data);
    } catch {
      setError("Failed to load assignment queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectChange = (id, field, value) => {
    setSelectedData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleAssign = async (complaintId) => {
    const { officerId, departmentId } = selectedData[complaintId] || {};

    if (!officerId || !departmentId) {
      alert("Please select both an officer and a department");
      return;
    }

    try {
      await assignComplaint(complaintId, { officerId, departmentId });
      loadData();
      // Clear specific local state
      const newSelections = { ...selectedData };
      delete newSelections[complaintId];
      setSelectedData(newSelections);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-8 bg-slate-50 min-h-screen">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Assign Complaints</h2>
            <p className="text-slate-500 text-sm italic">
              There are <span className="text-blue-600 font-bold">{complaints.length}</span> complaints waiting for assignment.
            </p>
          </div>
          <button 
            onClick={loadData}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Refresh List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400 italic">Syncing with server...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
            {complaints.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                <p className="text-slate-500">No unassigned complaints found in the system.</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div key={c._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center gap-6">
                  
                  {/* Left: Content */}
                  <div className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                      {c.category}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">{c.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">ID: {c._id.substring(0, 8)}...</p>
                  </div>

                  {/* Right: Assignment Controls */}
                  <div className="flex flex-col sm:flex-row items-end gap-3 lg:w-3/5">
                    <div className="w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Officer</label>
                      <select 
                        value={selectedData[c._id]?.officerId || ""}
                        onChange={(e) => handleSelectChange(c._id, "officerId", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value="">Select Officer</option>
                        {officers.map((o) => (
                          <option key={o._id} value={o._id}>{o.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Dept</label>
                      <select 
                        value={selectedData[c._id]?.departmentId || ""}
                        onChange={(e) => handleSelectChange(c._id, "departmentId", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleAssign(c._id)}
                      className="whitespace-now7rap bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                      Assign
                    </button>
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

export default AssignComplaints;