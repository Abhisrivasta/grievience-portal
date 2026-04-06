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
      <div className="max-w-5xl mx-auto p-6 space-y-8">

        <h1 className="text-2xl font-bold">Homepage CMS</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC */}
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border" />
          <textarea name="contents" value={form.contents} onChange={handleChange} placeholder="Content" className="w-full p-2 border" />

          {/* 🔥 FEATURES */}
          <div>
            <h2 className="font-semibold mb-2">Features</h2>
            {form.features.map((f, i) => (
              <div key={i} className="border p-3 mb-2 rounded space-y-2">
                <input placeholder="Icon" value={f.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)} className="w-full p-2 border" />
                <input placeholder="Title" value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)} className="w-full p-2 border" />
                <input placeholder="Description" value={f.desc} onChange={(e) => updateFeature(i, "desc", e.target.value)} className="w-full p-2 border" />
                <button type="button" onClick={() => removeFeature(i)} className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addFeature} className="text-blue-600">+ Add Feature</button>
          </div>

          {/* 🔥 STATS */}
          <div>
            <h2 className="font-semibold mb-2">Stats</h2>
            {form.stats.map((s, i) => (
              <div key={i} className="border p-3 mb-2 rounded space-y-2">
                <input placeholder="Label" value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} className="w-full p-2 border" />
                <input placeholder="Value" value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} className="w-full p-2 border" />
                <button type="button" onClick={() => removeStat(i)} className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addStat} className="text-blue-600">+ Add Stat</button>
          </div>

          {/* CTA */}
          <input name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="CTA Text" className="w-full p-2 border" />
          <input name="ctaSubText" value={form.ctaSubText} onChange={handleChange} placeholder="CTA SubText" className="w-full p-2 border" />

          {/* SUBMIT */}
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            {saving ? "Saving..." : "Save"}
          </button>

          {message && <p>{message}</p>}

        </form>
      </div>
    </MainLayout>
  );
}

export default AdminHomeEditor;