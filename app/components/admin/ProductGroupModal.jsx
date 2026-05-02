"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductGroupModal({ product, categoryId, parentId, depth = 0, onClose, onSaved }) {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setImage(product.image || "");
    }
  }, [product]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let url, body;

      if (isEditing) {
        url  = `${API}/api/products/${product.id}`;
        body = { name, description, image };
        const res  = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        onSaved(data);
      } else if (parentId) {
        // Sub-group inside an existing group — use normal endpoint
        url  = `${API}/api/products`;
        body = { name, description, image, isGroup: true, depth, parentId };
        const res  = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        onSaved(data);
      } else if (categoryId) {
        // Legacy: creating inside a category
        url  = `${API}/api/products`;
        body = { name, description, image, isGroup: true, depth, categoryId };
        const res  = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        onSaved(data);
      } else {
        // New depth-0 group with no category/parent — use standalone endpoint
        url  = `${API}/api/products/standalone`;
        body = { name, description, image, isGroup: true, depth: 0 };
        const res  = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        onSaved(data);
      }
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
            <label className="text-[#666] text-[11px] tracking-widest uppercase">Image</label>
            <ImageUpload value={image} onChange={setImage} height="h-36" />
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