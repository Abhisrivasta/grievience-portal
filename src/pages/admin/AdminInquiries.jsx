/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Mail,
  MessageSquare,
  Calendar,
  Trash2,
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import {
  getAllInquiries,
  deleteInquiry,
  updateInquiry
} from "../../api/inquiry.api";

function AdminInquiries() {

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 FETCH
  const fetchInquiries = async () => {
    try {
      setLoading(true);

      const res = await getAllInquiries(); 
      setInquiries(res.data.data);

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;

    try {
      await deleteInquiry(id);
      fetchInquiries();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 🔥 STATUS UPDATE
  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiry(id, { status });
      fetchInquiries();
    } catch (err) {
      alert("Status update failed");
    }
  };

  // 🔍 FILTER
  const filteredInquiries = inquiries.filter((iq) =>
    iq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <MessageSquare className="text-indigo-600" />
            User Inquiries
          </h1>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No inquiries found
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-gray-900 text-white text-xs">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Subject</th>
                  <th className="p-4 text-left">Message</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInquiries.map((iq) => (
                  <tr key={iq._id} className="border-b hover:bg-gray-50">

                    {/* USER */}
                    <td className="p-4">
                      <div className="font-bold">{iq.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {iq.email}
                      </div>
                    </td>

                    {/* SUBJECT */}
                    <td className="p-4 font-semibold">
                      {iq.subject}
                    </td>

                    {/* MESSAGE */}
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                      {iq.message}
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(iq.createdAt).toLocaleDateString()}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <select
                        value={iq.status}
                        onChange={(e) =>
                          handleStatusChange(iq._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Replied">Replied</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(iq._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default AdminInquiries;