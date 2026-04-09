import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Camera, MapPin, Calendar, ShieldCheck, Mail, User as UserIcon,
  Save, X, Edit3, Loader2, AlertCircle,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { updateProfile } from "../api/auth.api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Profile() {
  const { user, updateUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null); // ✅ Error state added

  // Form States
  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.location?.city || "");
  const [state, setState] = useState(user?.location?.state || "");
  const [ward, setWard] = useState(user?.location?.ward || "");
  const [photoPreview, setPhotoPreview] = useState(null);

  const fileInputRef = useRef(null);

  const getInitials = (n) =>
    n?.split(" ").map((i) => i[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  // ✅ Cancel — sab kuch reset karo
  const handleCancel = () => {
    setIsEditing(false);
    setPhotoPreview(null);
    setError(null);
    setName(user?.name || "");
    setCity(user?.location?.city || "");
    setState(user?.location?.state || "");
    setWard(user?.location?.ward || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    // ✅ Basic validation
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setUpdating(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("city", city.trim());
    formData.append("state", state.trim());
    formData.append("ward", ward.trim());

    if (fileInputRef.current?.files[0]) {
      formData.append("profilePhoto", fileInputRef.current.files[0]);
    }

    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser); // ✅ Context update
      setIsEditing(false);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      // ✅ Error user ko dikhta hai ab
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 gap-3">
          <Loader2 className="animate-spin" size={40} />
          <p className="font-bold tracking-widest text-xs uppercase">
            Syncing Profile...
          </p>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

        {/* ✅ Error Banner — globally dikhega */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-semibold">
            <AlertCircle size={18} className="shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* 🏆 PROFILE HEADER CARD */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <UserIcon size={180} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* AVATAR */}
            <div className="relative group">
              <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl">
                <div className="h-full w-full rounded-[1.8rem] bg-slate-800 flex items-center justify-center text-4xl font-black overflow-hidden border-4 border-slate-900">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      className="h-full w-full object-cover"
                      alt="Preview"
                    />
                  ) : user?.profilePhoto ? (
                    <img
                      src={`${BASE_URL}${user.profilePhoto}`}
                      className="h-full w-full object-cover"
                      alt="Profile"
                      // ✅ Image load fail hone pe initials dikhao
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl text-white shadow-xl hover:scale-110 transition-all border-4 border-slate-900"
                >
                  <Camera size={18} />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/jpeg,image/jpg,image/png,image/webp" // ✅ Accept filter
                onChange={handlePhotoChange}
              />
            </div>

            {/* IDENTITY */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                <ShieldCheck size={12} /> Verified {user?.role}
              </div>

              {isEditing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-4xl font-black bg-transparent border-b-2 border-indigo-500 outline-none w-full md:w-auto pb-1"
                  autoFocus
                  maxLength={50} // ✅ Limit
                />
              ) : (
                <h2 className="text-4xl font-black tracking-tight">
                  {user?.name}
                </h2>
              )}

              <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400 font-medium">
                <p className="flex items-center gap-1.5 text-sm">
                  <Mail size={14} /> {user?.email}
                </p>
                <p className="flex items-center gap-1.5 text-sm">
                  <MapPin size={14} /> {user?.location?.city || "Update Location"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4 md:mt-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg text-sm disabled:opacity-60"
                  >
                    {updating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}{" "}
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel} // ✅ handleCancel use karo
                    disabled={updating}
                    className="p-3 bg-slate-800 text-slate-400 rounded-2xl hover:text-white transition-all border border-slate-700 disabled:opacity-60"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 text-sm"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 📂 DETAILS & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ADDRESS FORM */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <MapPin className="text-indigo-600" /> Residency Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "City / District", value: city, setter: setCity },
                { label: "State / Province", value: state, setter: setState },
                { label: "Ward / Sector", value: ward, setter: setWard },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={14} /> {field.label}
                  </label>
                  <input
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SYSTEM INFO PANEL */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Account Insight
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Status</p>
                  </div>
                  <span className="text-xs font-black text-green-600 uppercase">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Calendar size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Joined</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {new Date(user?.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white text-center shadow-xl shadow-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                Citizen Power
              </p>
              <h4 className="text-lg font-bold">
                Help your city grow by reporting issues.
              </h4>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;