"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { credentials: "include", ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// invisible 1x1 gif — eliminates the browser drag ghost delay
const BLANK_IMG = (() => {
  if (typeof window === "undefined") return null;
  const img = new Image();
  img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  return img;
})();

export default function Products2Page() {
  const router = useRouter();

  const [sectors, setSectors]           = useState([]);
  const [activeSector, setActiveSector] = useState(null);
  const [sectorProducts, setSectorProds] = useState([]);
  const [allProducts, setAllProducts]   = useState([]);
  const [search, setSearch]             = useState("");
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [loadingCenter, setLoadingCenter]   = useState(false);
  const [loadingRight, setLoadingRight]     = useState(true);
  const [addMenuOpen, setAddMenuOpen]   = useState(false);
  const [toast, setToast]               = useState(null);
  const toastTimer = useRef(null);

  // drag state — kept in refs so drag handlers don't need stale closures
  const draggingFrom    = useRef(null); // "right" | "center"
  const draggingProduct = useRef(null);
  const dragOverIndex   = useRef(null); // for center reorder
  const [dragOverIndexState, setDragOverIndexState] = useState(null); // for render
  const [centerDropActive, setCenterDropActive]     = useState(false);
  const [rightDropActive, setRightDropActive]       = useState(false);

  // reorder debounce
  const reorderTimer = useRef(null);

  // ── fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => { fetchSectors(); fetchAllProducts(); }, []);

  async function fetchSectors() {
    setLoadingSectors(true);
    try {
      const data = await apiFetch("/api/product-sectors/sectors");
      setSectors(data);
      if (data.length > 0) await selectSector(data[0]);
    } catch (e) { console.error(e); }
    finally { setLoadingSectors(false); }
  }

  async function fetchAllProducts(q = "") {
    setLoadingRight(true);
    try {
      const url = `/api/product-sectors/all-products${q ? `?q=${encodeURIComponent(q)}` : ""}`;
      const data = await apiFetch(url);
      const raw = Array.isArray(data) ? data : [];
      const seen2 = new Set();
      setAllProducts(raw.filter(p => { if (seen2.has(p.id)) return false; seen2.add(p.id); return true; }));
    } catch (e) { console.error(e); }
    finally { setLoadingRight(false); }
  }

  async function selectSector(sector) {
    setActiveSector(sector);
    setLoadingCenter(true);
    try {
      const data = await apiFetch(`/api/product-sectors/products?sectorId=${sector.id}`);
      const list = Array.isArray(data) ? data : [];
      const seen = new Set();
      setSectorProds(list.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; }));
    } catch (e) { console.error(e); }
    finally { setLoadingCenter(false); }
  }

  useEffect(() => {
    const t = setTimeout(() => fetchAllProducts(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── toast ──────────────────────────────────────────────────────────────────

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  // ── derived ────────────────────────────────────────────────────────────────

  const sectorProductIds = new Set(sectorProducts.map((p) => p.id));
  const rightProducts = allProducts.filter((p) => !sectorProductIds.has(p.id));
  const filteredRight = search
    ? rightProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : rightProducts;

  // ── link ───────────────────────────────────────────────────────────────────

  async function linkProduct(product) {
    if (!activeSector) return;
    // optimistic
    setSectorProds((prev) => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
    setSectors((prev) => prev.map((s) =>
      s.id === activeSector.id
        ? { ...s, _count: { ...s._count, products: (s._count?.products ?? 0) + 1 } }
        : s
    ));
    try {
      await apiFetch("/api/product-sectors/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, sectorId: activeSector.id }),
      });
      showToast(`Added to ${activeSector.name}`);
    } catch (e) {
      // rollback
      setSectorProds((prev) => prev.filter((p) => p.id !== product.id));
      setSectors((prev) => prev.map((s) =>
        s.id === activeSector.id
          ? { ...s, _count: { ...s._count, products: Math.max(0, (s._count?.products ?? 1) - 1) } }
          : s
      ));
      showToast("Failed to link", "error");
    }
  }

  // ── unlink ─────────────────────────────────────────────────────────────────

  async function unlinkProduct(product) {
    if (!activeSector) return;
    // optimistic
    setSectorProds((prev) => prev.filter((p) => p.id !== product.id));
    setSectors((prev) => prev.map((s) =>
      s.id === activeSector.id
        ? { ...s, _count: { ...s._count, products: Math.max(0, (s._count?.products ?? 1) - 1) } }
        : s
    ));
    try {
      await apiFetch("/api/product-sectors/unlink", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, sectorId: activeSector.id }),
      });
      showToast("Removed from sector");
    } catch (e) {
      showToast("Failed to unlink", "error");
      selectSector(activeSector); // re-fetch to restore
    }
  }

  // ── reorder (optimistic + debounced backend save) ──────────────────────────

  function reorderProducts(newList) {
    setSectorProds(newList);
    clearTimeout(reorderTimer.current);
    reorderTimer.current = setTimeout(async () => {
      try {
        await apiFetch("/api/product-sectors/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectorId: activeSector.id,
            productIds: newList.map((p) => p.id),
          }),
        });
      } catch (e) {
        console.error("Reorder save failed", e);
        showToast("Failed to save order", "error");
      }
    }, 600);
  }

  // ── drag handlers ──────────────────────────────────────────────────────────

  function onDragStart(e, product, from) {
    draggingFrom.current    = from;
    draggingProduct.current = product;
    // remove ghost image delay
    if (BLANK_IMG) e.dataTransfer.setDragImage(BLANK_IMG, 0, 0);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragEnd() {
    draggingFrom.current    = null;
    draggingProduct.current = null;
    dragOverIndex.current   = null;
    setDragOverIndexState(null);
    setCenterDropActive(false);
    setRightDropActive(false);
  }

  // center panel drag events
  function onCenterDragOver(e, index) {
    e.preventDefault();
    if (draggingFrom.current === "center") {
      dragOverIndex.current = index;
      setDragOverIndexState(index);
      setCenterDropActive(false);
    } else if (draggingFrom.current === "right") {
      setCenterDropActive(true);
    }
  }

  function onCenterDrop(e, dropIndex) {
    e.preventDefault();
    setCenterDropActive(false);
    setDragOverIndexState(null);

    const product = draggingProduct.current;
    const from    = draggingFrom.current;
    if (!product) return;

    if (from === "right") {
      linkProduct(product);
    } else if (from === "center") {
      const fromIndex = sectorProducts.findIndex((p) => p.id === product.id);
      if (fromIndex === -1 || fromIndex === dropIndex) return;
      const next = [...sectorProducts];
      next.splice(fromIndex, 1);
      next.splice(dropIndex, 0, product);
      reorderProducts(next);
    }
  }

  function onRightDragOver(e) {
    e.preventDefault();
    if (draggingFrom.current === "center") setRightDropActive(true);
  }

  function onRightDrop(e) {
    e.preventDefault();
    setRightDropActive(false);
    if (draggingFrom.current === "center" && draggingProduct.current) {
      unlinkProduct(draggingProduct.current);
    }
  }

  // ── delete ─────────────────────────────────────────────────────────────────

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This will delete all sub-products too.`)) return;
    try {
      await apiFetch(`/api/products/${product.id}`, { method: "DELETE" });
      setSectorProds((prev) => prev.filter((p) => p.id !== product.id));
      setAllProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast("Deleted");
    } catch (e) {
      showToast("Failed to delete", "error");
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden -m-8">

      {/* ── FAR LEFT — sector list ──────────────────────────────────────── */}
      <div className="w-[170px] shrink-0 border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a]">
        <div className="px-4 py-4 border-b border-[#1a1a1a]">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#333]">Sectors</p>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {loadingSectors
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mx-2 mb-1 h-9 bg-[#111] rounded-lg animate-pulse" />
              ))
            : sectors.map((sector) => {
                const isActive = activeSector?.id === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => selectSector(sector)}
                    className={`w-full text-left px-4 py-2.5 text-[11px] font-medium transition-colors flex items-center justify-between gap-2
                      ${isActive ? "bg-white text-black" : "text-[#555] hover:text-white hover:bg-[#111]"}`}
                  >
                    <span className="truncate">{sector.name}</span>
                    <span className={`text-[10px] shrink-0 tabular-nums ${isActive ? "text-black/40" : "text-[#2a2a2a]"}`}>
                      {sector._count?.products ?? 0}
                    </span>
                  </button>
                );
              })
          }
        </div>
      </div>

      {/* ── CENTER — products in sector ─────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col border-r border-[#1a1a1a] transition-colors duration-100
          ${centerDropActive ? "bg-[#0f1a0f]" : "bg-[#0d0d0d]"}`}
        onDragOver={(e) => { e.preventDefault(); if (draggingFrom.current === "right") setCenterDropActive(true); }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setCenterDropActive(false); }}
        onDrop={(e) => onCenterDrop(e, sectorProducts.length)}
      >
        <div className="px-5 py-4 border-b border-[#1a1a1a] shrink-0">
          <h2 className="text-white text-xs font-bold tracking-widest uppercase">
            {activeSector?.name ?? "—"}
          </h2>
          <p className="text-[#333] text-[10px] mt-0.5">
            {sectorProducts.length} products · drag to reorder · drag right to remove
          </p>
        </div>

        {centerDropActive && (
          <div className="mx-5 mt-4 shrink-0 border border-dashed border-green-500/30 rounded-xl py-2.5 text-center text-[11px] text-green-400/50">
            Drop to add
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-0.5">
          {loadingCenter
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-[52px] bg-[#111] border border-[#1a1a1a] rounded-xl animate-pulse mb-0.5" />
              ))
            : !activeSector
              ? <p className="text-[#222] text-xs text-center mt-16">Select a sector</p>
              : sectorProducts.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center mt-16 text-center">
                    <p className="text-[#333] text-xs">No products yet</p>
                    <p className="text-[#222] text-[10px] mt-1">Drag from the right panel to add</p>
                  </div>
                )
                : sectorProducts.map((product, index) => (
                    <CenterRow
                      key={product.id}
                      product={product}
                      index={index}
                      isDragging={draggingProduct.current?.id === product.id && draggingFrom.current === "center"}
                      isDropTarget={dragOverIndexState === index && draggingFrom.current === "center"}
                      onDragStart={(e) => onDragStart(e, product, "center")}
                      onDragEnd={onDragEnd}
                      onDragOver={(e) => onCenterDragOver(e, index)}
                      onDrop={(e) => onCenterDrop(e, index)}
                      onUnlink={() => unlinkProduct(product)}
                      onEdit={() => router.push(product.isGroup ? `/admin/products2/group/${product.id}` : `/admin/products2/product/${product.id}`)}
                      onDelete={() => handleDelete(product)}
                    />
                  ))
          }
        </div>
      </div>

      {/* ── RIGHT — products not in sector ──────────────────────────────── */}
      <div
        className={`w-[290px] shrink-0 flex flex-col transition-colors duration-100
          ${rightDropActive ? "bg-[#1a0a0a]" : "bg-[#0a0a0a]"}`}
        onDragOver={onRightDragOver}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setRightDropActive(false); }}
        onDrop={onRightDrop}
      >
        <div className="px-4 py-4 border-b border-[#1a1a1a] flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#333]">All Products</p>
            <p className="text-[#222] text-[10px] mt-0.5">Not in selected sector</p>
          </div>
          <div className="relative">
            {/* <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="text-[10px] bg-white text-black font-bold px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              + Add
            </button> */}
            {addMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => { setAddMenuOpen(false); router.push("/admin/products2/product/new"); }}
                    className="w-full text-left px-4 py-3 text-xs text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    <p className="font-semibold">New Single Product</p>
                    <p className="text-[#555] text-[10px] mt-0.5">Leaf product</p>
                  </button>
                  <div className="border-t border-[#1f1f1f]" />
                  <button
                    onClick={() => { setAddMenuOpen(false); router.push("/admin/products2/product/new?isGroup=1"); }}
                    className="w-full text-left px-4 py-3 text-xs text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    <p className="font-semibold">New Product Group</p>
                    <p className="text-[#555] text-[10px] mt-0.5">Has sub-products</p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[#1a1a1a] shrink-0">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#333] transition-colors placeholder:text-[#2a2a2a]"
          />
        </div>

        {rightDropActive && (
          <div className="mx-4 mt-3 shrink-0 border border-dashed border-red-500/30 rounded-xl py-2.5 text-center text-[11px] text-red-400/50">
            Drop to remove from {activeSector?.name}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
          {loadingRight
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[52px] bg-[#111] border border-[#1a1a1a] rounded-xl animate-pulse mb-0.5" />
              ))
            : filteredRight.length === 0
              ? <p className="text-[#222] text-xs text-center mt-10">
                  {search ? "No results" : "All products are in this sector"}
                </p>
              : filteredRight.map((product) => (
                  <RightRow
                    key={product.id}
                    product={product}
                    isDragging={draggingProduct.current?.id === product.id && draggingFrom.current === "right"}
                    onDragStart={(e) => onDragStart(e, product, "right")}
                    onDragEnd={onDragEnd}
                    onEdit={() => router.push(product.isGroup ? `/admin/products2/group/${product.id}` : `/admin/products2/product/${product.id}`)}
                    onDelete={() => handleDelete(product)}
                  />
                ))
          }
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-5 py-2.5 rounded-xl text-xs font-semibold shadow-2xl pointer-events-none
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-white text-black"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── CenterRow ────────────────────────────────────────────────────────────────

function CenterRow({ product, index, isDragging, isDropTarget, onDragStart, onDragEnd, onDragOver, onDrop, onUnlink, onEdit, onDelete }) {
  return (
    <div onDragOver={onDragOver} onDrop={onDrop}>
      {isDropTarget && <div className="h-0.5 bg-white/40 rounded-full mx-1 mb-0.5" />}
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border select-none transition-all duration-75
          ${isDragging
            ? "opacity-20 border-[#222] bg-[#0d0d0d]"
            : "border-[#1a1a1a] bg-[#111] hover:border-[#252525] cursor-grab active:cursor-grabbing"
          }`}
      >
        {/* grip */}
        <svg className="text-[#2a2a2a] shrink-0" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
          <circle cx="3" cy="2.5" r="1.3"/><circle cx="7" cy="2.5" r="1.3"/>
          <circle cx="3" cy="7"   r="1.3"/><circle cx="7" cy="7"   r="1.3"/>
          <circle cx="3" cy="11.5" r="1.3"/><circle cx="7" cy="11.5" r="1.3"/>
        </svg>

        {/* image */}
        <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] overflow-hidden shrink-0">
          {product.image
            ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-[#2a2a2a] text-[10px]">▦</div>
          }
        </div>

        {/* name */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-[11px] font-medium truncate">{product.name}</p>
          <p className="text-[#333] text-[9px]">
            {product.isGroup ? `${product._count?.subProducts ?? 0} sub` : "Single"}
          </p>
        </div>

        {/* order number */}
        <span className="text-[10px] text-[#2a2a2a] w-5 text-right shrink-0 tabular-nums">{index + 1}</span>

        {/* actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <IconBtn onClick={onEdit} title="Edit" color="hover:text-white">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
          </IconBtn>
          <IconBtn onClick={onUnlink} title="Remove from sector" color="hover:text-orange-400">
            <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" strokeLinecap="round" strokeLinejoin="round"/>
          </IconBtn>
          <IconBtn onClick={onDelete} title="Delete product" color="hover:text-red-400">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round"/>
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

// ─── RightRow ─────────────────────────────────────────────────────────────────

function RightRow({ product, isDragging, onDragStart, onDragEnd, onEdit, onDelete }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border select-none transition-all duration-75
        ${isDragging
          ? "opacity-20 border-[#222] bg-[#0a0a0a]"
          : "border-[#1a1a1a] bg-[#111] hover:border-[#252525] cursor-grab active:cursor-grabbing"
        }`}
    >
      <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] overflow-hidden shrink-0">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[#2a2a2a] text-[10px]">▦</div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-[11px] font-medium truncate">{product.name}</p>
        <p className="text-[#333] text-[9px]">
          {product.isGroup ? `${product._count?.subProducts ?? 0} sub` : "Single"}
          {product.sectors?.length > 0 && <span className="ml-1">· {product.sectors.length}s</span>}
        </p>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <IconBtn onClick={onEdit} title="Edit" color="hover:text-white">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
        </IconBtn>
        <IconBtn onClick={onDelete} title="Delete" color="hover:text-red-400">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round"/>
        </IconBtn>
      </div>
    </div>
  );
}

// ─── IconBtn ──────────────────────────────────────────────────────────────────

function IconBtn({ onClick, title, color, children }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className={`p-1.5 text-[#333] transition-colors ${color}`}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {children}
      </svg>
    </button>
  );
}