"use client";

import { useRouter } from "next/navigation";

export default function SectorCard({ sector, onEdit, onDelete }) {
  const router = useRouter();

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--border-default)] transition-colors">

      {/* Clickable image + name area */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/admin/products/${sector.id}`)}
      >
        <div className="w-full h-36 bg-[var(--bg-elevated)] flex items-center justify-center overflow-hidden">
          {sector.image ? (
            <img src={sector.image} alt={sector.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--text-disabled)] text-3xl">▦</span>
          )}
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[var(--text-primary)] text-sm font-semibold hover:underline">
                {sector.name}
              </h3>
              <p className="text-[var(--text-faint)] text-xs mt-0.5">
                {sector._count?.categories ?? 0} categories
              </p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0
              ${sector.isActive
                ? "bg-green-950 text-green-400"
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
              }`}>
              {sector.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {sector.description && (
            <p className="text-[var(--text-faint)] text-xs mt-2 line-clamp-2">{sector.description}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-4 mt-2 border-t border-[var(--border-faint)]">
        <button
          onClick={onEdit}
          className="flex-1 text-xs text-[var(--text-tertiary)] border border-[var(--border-subtle)] rounded-lg py-1.5 hover:text-[var(--text-primary)] hover:border-[var(--border-mid)] transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 text-xs text-[var(--text-tertiary)] border border-[var(--border-subtle)] rounded-lg py-1.5 hover:text-red-400 hover:border-red-900 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}