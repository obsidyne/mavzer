"use client";

import { useEffect, useState } from "react";
import SectorModal from "../../components/admin/SectorModal";

const API = process.env.NEXT_PUBLIC_API_URL;

function SectorRow({ sector, onEdit, onDelete, onToggleActive }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-[#1f1f1f] rounded-xl hover:border-[#2a2a2a] transition-colors">

      {/* Image */}
      <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center overflow-hidden shrink-0">
        {sector.image ? (
          <img src={sector.image} alt={sector.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#333] text-lg">▦</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-semibold truncate">{sector.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0
            ${sector.isActive
              ? "bg-green-950 text-green-400"
              : "bg-[#1a1a1a] text-[#555]"
            }`}>
            {sector.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        {sector.description && (
          <p className="text-[#444] text-xs mt-0.5 truncate">{sector.description}</p>
        )}
        <p className="text-[#333] text-[11px] mt-1">
          {sector._count?.categories ?? 0} {sector._count?.categories === 1 ? "category" : "categories"}
        </p>
      </div>

      {/* Order badge */}
      <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a1a] text-[#555] text-xs font-mono shrink-0">
        {sector.order}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggleActive(sector)}
          title={sector.isActive ? "Deactivate" : "Activate"}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1f1f1f] text-[#555] hover:text-white hover:border-[#333] transition-colors text-xs"
        >
          {sector.isActive ? "○" : "●"}
        </button>
        <button
          onClick={() => onEdit(sector)}
          className="text-xs text-[#666] border border-[#1f1f1f] rounded-lg px-3 py-1.5 hover:text-white hover:border-[#333] transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(sector.id)}
          className="text-xs text-[#666] border border-[#1f1f1f] rounded-lg px-3 py-1.5 hover:text-red-400 hover:border-red-900 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // "all" | "active" | "inactive"
  const [deleteError, setDeleteError] = useState("");

  async function fetchSectors() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/sectors`, { credentials: "include" });
      const data = await res.json();
      setSectors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSectors(); }, []);

  function handleAdd() {
    setEditingSector(null);
    setModalOpen(true);
  }

  function handleEdit(sector) {
    setEditingSector(sector);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    setDeleteError("");
    const sector = sectors.find((s) => s.id === id);
    const count = sector?._count?.categories ?? 0;
    const msg = count > 0
      ? `Delete "${sector.name}"? This will also delete all ${count} categories and their products.`
      : `Delete "${sector.name}"?`;
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`${API}/api/sectors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.message || "Failed to delete sector");
        return;
      }
      setSectors((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setDeleteError("Failed to delete sector");
    }
  }

  async function handleToggleActive(sector) {
    try {
      const res = await fetch(`${API}/api/sectors/${sector.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !sector.isActive }),
      });
      const updated = await res.json();
      setSectors((prev) => prev.map((s) => s.id === updated.id ? { ...s, isActive: updated.isActive } : s));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSaved(sector) {
    if (editingSector) {
      setSectors((prev) => prev.map((s) => s.id === sector.id ? { ...s, ...sector } : s));
    } else {
      setSectors((prev) => [...prev, { ...sector, _count: { categories: 0 } }]);
    }
    setModalOpen(false);
    setEditingSector(null);
  }

  // Filtered list
  const filtered = sectors.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && s.isActive) ||
      (filterActive === "inactive" && !s.isActive);
    return matchesSearch && matchesFilter;
  });

  const activeCount = sectors.filter((s) => s.isActive).length;
  const inactiveCount = sectors.filter((s) => !s.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Sectors</h1>
          <p className="text-[#555] text-sm mt-1">
            Manage top-level sectors — each sector groups related categories
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors shrink-0"
        >
          + Add Sector
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 mb-6">
        {[
          { label: "Total", value: sectors.length, key: "all" },
          { label: "Active", value: activeCount, key: "active" },
          { label: "Inactive", value: inactiveCount, key: "inactive" },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilterActive(stat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors
              ${filterActive === stat.key
                ? "bg-[#1a1a1a] border-[#333] text-white"
                : "bg-transparent border-[#1a1a1a] text-[#555] hover:border-[#2a2a2a] hover:text-[#888]"
              }`}
          >
            <span className="font-bold">{stat.value}</span>
            <span className="text-xs">{stat.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search sectors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm bg-[#111] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#333] transition-colors placeholder:text-[#333]"
        />
      </div>

      {deleteError && (
        <div className="mb-4 px-4 py-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-sm">
          {deleteError}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#111] border border-[#1f1f1f] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        searchQuery || filterActive !== "all" ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-16">
            <p className="text-[#444] text-sm">No sectors match your search</p>
            <button
              onClick={() => { setSearchQuery(""); setFilterActive("all"); }}
              className="mt-3 text-[#666] text-xs hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-20">
            <span className="text-[#222] text-4xl mb-4">▦</span>
            <p className="text-[#444] text-sm">No sectors yet</p>
            <p className="text-[#333] text-xs mt-1">Sectors are the top level of your product catalogue</p>
            <button
              onClick={handleAdd}
              className="mt-5 text-white text-sm border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition-colors"
            >
              Add your first sector
            </button>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((sector) => (
            <SectorRow
              key={sector.id}
              sector={sector}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <SectorModal
          sector={editingSector}
          onClose={() => { setModalOpen(false); setEditingSector(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}