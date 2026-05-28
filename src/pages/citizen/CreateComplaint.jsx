/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Send,
  MapPin,
  Navigation,
  Loader2,
  ArrowLeft,
  Info,
  Type,
  Tag,
  FileText,
  Camera,
  X,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import {
  createComplaint,
  getComplaintById,
  updateComplaint,
} from "../../api/complaint.api";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function MapLogic({ coords, setCoords, onLocationChange }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      onLocationChange(lat, lng);
    },
  });

  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lng], 16);
  }, [coords, map]);

  return <Marker position={[coords.lat, coords.lng]} />;
}

function CreateComplaint() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    area: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");
    setWarning("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    setError("");
    setWarning("");

    if (!allowedTypes.includes(file.type)) {
      return setError("Only JPG, PNG or WEBP images are allowed.");
    }

    if (file.size > 3 * 1024 * 1024) {
      return setError("Image size should be less than 3MB for faster upload.");
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      if (data.display_name) {
        setForm((prev) => ({ ...prev, area: data.display_name }));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getAutoLocation = () => {
    setError("");
    setWarning("");

    if (!navigator.geolocation) {
      return setError("Geolocation is not supported in this browser.");
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        setCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);

        if (accuracy > 100) {
          setWarning(
            "Location detected, but accuracy is low. Please adjust the map pin manually."
          );
        }

        setLocating(false);
      },
      () => {
        setError("Location permission denied. Please select location on the map.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (!isEdit || !id) return;

    const loadComplaint = async () => {
      try {
        const res = await getComplaintById(id);
        const data = res.data || res;

        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          area: data.location?.area || "",
        });

        setCoords({
          lat: data.location?.latitude || 20.5937,
          lng: data.location?.longitude || 78.9629,
        });

        if (data.image) setPreview(data.image);
      } catch (err) {
        setError("Failed to load complaint data.");
      }
    };

    loadComplaint();
  }, [isEdit, id]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWarning("");

    if (!form.title.trim()) {
      return setError("Please enter complaint subject.");
    }

    if (form.title.trim().length < 5) {
      return setError("Subject should be at least 5 characters.");
    }

    if (!form.category.trim()) {
      return setError("Please select complaint category.");
    }

    if (!form.area.trim()) {
      return setError("Please enter or detect area details.");
    }

    if (!form.description.trim()) {
      return setError("Please enter complaint description.");
    }

    if (form.description.trim().length < 20) {
      return setError("Description should be at least 20 characters.");
    }

    if (!image && !isEdit) {
      setWarning(
        "Photo evidence is optional, but adding one helps faster verification."
      );
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("category", form.category.trim());
    formData.append("area", form.area.trim());
    formData.append("latitude", coords.lat);
    formData.append("longitude", coords.lng);

    if (image) formData.append("image", image);

    try {
      if (isEdit) {
        await updateComplaint(id, formData);
      } else {
        await createComplaint(formData);
      }

      navigate("/citizen/complaints");
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 p-4 animate-in fade-in duration-700 md:p-8">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all hover:bg-slate-50"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>

          <div>
            <h1 className="text-2xl font-black">
              {isEdit ? "Update Grievance" : "Register New Grievance"}
            </h1>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Official Submission Portal
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
        >
          <div className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-10 lg:col-span-7">
            {error && (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {warning && (
              <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold text-amber-700">
                <Info size={16} className="mt-0.5 shrink-0" />
                <span>{warning}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Camera size={14} className="text-indigo-500" /> Photo Evidence
                Optional
              </label>

              {!preview ? (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 transition-all hover:border-indigo-400 hover:bg-indigo-50/30"
                >
                  <div className="rounded-2xl bg-white p-4 text-slate-400 shadow-sm transition-transform group-hover:scale-110">
                    <ImageIcon size={32} />
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-black uppercase text-slate-600">
                      Click to upload photo
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      Upload JPG, PNG or WEBP. Max 3MB recommended.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="group relative h-64 w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
                  <img
                    src={preview}
                    alt="Complaint evidence preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-4 top-4 scale-90 rounded-2xl bg-rose-500 p-2.5 text-white shadow-lg transition-all hover:bg-rose-600 group-hover:scale-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Type size={14} className="text-indigo-500" /> Subject
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white"
                  placeholder="What is the issue?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Tag size={14} className="text-indigo-500" /> Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Road">Road & Infrastructure</option>
                    <option value="Water">Water Supply</option>
                    <option value="Electricity">Electricity/Power</option>
                    <option value="Sanitation">Waste & Sanitation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <MapPin size={14} className="text-indigo-500" /> Area Details
                  </label>

                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white"
                    placeholder="Auto-detect or type..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <FileText size={14} className="text-indigo-500" /> Full
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full resize-none rounded-3xl border border-slate-100 bg-slate-50 p-5 text-sm font-medium leading-relaxed text-slate-600 shadow-inner outline-none transition-all focus:bg-white"
                  placeholder="Detailed info..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0f172a] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing
                </>
              ) : (
                <>
                  {isEdit ? "Update Complaint" : "Register Complaint"}
                  <Send size={16} />
                </>
              )}
            </button>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-600" />
                  <span className="text-sm font-black uppercase text-slate-800">
                    Map Pin
                  </span>
                </div>

                <button
                  type="button"
                  onClick={getAutoLocation}
                  disabled={locating}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-[10px] font-black uppercase text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {locating ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Navigation size={12} />
                  )}
                  Detect
                </button>
              </div>

              <div className="relative z-0 h-[400px] w-full">
                <MapContainer
                  center={[coords.lat, coords.lng]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapLogic
                    coords={coords}
                    setCoords={setCoords}
                    onLocationChange={reverseGeocode}
                  />
                </MapContainer>
              </div>

              <div className="bg-slate-50 p-5">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Tap the map to set exact location
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default CreateComplaint;