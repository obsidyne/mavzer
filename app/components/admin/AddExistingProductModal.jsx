// COMPONENT: AddExistingProductModal
// Search and link an existing product to the current category or group
// Used in the products grid page

"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AddExistingProductModal({ categoryId, parentId, existingIds, onClose, onLinked }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    const q = e.target.value;
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }

    setLoading(true);
    try {
      const exclude = existingIds.join(",");
      const res = await fetch(`${API}/api/products/search?q=${q}&exclude=${exclude}`, { credentials: "include" });
      setResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLink(product) {
    setLinking(product.id);
    setError("");
    try {
      const res = await fetch(`${API}/api/products/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          ...(categoryId ? { categoryId } : { parentId }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to link product");
      onLinked(product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLinking(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-base">Add Existing Product</h2>
            <p className="text-[#555] text-xs mt-0.5">Search and link a product from another category</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-lg">✕</button>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search products..."
          autoFocus
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333] mb-4"
        />

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {loading && <p className="text-[#555] text-xs text-center py-4">Searching...</p>}

          {!loading && query && results.length === 0 && (
            <p className="text-[#555] text-xs text-center py-4">No products found</p>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-white text-sm font-medium">{product.name}</p>
                <p className="text-[#444] text-xs mt-0.5">
                  {product.categories?.map((c) => `${c.category?.sector?.name} › ${c.category?.name}`).join(", ")}
                </p>
              </div>
              <button
                onClick={() => handleLink(product)}
                disabled={linking === product.id}
                className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 shrink-0 ml-4"
              >
                {linking === product.id ? "Linking..." : "Add"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}