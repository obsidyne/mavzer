"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm]       = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  function handleChange(e) { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true); setSending(false);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="fixed inset-0 z-[-1]" style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 z-[-1] bg-white/70" />

      <div className="pt-[66px] border-b border-[#dde4ef]">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            <span className="block w-5 h-px bg-[#1e88e5]" />{t.contact_label}
          </div>
          <h1 className="font-condensed text-[36px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">{t.contact_title}</h1>
          <p className="text-[13px] text-[#9aa3af] mt-1">{t.contact_subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-14" id="form">
        <div className="bg-white border border-[#dde4ef] rounded-xl shadow-[0_2px_24px_rgba(7,30,61,0.06)] p-10 mb-16">
          <h2 className="font-condensed text-[22px] font-extrabold uppercase text-[#071e3d] mb-1">{t.form_title}</h2>
          <p className="text-[13px] text-[#9aa3af] mb-8">{t.form_subtitle}</p>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#eef6ff] border border-[#bdd9f5] flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0a4c8a" strokeWidth="2" width="24" height="24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-condensed text-[20px] font-extrabold uppercase text-[#071e3d] mb-2">{t.form_success_title}</h3>
              <p className="text-[13px] text-[#9aa3af]">{t.form_success_sub}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder={t.form_name} required
                className="w-full border border-[#dde4ef] rounded px-4 py-3 text-[13px] text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t.form_email} required
                  className="w-full border border-[#dde4ef] rounded px-4 py-3 text-[13px] text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder={t.form_phone}
                  className="w-full border border-[#dde4ef] rounded px-4 py-3 text-[13px] text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all" />
              </div>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder={t.form_message} rows={5} required
                className="w-full border border-[#dde4ef] rounded px-4 py-3 text-[13px] text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all resize-none" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <div className="flex justify-center mt-2">
                <button type="submit" disabled={sending}
                  className="bg-[#0a4c8a] text-white font-bold tracking-[0.15em] uppercase text-[12px] px-12 py-3 rounded hover:bg-[#071e3d] transition-colors disabled:opacity-60">
                  {sending ? t.form_sending : t.form_send}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact details + map — static, no translation needed for data */}
        <div className="grid grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="font-condensed text-[20px] font-extrabold uppercase text-[#071e3d] mb-6">
              {t.contact_label}
            </h2>
            <div className="flex flex-col gap-5">
              {[
                { label: "Adres", lines: ["Çamlıca, 137. Sk. No: 2", "06200 Yenimahalle/Ankara"] },
                { label: "E-posta", lines: ["mavzer@mavzerambalaj.com.tr"] },
                { label: "Telefon", lines: ["0312 397 3935", "0533 681 9127"] },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-lg bg-[#eef6ff] border border-[#bdd9f5] flex items-center justify-center text-[#0a4c8a] shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><circle cx="12" cy="12" r="10"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af] mb-1">{item.label}</p>
                    {item.lines.map((line, i) => <p key={i} className="text-[13px] text-[#071e3d] leading-relaxed">{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-[#dde4ef] shadow-[0_2px_16px_rgba(7,30,61,0.06)]" style={{ height: 380 }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.123456789!2d32.8264!3d39.9752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU4JzMwLjciTiAzMsKwNDknMzUuMSJF!5e0!3m2!1str!2str!4v1234567890"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mavzer Ambalaj Konum" />
          </div>
        </div>
      </div>
    </div>
  );
}