'use client';
import { useState } from 'react';
import Link from 'next/link';

const INFO = [
  {
    label: 'Phone',
    value: '0312 397 3935',
    href: 'tel:+903123973935',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: '0533 681 9127',
    href: 'https://api.whatsapp.com/send?phone=905336819127',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'mavzer@mavzerambalaj.com.tr',
    href: 'mailto:mavzer@mavzerambalaj.com.tr',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const SECTORS = ['Restaurant', 'Cafe', 'Hotel', 'Government', 'Medical', 'Industrial', 'Other'];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', company: '', sector: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to your backend / email service here
    setSent(true);
  };

  return (
    <section className="bg-[#071e3d] relative overflow-hidden">
      {/* Subtle diagonal accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#1e88e5]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#1e88e5]/20 to-transparent" style={{ left: '42%' }} />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] min-h-[520px]">

        {/* ── LEFT: info panel ── */}
        <div className="flex flex-col justify-between px-12 py-16 ">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#5bb8ff] mb-5">Get in touch</p>
            <h2 className="font-condensed text-[42px] font-extrabold uppercase text-white leading-[1.05] mb-4">
              Ready to Work{' '}
              <span className="text-[#5bb8ff]">Together?</span>
            </h2>
            <p className="text-sm text-white/45 font-light leading-relaxed max-w-xs">
              Reach out for packaging solutions tailored precisely to your sector and scale.
            </p>
          </div>

          <div className="flex flex-col gap-7 mt-12">
            {INFO.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-md bg-[#1e88e5]/15 --border border-[#1e88e5]/25 flex items-center justify-center text-[#5bb8ff] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/30 mb-0.5">
                    {item.label}
                  </div>
                  {/* FIX 1: was missing the opening <a tag */}
                  <a
                    href={item.href}
                    target={item.href.startsWith('https') ? '_blank' : undefined}
                    rel={item.href.startsWith('https') ? 'noreferrer' : undefined}
                    className="text-[14px] font-semibold text-white/85 no-underline transition-colors duration-200 hover:text-[#5bb8ff]"
                  >
                    {item.value}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 --border-t --border-white/[0.07]">
            <p className="text-[10px] tracking-widest uppercase text-white/20 mb-3">Or message us directly</p>
            {/* FIX 2: was missing the opening <a tag */}
            <a
              href="https://api.whatsapp.com/send?phone=905336819127"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1e88e5] text-white px-5 py-2.5 rounded text-xs font-bold tracking-widest uppercase no-underline transition-all duration-200 hover:bg-[#1565c0] hover:-translate-y-0.5"
            >
              {INFO[1].icon} WhatsApp
            </a>
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="flex items-center px-12 py-16">
          {sent ? (
            <div className="w-full text-center py-16">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1e88e5]/15 --border border-[#1e88e5]/30 mb-6">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#5bb8ff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-condensed text-2xl font-extrabold uppercase text-white mb-2">Message Sent!</h3>
              <p className="text-sm text-white/45">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
                <Field label="Company" name="company" value={form.company} onChange={handleChange} placeholder="Acme Ltd." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/35">Sector</label>
                  <select
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    className="bg-white/[0.05] --border border-white/[0.1] rounded px-3 py-2.5 text-sm text-white/80 outline-none focus:border-[#1e88e5]/60 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" disabled>Select sector…</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+90 5xx xxx xx xx" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/35">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Tell us about your packaging needs…"
                  className="bg-white/[0.05] --border border-white/[0.1] rounded px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-[#1e88e5]/60 focus:bg-white/[0.08] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="self-start inline-flex items-center gap-2 bg-[#1e88e5] text-white px-8 py-3 rounded text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:bg-[#1565c0] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,136,229,0.35)]"
              >
                Send Message
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Reusable input field
function Field({ label, name, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/35">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-white/[0.05] border border-white/[0.1] rounded px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-[#1e88e5]/60 focus:bg-white/[0.08] transition-all"
      />
    </div>
  );
}