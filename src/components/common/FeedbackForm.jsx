import { useState } from "react";
import { submitFeedback } from "../../api/feedback.api";

function FeedbackForm({ complaintId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitFeedback({
        complaintId,
        rating,
        comment,
      });

      onSubmitted();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Submit Feedback</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating</label><br />
          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Comment (optional)</label><br />
          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows={3}
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
