/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { 
  Save, Plus, Trash2, Layout, Sparkles, 
  BarChart3, MousePointer2, Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Feature Handlers
  const addFeature = () => setForm({ ...form, features: [...form.features, { icon: "🚀", title: "", desc: "" }] });
  const updateFeature = (index, field, value) => {
    const updated = [...form.features];
    updated[index][field] = value;
    setForm({ ...form, features: updated });
  };
  const removeFeature = (index) => setForm({ ...form, features: form.features.filter((_, i) => i !== index) });

  // Stats Handlers
  const addStat = () => setForm({ ...form, stats: [...form.stats, { label: "", value: "" }] });
  const updateStat = (index, field, value) => {
    const updated = [...form.stats];
    updated[index][field] = value;
    setForm({ ...form, stats: updated });
  };
  const removeStat = (index) => setForm({ ...form, stats: form.stats.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await upsertHomePage(form);
      setMessage("✅ Homepage configuration updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Editor...</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700 pb-20">
        
        {/* --- HEADER --- */}
        <div className="relative overflow-hidden bg-[#0f172a] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <Layout className="text-indigo-400" size={28} />
                Homepage Editor
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dynamically customize your public landing page</p>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Publishing..." : "Save Changes"}
            </button>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2 border ${
            message.includes('✅') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            {message.includes('✅') ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: MAIN CONFIG --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO SECTION */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <Sparkles size={14} /> Hero Content
              </h3>
              <div className="space-y-4">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Main Hero Title"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Hero Sub-description"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium italic outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                />
              </div>
            </div>

            {/* FEATURES DYNAMIC LIST */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Layout size={14} /> Features Matrix
                </h3>
                <button onClick={addFeature} className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all">
                  <Plus size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.features.map((f, i) => (
                  <div key={i} className="group relative bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-purple-200 transition-all">
                    <button 
                      onClick={() => removeFeature(i)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input 
                          placeholder="Icon (Emoji)" 
                          value={f.icon} 
                          onChange={(e) => updateFeature(i, "icon", e.target.value)}
                          className="w-16 bg-white border border-slate-200 rounded-xl px-2 py-2 text-center text-xl outline-none"
                        />
                        <input 
                          placeholder="Feature Title" 
                          value={f.title} 
                          onChange={(e) => updateFeature(i, "title", e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black uppercase outline-none"
                        />
                      </div>
                      <textarea 
                        placeholder="Feature description..." 
                        value={f.desc} 
                        onChange={(e) => updateFeature(i, "desc", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-medium leading-relaxed resize-none outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT: STATS & CTA --- */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* STATS SECTION */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <BarChart3 size={14} /> Live Stats
                </h3>
                <button onClick={addStat} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {form.stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                    <input 
                      placeholder="Label" 
                      value={s.label} 
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                    />
                    <input 
                      placeholder="Value" 
                      value={s.value} 
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                      className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black text-emerald-600 text-center outline-none"
                    />
                    <button onClick={() => removeStat(i)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA CONFIG */}
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                <MousePointer2 size={14} /> Call to Action
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Primary Button</label>
                  <input name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="Login" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Secondary Button</label>
                  <input name="ctaSubText" value={form.ctaSubText} onChange={handleChange} placeholder="Register" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminHomeEditor;