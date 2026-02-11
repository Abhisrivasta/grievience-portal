import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { createComplaint } from "../../api/complaint.api";

function CreateComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    area: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.category || !form.area) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await createComplaint({
        title: form.title,
        description: form.description,
        category: form.category,
        location: { area: form.area },
      });

      navigate("/citizen/complaints");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Page Background */}
      <div className="min-h-full px-6 py-8  bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

        {/* Centered Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Submit New Complaint
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Please provide accurate details so your grievance can be resolved efficiently.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Centered Form */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white border border-slate-200
              rounded-lg p-6 space-y-4"
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
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                rows={4}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-md text-sm font-medium text-white
                  bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CreateComplaint;
