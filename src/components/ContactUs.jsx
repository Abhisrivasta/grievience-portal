import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import MainLayout from "./layout/MainLayout";
import { useState } from "react";
import { createInquiry } from "../api/inquiry.api";

function ContactUs() {

  // 🔥 STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createInquiry(formData);

      alert("✅ Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
                { icon: Mail, label: "Official Email", value: "admin@gmail.com" },
                { icon: Phone, label: "Toll Free Number", value: "1800-123-4567" },
                { icon: MapPin, label: "Headquarters", value: "District Cell, Patna, Bihar" },
                { icon: Clock, label: "Working Hours", value: "Mon - Sat: 10 AM - 5 PM" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all">
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
            <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-200 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-indigo-600" size={24} />
                <h3 className="text-xl font-black text-slate-800">Send us a Message</h3>
              </div>

              {/* 🔥 FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* NAME */}
                  <div>
                    <label className="text-xs font-bold text-slate-500">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full mt-2 bg-slate-50 border rounded-xl px-4 py-3"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-xs font-bold text-slate-500">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full mt-2 bg-slate-50 border rounded-xl px-4 py-3"
                    />
                  </div>

                </div>

                {/* SUBJECT */}
                <div>
                  <label className="text-xs font-bold text-slate-500">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 bg-slate-50 border rounded-xl px-4 py-3"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-xs font-bold text-slate-500">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full mt-2 bg-slate-50 border rounded-xl px-4 py-3"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition"
                >
                  {loading ? "Sending..." : "Send Message"}
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