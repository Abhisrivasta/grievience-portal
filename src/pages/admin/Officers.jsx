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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination for List
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const officersRes = await getOfficers();
      const deptRes = await getDepartments();
      setOfficers(officersRes.data);
      setDepartments(deptRes.data);
    } catch {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedOfficer || !selectedDept) {
      setError("Officer and department are required");
      return;
    }

    setLoading(true);
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
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOfficers = officers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(officers.length / itemsPerPage);

  return (
    <MainLayout>
      <div className="px-6 py-8 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Officer Directory</h2>
          <p className="text-slate-500 text-sm">Assign departments and manage officer profiles.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Assignment Form */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h4 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Assign / Update Profile
            </h4>
            
            <form onSubmit={handleAssign} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Select Officer</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  onChange={(e) => setSelectedOfficer(officers.find((o) => o._id === e.target.value))}
                  value={selectedOfficer?._id || ""}
                >
                  <option value="">Choose an officer...</option>
                  {officers.map((o) => (
                    <option key={o._id} value={o._id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Department</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Engineer"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          {/* RIGHT: Officer List */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-semibold text-slate-800 text-lg">All Officers ({officers.length})</h4>
            </div>

            <div className="grid gap-4">
              {currentOfficers.map((o) => (
                <div key={o._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {o.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{o.name}</h5>
                        <p className="text-sm text-slate-500">{o.email}</p>
                      </div>
                    </div>
                    {o.profile ? (
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-2 py-1 rounded-md tracking-wider">
                        Assigned
                      </span>
                    ) : (
                      <span className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase px-2 py-1 rounded-md tracking-wider">
                        No Profile
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</p>
                      <p className="text-sm font-medium text-slate-700">
                        {o.profile?.department?.name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</p>
                      <p className="text-sm font-medium text-slate-700">
                        {o.profile?.designation || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {officers.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
}

export default Officers;