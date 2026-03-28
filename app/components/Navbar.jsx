'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Corporate',  href: '/corporate'  },
  { label: 'Services',   href: '/services'   },
  { label: 'Production', href: '/production' },
  { label: 'References', href: '/references' },
  { label: 'Contact',    href: '/contact'    },
];

const MEGA_COLS = [
  {
    title: 'Display Products',
    links: ['Snapper Display Products', 'Traffic & Wayfinding Systems'],
  },
  {
    title: 'Graphic Products',
    links: ['Paper', 'Vinyl (Branda)', 'Fabric', 'Foils'],
  },
  {
    title: 'Panels',
    links: [
      'Acrylic (Plexiglass) Panel',
      'Aluminium',
      'Solid Polycarbonate Panels',
      'Hollow Polycarbonate Panels',
      'PVC Foam Panel (Dekota, Forex)',
      'Polystyrene Panel-Hips',
      'PET (Acetate) Panel',
      'Photoblok Panels',
      'PET-G Panel',
    ],
  },
  {
    title: 'LED & Electrical',
    links: ['Signage Lighting', 'Power Supplies', 'General Lighting', 'Mimaki Print Inks'],
  },
  {
    title: 'Printing Machines',
    links: [
      'Mimaki UV & Eco Solvent Printers',
      'Liyu Solvent Machines',
      'Digital Print Inks',
      'Cutting (Plotter) Machines',
    ],
  },
  {
    title: 'Auxiliary Materials',
    links: ['Tapes & Adhesives', 'Hardware'],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef  = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
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

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[900] h-[66px] flex items-center justify-between px-12 bg-white/95 backdrop-blur-sm border-b border-[#dde4ef] transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_2px_20px_rgba(7,30,61,0.1)]' : ''
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-20 h-10 bg-[#0a4c8a] rounded-lg flex items-center justify-center shrink-0">
            {/* <svg viewBox="0 0 24 24" fill="white" width="20" height="20"> */}
              {/* <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h2v-3h3v3h3v2h-3v3h-2v-3h-3v-2z" /> */}

            {/* </svg> */}
            <img src="logo.png" alt="" />
          </div>
         
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="relative text-[11px] font-semibold tracking-widest uppercase text-[#111827] no-underline pb-0.5 transition-colors duration-200 hover:text-[#0a4c8a] group"
              >
                {l.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e88e5] scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Menu button */}
        <button
          ref={btnRef}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 bg-[#0a4c8a] text-white border-none px-5 py-2 font-barlow text-[11px] font-bold tracking-widest uppercase cursor-pointer rounded transition-all duration-200 hover:bg-[#071e3d] hover:-translate-y-px"
        >
          <svg viewBox="0 0 14 10" fill="none" width="14" height="10">
            <rect width="14" height="1.5" rx=".75" fill="white" />
            <rect y="4.25" width="10" height="1.5" rx=".75" fill="white" />
            <rect y="8.5" width="14" height="1.5" rx=".75" fill="white" />
          </svg>
          Menu
        </button>
      </nav>

      {/* ── Mega Menu Dropdown ── */}
      <div
        ref={menuRef}
        className={`fixed top-[66px] left-0 right-0 z-[1000] bg-white border-t-4 border-t-[#0a4c8a] border-b border-b-[#dde4ef] shadow-[0_12px_48px_rgba(7,30,61,0.13)] transition-all duration-200 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <div className="grid grid-cols-6">
          {MEGA_COLS.map((col, i) => (
            <div
              key={col.title}
              className={`px-6 py-7 ${i < MEGA_COLS.length - 1 ? 'border-r border-[#dde4ef]' : ''}`}
            >
              <div className="text-[12.5px] font-bold tracking-wide text-[#071e3d] mb-4 pb-2 border-b border-[#dde4ef]">
                {col.title}
              </div>
              <ul className="list-none m-0 p-0 space-y-0.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="block text-xs font-normal text-[#6b7380] no-underline py-1 leading-snug transition-all duration-150 hover:text-[#0a4c8a] hover:pl-1.5"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}