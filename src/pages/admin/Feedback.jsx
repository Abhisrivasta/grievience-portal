import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getAllFeedback } from "../../api/feedback.api";

function AdminFeedback() {

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    try {

      const data = await getAllFeedback();
      setFeedbacks(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  return (
    <MainLayout>

      <div className="px-6 py-8 bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200 min-h-screen">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Citizen Feedback
          </h2>
          <p className="text-sm text-slate-500">
            Review feedback submitted by citizens after complaint resolution.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading feedback...
          </div>
        ) : (

          <div className="grid gap-6">

            {feedbacks.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-slate-500">
                No feedback submitted yet.
              </div>
            ) : (

              feedbacks.map((f) => (

                <div
                  key={f._id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >

                  <div className="flex justify-between items-center mb-3">

                    <div>

                      <h4 className="font-bold text-lg text-slate-900">
                        {f.complaint?.title}
                      </h4>

                      <p className="text-xs text-slate-500 uppercase">
                        {f.complaint?.category}
                      </p>

                    </div>

                    <div className="text-sm font-semibold text-blue-600">
                      ⭐ {f.rating} / 5
                    </div>

                  </div>

                  <p className="text-sm text-slate-700 mb-3">
                    {f.comment || "No comment provided"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Citizen: {f.citizen?.name} ({f.citizen?.email})
                  </p>

                </div>

              ))

            )}

          </div>

        )}

      </div>

    </MainLayout>
  );
}

export default AdminFeedback;