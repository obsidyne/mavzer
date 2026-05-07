"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ReferencesPage() {
  const { t } = useLanguage();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/public/clients`)
      .then((r) => r.json())
      .then((d) => setClients(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: "url(/background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="fixed inset-0 z-[-1] bg-white/70" />
      <Navbar />

      {/* Page header */}
      <div className="pt-[66px] border-b border-[#dde4ef]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            {t.clients_label}
          </div>
          <h1 className="font-condensed text-[26px] sm:text-[36px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            {t.clients_title}
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#9aa3af] mt-1">{t.clients_subtitle}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/2] bg-white rounded-xl border border-[#dde4ef] animate-pulse"
              />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-24 text-[#9aa3af] text-sm">
            {t.clients_empty}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {clients.map((client) => (
              <div
                key={client.id}
                className="aspect-[3/2] bg-white rounded-xl border border-[#dde4ef]
                           flex items-center justify-center p-4 sm:p-6
                           hover:shadow-[0_4px_24px_rgba(7,30,61,0.08)]
                           hover:border-[#0a4c8a]/20
                           active:scale-[0.97]
                           transition-all duration-200"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}