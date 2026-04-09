"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import GroupModal from "../../components/admin/GroupModal";

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-[#1a1a1a] text-[#888] border-[#2a2a2a]",
    green: "bg-green-950/60 text-green-400 border-green-900/40",
    inactive: "bg-[#111] text-[#444] border-[#1a1a1a]",
    purple: "bg-[#130f29] text-[#9b7de8] border-[#1e1650]",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${styles[variant]}`}>
      {children}
    </span>
  );
}

// ─── ProductChip (draggable) ──────────────────────────────────────────────────

function ProductChip({ product, side, onDragStart, onDragEnd, isDragging }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, product, side)}
      onDragEnd={onDragEnd}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing
        transition-all duration-150 select-none
        ${isDragging
          ? "opacity-40 scale-95 border-[#333] bg-[#111]"
          : "border-[#1f1f1f] bg-[#0e0e0e] hover:border-[#2a2a2a] hover:bg-[#111]"
        }
      `}
    >
      <div className="text-[#333] group-hover:text-[#555] transition-colors shrink-0">
        <svg viewBox="0 0 10 16" width="8" height="12" fill="currentColor">
          <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/>
          <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
          <circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/>
        </svg>
      </div>
      <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] overflow-hidden shrink-0 border border-[#1f1f1f]">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[#333] text-xs">▦</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#ccc] text-[12px] font-medium truncate">{product.name}</p>
        {product.isGroup && (
          <p className="text-[#555] text-[10px]">Group · {product._count?.subProducts ?? 0} sub</p>
        )}
      </div>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${product.isActive ? "bg-green-500" : "bg-[#333]"}`} />
    </div>
  );
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

function DropZone({ children, onDrop, isEmpty, emptyMsg, emptyIcon }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false); }}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(e); }}
      className={`
        relative flex-1 rounded-xl border transition-all duration-200
        ${isOver ? "border-white/20 bg-white/[0.03]" : "border-[#1a1a1a] bg-transparent"}
      `}
    >
      {isOver && (
        <div className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 24px rgba(255,255,255,0.04)" }} />
      )}

      {isEmpty && !isOver ? (
        <div className="h-full flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
          <div className="text-[#252525] text-3xl mb-1">{emptyIcon}</div>
          <p className="text-[#3a3a3a] text-[12px]">{emptyMsg}</p>
        </div>
      ) : (
        <div className="p-3 flex flex-col gap-1.5">
          {children}
          {isOver && (
            <div className="h-10 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
              <span className="text-[#666] text-[11px]">Drop here</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── GroupRow ─────────────────────────────────────────────────────────────────

function GroupRow({ group, isSelected, onClick, onEdit, onDelete, onToggle }) {
  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150
        ${isSelected
          ? "bg-[#111] border-[#2a2a2a]"
          : "bg-transparent border-transparent hover:bg-[#0e0e0e] hover:border-[#1a1a1a]"
        }
      `}
    >
      <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] overflow-hidden shrink-0 border border-[#1f1f1f]">
        {group.image
          ? <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[#333] text-xs">⊞</div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[13px] font-semibold truncate ${isSelected ? "text-white" : "text-[#bbb]"}`}>
            {group.name}
          </span>
          {!group.isActive && <Badge variant="inactive">Off</Badge>}
        </div>
        <p className="text-[#444] text-[11px] mt-0.5">{group._count?.products ?? 0} products</p>
      </div>

      {isSelected && <div className="w-1 h-6 rounded-full bg-white shrink-0" />}

      <div
        className={`flex items-center gap-1 shrink-0 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onToggle(group)}
          title={group.isActive ? "Deactivate" : "Activate"}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1f1f1f] text-[#555] hover:text-white hover:border-[#333] transition-colors text-xs"
        >
          {group.isActive ? "○" : "●"}
        </button>
        <button
          onClick={() => onEdit(group)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1f1f1f] text-[#555] hover:text-white hover:border-[#333] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(group)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1f1f1f] text-[#555] hover:text-red-400 hover:border-red-900/60 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── InfoCard ─────────────────────────────────────────────────────────────────

function InfoCard({ label, value }) {
  return (
    <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-3">
      <p className="text-[#444] text-[10px] tracking-widest uppercase mb-1">{label}</p>
      <p className="text-white text-[13px] font-semibold truncate">{String(value)}</p>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupProducts, setGroupProducts] = useState([]);  // products IN selected group
  const [allProducts, setAllProducts] = useState([]);       // all layer-3 products

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [activeTab, setActiveTab] = useState("info");

  const dragItem = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const [groupSearch, setGroupSearch] = useState("");
  const [prodSearch, setProdSearch] = useState("");
  const [error, setError] = useState("");

  // ── fetch groups ──
  useEffect(() => {
    (async () => {
      setLoadingGroups(true);
      try {
        const res = await fetch(`${API}/api/groups`, { credentials: "include" });
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
      finally { setLoadingGroups(false); }
    })();
  }, []);

  // ── fetch all layer-3 products once ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/products/all`, { credentials: "include" });
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  // ── fetch products for selected group ──
  const fetchGroupProducts = useCallback(async (groupId) => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API}/api/groups/${groupId}/products`, { credentials: "include" });
      const data = await res.json();
      setGroupProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoadingProducts(false); }
  }, []);

  function handleSelectGroup(g) {
    setSelectedGroup(g);
    fetchGroupProducts(g.id);
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

  async function handleDropToGroup() {
    const item = dragItem.current;
    if (!item || item.side !== "right" || !selectedGroup) return;
    const product = item.product;

    setGroupProducts((prev) => [...prev, product]);

    try {
      const res = await fetch(`${API}/api/groups/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, groupId: selectedGroup.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        setGroupProducts((prev) => prev.filter((p) => p.id !== product.id));
        setError(d.message || "Failed to add product");
        return;
      }
      setGroups((prev) =>
        prev.map((g) => g.id === selectedGroup.id
          ? { ...g, _count: { products: (g._count?.products ?? 0) + 1 } }
          : g
        )
      );
      setSelectedGroup((prev) =>
        prev ? { ...prev, _count: { products: (prev._count?.products ?? 0) + 1 } } : prev
      );
    } catch {
      setGroupProducts((prev) => prev.filter((p) => p.id !== product.id));
      setError("Failed to add product");
    }
  }

  async function handleDropToPool() {
    const item = dragItem.current;
    if (!item || item.side !== "left" || !selectedGroup) return;
    const product = item.product;

    setGroupProducts((prev) => prev.filter((p) => p.id !== product.id));

    try {
      const res = await fetch(`${API}/api/groups/unlink`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, groupId: selectedGroup.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        setGroupProducts((prev) => [...prev, product]);
        setError(d.message || "Failed to remove product");
        return;
      }
      setGroups((prev) =>
        prev.map((g) => g.id === selectedGroup.id
          ? { ...g, _count: { products: Math.max(0, (g._count?.products ?? 1) - 1) } }
          : g
        )
      );
      setSelectedGroup((prev) =>
        prev ? { ...prev, _count: { products: Math.max(0, (prev._count?.products ?? 1) - 1) } } : prev
      );
    } catch {
      setGroupProducts((prev) => [...prev, product]);
      setError("Failed to remove product");
    }
  }

  // ── CRUD ──
  async function handleDeleteGroup(g) {
    const count = g._count?.products ?? 0;
    const msg = count > 0
      ? `Delete "${g.name}"? This will remove it from ${count} products.`
      : `Delete "${g.name}"?`;
    if (!confirm(msg)) return;
    try {
      await fetch(`${API}/api/groups/${g.id}`, { method: "DELETE", credentials: "include" });
      setGroups((prev) => prev.filter((x) => x.id !== g.id));
      if (selectedGroup?.id === g.id) {
        setSelectedGroup(null);
        setGroupProducts([]);
        setActiveTab("info");
      }
    } catch { setError("Failed to delete group"); }
  }

  async function handleToggleGroup(g) {
    try {
      const res = await fetch(`${API}/api/groups/${g.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !g.isActive }),
      });
      const updated = await res.json();
      setGroups((prev) => prev.map((x) => x.id === updated.id ? { ...x, isActive: updated.isActive } : x));
      if (selectedGroup?.id === g.id)
        setSelectedGroup((prev) => ({ ...prev, isActive: updated.isActive }));
    } catch { setError("Failed to update group"); }
  }

  function handleGroupSaved(g) {
    if (editingGroup) {
      setGroups((prev) => prev.map((x) => x.id === g.id ? { ...x, ...g } : x));
      if (selectedGroup?.id === g.id) setSelectedGroup((prev) => ({ ...prev, ...g }));
    } else {
      setGroups((prev) => [...prev, { ...g, _count: { products: 0 } }]);
    }
    setModalOpen(false);
    setEditingGroup(null);
  }

  // ── derived ──
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const groupProductIds = new Set(groupProducts.map((p) => p.id));
  const poolProducts = allProducts.filter((p) => {
    const notInGroup = !groupProductIds.has(p.id);
    const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase());
    return notInGroup && matchesSearch;
  });

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Groups</h1>
          <p className="text-[#555] text-sm mt-1">
            Curate product collections independent of categories
          </p>
        </div>
        <button
          onClick={() => { setEditingGroup(null); setModalOpen(true); }}
          className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors shrink-0"
        >
          + Add Group
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-sm flex items-center justify-between shrink-0">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-300 ml-4">✕</button>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* ══ LEFT — group list ══════════════════════════════════════════════ */}
        <div className="w-[300px] shrink-0 flex flex-col bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden">

          <div className="px-4 py-3 border-b border-[#111] flex items-center gap-2 shrink-0">
            <span className="text-[#777] text-[11px] tracking-widest uppercase font-semibold">Groups</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#111] text-[#555] border border-[#1a1a1a]">
              {filteredGroups.length}
            </span>
          </div>

          <div className="px-3 pt-3 shrink-0">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                placeholder="Search groups…"
                className="w-full bg-[#0e0e0e] border border-[#1a1a1a] rounded-lg pl-8 pr-3 py-2 text-[12px] text-white outline-none focus:border-[#2a2a2a] transition-colors placeholder:text-[#333]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 mt-1">
            {loadingGroups ? (
              <div className="flex flex-col gap-1.5 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-[#0e0e0e] rounded-xl animate-pulse border border-[#111]" />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <span className="text-[#252525] text-3xl">⊞</span>
                <p className="text-[#3a3a3a] text-[12px]">
                  {groupSearch ? "No groups match" : "No groups yet"}
                </p>
                {!groupSearch && (
                  <button
                    onClick={() => { setEditingGroup(null); setModalOpen(true); }}
                    className="mt-2 text-[#555] text-[11px] border border-[#1f1f1f] rounded-lg px-3 py-1.5 hover:text-white hover:border-[#333] transition-colors"
                  >
                    Add first group
                  </button>
                )}
              </div>
            ) : (
              filteredGroups.map((g) => (
                <GroupRow
                  key={g.id}
                  group={g}
                  isSelected={selectedGroup?.id === g.id}
                  onClick={() => handleSelectGroup(g)}
                  onEdit={(x) => { setEditingGroup(x); setModalOpen(true); }}
                  onDelete={handleDeleteGroup}
                  onToggle={handleToggleGroup}
                />
              ))
            )}
          </div>
        </div>

        {/* ══ RIGHT — detail + product assignment ════════════════════════════ */}
        <div className="flex-1 flex flex-col bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden min-w-0">

          {selectedGroup ? (
            <>
              {/* panel header */}
              <div className="px-5 py-3 border-b border-[#111] flex items-center gap-3 shrink-0">
                {selectedGroup.image && (
                  <img src={selectedGroup.image} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[13px] font-semibold truncate">{selectedGroup.name}</span>
                    <Badge variant={selectedGroup.isActive ? "green" : "inactive"}>
                      {selectedGroup.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="purple">Group</Badge>
                  </div>
                  <p className="text-[#444] text-[11px]">{selectedGroup._count?.products ?? 0} products assigned</p>
                </div>

                {/* tab switcher */}
                <div className="flex items-center gap-1 bg-[#0e0e0e] border border-[#1a1a1a] rounded-lg p-0.5 shrink-0">
                  {[["info", "Group Info"], ["products", "Assign Products"]].map(([tab, label]) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium capitalize transition-all
                        ${activeTab === tab
                          ? "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                          : "text-[#555] hover:text-[#888]"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ Tab: Info ─ */}
              {activeTab === "info" && (
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="max-w-lg flex flex-col gap-5">
                    {selectedGroup.image && (
                      <div className="w-full h-40 rounded-xl overflow-hidden border border-[#1f1f1f]">
                        <img src={selectedGroup.image} alt={selectedGroup.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <InfoCard label="Name" value={selectedGroup.name} />
                      <InfoCard label="Status" value={selectedGroup.isActive ? "Active" : "Inactive"} />
                      <InfoCard label="Products" value={selectedGroup._count?.products ?? 0} />
                    </div>
                    {selectedGroup.description && (
                      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-4">
                        <p className="text-[#555] text-[10px] tracking-widest uppercase mb-2">Description</p>
                        <p className="text-[#888] text-sm leading-relaxed">{selectedGroup.description}</p>
                      </div>
                    )}
                    <button
                      onClick={() => { setEditingGroup(selectedGroup); setModalOpen(true); }}
                      className="text-sm text-white border border-[#2a2a2a] rounded-lg px-4 py-2.5 hover:border-[#444] transition-colors w-fit"
                    >
                      Edit Group
                    </button>
                  </div>
                </div>
              )}

              {/* ─ Tab: Assign Products (drag & drop) ─ */}
              {activeTab === "products" && (
                <div className="flex-1 flex gap-3 p-3 min-h-0 overflow-hidden">

                  {/* LEFT: products IN this group */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                      <span className="text-[#555] text-[10px] tracking-widest uppercase font-semibold">In Group</span>
                      <span className="text-[#333] text-[10px]">{groupProducts.length}</span>
                    </div>
                    <DropZone
                      onDrop={handleDropToGroup}
                      isEmpty={groupProducts.length === 0}
                      emptyMsg="Drag products here to add them to this group"
                      emptyIcon="⊞"
                    >
                      {loadingProducts
                        ? [1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-[#111] rounded-xl animate-pulse border border-[#1a1a1a]" />
                          ))
                        : groupProducts.map((p) => (
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

                  {/* divider */}
                  <div className="flex flex-col items-center justify-center gap-2 shrink-0 w-8">
                    <div className="flex-1 w-px bg-[#111]" />
                    <div className="w-6 h-6 rounded-full bg-[#111] border border-[#1f1f1f] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" width="10" height="10">
                        <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M12 8l-4 4 4 4M8 12h8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 w-px bg-[#111]" />
                  </div>

                  {/* RIGHT: all products NOT in group */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                      <span className="text-[#555] text-[10px] tracking-widests uppercase font-semibold">All Products</span>
                      <span className="text-[#333] text-[10px]">{poolProducts.length}</span>
                    </div>
                    <div className="relative mb-2 shrink-0">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text"
                        value={prodSearch}
                        onChange={(e) => setProdSearch(e.target.value)}
                        placeholder="Search products…"
                        className="w-full bg-[#0e0e0e] border border-[#1a1a1a] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-white outline-none focus:border-[#2a2a2a] transition-colors placeholder:text-[#333]"
                      />
                    </div>
                    <DropZone
                      onDrop={handleDropToPool}
                      isEmpty={poolProducts.length === 0}
                      emptyMsg={prodSearch ? "No products match your search" : "All products are in this group"}
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
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-[#0e0e0e] border border-[#1a1a1a] flex items-center justify-center mb-1">
                <span className="text-[#333] text-2xl">⊞</span>
              </div>
              <p className="text-[#3a3a3a] text-[13px] font-medium">Select a group</p>
              <p className="text-[#2a2a2a] text-[11px] max-w-xs leading-relaxed">
                Choose a group from the left panel to view its details and assign products via drag & drop
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <GroupModal
          group={editingGroup}
          onClose={() => { setModalOpen(false); setEditingGroup(null); }}
          onSaved={handleGroupSaved}
        />
      )}
    </div>
  );
}