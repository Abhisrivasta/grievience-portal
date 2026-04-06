/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getHomePage, upsertHomePage } from "../../api/home.api";

function AdminHomeEditor() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    contents: "",
    features: [],
    stats: [],
    ctaText: "",
    ctaSubText: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 📥 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomePage();

        if (res?.data) {
          setForm({
            title: res.data.title || "",
            description: res.data.description || "",
            contents: res.data.contents || "",
            features: res.data.features || [],
            stats: res.data.stats || [],
            ctaText: res.data.ctaText || "",
            ctaSubText: res.data.ctaSubText || "",
          });
        }
      } catch (err) {
        console.log("Error loading homepage");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔤 Basic input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Feature handlers
  const addFeature = () => {
    setForm({
      ...form,
      features: [...form.features, { icon: "", title: "", desc: "" }],
    });
  };

  const updateFeature = (index, field, value) => {
    const updated = [...form.features];
    updated[index][field] = value;
    setForm({ ...form, features: updated });
  };

  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  // 🔥 Stats handlers
  const addStat = () => {
    setForm({
      ...form,
      stats: [...form.stats, { label: "", value: "" }],
    });
  };

  const updateStat = (index, field, value) => {
    const updated = [...form.stats];
    updated[index][field] = value;
    setForm({ ...form, stats: updated });
  };

  const removeStat = (index) => {
    const updated = form.stats.filter((_, i) => i !== index);
    setForm({ ...form, stats: updated });
  };

  // 📤 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await upsertHomePage(form);
      setMessage("✅ Updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <MainLayout><p className="p-6">Loading...</p></MainLayout>;
  }

  return (
  <MainLayout>
  <div className="max-w-6xl mx-auto p-6 space-y-6">

    {/* 🔥 HEADER */}
    <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg">
      <h1 className="text-2xl font-semibold">Homepage Editor</h1>
      <p className="text-blue-100 text-sm mt-1">
        Customize your public landing page dynamically
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 🔥 HERO */}
      <section className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-blue-600">
          🚀 Hero Section
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter title..."
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Enter description..."
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="contents"
          value={form.contents}
          onChange={handleChange}
          rows={3}
          placeholder="Extra content..."
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </section>

      {/* 🔥 FEATURES */}
      <section className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-purple-600">
            ✨ Features
          </h2>

          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            + Add
          </button>
        </div>

        {form.features.map((f, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm space-y-2">

            <div className="flex justify-between text-xs text-gray-500">
              <span>Feature {i + 1}</span>
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>

            <input
              placeholder="Icon"
              value={f.icon}
              onChange={(e) => updateFeature(i, "icon", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Title"
              value={f.title}
              onChange={(e) => updateFeature(i, "title", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Description"
              value={f.desc}
              onChange={(e) => updateFeature(i, "desc", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        ))}
      </section>

      {/* 🔥 STATS */}
      <section className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-green-600">
            📊 Stats
          </h2>

          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            + Add
          </button>
        </div>

        {form.stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-green-100 shadow-sm space-y-2">

            <div className="flex justify-between text-xs text-gray-500">
              <span>Stat {i + 1}</span>
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>

            <input
              placeholder="Label"
              value={s.label}
              onChange={(e) => updateStat(i, "label", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Value"
              value={s.value}
              onChange={(e) => updateStat(i, "value", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        ))}
      </section>

      {/* 🔥 CTA */}
      <section className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-orange-600">
          🎯 Call To Action
        </h2>

        <input
          name="ctaText"
          value={form.ctaText}
          onChange={handleChange}
          placeholder="Primary Button Text"
          className="w-full px-4 py-3 border rounded-xl"
        />

        <input
          name="ctaSubText"
          value={form.ctaSubText}
          onChange={handleChange}
          placeholder="Secondary Button Text"
          className="w-full px-4 py-3 border rounded-xl"
        />
      </section>

      {/* 🔥 SAVE */}
      <div className="flex items-center gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition">
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="text-sm text-slate-600">{message}</p>
        )}
      </div>

    </form>
  </div>
</MainLayout>
  );
}

export default AdminHomeEditor;