"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryModal({ category, sectorId: defaultSectorId, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  // ── NEW: sector state ──
  const [selectedSectorId, setSelectedSectorId] = useState(defaultSectorId || "");
  const [sectors, setSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  // ──────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!category;

  // ── NEW: fetch all sectors on mount ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/sectors`, { credentials: "include" });
        const data = await res.json();
        setSectors(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSectors(false);
      }
    })();
  }, []);
  // ─────────────────────────────────────

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setImage(category.image || "");
      setIsActive(category.isActive ?? true);
      // ── NEW: pre-populate sector when editing ──
      setSelectedSectorId(category.sectorId || defaultSectorId || "");
    }
  }, [category]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // ── NEW: guard — sector is required ──
    if (!selectedSectorId) {
      setError("Please select a sector.");
      return;
    }
    // ─────────────────────────────────────

    setLoading(true);
    try {
      const url = isEditing ? `${API}/api/categories/${category.id}` : `${API}/api/categories`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // ── CHANGED: use selectedSectorId instead of the prop directly ──
        body: JSON.stringify({ name, description, image, isActive, sectorId: selectedSectorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      onSaved(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[var(--text-primary)] font-semibold text-base">{isEditing ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* ── NEW: Sector dropdown ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Sector *</label>
            {loadingSectors ? (
              <div className="h-10 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                required
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-[var(--text-muted)]">Select a sector…</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[var(--bg-elevated)] text-[var(--text-primary)]">
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* ────────────────────────── */}

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paper Bags" required
              className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-[var(--text-disabled)]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description..." rows={3}
              className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-[var(--text-disabled)] resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Image</label>
            <ImageUpload value={image} onChange={setImage} height="h-36" />
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Active</label>
            <button type="button" onClick={() => setIsActive(!isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative ${isActive ? "bg-[var(--invert-bg)]" : "bg-[var(--bg-elevated-2)]"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${isActive ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 text-sm text-[var(--text-tertiary)] border border-[var(--border-default)] rounded-lg py-2.5 hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || loadingSectors}
              className="flex-1 text-sm bg-[var(--invert-bg)] text-[var(--invert-text)] font-semibold rounded-lg py-2.5 hover:bg-[var(--invert-hover)] transition-colors disabled:opacity-50">
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}