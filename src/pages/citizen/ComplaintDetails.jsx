import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Tag,
  Shield,
  CheckCircle,
  Info,
  Image as ImageIcon,
  Edit2,
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { getComplaintById } from "../../api/complaint.api";
import FeedbackForm from "../../components/common/FeedbackForm";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return null;

  const cleanPath = String(path).replace(/\\/g, "/");

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    if (
      cleanPath.includes("res.cloudinary.com") &&
      cleanPath.includes("/upload/")
    ) {
      return cleanPath.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1200,c_limit/"
      );
    }

    return cleanPath;
  }

  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${BASE_URL}${formattedPath}`;
};

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await getComplaintById(id);
        setComplaint(res.data || res);
      } catch (err) {
        setError(err.message || "Failed to load complaint");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-widest">
            Fetching Details...
          </p>
        </div>
      </MainLayout>
    );
  }

  const imageUrl = getImageUrl(complaint?.image);

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-8 p-4 animate-in fade-in duration-500 md:p-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all hover:bg-slate-50"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                Complaint Information
              </h1>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Ticket ID: #{id?.slice(-6)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {complaint?.status === "Pending" && (
              <button
                type="button"
                onClick={() => navigate(`/citizen/complaints/edit/${id}`)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
              >
                <Edit2 size={14} /> Edit Complaint
              </button>
            )}

            <div
              className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                complaint?.status === "Resolved"
                  ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                  : complaint?.status === "In Progress"
                  ? "border-blue-100 bg-blue-50 text-blue-600"
                  : "border-amber-100 bg-amber-50 text-amber-600"
              }`}
            >
              {complaint?.status}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold italic text-rose-600">
            {error}
          </div>
        )}

        {complaint && (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ImageIcon size={14} className="text-indigo-500" /> Evidence
                  Attached
                </h3>

                {imageUrl && !imageFailed ? (
                  <div className="group aspect-video overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl shadow-slate-200">
                    <img
                      src={imageUrl}
                      alt="Complaint Evidence"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={() => setImageFailed(true)}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-100 p-12 text-slate-400">
                    <ImageIcon size={40} className="mb-2 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-tight">
                      {complaint.image
                        ? "Image could not be loaded"
                        : "No image evidence provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
                <div>
                  <h2 className="mb-2 text-xl font-black text-slate-800">
                    {complaint.title}
                  </h2>
                  <p className="text-sm font-medium italic leading-relaxed text-slate-600">
                    "{complaint.description}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Department
                    </p>
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Tag size={12} className="text-indigo-500" />
                      {complaint.category}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Priority Level
                    </p>
                    <p
                      className={`flex items-center gap-2 text-xs font-bold ${
                        complaint.priority === "High"
                          ? "text-rose-600"
                          : "text-indigo-600"
                      }`}
                    >
                      <Info size={12} /> {complaint.priority}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Area
                    </p>
                    <p className="flex truncate items-center gap-2 text-xs font-bold text-slate-700">
                      <MapPin size={12} className="text-indigo-500" />
                      {complaint.location?.area || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {complaint.status === "Resolved" && (
                <div className="rounded-[2.5rem] bg-emerald-600 p-8 text-white shadow-xl shadow-emerald-100">
                  <div className="mb-6 flex items-center gap-3">
                    <CheckCircle size={24} />
                    <h3 className="text-lg font-bold">
                      Issue Resolved - Share Your Experience
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-white p-2 text-slate-800">
                    <FeedbackForm
                      complaintId={complaint._id}
                      onSubmitted={() =>
                        alert("Feedback submitted successfully")
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl">
                <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Official Assignment
                </h3>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 font-bold text-indigo-400">
                    {complaint.assignedOfficer?.name?.[0] || (
                      <Shield size={18} />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">
                      {complaint.assignedOfficer?.name || "Pending Assignment"}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {complaint.department?.name || "District Cell"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
                <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-800">
                  <Clock size={16} className="text-indigo-600" /> Resolution
                  Timeline
                </h3>

                <div className="relative space-y-8 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100">
                  {complaint.timeline?.map((item, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full border-4 border-indigo-600 bg-white shadow-sm" />

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-800">
                            {item.status}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            {item.date
                              ? new Date(item.date).toLocaleDateString("en-GB")
                              : "N/A"}
                          </p>
                        </div>

                        <p className="text-xs font-medium italic text-slate-500">
                          "{item.remark || "No specific remark provided."}"
                        </p>

                        <p className="flex items-center gap-1 pt-1 text-[9px] font-black uppercase tracking-widest text-indigo-500">
                          <Shield size={10} /> {item.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ComplaintDetails;