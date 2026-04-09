/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Mail,
  MessageSquare,
  Calendar,
  Trash2,
  Loader2,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import {
  getAllInquiries,
  deleteInquiry,
  updateInquiry,
} from "../../api/inquiry.api";

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDraft, setReplyDraft] = useState({});

  // 🔥 FETCH
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await getAllInquiries();
      setInquiries(res.data.data);
    } catch (err) {
      console.error(err);
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

  // 🔥 REPLY + NOTIFICATION TRIGGER
  const handleReply = async (id) => {
    const message = replyDraft[id];

    if (!message || message.trim() === "") {
      return alert("Reply cannot be empty");
    }

    try {
      await updateInquiry(id, {
        status: "Replied",
        replyMessage: message,
      });

      // clear input
      setReplyDraft((prev) => ({ ...prev, [id]: "" }));

      fetchInquiries();
    } catch (err) {
      alert("Reply failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="text-indigo-600" />
          User Inquiries
        </h1>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
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
                {inquiries.map((iq) => (
                  <tr key={iq._id} className="border-b hover:bg-gray-50">

                    {/* USER */}
                    <td className="p-4">
                      <div className="font-bold">{iq.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {iq.email}
                      </div>
                    </td>

                    {/* SUBJECT */}
                    <td className="p-4 font-semibold">{iq.subject}</td>

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
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          iq.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : iq.status === "Replied"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {iq.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-4">
                      <div className="flex flex-col gap-2">

                        {/* REPLY BOX */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write reply..."
                            value={replyDraft[iq._id] || ""}
                            onChange={(e) =>
                              setReplyDraft((prev) => ({
                                ...prev,
                                [iq._id]: e.target.value,
                              }))
                            }
                            className="border rounded px-2 py-1 text-sm flex-1"
                          />

                          <button
                            onClick={() => handleReply(iq._id)}
                            disabled={!replyDraft[iq._id]}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-40"
                          >
                            Send
                          </button>
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(iq._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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