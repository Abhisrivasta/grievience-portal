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
  <div className="max-w-5xl mx-auto p-6">

    {/* HEADER */}
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-slate-800">
        Homepage Editor
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Update content visible on the public homepage
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* HERO */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-600">
          Hero Section
        </h2>

        <div className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="contents"
            value={form.contents}
            onChange={handleChange}
            placeholder="Enter additional content..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-slate-600">
            Features
          </h2>

          <button
            type="button"
            onClick={addFeature}
            className="text-blue-600 text-sm font-medium"
          >
            + Add
          </button>
        </div>

        {form.features.map((f, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3">

            <div className="flex justify-between text-xs text-slate-500">
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
              placeholder="Icon (emoji)"
              value={f.icon}
              onChange={(e) => updateFeature(i, "icon", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              placeholder="Title"
              value={f.title}
              onChange={(e) => updateFeature(i, "title", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              placeholder="Description"
              value={f.desc}
              onChange={(e) => updateFeature(i, "desc", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}
      </section>

      {/* STATS */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-slate-600">
            Stats
          </h2>

          <button
            type="button"
            onClick={addStat}
            className="text-blue-600 text-sm font-medium"
          >
            + Add
          </button>
        </div>

        {form.stats.map((s, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3">

            <div className="flex justify-between text-xs text-slate-500">
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
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              placeholder="Value"
              value={s.value}
              onChange={(e) => updateStat(i, "value", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-600">
          Call To Action
        </h2>

        <input
          name="ctaText"
          value={form.ctaText}
          onChange={handleChange}
          placeholder="Primary Button Text"
          className="w-full px-4 py-3 border rounded-lg"
        />

        <input
          name="ctaSubText"
          value={form.ctaSubText}
          onChange={handleChange}
          placeholder="Secondary Button Text"
          className="w-full px-4 py-3 border rounded-lg"
        />
      </section>

      {/* SAVE */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>

    </form>
  </div>
</MainLayout>
  );
}

export default AdminHomeEditor;