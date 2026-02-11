import { useState } from "react";
import { submitFeedback } from "../../api/feedback.api";

function FeedbackForm({ complaintId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0); // For star hover effect
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
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-w-lg">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">Share Your Experience</h3>
        <p className="text-xs text-slate-500 italic">Your feedback helps us improve our services.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-100 flex items-center gap-2">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        {/* Star Rating Section */}
        <div className="text-center py-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            How would you rate the resolution?
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90 outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 transition-colors ${
                    star <= (hover || rating) ? "text-yellow-400 fill-current" : "text-slate-200 fill-none"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-400 mt-3 capitalize">
            {rating === 5 ? "Excellent!" : rating === 1 ? "Poor" : "Good"}
          </p>
        </div>

        {/* Comment Section */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Additional Comments <span className="text-slate-300 normal-case">(Optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Tell us what we did well or how we can improve..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;