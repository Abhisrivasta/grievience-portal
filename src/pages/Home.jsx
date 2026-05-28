import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHomePage } from "../api/home.api";
import MainLayout from "../components/layout/MainLayout";

const parseStatValue = (value) => {
  const raw = String(value || "0");
  const number = Number(raw.replace(/[^0-9]/g, "")) || 0;
  const suffix = raw.replace(/[0-9,\s]/g, "") || "+";

  return { number, suffix };
};

const formatStatSuffix = (suffix) => {
  if (!suffix || suffix === "+") return "+";
  return ` ${suffix}`;
};

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

  const normalizedStats = useMemo(() => {
    return (
      data.stats?.map((stat) => {
        const parsed = parseStatValue(stat.value);

        return {
          ...stat,
          target: parsed.number,
          suffix: parsed.suffix,
        };
      }) || []
    );
  }, [data.stats]);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await getHomePage();

        if (res?.data) {
          setData(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  useEffect(() => {
    if (!normalizedStats.length) {
      setCounts([]);
      return;
    }

    setCounts(normalizedStats.map(() => 0));

    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((count, index) => {
          const target = normalizedStats[index]?.target || 0;
          const step = Math.max(1, Math.ceil(target / 40));

          return Math.min(count + step, target);
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, [normalizedStats]);

  return (
    <MainLayout isPublic={true}>
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <style>
          {`
            @keyframes float {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-18px) rotate(4deg);
              }
            }

            @keyframes fadeUp {
              from {
                opacity: 0;
                transform: translateY(28px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes pulseGlow {
              0%, 100% {
                opacity: 0.45;
                transform: scale(1);
              }
              50% {
                opacity: 0.85;
                transform: scale(1.08);
              }
            }

            @keyframes borderMove {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }

            .animate-float {
              animation: float 5s ease-in-out infinite;
            }

            .animate-fade-up {
              animation: fadeUp 0.8s ease-out both;
            }

            .animate-pulse-glow {
              animation: pulseGlow 6s ease-in-out infinite;
            }

            .animated-border {
              background-size: 300% 300%;
              animation: borderMove 5s ease infinite;
            }
          `}
        </style>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.24),transparent_36%)]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute -left-20 top-32 h-32 w-32 rounded-full border border-white/10 bg-white/5 animate-float" />
          <div className="absolute right-10 top-44 h-20 w-20 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 rotate-12 animate-float" />
          <div className="absolute bottom-28 left-16 h-24 w-24 rounded-2xl border border-purple-300/20 bg-purple-400/10 -rotate-12 animate-float" />
        </div>

        {loading ? (
          <div className="relative z-10 flex min-h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
          </div>
        ) : (
          <>
            <section className="relative z-10 mx-auto flex min-h-[75vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
              <div className="animate-fade-up">
                <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-cyan-100 backdrop-blur-xl">
                  Smart, fast and transparent grievance management
                </span>

                <h1 className="mx-auto mt-8 max-w-5xl bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-7xl">
                  {data.title || "Digital Grievance Portal"}
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  {data.description ||
                    "Submit, track and resolve complaints through a simple digital platform built for speed, visibility and trust."}
                </p>

                <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                  <Link
                    to="/login"
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/40"
                  >
                    {data.ctaText || "Login"}
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl border border-white/15 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-950"
                  >
                    {data.ctaSubText || "Register"}
                  </Link>
                </div>
              </div>
            </section>

            {data.features?.length > 0 && (
              <section className="relative z-10 px-6 py-20">
                <div className="mx-auto max-w-7xl">
                  <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold md:text-4xl">
                      Powerful Features
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-slate-400">
                      Everything needed to manage complaints with clarity and
                      speed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {data.features.map((feature, index) => (
                      <div
                        key={feature.id || feature._id || index}
                        className="group animate-fade-up rounded-2xl border border-white/10 bg-white/[0.07] p-6 text-center shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/40 hover:bg-white/[0.12]"
                        style={{ animationDelay: `${index * 120}ms` }}
                      >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-4xl ring-1 ring-white/10 transition duration-300 group-hover:scale-110">
                          {feature.icon}
                        </div>

                        <h3 className="mt-5 text-xl font-semibold">
                          {feature.title}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {normalizedStats.length > 0 && (
              <section className="relative z-10 px-6 py-20">
                <div className="mx-auto max-w-6xl">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                      Our Impact
                    </h2>

                    <p className="mt-3 text-sm text-slate-400 md:text-base">
                      Numbers that show trust, speed and transparency.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {normalizedStats.map((stat, index) => (
                      <div
                        key={stat.id || stat._id || index}
                        className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] p-7 text-center shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/40 hover:bg-white/[0.12]"
                        style={{ animationDelay: `${index * 120}ms` }}
                      >
                        <div className="animated-border absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400" />

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 ring-1 ring-white/10 transition duration-300 group-hover:scale-110">
                          <span className="text-2xl font-bold text-cyan-300">
                            {index + 1}
                          </span>
                        </div>

                        <h3 className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
                          {(counts[index] || 0).toLocaleString("en-IN")}
                          {formatStatSuffix(stat.suffix)}
                        </h3>

                        <p className="mt-3 text-sm font-medium leading-6 text-slate-300 md:text-base">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}