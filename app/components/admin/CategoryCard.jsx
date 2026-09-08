// COMPONENT: CategoryCard
// Card shown in the categories grid (/admin/products/[sectorId]).
// Clicking navigates to /admin/products/[sectorId]/[categoryId] (catch-all route).
// Has Edit and Delete action buttons.

"use client";

import { useRouter } from "next/navigation";

export default function CategoryCard({ category, sectorId, onEdit, onDelete }) {
  const router = useRouter();

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--border-default)] transition-colors">
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/admin/products/${sectorId}/${category.id}`)}
      >
        <div className="w-full h-36 bg-[var(--bg-elevated)] flex items-center justify-center overflow-hidden">
          {category.image
            ? <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            : <span className="text-[var(--text-disabled)] text-3xl">◈</span>
          }
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[var(--text-primary)] text-sm font-semibold hover:underline">{category.name}</h3>
              <p className="text-[var(--text-faint)] text-xs mt-0.5">{category._count?.products ?? 0} products</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0
              ${category.isActive ? "bg-green-950 text-green-400" : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"}`}>
              {category.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {category.description && (
            <p className="text-[var(--text-faint)] text-xs mt-2 line-clamp-2">{category.description}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-4 py-4 mt-2 border-t border-[var(--border-faint)]">
        <button onClick={onEdit} className="flex-1 text-xs text-[var(--text-tertiary)] border border-[var(--border-subtle)] rounded-lg py-1.5 hover:text-[var(--text-primary)] hover:border-[var(--border-mid)] transition-colors">Edit</button>
        <button onClick={onDelete} className="flex-1 text-xs text-[var(--text-tertiary)] border border-[var(--border-subtle)] rounded-lg py-1.5 hover:text-red-400 hover:border-red-900 transition-colors">Delete</button>
      </div>
    </div>
  );
}