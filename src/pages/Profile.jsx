import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import { updateProfile } from "../api/auth.api";

const BASE_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const { user, updateUser, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.location?.city || "");
  const [state, setState] = useState(user?.location?.state || "");
  const [ward, setWard] = useState(user?.location?.ward || "");

  const [photoPreview, setPhotoPreview] = useState(null);

  const fileInputRef = useRef(null);

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("ward", ward);

    if (fileInputRef.current?.files[0]) {
      formData.append("profilePhoto", fileInputRef.current.files[0]);
    }

    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);

      setIsEditing(false);
      setPhotoPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-40 text-gray-500">
          Loading profile...
        </div>
      </MainLayout>
    );
  }

return (
  <MainLayout>
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* 🔥 HERO */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-5">

          {/* AVATAR */}
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
              
              {photoPreview ? (
                <img src={photoPreview} className="h-full w-full object-cover" />
              ) : user?.profilePhoto ? (
                <img
                  src={`${BASE_URL}${user.profilePhoto}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>

            {/* ✅ FIX: Change photo only in edit */}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 text-white text-xs flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition"
              >
                Change
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handlePhotoChange}
            />
          </div>

          {/* 🔥 NAME + EMAIL */}
          <div className="flex-1">

            {/* ✅ FIX: Editable name */}
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-semibold bg-transparent border-b border-white/50 outline-none w-full"
              />
            ) : (
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
            )}

            <p className="text-blue-100">{user?.email}</p>
          </div>

          {/* 🔥 ACTION BUTTONS */}
          <div className="flex gap-2">

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  {updating ? "Saving..." : "Save"}
                </button>

                {/* ✅ FIX: Cancel button */}
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPhotoPreview(null);
                  }}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100"
              >
                Edit
              </button>
            )}

          </div>
        </div>
      </div>

      {/* 🔥 MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {[
            { label: "City", value: city, setter: setCity },
            { label: "State", value: state, setter: setState },
            { label: "Ward", value: ward, setter: setWard },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-sm text-slate-500">
                {field.label}
              </label>

              <input
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                disabled={!isEditing}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
              />
            </div>
          ))}

        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-500">Role</p>
            <p className="text-lg font-semibold text-slate-800 capitalize">
              {user?.role}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-green-600">Status</p>
            <p className="text-lg font-semibold text-green-700">
              Active
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-500">Joined</p>
            <p className="text-lg font-semibold text-slate-800">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>

        </div>

      </div>
    </div>
  </MainLayout>
);
}

export default Profile;