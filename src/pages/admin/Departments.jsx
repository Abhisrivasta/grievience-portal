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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch {
      setError("Failed to load departments");
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

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
      setCurrentPage(1); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (dept) => {
    try {
      await updateDepartment(dept._id, { isActive: !dept.isActive });
      loadDepartments();
    } catch {
      alert("Failed to update department");
    }
  };

  return (
    <MainLayout>
      <div className="px-6 py-8 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Department Management</h2>
          <p className="text-slate-500">Create new departments and manage existing ones side by side.</p>
        </div>

        {error && <p className="text-red-600 bg-red-50 p-3 rounded-md mb-6 border border-red-100">{error}</p>}

        {/* --- Side-by-Side Container --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create Form (Takes 4/12 spaces) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h4 className="font-semibold text-slate-800 mb-5 text-lg">Create Department</h4>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Civil Maintenance"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Road">Road</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Processing..." : "Add Department"}
              </button>
            </form>
          </div>

          {/* Right Column: List (Takes 8/12 spaces) */}
          <div className="lg:col-span-8">
            <h4 className="font-semibold text-slate-800 mb-5 text-lg">Existing Departments ({departments.length})</h4>
            <div className="space-y-3">
              {currentItems.map((d) => (
                <div key={d._id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${d.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-500">{d.category} • <span className={d.isActive ? "text-green-600" : "text-slate-400"}>{d.isActive ? "Active" : "Inactive"}</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActive(d)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      d.isActive 
                      ? "border border-slate-200 text-slate-600 hover:bg-slate-50" 
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    }`}
                  >
                    {d.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            {departments.length > itemsPerPage && (
              <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-md hover:bg-slate-50 disabled:opacity-30"
                  >
                    ←
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                        currentPage === i + 1 ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-md hover:bg-slate-50 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default Departments;