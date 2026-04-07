import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import MainLayout from "./layout/MainLayout";


function ContactUs() {
  return (
    <MainLayout isPublic={true}>
      <div className="max-w-7xl mx-auto p-4 md:p-12 space-y-12 animate-in fade-in duration-700">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT: INFO --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Get in <span className="text-indigo-600">Touch.</span>
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Have a technical issue or need help with a grievance? Our support team is available to assist you.
              </p>
            </div>

            <div className="space-y-4">
               {[
                 { icon: Mail, label: "Official Email", value: "support@grievance.gov.in" },
                 { icon: Phone, label: "Toll Free Number", value: "1800-123-4567" },
                 { icon: MapPin, label: "Headquarters", value: "District Cell, Secretariat Building, Patna, Bihar" },
                 { icon: Clock, label: "Working Hours", value: "Mon - Sat: 10:00 AM - 05:00 PM" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <item.icon size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-black text-slate-800">{item.value}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* --- RIGHT: FORM --- */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-200 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-indigo-600" size={24} />
                <h3 className="text-xl font-black text-slate-800">Send us a Message</h3>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Your Name</label>
                    <input type="text" placeholder="Ex: Rahul Kumar" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                    <input type="email" placeholder="rahul@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Subject</label>
                    <input type="text" placeholder="Technical issue / Query" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">How can we help?</label>
                  <textarea rows={4} placeholder="Describe your concern in detail..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-xl active:scale-[0.98]">
                   Send Message <Send size={16} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
    
  );
}

export default ContactUs;