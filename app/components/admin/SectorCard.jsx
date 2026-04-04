"use client";

import { useRouter } from "next/navigation";

export default function SectorCard({ sector, onEdit, onDelete }) {
  const router = useRouter();

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-colors">

      {/* Clickable image + name area */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/admin/products/${sector.id}`)}
      >
        <div className="w-full h-36 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          {sector.image ? (
            <img src={sector.image} alt={sector.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#333] text-3xl">▦</span>
          )}
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white text-sm font-semibold hover:underline">
                {sector.name}
              </h3>
              <p className="text-[#444] text-xs mt-0.5">
                {sector._count?.categories ?? 0} categories
              </p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0
              ${sector.isActive
                ? "bg-green-950 text-green-400"
                : "bg-[#1a1a1a] text-[#555]"
              }`}>
              {sector.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {sector.description && (
            <p className="text-[#444] text-xs mt-2 line-clamp-2">{sector.description}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-4 mt-2 border-t border-[#1a1a1a]">
        <button
          onClick={onEdit}
          className="flex-1 text-xs text-[#666] border border-[#1f1f1f] rounded-lg py-1.5 hover:text-white hover:border-[#333] transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 text-xs text-[#666] border border-[#1f1f1f] rounded-lg py-1.5 hover:text-red-400 hover:border-red-900 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}