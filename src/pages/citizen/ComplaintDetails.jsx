import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper";
import { getComplaintDetails } from "../../services/complaintService";
import ComplaintTimeline from "../../components/timeline/ComplaintTimeline";
import { submitFeedback } from "../../services/complaintService";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getComplaintDetails(id)
      .then((res) => {
        setComplaint(res.data);
      })
      .catch(() => {
        alert("Failed to load complaint details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading...</p>
      </PageWrapper>
    );
  }

  if (!complaint) {
    return (
      <PageWrapper>
        <p>Complaint not found.</p>
      </PageWrapper>
    );
  }

    const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitFeedback({
        complaintId: id,
        rating,
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to submit feedback"
      );
    }
  };


  return (
    <PageWrapper>
      <h2 className="text-xl font-bold mb-4">Complaint Details</h2>


          {complaint.status === "Resolved" && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">
            Submit Feedback
          </h3>

          {submitted ? (
            <p className="text-green-600">
              Feedback submitted successfully 🙏
            </p>
          ) : (
            <form
              onSubmit={handleFeedbackSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">
                  Rating
                </label>
                <select
                  required
                  value={rating}
                  onChange={(e) =>
                    setRating(e.target.value)
                  }
                  className="border px-3 py-2 rounded w-32"
                >
                  <option value="">
                    Select
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      )}

      
      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>Title:</strong> {complaint.title}
        </p>
        <p>
          <strong>Category:</strong> {complaint.category}
        </p>
        <p>
          <strong>Priority:</strong> {complaint.priority}
        </p>
        <p>
          <strong>Status:</strong> {complaint.status}
        </p>
        <p>
          <strong>Description:</strong> {complaint.description}
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Complaint Timeline</h3>
        <ComplaintTimeline timeline={complaint.timeline} />
      </div>

      {/* Feedback placeholder */}
      {complaint.status === "Resolved" && (
        <div className="mt-6 p-4 bg-green-50 border rounded">
          <p className="font-semibold">Complaint resolved 🎉</p>
          <p className="text-sm text-gray-600">
            Feedback form will appear here.
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
