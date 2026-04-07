import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Send, MapPin, Navigation, Loader2, ArrowLeft, 
  Info, Type, Tag, FileText, Camera, X, ImageIcon, AlertCircle
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { createComplaint } from "../../api/complaint.api";

// --- Leaflet Icon Fix ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
  
  // 1. Unified Form State
  const [form, setForm] = useState({ title: "", description: "", category: "", area: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setError("Image size should be less than 5MB");
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.display_name) setForm((prev) => ({ ...prev, area: data.display_name }));
    } catch (err) { console.error(err); }
  }, []);

  const getAutoLocation = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setLocating(false);
      },
      () => { setError("Location permission denied."); setLocating(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("area", form.area);
    formData.append("latitude", coords.lat);
    formData.append("longitude", coords.lng);
    if (image) formData.append("image", image);

    try {
      await createComplaint(formData);
      navigate("/citizen/complaints");
    } catch (err) {
      setError(err.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Register New Grievance</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 tracking-[0.2em]">Official Submission Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM DETAILS */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8">
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 flex items-center gap-2 italic">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* IMAGE UPLOAD SECTION */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Camera size={14} className="text-indigo-500" /> Photo Evidence (Optional)
              </label>
              
              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer bg-slate-50/50"
                >
                  <div className="p-4 bg-white text-slate-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <ImageIcon size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-600 uppercase">Click to upload photo</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Upload JPG or PNG (Max 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl h-64 w-full group">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setImage(null); setPreview(null); }}
                    className="absolute top-4 right-4 p-2.5 bg-rose-500 text-white rounded-2xl shadow-lg hover:bg-rose-600 transition-all scale-90 group-hover:scale-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Type size={14} className="text-indigo-500" /> Subject</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all" placeholder="What is the issue?" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Tag size={14} className="text-indigo-500" /> Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none font-bold text-slate-700 cursor-pointer appearance-none" required>
                    <option value="">Select Category</option>
                    <option value="Road">Road & Infrastructure</option>
                    <option value="Water">Water Supply</option>
                    <option value="Electricity">Electricity/Power</option>
                    <option value="Sanitation">Waste & Sanitation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={14} className="text-indigo-500" /> Area Details</label>
                  <input name="area" value={form.area} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-indigo-500 font-bold text-slate-700 transition-all" placeholder="Auto-detect or type..." required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={14} className="text-indigo-500" /> Full Description</label>
                <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm outline-none focus:bg-white transition-all resize-none font-medium text-slate-600 leading-relaxed shadow-inner" placeholder="Detailed info..." required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0f172a] hover:bg-indigo-600 text-white py-5 rounded-2xl font-black tracking-[0.2em] uppercase text-[11px] transition-all flex justify-center items-center gap-3 shadow-xl active:scale-95">
              {loading ? <Loader2 className="animate-spin" /> : <>Register Complaint <Send size={16} /></>}
            </button>
          </div>

          {/* RIGHT: MAP */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-600" />
                  <span className="text-sm font-black text-slate-800 uppercase">Map Pin</span>
                </div>
                <button type="button" onClick={getAutoLocation} disabled={locating} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all flex items-center gap-2">
                  {locating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />} Detect
                </button>
              </div>
              <div className="h-[400px] w-full z-0 relative">
                <MapContainer center={[coords.lat, coords.lng]} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapLogic coords={coords} setCoords={setCoords} onLocationChange={reverseGeocode} />
                </MapContainer>
              </div>
              <div className="p-5 bg-slate-50">
                <p className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-widest">Tap the map to set exact location</p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </MainLayout>
  );
}

export default CreateComplaint;