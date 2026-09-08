"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── MultiImageUpload ─────────────────────────────────────────────────────────
function MultiImageUpload({ images = [], onChange }) {
  function move(from, to) {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  function remove(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function handleNewUpload(url) {
    if (url && !images.includes(url)) onChange([...images, url]);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Uploaded images list */}
      {images.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {images.map((url, idx) => (
            <div
              key={url}
              className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-2.5 py-1.5"
            >
              {/* Thumbnail */}
              <div className="w-8 h-8 rounded border border-[var(--border-default)] overflow-hidden shrink-0 bg-[var(--bg-page)]">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Primary badge */}
              {idx === 0 && (
                <span className="text-[9px] font-bold tracking-widest uppercase text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded-full shrink-0">
                  Primary
                </span>
              )}

              {/* URL */}
              <p className="flex-1 text-[10px] text-[var(--text-muted)] truncate min-w-0">{url}</p>

              {/* Reorder */}
              <div className="flex gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, idx - 1)}
                  className="w-5 h-5 flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-20 text-xs"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => move(idx, idx + 1)}
                  className="w-5 h-5 flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-20 text-xs"
                >
                  ↓
                </button>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="w-5 h-5 flex items-center justify-center text-[var(--text-faint)] hover:text-red-400 transition-colors text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload widget */}
      <div className="border border-dashed border-[var(--border-default)] rounded-lg overflow-hidden">
        <ImageUpload value="" onChange={handleNewUpload} height="h-24" />
      </div>

      {images.length > 0 && (
        <p className="text-[var(--text-faint)] text-[10px]">
          <span className="text-blue-500">First image</span> is the primary thumbnail. Use ↑↓ to reorder.
        </p>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ProductGroupModal({ product, categoryId, parentId, depth = 0, onClose, onSaved }) {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      // Support both new { images[] } and legacy { image } format
      setImages(
        Array.isArray(product.images) && product.images.length
          ? product.images
          : product.image
          ? [product.image]
          : []
      );
    }
  }, [product]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let url, method, body;

      if (isEditing) {
        url    = `${API}/api/products/${product.id}`;
        method = "PUT";
        body   = { name, description, images };
      } else if (parentId) {
        url    = `${API}/api/products`;
        method = "POST";
        body   = { name, description, images, isGroup: true, depth, parentId };
      } else if (categoryId) {
        url    = `${API}/api/products`;
        method = "POST";
        body   = { name, description, images, isGroup: true, depth, categoryId };
      } else {
        url    = `${API}/api/products/standalone`;
        method = "POST";
        body   = { name, description, images, isGroup: true, depth: 0 };
      }

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
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
          <div>
            <h2 className="text-[var(--text-primary)] font-semibold text-base">
              {isEditing ? "Edit Product Group" : "Add Product Group"}
            </h2>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Add sub-products after creating the group</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kraft Paper Bags" required
              className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-[var(--text-disabled)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..." rows={3}
              className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors placeholder:text-[var(--text-disabled)] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[var(--text-tertiary)] text-[11px] tracking-widest uppercase flex items-center justify-between">
              Images
              {images.length > 0 && (
                <span className="normal-case font-normal tracking-normal text-[var(--text-faint)] text-[11px]">
                  {images.length} uploaded
                </span>
              )}
            </label>
            <MultiImageUpload images={images} onChange={setImages} />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 text-sm text-[var(--text-tertiary)] border border-[var(--border-default)] rounded-lg py-2.5 hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 text-sm bg-[var(--invert-bg)] text-[var(--invert-text)] font-semibold rounded-lg py-2.5 hover:bg-[var(--invert-hover)] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}