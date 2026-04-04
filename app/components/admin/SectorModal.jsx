"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SectorModal({ sector, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!sector;

  useEffect(() => {
    if (sector) {
      setName(sector.name || "");
      setDescription(sector.description || "");
      setImage(sector.image || "");
      setIsActive(sector.isActive ?? true);
    }
  }, [sector]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isEditing ? `${API}/api/sectors/${sector.id}` : `${API}/api/sectors`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description, image, isActive }),
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
      <div className="relative z-10 w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-base">{isEditing ? "Edit Sector" : "Add Sector"}</h2>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Restaurant" required
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description..." rows={3}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333] resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Image</label>
            <ImageUpload value={image} onChange={setImage} height="h-36" />
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Active</label>
            <button type="button" onClick={() => setIsActive(!isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative ${isActive ? "bg-white" : "bg-[#2a2a2a]"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${isActive ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 text-sm text-[#666] border border-[#2a2a2a] rounded-lg py-2.5 hover:text-white hover:border-[#444] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 text-sm bg-white text-black font-semibold rounded-lg py-2.5 hover:bg-neutral-200 transition-colors disabled:opacity-50">
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Sector"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}