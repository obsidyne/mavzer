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
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-colors">

      <div className="cursor-pointer" onClick={handleClick}>
        <div className="w-full h-36 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#333] text-3xl">▦</span>
          )}
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white text-sm font-semibold hover:underline">{product.name}</h3>
              <p className="text-[#444] text-xs mt-0.5">
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
                ${product.isActive ? "bg-green-950 text-green-400" : "bg-[#1a1a1a] text-[#555]"}`}>
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {product.description && (
            <p className="text-[#444] text-xs mt-2 line-clamp-2">{product.description}</p>
          )}
        </div>
      </div>

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