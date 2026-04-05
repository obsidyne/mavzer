"use client";

import { useState, useEffect } from "react";

export default function ProductsSidebar({ sectors, loading, activeId, autoOpenSectorId, onSelectCategory }) {
  const [openSectors, setOpenSectors] = useState({});

  // auto open sector when coming from hero section
  useEffect(() => {
    if (autoOpenSectorId) {
      setOpenSectors((prev) => ({ ...prev, [autoOpenSectorId]: true }));
    }
  }, [autoOpenSectorId]);

  function toggleSector(id) {
    setOpenSectors((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading) {
    return (
      <div className="w-56 shrink-0">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-11 bg-[#eef1f6] rounded-lg mb-1.5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 shrink-0 sticky top-24">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9aa3af] mb-3 px-1">
        Browse by Sector
      </p>

      <div className="border border-[#dde4ef] rounded-lg overflow-hidden bg-white divide-y divide-[#dde4ef]">
        {sectors.map((sector) => (
          <div key={sector.id}>
            <button
              onClick={() => toggleSector(sector.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f8fafc] transition-colors text-left"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#071e3d]">
                {sector.name}
              </span>
              <svg
                viewBox="0 0 24 24" fill="none" stroke="#b0b8c4" strokeWidth="2"
                width="12" height="12"
                className={`transition-transform duration-200 shrink-0 ${openSectors[sector.id] ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {openSectors[sector.id] && (
              <div className="bg-[#f8fafc] divide-y divide-[#eef1f6]">
                {sector.categories?.length === 0 && (
                  <p className="text-[11px] text-[#b0b8c4] px-5 py-2.5">No categories</p>
                )}
                {sector.categories?.map((cat) => {
                  const isActive = activeId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.id, cat.name, [{ label: sector.name, id: sector.id, type: "sector" }])}
                      className={`w-full text-left px-5 py-2.5 text-[11px] flex items-center gap-2 transition-colors
                        ${isActive
                          ? "bg-[#0a4c8a] text-white font-semibold"
                          : "text-[#4a5568] hover:bg-[#eef3fa] hover:text-[#071e3d]"
                        }`}
                    >
                      <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? "bg-white" : "bg-[#cbd5e1]"}`} />
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