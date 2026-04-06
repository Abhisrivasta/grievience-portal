import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHomePage } from "../api/home.api";

export default function Home() {
  const [data, setData] = useState({
    title: "",
    description: "",
    contents: "",
    features: [],
    stats: [],
    ctaText: "",
    ctaSubText: "",
  });

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await getHomePage();
        if (res?.data) {
          setData(res.data);
          setCounts(res.data.stats?.map(() => 0) || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  // 🔥 COUNT-UP ANIMATION
  useEffect(() => {
    if (!data.stats?.length) return;

    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((c, i) => {
          const target = parseInt(data.stats[i].value) || 0;
          if (c < target) return c + Math.ceil(target / 30);
          return target;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [data.stats]);

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-black">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/30 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-500/30 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* 🔥 HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-28">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          {data.title || "Digital Grievance Portal"}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          {data.description}
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 rounded-xl hover:scale-105 transition"
          >
            {data.ctaText || "Login"}
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 border border-white rounded-xl hover:bg-white hover:text-black transition"
          >
            {data.ctaSubText || "Register"}
          </Link>
        </div>
      </section>

      {/* 🔥 FEATURES */}
      {data.features?.length > 0 && (
        <section className="relative z-10 py-20 px-6">
          <h2 className="text-3xl text-center font-bold mb-12">
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {data.features.map((f, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center hover:scale-105 transition"
              >
                <div className="text-5xl">{f.icon}</div>
                <h3 className="text-xl mt-3">{f.title}</h3>
                <p className="text-gray-400 mt-2 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔥 STATS */}
      {data.stats?.length > 0 && (
        <section className="relative z-10 py-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {data.stats.map((s, i) => (
              <div key={i}>
                <h3 className="text-4xl font-bold text-blue-400">
                  {counts[i] || 0}+
                </h3>
                <p className="text-gray-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔥 FOOTER */}
      <footer className="text-center py-6 text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Digital Grievance System
      </footer>
    </div>
  );
}