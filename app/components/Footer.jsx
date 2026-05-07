'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0d1117] pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Video — centered, lifted up on md+ */}
        <div className="flex flex-col items-center mb-10 md:-mt-[200px]">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <video controls loop autoPlay muted className="w-full h-full block">
                  <source src="mavzer.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5 mt-5">
            <a href="https://x.com/mavzerambalaj" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.facebook.com/mavzerambalaj" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="https://www.instagram.com/mavzerambalaj" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
          </div>
        </div>

        {/* Three columns — stack on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center md:text-left">

          {/* LEFT — brand */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white text-[15px] font-extrabold uppercase tracking-widest mb-3">
              Mavzer Ambalaj
            </h3>
            <p className="text-white/40 text-[12px] leading-relaxed max-w-[220px]">
              Mavzer Pazarlama Matbaacılık Reklam Ambalaj Gıda Kimya Sanayi ve Ticaret Ltd. Şti.
            </p>
          </div>

          {/* CENTER — copyright (hidden on mobile, shown between cols on md) */}
          <div className="flex flex-col items-center justify-end order-last md:order-none">
            <p className="text-white/25 text-[11px]">
              © {new Date().getFullYear()} Mavzer Ambalaj. {t.footer_rights}
            </p>
            <p>
              <span className="text-white/20 text-[11px]">{t.footer_created} </span>
              <a href="https://www.asarmedia.com.tr" className="text-white/50 text-[11px] hover:text-white transition-colors">
                AsarMedia
              </a>
            </p>
          </div>

          {/* RIGHT — address + contact */}
          <div className="flex flex-row gap-8 items-start justify-center md:justify-end">
            <div>
              <h3 className="text-white text-[11px] font-bold uppercase tracking-widest mb-2">{t.footer_address_label}</h3>
              <p className="text-white/40 text-[12px] leading-relaxed">
                Çamlıca, 137. Sk. No: 2<br />
                06200 Yenimahalle / Ankara
              </p>
            </div>
            <div>
              <h3 className="text-white text-[11px] font-bold uppercase tracking-widest mb-2">{t.footer_contact_label}</h3>
              <div className="flex flex-col gap-1">
                <p className="text-white/40 text-[12px]">0312 397 3935</p>
                <p className="text-white/40 text-[12px]">0533 681 9127</p>
                <p className="text-white/40 text-[12px]">mavzer@mavzerambalaj.com.tr</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}