'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { lang, switchLang, t } = useLanguage();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const menuRef = useRef(null);
  const btnRef  = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey   = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onClick = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current  && !btnRef.current.contains(e.target)
      ) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [menuOpen]);

  const LEFT_LINKS  = [
    { label: t.nav_corporate, href: '/about' },
    { label: t.nav_products,  href: '/products2' },
  ];
  const RIGHT_LINKS = [
    { label: t.nav_references, href: '/clients' },
    { label: t.nav_contact,    href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[900] h-[66px] flex items-center bg-white/95 backdrop-blur-sm border-b border-[#dde4ef] transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_20px_rgba(7,30,61,0.1)]' : ''}`}>

      {/* Hamburger — leftmost */}
      <div className="relative pl-6 shrink-0">
        <button
          ref={btnRef}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center justify-center w-9 h-9 border border-[#dde4ef] text-[#071e3d] rounded cursor-pointer transition-all duration-200 hover:bg-[#0a4c8a] hover:text-white hover:border-[#0a4c8a]"
        >
          <svg viewBox="0 0 14 10" fill="none" width="14" height="10">
            <rect width="14" height="1.5" rx=".75" fill="currentColor" />
            <rect y="4.25" width="10" height="1.5" rx=".75" fill="currentColor" />
            <rect y="8.5" width="14" height="1.5" rx=".75" fill="currentColor" />
          </svg>
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute left-2 top-full mt-2 w-64 bg-white border border-[#dde4ef] rounded-xl shadow-[0_8px_40px_rgba(7,30,61,0.13)] overflow-hidden z-[1000] flex flex-col"
            style={{ maxHeight: '75vh' }}
          >
            <div className="overflow-y-auto flex-1">
              <Link href="/" onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-[#071e3d] font-semibold text-sm border-b border-[#f0f3f8] hover:bg-[#f0f7ff] hover:text-[#0a4c8a] transition-colors no-underline">
                {t.nav_home}
              </Link>

              <div className="border-b border-[#f0f3f8]">
                <div className="px-5 py-2.5 text-[#071e3d] font-bold text-[10px] tracking-widest uppercase bg-[#f8fafc]">
                  {t.nav_mavzer}
                </div>
                {[
                  { label: t.nav_corporate,  href: '/about' },
                  { label: t.nav_production, href: '/products2' },
                  { label: t.nav_references, href: '/clients' },
                  { label: t.nav_contact,    href: '/contact' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                    className="block px-7 py-2 text-sm text-[#6b7380] hover:text-[#0a4c8a] hover:bg-[#f0f7ff] transition-colors no-underline">
                    • {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-b border-[#f0f3f8]">
                <div className="px-5 py-2.5 text-[#071e3d] font-bold text-[10px] tracking-widest uppercase bg-[#f8fafc]">
                  {t.nav_categories}
                </div>
                {[
                  { label: 'Kafe',     href: '/products?sector=kafe' },
                  { label: 'Otel',     href: '/products?sector=otel' },
                  { label: 'Restoran', href: '/products?sector=restoran' },
                  { label: 'Endüstri', href: '/products?sector=endustri' },
                  { label: 'Kurum',    href: '/products?sector=kurum' },
                  { label: 'Medikal',  href: '/products?sector=medikal' },
                ].map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                    className="block px-7 py-2 text-sm text-[#6b7380] hover:text-[#0a4c8a] hover:bg-[#f0f7ff] transition-colors no-underline">
                    • {item.label}
                  </Link>
                ))}
              </div>

              <div>
                <div className="px-5 py-2.5 text-[#071e3d] font-bold text-[10px] tracking-widest uppercase bg-[#f8fafc]">
                  {t.nav_info}
                </div>
                {[
                  { label: t.nav_info_1, href: '/bilgi-toplumu-hizmeti' },
                  { label: t.nav_info_2, href: '/sosyal-sorumluluk' },
                  { label: t.nav_info_3, href: '/cerez-politikasi' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                    className="block px-7 py-2 text-sm text-[#6b7380] hover:text-[#0a4c8a] hover:bg-[#f0f7ff] transition-colors no-underline">
                    • {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact footer */}
            <div className="px-5 py-4 bg-[#f8fafc] border-t border-[#dde4ef] shrink-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af] mb-2">{t.nav_contact_label}</p>
              <a href="tel:+903123973935" className="flex items-center gap-2 text-[12px] text-[#071e3d] font-semibold no-underline hover:text-[#0a4c8a] transition-colors mb-1">
                <PhoneIcon /> 0312 397 3935
              </a>
              <a href="tel:+905336819127" className="flex items-center gap-2 text-[12px] text-[#071e3d] font-semibold no-underline hover:text-[#0a4c8a] transition-colors mb-1">
                <PhoneIcon /> 0533 681 9127
              </a>
              <a href="mailto:mavzer@mavzerambalaj.com.tr" className="flex items-center gap-2 text-[12px] text-[#071e3d] font-semibold no-underline hover:text-[#0a4c8a] transition-colors">
                <MailIcon /> mavzer@mavzerambalaj.com.tr
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Center — links + logo + links */}
      <div className="flex-1 flex items-center justify-center gap-8">
        {LEFT_LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            className="relative text-[11px] font-semibold tracking-widest uppercase text-[#111827] no-underline pb-0.5 transition-colors duration-200 hover:text-[#0a4c8a] group whitespace-nowrap">
            {l.label}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e88e5] scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
        ))}

        <Link href="/" className="flex items-center justify-center no-underline shrink-0 px-4">
          <img src="/logo2.png" alt="Mavzer" className="h-10 object-contain" />
        </Link>

        {RIGHT_LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            className="relative text-[11px] font-semibold tracking-widest uppercase text-[#111827] no-underline pb-0.5 transition-colors duration-200 hover:text-[#0a4c8a] group whitespace-nowrap">
            {l.label}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e88e5] scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
        ))}
      </div>

      {/* Language switcher — rightmost */}
      <div className="pr-6 shrink-0 flex items-center gap-1">
        <button
          onClick={() => switchLang('tr')}
          className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded transition-all duration-200
            ${lang === 'tr' ? 'bg-[#071e3d] text-white' : 'text-[#9aa3af] hover:text-[#071e3d]'}`}
        >
          TR
        </button>
        <span className="text-[#dde4ef] text-xs">|</span>
        <button
          onClick={() => switchLang('en')}
          className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded transition-all duration-200
            ${lang === 'en' ? 'bg-[#071e3d] text-white' : 'text-[#9aa3af] hover:text-[#071e3d]'}`}
        >
          EN
        </button>
      </div>
    </nav>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}