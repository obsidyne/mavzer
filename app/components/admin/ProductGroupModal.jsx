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
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5"
            >
              {/* Thumbnail */}
              <div className="w-8 h-8 rounded border border-[#2a2a2a] overflow-hidden shrink-0 bg-[#0d0d0d]">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Primary badge */}
              {idx === 0 && (
                <span className="text-[9px] font-bold tracking-widest uppercase text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded-full shrink-0">
                  Primary
                </span>
              )}

              {/* URL */}
              <p className="flex-1 text-[10px] text-[#555] truncate min-w-0">{url}</p>

              {/* Reorder */}
              <div className="flex gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, idx - 1)}
                  className="w-5 h-5 flex items-center justify-center text-[#444] hover:text-white transition-colors disabled:opacity-20 text-xs"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => move(idx, idx + 1)}
                  className="w-5 h-5 flex items-center justify-center text-[#444] hover:text-white transition-colors disabled:opacity-20 text-xs"
                >
                  ↓
                </button>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="w-5 h-5 flex items-center justify-center text-[#444] hover:text-red-400 transition-colors text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload widget */}
      <div className="border border-dashed border-[#2a2a2a] rounded-lg overflow-hidden">
        <ImageUpload value="" onChange={handleNewUpload} height="h-24" />
      </div>

      {images.length > 0 && (
        <p className="text-[#3a3a3a] text-[10px]">
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
      <div className="relative z-10 w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-base">
              {isEditing ? "Edit Product Group" : "Add Product Group"}
            </h2>
            <p className="text-[#555] text-xs mt-0.5">Add sub-products after creating the group</p>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kraft Paper Bags" required
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..." rows={3}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#666] text-[11px] tracking-widest uppercase flex items-center justify-between">
              Images
              {images.length > 0 && (
                <span className="normal-case font-normal tracking-normal text-[#444] text-[11px]">
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
              className="flex-1 text-sm text-[#666] border border-[#2a2a2a] rounded-lg py-2.5 hover:text-white hover:border-[#444] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 text-sm bg-white text-black font-semibold rounded-lg py-2.5 hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}