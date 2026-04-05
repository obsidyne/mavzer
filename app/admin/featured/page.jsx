// PAGE: Featured Products — /admin/featured

"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function FeaturedPage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  async function fetchFeatured() {
    try {
      const res = await fetch(`${API}/api/featured`, { credentials: "include" });
      const data = await res.json();
      setFeatured(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFeatured(); }, []);

  async function handleSearch(e) {
    const q = e.target.value;
    setSearch(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const featuredIds = featured.map((p) => p.id).join(",");
      const res = await fetch(
        `${API}/api/products/search?q=${encodeURIComponent(q)}&exclude=${featuredIds}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }

  async function handleAdd(product) {
    try {
      const res = await fetch(`${API}/api/featured/${product.id}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      setFeatured((prev) => [data, ...prev]);
      setSearch("");
      setSearchResults([]);
      setSearchOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemove(id) {
    if (!confirm("Remove this product from featured?")) return;
    try {
      await fetch(`${API}/api/featured/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setFeatured((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Featured Products</h1>
          <p className="text-[#555] text-sm mt-1">
            Featured products appear in highlighted sections on the website.
          </p>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Search modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => { setSearchOpen(false); setSearch(""); setSearchResults([]); }}
          />
          <div className="relative z-10 w-full max-w-lg bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-base">Add Featured Product</h2>
              <button
                onClick={() => { setSearchOpen(false); setSearch(""); setSearchResults([]); }}
                className="text-[#555] hover:text-white transition-colors text-lg"
              >✕</button>
            </div>

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search products..."
              autoFocus
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333] mb-4"
            />

            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {searching && <p className="text-[#555] text-xs text-center py-4">Searching...</p>}
              {!searching && search && searchResults.length === 0 && (
                <p className="text-[#555] text-xs text-center py-4">No products found</p>
              )}
              {!search && <p className="text-[#444] text-xs text-center py-6">Type to search products</p>}

              {searchResults.map((product) => (
                <div key={product.id} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3">
                  <div className="w-12 h-12 rounded-lg bg-[#222] border border-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      : <span className="text-[#333] text-lg">▦</span>
                    }
                  </div>
                  <p className="text-white text-sm font-medium flex-1 truncate">{product.name}</p>
                  <button
                    onClick={() => handleAdd(product)}
                    className="shrink-0 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured list */}
      {loading ? (
        <div className="text-[#555] text-sm">Loading...</div>
      ) : featured.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-20">
          <p className="text-[#444] text-sm">No featured products yet</p>
          <button
            onClick={() => setSearchOpen(true)}
            className="mt-4 text-white text-sm border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition-colors"
          >
            Add your first featured product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featured.map((product) => (
            <div key={product.id} className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden group">

              {/* Image */}
              <div className="h-40 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                {product.image
                  ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  : <span className="text-[#333] text-3xl">▦</span>
                }
              </div>

              {/* Info + Remove */}
              <div className="p-3">
                <p className="text-white text-sm font-semibold line-clamp-2 leading-tight mb-3">
                  {product.name}
                </p>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="w-full text-xs text-[#666] border border-[#1f1f1f] rounded-lg py-1.5 hover:text-red-400 hover:border-red-900 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}