import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Camera,
  MapPin,
  Calendar,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Save,
  X,
  Edit3,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { updateProfile } from "../api/auth.api";

const getCloudinaryImageUrl = (url, options = {}) => {
  if (!url) return null;

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const {
    width = 256,
    height = 256,
    crop = "fill",
    gravity = "face",
  } = options;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},h_${height},c_${crop},g_${gravity}/`
  );
};

function Profile() {
  const { user, updateUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.location?.city || "");
  const [state, setState] = useState(user?.location?.state || "");
  const [ward, setWard] = useState(user?.location?.ward || "");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const avatarUrl = photoPreview
    ? photoPreview
    : getCloudinaryImageUrl(user?.profilePhoto, {
        width: 256,
        height: 256,
      });

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={40} />
          <p className="text-xs font-bold uppercase tracking-widest">
            Syncing Profile...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  const getInitials = (value) =>
    value
      ?.split(" ")
      .map((item) => item[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    setError(null);
    setWarning(null);

    if (!allowedTypes.includes(file.type)) {
      return setError("Only JPG, PNG or WEBP images are allowed.");
    }

    if (file.size > 3 * 1024 * 1024) {
      return setError("Image size should be less than 3MB for faster upload.");
    }

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setName(user?.name || "");
    setCity(user?.location?.city || "");
    setState(user?.location?.state || "");
    setWard(user?.location?.ward || "");
    setPhotoPreview(null);
    setSelectedFile(null);
    setError(null);
    setWarning(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setIsEditing(false);
    setPhotoPreview(null);
    setSelectedFile(null);
    setError(null);
    setWarning(null);
    setName(user?.name || "");
    setCity(user?.location?.city || "");
    setState(user?.location?.state || "");
    setWard(user?.location?.ward || "");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setError(null);
    setWarning(null);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name should be at least 2 characters.");
      return;
    }

    setUpdating(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("city", city.trim());
    formData.append("state", state.trim());
    formData.append("ward", ward.trim());

    if (selectedFile) {
      formData.append("profilePhoto", selectedFile);
    }

    try {
      const res = await updateProfile(formData);
      updateUser(res?.user || res);

      setIsEditing(false);
      setPhotoPreview(null);
      setSelectedFile(null);

      if (fileInputRef.current) fileInputRef.current.value = "";

      setWarning("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-8 p-4 animate-in fade-in duration-700 md:p-8">
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {warning && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            <Info size={18} className="shrink-0" />
            {warning}
            <button
              type="button"
              onClick={() => setWarning(null)}
              className="ml-auto text-emerald-400 hover:text-emerald-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-300">
          <div className="pointer-events-none absolute right-0 top-0 p-12 opacity-10">
            <UserIcon size={180} />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
            <div className="group relative">
              <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.8rem] border-4 border-slate-900 bg-slate-800 text-4xl font-black">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      className="h-full w-full object-cover"
                      alt="Profile"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 rounded-2xl border-4 border-slate-900 bg-indigo-600 p-3 text-white shadow-xl transition-all hover:scale-110"
                >
                  <Camera size={18} />
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                <ShieldCheck size={12} /> Verified {user?.role}
              </div>

              {isEditing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b-2 border-indigo-500 bg-transparent pb-1 text-4xl font-black outline-none md:w-auto"
                  autoFocus
                  maxLength={50}
                />
              ) : (
                <h2 className="text-4xl font-black tracking-tight">
                  {user?.name}
                </h2>
              )}

              <div className="flex flex-col items-center gap-2 text-slate-400 md:flex-row md:justify-start md:gap-4">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Mail size={14} /> {user?.email}
                </p>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={14} />{" "}
                  {user?.location?.city || "Update Location"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3 md:mt-0">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={updating}
                    className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all hover:bg-indigo-50 disabled:opacity-60"
                  >
                    {updating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {updating ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updating}
                    className="rounded-2xl border border-slate-700 bg-slate-800 p-3 text-slate-400 transition-all hover:text-white disabled:opacity-60"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10 lg:col-span-2">
            <h3 className="flex items-center gap-3 text-xl font-black text-slate-800">
              <MapPin className="text-indigo-600" /> Residency Details
            </h3>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                { label: "City / District", value: city, setter: setCity },
                { label: "State / Province", value: state, setter: setState },
                { label: "Ward / Sector", value: ward, setter: setWard },
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <MapPin size={14} /> {field.label}
                  </label>

                  <input
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Account Insight
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2 text-green-600">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Status</p>
                  </div>
                  <span className="text-xs font-black uppercase text-green-600">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <Calendar size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Joined</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-indigo-600 p-6 text-center text-white shadow-xl shadow-indigo-100">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-80">
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