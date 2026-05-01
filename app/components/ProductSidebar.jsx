"use client";

import { useEffect, useRef } from "react";

export default function ProductsSidebar({
  sectors, loading, activeSectorId, isGeneralActive,
  onSelectSector, onSelectGeneral,
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || sectors.length === 0) return;
    initialized.current = true;
    onSelectSector(sectors[0]);
  }, [sectors]);

  if (loading) {
    return (
      <div className="w-52 shrink-0 sticky top-24">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-11 bg-[#eef1f6] rounded-lg mb-1.5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-52 shrink-0 sticky top-24">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9aa3af] mb-3 px-1">
        Sektöre Göre
      </p>

      <div className="border border-[#dde4ef] rounded-xl overflow-hidden bg-white divide-y divide-[#dde4ef]">
        {sectors.map((sector) => {
          const isActive = !isGeneralActive && activeSectorId === sector.id;
          const count = sector._count?.products ?? 0;
          return (
            <button
              key={sector.id}
              onClick={() => onSelectSector(sector)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left
                ${isActive ? "bg-[#071e3d]" : "hover:bg-[#f8fafc]"}`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider truncate
                ${isActive ? "text-white" : "text-[#071e3d]"}`}>
                {sector.name}
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-2
                ${isActive ? "bg-white/20 text-white" : "bg-[#f0f4f8] text-[#9aa3af]"}`}>
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={onSelectGeneral}
          className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left
            ${isGeneralActive ? "bg-[#071e3d]" : "hover:bg-[#f8fafc]"}`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-wider
            ${isGeneralActive ? "text-white" : "text-[#071e3d]"}`}>
            Tüm Ürünler
          </span>
        </button>
      </div>
    </div>
  );
}