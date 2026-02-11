import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import { updateProfile } from "../api/auth.api";

function Profile() {
  const { user, updateUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Local states for form
  const [name, setName] = useState(user?.name || "");
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
  };

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
    
    if (fileInputRef.current?.files[0]) {
      formData.append("profilePhoto", fileInputRef.current.files[0]);
    }

    try {
      const res = await updateProfile(formData);
      // Backend response: res.data (success) -> res.data.data (user object)
      updateUser(res.data); 
      setIsEditing(false);
      setPhotoPreview(null);
      alert("Profile Updated!");
    } catch (err) {
      alert("Update Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/50 pb-12">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 w-full" />

        <div className="max-w-4xl mx-auto px-6 -mt-24">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row items-center gap-6">
              
              {/* Avatar Logic */}
              <div className="relative group">
                <div className="h-28 w-28 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} className="h-full w-full object-cover" alt="Preview" />
                  ) : user?.profilePhoto ? (
                    <img src={`http://localhost:5000${user.profilePhoto}`} className="h-full w-full object-cover" alt="Profile" />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                )}
                <input type="file" ref={fileInputRef} hidden onChange={handlePhotoChange} accept="image/*" />
              </div>

              {/* Info Logic */}
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-blue-600 outline-none w-full md:w-auto"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                )}
                <p className="text-slate-500">{user?.email}</p>
              </div>

              {/* Edit/Save Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={updating} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md active:scale-95 disabled:opacity-50">
                      {updating ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => {setIsEditing(false); setPhotoPreview(null);}} className="px-5 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg active:scale-95">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Static Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100 bg-slate-50/50">
               <div className="p-6 text-center border-r border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
                  <p className="font-bold text-slate-800 capitalize">{user?.role}</p>
               </div>
               <div className="p-6 text-center border-r border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-green-600">Active</p>
               </div>
               <div className="p-6 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">City</p>
                  <p className="font-bold text-slate-800">{user?.location?.city || "Not Set"}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;