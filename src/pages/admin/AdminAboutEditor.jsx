/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAboutContent, updateAboutContent } from "../../api/about.api";
import { Save, Plus, Trash2 } from "lucide-react";

const AdminAboutEditor = () => {
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    features: []
  });

  useEffect(() => {
    getAboutContent().then(data => {
      if (data) setFormData(data);
    }).catch(err => console.log("No existing data found"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, e) => {
    const newFeatures = [...formData.features];
    newFeatures[index][e.target.name] = e.target.value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: "", desc: "", iconName: "ShieldCheck" }]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAboutContent(formData);
      alert("About Page Updated Successfully!");
    } catch (err) {
      alert("Error updating page");
    }
  };

  return (
    <MainLayout>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
          <Save className="text-indigo-600" /> Edit About Page Content
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Hero Title</label>
              <input name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Bridging the gap between" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Hero Subtitle</label>
              <input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Citizens & Government" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
            <textarea name="heroDescription" value={formData.heroDescription} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl h-24" placeholder="Brief mission description..." />
          </div>

          <hr />

          {/* Features Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Features List</h3>
              <button type="button" onClick={addFeature} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <Plus size={16} /> Add Feature
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-4 border rounded-2xl flex gap-4 items-start bg-slate-50/50">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="title" placeholder="Title" value={feature.title} onChange={(e) => handleFeatureChange(index, e)} className="p-2 border rounded-lg text-sm" />
                    <input name="iconName" placeholder="Icon Name (e.g. Globe)" value={feature.iconName} onChange={(e) => handleFeatureChange(index, e)} className="p-2 border rounded-lg text-sm" />
                    <input name="desc" placeholder="Description" value={feature.desc} onChange={(e) => handleFeatureChange(index, e)} className="p-2 border rounded-lg text-sm col-span-1 md:col-span-3" />
                  </div>
                  <button type="button" onClick={() => removeFeature(index)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all">
            Save Changes
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default AdminAboutEditor;