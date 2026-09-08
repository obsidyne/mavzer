"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductGroupModal from "../../components/admin/ProductGroupModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AllProductsPage() {
  const router = useRouter();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [addMenuOpen, setAddMenuOpen]         = useState(false);
  const [groupModalOpen, setGroupModalOpen]   = useState(false);
  const [editingGroup, setEditingGroup]       = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [debouncedSearch]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const url = debouncedSearch
        ? `${API}/api/products/all?q=${encodeURIComponent(debouncedSearch)}`
        : `${API}/api/products/all`;
      const res  = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This will also delete all its sub-products.`)) return;
    await fetch(`${API}/api/products/${product.id}`, { method: "DELETE", credentials: "include" });
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  function handleClick(product) {
    if (product.isGroup) {
      router.push(`/admin/products2/group/${product.id}`);
    } else {
      router.push(`/admin/products2/product/${product.id}`);
    }
  }

  function handleEdit(product) {
    if (product.isGroup) {
      setEditingGroup(product);
      setGroupModalOpen(true);
    } else {
      router.push(`/admin/products2/product/${product.id}`);
    }
  }

  function handleGroupSaved(saved) {
    if (editingGroup) {
      setProducts((prev) => prev.map((p) => p.id === saved.id ? { ...p, ...saved } : p));
    } else {
      setProducts((prev) => [saved, ...prev]);
    }
    setGroupModalOpen(false);
    setEditingGroup(null);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">tüm ürünler</h1>
          {/* <p className="text-[var(--text-muted)] text-sm mt-0.5">Manage all depth-0 products and groups. Click a group to drill in.</p> */}
        </div>

        {/* Add button */}
        <div className="relative">
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="bg-[var(--invert-bg)] text-[var(--invert-text)] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--invert-hover)] transition-colors flex items-center gap-2"
          >
            + ürün ekle <span className="text-xs opacity-60">▾</span>
          </button>
          {addMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={() => { setAddMenuOpen(false); router.push("/admin/products2/product/new"); }}
                  className="w-full text-left px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <p className="font-medium">Yeni Tek Ürün</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">Leaf ürününün özellikleri ve fiyatı</p>
                </button>
                <div className="border-t border-[var(--border-subtle)]" />
                <button
                  onClick={() => { setAddMenuOpen(false); setEditingGroup(null); setGroupModalOpen(true); }}
                  className="w-full text-left px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <p className="font-medium">Yeni Ürün Grubu</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">İçinde alt ürünler bulunan grup</p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="aramak..."
          className="w-full bg-[var(--bg-sidebar)] border border-[var(--border-default)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none focus:border-[var(--border-strong)] transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-[var(--text-muted)] text-xs mb-4">{products.length} ürünler</p>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-16 bg-[var(--bg-surface)] rounded-xl animate-pulse border border-[var(--border-faint)]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-[var(--border-default)] rounded-xl py-20 text-center">
          <p className="text-[var(--text-faint)] text-sm mb-4">
            {search ? `No products found for "${search}"` : "No products yet"}
          </p>
          {!search && (
            <button
              onClick={() => { setEditingGroup(null); setGroupModalOpen(true); }}
              className="text-[var(--text-primary)] text-sm border border-[var(--border-default)] px-4 py-2 rounded-lg hover:border-[var(--border-strong)] transition-colors"
            >
              İlk ürününüzü ekleyin
            </button>
          )}
        </div>
      ) : (
        <div className="border border-[var(--border-faint)] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-3 bg-[var(--bg-sidebar)] border-b border-[var(--border-faint)]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Product</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Sectors</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Sub-products</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Status</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Actions</span>
          </div>

          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-5 py-4 items-center border-b border-[var(--border-faint)] last:border-0 hover:bg-[var(--bg-surface)] transition-colors ${idx % 2 === 0 ? "bg-[var(--bg-page)]" : "bg-[var(--bg-sidebar)]"}`}
            >
              {/* Name */}
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleClick(product)}>
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] overflow-hidden shrink-0 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" width="16" height="16">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[var(--text-primary)] text-[13px] font-semibold group-hover:text-[#1e88e5] transition-colors">
                    {product.name}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${product.isGroup ? "bg-purple-500/15 text-purple-400" : "bg-blue-500/15 text-blue-400"}`}>
                    {product.isGroup ? "Group" : "Product"}
                  </span>
                </div>
              </div>

              {/* Sectors */}
              <div className="flex flex-wrap gap-1">
                {product.sectors?.length > 0 ? (
                  product.sectors.slice(0, 2).map((ps) => (
                    <span key={ps.sectorId} className="text-[10px] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full whitespace-nowrap">
                      {ps.sector?.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[var(--text-faint)] text-[11px]">—</span>
                )}
                {product.sectors?.length > 2 && (
                  <span className="text-[10px] text-[var(--text-faint)]">+{product.sectors.length - 2}</span>
                )}
              </div>

              {/* Sub-product count */}
              <div>
                {product.isGroup ? (
                  <button
                    onClick={() => handleClick(product)}
                    className="text-[13px] text-[var(--text-primary)] font-semibold hover:text-[#1e88e5] transition-colors flex items-center gap-1"
                  >
                    {product._count?.subProducts ?? 0}
                    <span className="text-[var(--text-faint)] text-[11px] font-normal">sub-products</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10" className="text-[var(--text-faint)]">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                    </svg>
                  </button>
                ) : (
                  <span className="text-[var(--text-faint)] text-[11px]">—</span>
                )}
              </div>

              {/* Status */}
              <div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${product.isActive ? "bg-green-500/15 text-green-400" : "bg-[var(--bg-muted)] text-[var(--text-faint)]"}`}>
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)] rounded-lg hover:border-[var(--border-strong)] transition-colors"
                  title="Edit"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round"/>
                  </svg>
                </button>
                {product.isGroup && (
                  <button
                    onClick={() => handleClick(product)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-blue-400 border border-[var(--border-default)] rounded-lg hover:border-blue-900 transition-colors"
                    title="Open group"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(product)}
                  className="p-1.5 text-red-500/60 hover:text-red-400 border border-[var(--border-default)] rounded-lg hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group create/edit modal */}
      {groupModalOpen && (
        <ProductGroupModal
          product={editingGroup}
          parentId={null}
          depth={0}
          onClose={() => { setGroupModalOpen(false); setEditingGroup(null); }}
          onSaved={handleGroupSaved}
        />
      )}
    </div>
  );
}