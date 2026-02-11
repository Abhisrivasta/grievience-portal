import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white flex flex-col">

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
  
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mt-4">
          Digital Grievance Portal
        </h1>

        <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-300">
          A secure and transparent platform for citizens to raise grievances,
          track resolution progress, and communicate with authorities in
          real-time.
        </p>

        {/* ACTION CARD */}
        <div className="mt-12 bg-white text-gray-900 rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Get Started
          </h2>

          <div className="flex flex-col gap-4">
            <Link
              to="/login"
              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="w-full text-center border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-black/20 backdrop-blur py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why use this portal?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📝",
                title: "Easy Complaint Filing",
                desc: "Submit grievances quickly with structured forms.",
              },
              {
                icon: "📊",
                title: "Real-time Tracking",
                desc: "Track complaint status from submission to resolution.",
              },
              {
                icon: "👮",
                title: "Officer Assignment",
                desc: "Complaints are assigned to responsible officers.",
              },
              {
                icon: "🔔",
                title: "Smart Notifications",
                desc: "Get alerts on every action and status update.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/20 transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-400 py-6">
        © {new Date().getFullYear()} Digital Grievance Redressal System. All rights reserved.
      </footer>
    </div>
  );
}
