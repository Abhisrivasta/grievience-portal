import { ShieldCheck, Users, Globe, Target, CheckCircle } from "lucide-react";
import MainLayout from "./layout/MainLayout";

function AboutUs() {
  const features = [
    { title: "Transparency", desc: "Every action taken on a grievance is logged and visible to the citizen.", icon: Globe },
    { title: "Accountability", desc: "Time-bound resolution tracking for every assigned officer.", icon: Target },
    { title: "Efficiency", desc: "Smart categorization to route complaints to the right department.", icon: ShieldCheck },
  ];

  return (
    <MainLayout isPublic={true}>
      <div className="max-w-7xl mx-auto p-4 md:p-12 space-y-16 animate-in fade-in duration-700">
        
        {/* HERO */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full border border-indigo-100">
            <Users size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Bridging the gap between <br />
            <span className="text-indigo-600 font-black">Citizens & Government.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
            The Smart Grievance Redressal Portal is a digital initiative to ensure that every citizen's 
            voice is heard and every public issue is resolved with absolute transparency.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-6">
                <f.icon size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* COMMITMENT SECTION */}
        <div className="bg-[#0f172a] rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tight">Fast. Reliable. <br/>Digitally Secure.</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Our platform uses advanced encryption and tracking mechanisms to ensure that 
                        no grievance goes unnoticed. We believe in a digital democracy where public 
                        service is just a click away.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {["End-to-End Tracking", "Official Auditing", "Citizen Feedback"].map((tag, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                <CheckCircle size={12} className="text-indigo-400" /> {tag}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden lg:block bg-indigo-500/20 aspect-square rounded-[3rem] border border-white/5 flex items-center justify-center">
                     <ShieldCheck size={180} className="text-indigo-400/20" />
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default AboutUs;