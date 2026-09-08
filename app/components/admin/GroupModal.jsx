"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function GroupModal({ group, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!group;

  useEffect(() => {
    if (group) {
      setName(group.name || "");
      setDescription(group.description || "");
      setImage(group.image || "");
      setIsActive(group.isActive ?? true);
    }
  }, [group]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isEditing ? `${API}/api/groups/${group.id}` : `${API}/api/groups`;
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
      <div className="relative z-10 w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[var(--text-primary)] font-semibold text-base">{isEditing ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Arrivals"
              required
              className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-[var(--text-disabled)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              rows={3}
              className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-[var(--text-disabled)] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Image</label>
            <ImageUpload value={image} onChange={setImage} height="h-36" />
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Active</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative ${isActive ? "bg-[var(--invert-bg)]" : "bg-[var(--bg-elevated-2)]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${isActive ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm text-[var(--text-tertiary)] border border-[var(--border-default)] rounded-lg py-2.5 hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-sm bg-[var(--invert-bg)] text-[var(--invert-text)] font-semibold rounded-lg py-2.5 hover:bg-[var(--invert-hover)] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}