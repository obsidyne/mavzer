"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const STOCK = {
  factory1: "image1.jpg",
  factory2: "image2.jpg",
  factory3: "image3.jpg",
  team1:    "image4.webp",
  team2:    "image5.webp",
  team3:    "image6.jpg",
};

export default function CorporatePage() {
  const { t } = useLanguage();
  const [c, setC] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/about`)
      .then((r) => r.json())
      .then(setC)
      .catch(() => {});
  }, []);

  // API data takes priority; t.* keys are the translated fallback
  const data = {
    section1_label: c?.section1_label || t.about_s1_label,
    section1_title: c?.section1_title || t.about_s1_title,
    section1_p1:    c?.section1_p1    || t.about_s1_p1,
    section1_p2:    c?.section1_p2    || t.about_s1_p2,
    section1_p3:    c?.section1_p3    || t.about_s1_p3,
    section1_img1:  c?.section1_img1  || STOCK.factory1,
    section1_img2:  c?.section1_img2  || STOCK.factory2,
    section1_img3:  c?.section1_img3  || STOCK.factory3,
    section2_label: c?.section2_label || t.about_s2_label,
    section2_title: c?.section2_title || t.about_s2_title,
    section2_p1:    c?.section2_p1    || t.about_s2_p1,
    section2_p2:    c?.section2_p2    || t.about_s2_p2,
    section2_p3:    c?.section2_p3    || t.about_s2_p3,
    section2_img1:  c?.section2_img1  || STOCK.team1,
    section2_img2:  c?.section2_img2  || STOCK.team2,
    section2_img3:  c?.section2_img3  || STOCK.team3,
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0" style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 z-0 bg-white/50" />

      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <div className="pt-[66px] border-[#dde4ef]">
          <div className="max-w-4xl mx-auto px-8 py-10">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
              <span className="block w-5 h-px bg-[#1e88e5]" />
              {t.about_label}
            </div>
            <h1 className="font-condensed text-[36px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
              {t.about_title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-14">

          {/* Section 1 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#1e88e5]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">{data.section1_label}</span>
            </div>
            <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-4">{data.section1_title}</h2>
            <div className="text-[14px] text-[#4a5568] leading-[1.9] space-y-4 max-w-3xl">
              {[data.section1_p1, data.section1_p2, data.section1_p3].filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-14">
            {[data.section1_img1, data.section1_img2, data.section1_img3].filter(Boolean).map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[#dde4ef] aspect-[4/3]">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <div className="border-t border-[#dde4ef] mb-14" />

          {/* Section 2 */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#1e88e5]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">{data.section2_label}</span>
            </div>
            <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-4">{data.section2_title}</h2>
            <div className="text-[14px] text-[#4a5568] leading-[1.9] space-y-4 max-w-3xl">
              {[data.section2_p1, data.section2_p2, data.section2_p3].filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-14">
            {[data.section2_img1, data.section2_img2, data.section2_img3].filter(Boolean).map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[#dde4ef] aspect-[4/3]">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}