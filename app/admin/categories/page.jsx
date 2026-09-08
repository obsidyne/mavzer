"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import CategoryModal from "../../components/admin/CategoryModal";

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-9 h-[18px] rounded-full relative transition-colors shrink-0
        ${value ? "bg-[var(--invert-bg)]" : "bg-[var(--bg-elevated-2)]"}`}
    >
      <span
        className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-black transition-all
          ${value ? "left-[20px]" : "left-[2px]"}`}
      />
    </button>
  );
}

function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border-[var(--border-default)]",
    green: "bg-[var(--badge-green-bg)] text-[var(--badge-green-text)] border-[var(--badge-green-border)]",
    inactive: "bg-[var(--bg-surface)] text-[var(--text-faint)] border-[var(--border-faint)]",
    sector: "bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)] border-[var(--badge-blue-border)]",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${styles[variant]}`}>
      {children}
    </span>
  );
}

// ─── ProductChip (draggable item) ────────────────────────────────────────────

function ProductChip({ product, side, onDragStart, onDragEnd, isDragging, isOver }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, product, side)}
      onDragEnd={onDragEnd}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing
        transition-all duration-150 select-none
        ${isDragging
          ? "opacity-40 scale-95 border-[var(--border-mid)] bg-[var(--bg-surface)]"
          : isOver
          ? "border-[var(--border-strong)] bg-[var(--bg-elevated)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)]"
        }
      `}
    >
      {/* drag handle */}
      <div className="text-[var(--text-disabled)] group-hover:text-[var(--text-muted)] transition-colors shrink-0">
        <svg viewBox="0 0 10 16" width="8" height="12" fill="currentColor">
          <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/>
          <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
          <circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/>
        </svg>
      </div>

      {/* image */}
      <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] overflow-hidden shrink-0 border border-[var(--border-subtle)]">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[var(--text-disabled)] text-xs">▦</div>
        }
      </div>

      {/* name */}
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-secondary)] text-[12px] font-medium truncate">{product.name}</p>
        {product.isGroup && (
          <p className="text-[var(--text-muted)] text-[10px]">Group · {product._count?.subProducts ?? 0} sub</p>
        )}
      </div>

      {/* active dot */}
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${product.isActive ? "bg-green-500" : "bg-[var(--bg-elevated-2)]"}`} />
    </div>
  );
}

// ─── DropZone wrapper ────────────────────────────────────────────────────────

function DropZone({ children, onDrop, accepts, isEmpty, emptyMsg, emptyIcon, className = "" }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false); }}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(e); }}
      className={`
        relative flex-1 rounded-xl border transition-all duration-200
        ${isOver
          ? "border-[#1e88e5]/40 bg-[#1e88e5]/[0.06]"
          : "border-[var(--border-faint)] bg-transparent"
        }
        ${className}
      `}
    >
      {/* glowing border on hover */}
      {isOver && (
        <div className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(30,136,229,0.3), 0 0 24px rgba(30,136,229,0.1)" }} />
      )}

      {isEmpty && !isOver ? (
        <div className="h-full flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
          <div className="text-[var(--text-disabled)] text-3xl mb-1">{emptyIcon}</div>
          <p className="text-[var(--text-faint)] text-[12px]">{emptyMsg}</p>
        </div>
      ) : (
        <div className="p-3 flex flex-col gap-1.5">
          {children}
          {isOver && (
            <div className="h-10 rounded-xl border-2 border-dashed border-[#1e88e5]/40 flex items-center justify-center">
              <span className="text-[var(--text-tertiary)] text-[11px]">Drop here</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CategoryRow ─────────────────────────────────────────────────────────────

function CategoryRow({ category, isSelected, onClick, onEdit, onDelete, onToggle }) {
  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer
        transition-all duration-150
        ${isSelected
          ? "bg-[var(--bg-surface)] border-[var(--border-default)]"
          : "bg-transparent border-transparent hover:bg-[var(--bg-surface-2)] hover:border-[var(--border-faint)]"
        }
      `}
    >
      {/* image */}
      <div className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] overflow-hidden shrink-0 border border-[var(--border-subtle)]">
        {category.image
          ? <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[var(--text-disabled)] text-xs">◈</div>
        }
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[13px] font-semibold truncate ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
            {category.name}
          </span>
          {!category.isActive && <Badge variant="inactive">Off</Badge>}
        </div>
        <p className="text-[var(--text-faint)] text-[11px] mt-0.5">
          {category._count?.products ?? 0} products
        </p>
      </div>

      {/* selected indicator */}
      {isSelected && <div className="w-1 h-6 rounded-full bg-[var(--invert-bg)] shrink-0" />}

      {/* action buttons - only show on hover/selected */}
      <div className={`flex items-center gap-1 shrink-0 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onToggle(category)}
          title={category.isActive ? "Deactivate" : "Activate"}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-mid)] transition-colors text-xs"
        >
          {category.isActive ? "○" : "●"}
        </button>
        <button
          onClick={() => onEdit(category)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-mid)] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(category)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-900/60 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  // ── data ──
  const [sectors, setSectors] = useState([]);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // products
  const [categoryProducts, setCategoryProducts] = useState([]); // products IN the category
  const [allProducts, setAllProducts] = useState([]); // all layer-3 products (for right panel)

  // loading
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // tabs  "categories" | "products"
  const [activeTab, setActiveTab] = useState("categories");

  // drag state
  const dragItem = useRef(null); // { product, side: "left"|"right" }
  const [draggingId, setDraggingId] = useState(null);

  // search
  const [catSearch, setCatSearch] = useState("");
  const [prodSearch, setProdSearch] = useState("");

  // error
  const [error, setError] = useState("");

  // ── fetch sectors ──
  useEffect(() => {
    (async () => {
      setLoadingSectors(true);
      try {
        const res = await fetch(`${API}/api/sectors`, { credentials: "include" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setSectors(list);
        if (list.length) setSelectedSectorId(list[0].id);
      } catch (e) { console.error(e); }
      finally { setLoadingSectors(false); }
    })();
  }, []);

  // ── fetch categories when sector changes ──
  useEffect(() => {
    if (!selectedSectorId) return;
    setSelectedCategory(null);
    setCategoryProducts([]);
    setCategories([]);
    setLoadingCategories(true);
    (async () => {
      try {
        const res = await fetch(`${API}/api/categories?sectorId=${selectedSectorId}`, { credentials: "include" });
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
      finally { setLoadingCategories(false); }
    })();
  }, [selectedSectorId]);

  // ── fetch all products once ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/products/all`, { credentials: "include" });
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  // ── fetch products for selected category ──
  const fetchCategoryProducts = useCallback(async (catId) => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API}/api/products?categoryId=${catId}`, { credentials: "include" });
      const data = await res.json();
      setCategoryProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoadingProducts(false); }
  }, []);

  function handleSelectCategory(cat) {
    setSelectedCategory(cat);
    fetchCategoryProducts(cat.id);
    setActiveTab("products");
  }

  // ── drag & drop ──
  function handleDragStart(e, product, side) {
    dragItem.current = { product, side };
    setDraggingId(product.id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    dragItem.current = null;
    setDraggingId(null);
  }

  async function handleDropToCategory(e) {
    // drop from right (unassigned) to left (category)
    const item = dragItem.current;
    if (!item || item.side !== "right" || !selectedCategory) return;
    const product = item.product;

    // optimistic update
    setCategoryProducts((prev) => [...prev, product]);

    try {
      const res = await fetch(`${API}/api/products/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, categoryId: selectedCategory.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        // revert
        setCategoryProducts((prev) => prev.filter((p) => p.id !== product.id));
        setError(d.message || "Failed to add product");
        return;
      }
      // update category count
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id
            ? { ...c, _count: { products: (c._count?.products ?? 0) + 1 } }
            : c
        )
      );
      setSelectedCategory((prev) =>
        prev ? { ...prev, _count: { products: (prev._count?.products ?? 0) + 1 } } : prev
      );
    } catch (err) {
      setCategoryProducts((prev) => prev.filter((p) => p.id !== product.id));
      setError("Failed to add product");
    }
  }

  async function handleDropToPool(e) {
    // drop from left (category) to right (unassigned / remove from category)
    const item = dragItem.current;
    if (!item || item.side !== "left" || !selectedCategory) return;
    const product = item.product;

    // optimistic update
    setCategoryProducts((prev) => prev.filter((p) => p.id !== product.id));

    try {
      const res = await fetch(`${API}/api/products/unlink`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, categoryId: selectedCategory.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        setCategoryProducts((prev) => [...prev, product]);
        setError(d.message || "Failed to remove product");
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id
            ? { ...c, _count: { products: Math.max(0, (c._count?.products ?? 1) - 1) } }
            : c
        )
      );
      setSelectedCategory((prev) =>
        prev ? { ...prev, _count: { products: Math.max(0, (prev._count?.products ?? 1) - 1) } } : prev
      );
    } catch (err) {
      setCategoryProducts((prev) => [...prev, product]);
      setError("Failed to remove product");
    }
  }

  // ── category CRUD ──
  async function handleDeleteCategory(cat) {
    const count = cat._count?.products ?? 0;
    const msg = count > 0
      ? `Delete "${cat.name}"? This will remove it from ${count} products.`
      : `Delete "${cat.name}"?`;
    if (!confirm(msg)) return;
    try {
      await fetch(`${API}/api/categories/${cat.id}`, { method: "DELETE", credentials: "include" });
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      if (selectedCategory?.id === cat.id) {
        setSelectedCategory(null);
        setCategoryProducts([]);
        setActiveTab("categories");
      }
    } catch (e) { setError("Failed to delete category"); }
  }

  async function handleToggleCategory(cat) {
    try {
      const res = await fetch(`${API}/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => c.id === updated.id ? { ...c, isActive: updated.isActive } : c));
      if (selectedCategory?.id === cat.id)
        setSelectedCategory((prev) => ({ ...prev, isActive: updated.isActive }));
    } catch (e) { setError("Failed to update category"); }
  }

 // AFTER
function handleCategorySaved(cat) {
  if (editingCategory) {
    if (cat.sectorId !== selectedSectorId) {
      // category moved to a different sector — remove it from the current list
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      if (selectedCategory?.id === cat.id) {
        setSelectedCategory(null);
        setCategoryProducts([]);
        setActiveTab("categories");
      }
    } else {
      setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, ...cat } : c));
      if (selectedCategory?.id === cat.id) setSelectedCategory((prev) => ({ ...prev, ...cat }));
    }
  } else {
    // only add to list if it belongs to the currently viewed sector
    if (cat.sectorId === selectedSectorId) {
      setCategories((prev) => [...prev, { ...cat, _count: { products: 0 } }]);
    }
  }
  setModalOpen(false);
  setEditingCategory(null);
}
  // ── derived lists ──
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const catProductIds = new Set(categoryProducts.map((p) => p.id));

  // Right panel: products NOT in the selected category, filtered by search
  const poolProducts = allProducts.filter((p) => {
    const notInCat = !catProductIds.has(p.id);
    const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase());
    return notInCat && matchesSearch;
  });

  const selectedSector = sectors.find((s) => s.id === selectedSectorId);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Manage categories and assign products via drag & drop
          </p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setModalOpen(true); }}
          disabled={!selectedSectorId}
          className="bg-[var(--invert-bg)] text-[var(--invert-text)] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--invert-hover)] transition-colors disabled:opacity-40 shrink-0"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-sm flex items-center justify-between shrink-0">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-300 ml-4">✕</button>
        </div>
      )}

      {/* ── Sector selector ── */}
      {loadingSectors ? (
        <div className="flex gap-2 mb-5 shrink-0">
          {[1,2,3].map((i) => <div key={i} className="h-8 w-24 bg-[var(--bg-surface)] rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="flex gap-2 mb-5 shrink-0 flex-wrap">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSectorId(s.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-all
                ${selectedSectorId === s.id
                  ? "bg-[var(--bg-elevated)] border-[var(--border-mid)] text-[var(--text-primary)]"
                  : "bg-transparent border-[var(--border-faint)] text-[var(--text-muted)] hover:border-[var(--border-default)] hover:text-[var(--text-tertiary)]"
                }`}
            >
              {s.image && <img src={s.image} alt="" className="w-4 h-4 rounded object-cover" />}
              {s.name}
              <span className="text-[10px] opacity-60">{s._count?.categories ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Main two-column layout ── */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* ══ LEFT PANEL — categories ══════════════════════════════════════ */}
        <div className="w-[300px] shrink-0 flex flex-col bg-[var(--bg-deep)] border border-[var(--border-faint)] rounded-2xl overflow-hidden">

          {/* panel header */}
          <div className="px-4 py-3 border-b border-[var(--border-faint)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase font-semibold">Categories</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-faint)]">
                {filteredCategories.length}
              </span>
            </div>
          </div>

          {/* search */}
          <div className="px-3 pt-3 shrink-0">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full bg-[var(--bg-surface-2)] border border-[var(--border-faint)] rounded-lg pl-8 pr-3 py-2 text-[12px] text-[var(--text-primary)] outline-none focus:border-[var(--border-default)] transition-colors placeholder:text-[var(--text-disabled)]"
              />
            </div>
          </div>

          {/* category list */}
          <div className="flex-1 overflow-y-auto p-2 mt-1">
            {loadingCategories ? (
              <div className="flex flex-col gap-1.5 p-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-14 bg-[var(--bg-surface-2)] rounded-xl animate-pulse border border-[var(--border-faint)]" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <span className="text-[var(--text-disabled)] text-3xl">◈</span>
                <p className="text-[var(--text-faint)] text-[12px]">
                  {catSearch ? "No categories match" : "No categories yet"}
                </p>
                {!catSearch && selectedSectorId && (
                  <button
                    onClick={() => { setEditingCategory(null); setModalOpen(true); }}
                    className="mt-2 text-[var(--text-muted)] text-[11px] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 hover:text-[var(--text-primary)] hover:border-[var(--border-mid)] transition-colors"
                  >
                    Add first category
                  </button>
                )}
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  isSelected={selectedCategory?.id === cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  onEdit={(c) => { setEditingCategory(c); setModalOpen(true); }}
                  onDelete={handleDeleteCategory}
                  onToggle={handleToggleCategory}
                />
              ))
            )}
          </div>
        </div>

        {/* ══ RIGHT PANEL — product management ══════════════════════════════ */}
        <div className="flex-1 flex flex-col bg-[var(--bg-deep)] border border-[var(--border-faint)] rounded-2xl overflow-hidden min-w-0">

          {selectedCategory ? (
            <>
              {/* panel header with category info */}
              <div className="px-5 py-3 border-b border-[var(--border-faint)] flex items-center gap-3 shrink-0">
                {selectedCategory.image && (
                  <img src={selectedCategory.image} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-primary)] text-[13px] font-semibold truncate">{selectedCategory.name}</span>
                    <Badge variant={selectedCategory.isActive ? "green" : "inactive"}>
                      {selectedCategory.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {selectedSector && <Badge variant="sector">{selectedSector.name}</Badge>}
                  </div>
                  <p className="text-[var(--text-faint)] text-[11px]">{selectedCategory._count?.products ?? 0} products assigned</p>
                </div>

                {/* tab switcher */}
                <div className="flex items-center gap-1 bg-[var(--bg-surface-2)] border border-[var(--border-faint)] rounded-lg p-0.5 shrink-0">
                  {["categories", "products"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium capitalize transition-all
                        ${activeTab === tab
                          ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-tertiary)]"
                        }`}
                    >
                      {tab === "products" ? "Assign Products" : "Category Info"}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ Tab: Category info ─ */}
              {activeTab === "categories" && (
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="max-w-lg">
                    <div className="flex flex-col gap-5">
                      {/* preview image */}
                      {selectedCategory.image && (
                        <div className="w-full h-40 rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                          <img src={selectedCategory.image} alt={selectedCategory.name} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <InfoCard label="Name" value={selectedCategory.name} />
                        <InfoCard label="Status" value={selectedCategory.isActive ? "Active" : "Inactive"} />
                        <InfoCard label="Products" value={selectedCategory._count?.products ?? 0} />
                        <InfoCard label="Sector" value={selectedSector?.name ?? "—"} />
                      </div>

                      {selectedCategory.description && (
                        <div className="bg-[var(--bg-surface-2)] border border-[var(--border-faint)] rounded-xl p-4">
                          <p className="text-[var(--text-muted)] text-[10px] tracking-widest uppercase mb-2">Description</p>
                          <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">{selectedCategory.description}</p>
                        </div>
                      )}

                      <button
                        onClick={() => { setEditingCategory(selectedCategory); setModalOpen(true); }}
                        className="text-sm text-[var(--text-primary)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 hover:border-[var(--border-strong)] transition-colors w-fit"
                      >
                        Edit Category
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─ Tab: Assign Products (drag & drop) ─ */}
              {activeTab === "products" && (
                <div className="flex-1 flex gap-3 p-3 min-h-0 overflow-hidden">

                  {/* LEFT: products IN this category */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                      <span className="text-[var(--text-muted)] text-[10px] tracking-widest uppercase font-semibold">
                        In Category
                      </span>
                      <span className="text-[var(--text-disabled)] text-[10px]">{categoryProducts.length}</span>
                    </div>

                    <DropZone
                      onDrop={handleDropToCategory}
                      isEmpty={categoryProducts.length === 0}
                      emptyMsg="Drag products here to add them to this category"
                      emptyIcon="◈"
                    >
                      {loadingProducts
                        ? [1,2,3].map((i) => (
                            <div key={i} className="h-12 bg-[var(--bg-surface)] rounded-xl animate-pulse border border-[var(--border-faint)]" />
                          ))
                        : categoryProducts.map((p) => (
                            <ProductChip
                              key={p.id}
                              product={p}
                              side="left"
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              isDragging={draggingId === p.id}
                            />
                          ))
                      }
                    </DropZone>
                  </div>

                  {/* divider with arrow */}
                  <div className="flex flex-col items-center justify-center gap-2 shrink-0 w-8">
                    <div className="flex-1 w-px bg-[var(--bg-surface)]" />
                    <div className="w-6 h-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" width="10" height="10">
                        <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M12 8l-4 4 4 4M8 12h8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 w-px bg-[var(--bg-surface)]" />
                  </div>

                  {/* RIGHT: all products NOT in category */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                      <span className="text-[var(--text-muted)] text-[10px] tracking-widest uppercase font-semibold">
                        All Products
                      </span>
                      <span className="text-[var(--text-disabled)] text-[10px]">{poolProducts.length}</span>
                    </div>

                    {/* search the pool */}
                    <div className="relative mb-2 shrink-0">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-disabled)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text"
                        value={prodSearch}
                        onChange={(e) => setProdSearch(e.target.value)}
                        placeholder="Search products…"
                        className="w-full bg-[var(--bg-surface-2)] border border-[var(--border-faint)] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--border-default)] transition-colors placeholder:text-[var(--text-disabled)]"
                      />
                    </div>

                    <DropZone
                      onDrop={handleDropToPool}
                      isEmpty={poolProducts.length === 0}
                      emptyMsg={prodSearch ? "No products match your search" : "All products are in this category"}
                      emptyIcon="▦"
                    >
                      {poolProducts.map((p) => (
                        <ProductChip
                          key={p.id}
                          product={p}
                          side="right"
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          isDragging={draggingId === p.id}
                        />
                      ))}
                    </DropZone>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* no category selected */
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-faint)] flex items-center justify-center mb-1">
                <span className="text-[var(--text-disabled)] text-2xl">◈</span>
              </div>
              <p className="text-[var(--text-faint)] text-[13px] font-medium">Select a category</p>
              <p className="text-[var(--text-disabled)] text-[11px] max-w-xs leading-relaxed">
                Choose a category from the left panel to view its details and assign products via drag & drop
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          sectorId={selectedSectorId}
          onClose={() => { setModalOpen(false); setEditingCategory(null); }}
          onSaved={handleCategorySaved}
        />
      )}
    </div>
  );
}

// small helper card
function InfoCard({ label, value }) {
  return (
    <div className="bg-[var(--bg-surface-2)] border border-[var(--border-faint)] rounded-xl p-3">
      <p className="text-[var(--text-faint)] text-[10px] tracking-widest uppercase mb-1">{label}</p>
      <p className="text-[var(--text-primary)] text-[13px] font-semibold truncate">{String(value)}</p>
    </div>
  );
}