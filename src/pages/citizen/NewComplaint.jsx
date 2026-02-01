import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import { createComplaint } from "../../services/complaintService";

export default function NewComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Road",
    priority: "Medium",
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
    setLoading(true);

    try {
      await createComplaint({
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        location: {
          area: form.area,
        },
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
    <PageWrapper>
      <h2 className="text-xl font-bold mb-4">
        New Complaint
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4 max-w-xl"
      >
        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="block mb-1">
            Title
          </label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">
            Description
          </label>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option>Road</option>
            <option>Water</option>
            <option>Electricity</option>
            <option>Sanitation</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Area / Location
          </label>
          <input
            name="area"
            required
            value={form.area}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            placeholder="Near Govt School, Sector 5"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading
            ? "Submitting..."
            : "Submit Complaint"}
        </button>
      </form>
    </PageWrapper>
  );
}
