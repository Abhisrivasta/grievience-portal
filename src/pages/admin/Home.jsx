/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getHomePage, upsertHomePage } from "../../api/home.api";

function AdminHomeEditor() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    contents: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 📥 Fetch existing home data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomePage();

        if (res?.data) {
          setForm({
            title: res.data.title || "",
            description: res.data.description || "",
            contents: res.data.contents || "",
          });
        }
      } catch (err) {
        console.log("No existing data, create new");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✏️ Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 📤 Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await upsertHomePage(form);
      setMessage("✅ Home page updated successfully");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Failed to update"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="p-6 text-slate-600">Loading...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* 🔥 Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Edit Home Page
            </h1>
            <p className="text-sm text-slate-600">
              Update the public homepage content visible to all users.
            </p>
          </div>

          {/* 📝 Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-6 space-y-5"
          >

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md p-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-300 rounded-md p-2"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Main Content
              </label>
              <textarea
                name="contents"
                value={form.contents}
                onChange={handleChange}
                rows={6}
                className="w-full border border-slate-300 rounded-md p-2"
              />
            </div>

            {/* Button */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {message && (
                <p className="text-sm text-slate-700">
                  {message}
                </p>
              )}
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminHomeEditor;