"use client";

import { useEffect, useState } from "react";
import SectorCard from "../../components/admin/SectorCard";
import SectorModal from "../../components/admin/SectorModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);

  async function fetchSectors() {
    try {
      const res = await fetch(`${API}/api/sectors`, { credentials: "include" });
      const data = await res.json();
      setSectors(data);
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
    if (!confirm("Delete this sector? This will also delete all its categories and products.")) return;
    try {
      await fetch(`${API}/api/sectors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSectors((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSaved(sector) {
    if (editingSector) {
      setSectors((prev) => prev.map((s) => s.id === sector.id ? sector : s));
    } else {
      setSectors((prev) => [...prev, sector]);
    }
    setModalOpen(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-[#555] text-sm mt-1">Manage your sectors, categories and products</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          + Add Sector
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-[#555] text-sm">Loading...</div>
      ) : sectors.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-20">
          <p className="text-[#444] text-sm">No sectors yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-white text-sm border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition-colors"
          >
            Add your first sector
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sectors.map((sector) => (
            <SectorCard
              key={sector.id}
              sector={sector}
              onEdit={() => handleEdit(sector)}
              onDelete={() => handleDelete(sector.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <SectorModal
          sector={editingSector}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}