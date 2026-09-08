// COMPONENT: ProductCard
// Card shown in product grids (category products page and sub-products page).
// Clicking the card → goes to /admin/products/p/[productId]
// Shows 'Group' badge for product groups, price for single products.
// Has Edit and Delete action buttons.

"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product, onClick, onEdit, onDelete }) {
  const router = useRouter();

  function handleClick() {
    if (onClick) {
      onClick();
    } else {
      router.push(`/admin/products/p/${product.id}`);
    }
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--border-default)] transition-colors">

      <div className="cursor-pointer" onClick={handleClick}>
        <div className="w-full h-36 bg-[var(--bg-elevated)] flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--text-disabled)] text-3xl">▦</span>
          )}
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[var(--text-primary)] text-sm font-semibold hover:underline">{product.name}</h3>
              <p className="text-[var(--text-faint)] text-xs mt-0.5">
                {product.isGroup
                  ? `${product._count?.subProducts ?? 0} sub-products`
                  : product.price ? `₹${product.price}` : "No price set"
                }
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {product.isGroup && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 font-medium">
                  Group
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                ${product.isActive ? "bg-green-950 text-green-400" : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"}`}>
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {product.description && (
            <p className="text-[var(--text-faint)] text-xs mt-2 line-clamp-2">{product.description}</p>
          )}
        </div>
      </div>

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