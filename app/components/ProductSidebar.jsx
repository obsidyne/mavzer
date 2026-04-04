"use client";

import { useState } from "react";

export default function ProductsSidebar({ sectors, loading, activeId, onSelectCategory }) {
  const [openSectors, setOpenSectors] = useState({});

  function toggleSector(id) {
    setOpenSectors((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading) {
    return (
      <div className="w-60 shrink-0">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-12 bg-[#f4f6fa] rounded-lg mb-2 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-60 shrink-0 sticky top-8">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af] mb-3 flex items-center gap-2">
        <span className="block w-4 h-0.5 bg-[#1e88e5]" />
        Browse by Sector
      </div>

      <div className="flex flex-col gap-1.5">
        {sectors.map((sector) => (
          <div key={sector.id} className="rounded-xl border border-[#dde4ef] bg-white overflow-hidden">

            {/* Sector */}
            <button
              onClick={() => toggleSector(sector.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f8fafc] transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                {sector.image && (
                  <img src={sector.image} alt={sector.name} className="w-5 h-5 rounded object-cover" />
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#071e3d]">
                  {sector.name}
                </span>
              </div>
              <svg
                viewBox="0 0 24 24" fill="none" stroke="#b0b8c4" strokeWidth="2"
                width="13" height="13"
                className={`transition-transform duration-200 shrink-0 ${openSectors[sector.id] ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Categories */}
            {openSectors[sector.id] && (
              <div className="border-t border-[#f0f3f8]">
                {sector.categories?.length === 0 && (
                  <p className="text-[11px] text-[#b0b8c4] px-4 py-2.5">No categories</p>
                )}
                {sector.categories?.map((cat) => {
                  const isActive = activeId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.id, cat.name, [{ label: sector.name, id: sector.id, type: "sector" }])}
                      className={`w-full text-left px-4 py-2.5 text-[11px] flex items-center gap-2.5 transition-colors border-t border-[#f0f3f8] first:border-t-0
                        ${isActive
                          ? "bg-[#1e88e5] text-white"
                          : "text-[#4a5568] hover:bg-[#f4f8ff] hover:text-[#071e3d]"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-white" : "bg-[#dde4ef]"}`} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}