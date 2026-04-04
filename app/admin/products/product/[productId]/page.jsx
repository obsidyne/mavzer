// PAGE: Single Product Form — /admin/products/product/[productId]
// productId = "new" → add form
// productId = existing id → edit form

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "../../../../components/admin/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;
const EMPTY_DETAIL = { key: "", value: "" };

export default function ProductFormPage() {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isNew = productId === "new";
  const categoryId = searchParams.get("categoryId");
  const parentId = searchParams.get("parentId");
  const depth = parseInt(searchParams.get("depth") || "0");

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [details, setDetails] = useState([{ ...EMPTY_DETAIL }]);

  useEffect(() => {
    if (isNew) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`${API}/api/products/${productId}`, { credentials: "include" });
        const data = await res.json();
        setName(data.name || "");
        setDescription(data.description || "");
        setImage(data.image || "");
        setPrice(data.price?.toString() || "");
        setIsActive(data.isActive ?? true);
        const entries = data.details
          ? Object.entries(data.details).map(([key, value]) => ({ key, value }))
          : [{ ...EMPTY_DETAIL }];
        setDetails(entries.length ? entries : [{ ...EMPTY_DETAIL }]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  function addDetailRow() { setDetails((p) => [...p, { ...EMPTY_DETAIL }]); }
  function removeDetailRow(i) { setDetails((p) => p.filter((_, idx) => idx !== i)); }
  function updateDetail(i, field, value) {
    setDetails((p) => p.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const detailsObj = details.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key.trim()] = value;
        return acc;
      }, {});

      const body = {
        name, description, image, price,
        details: Object.keys(detailsObj).length ? detailsObj : null,
        isActive, isGroup: false, depth,
        ...(isNew ? (parentId ? { parentId } : { categoryId }) : {}),
      };

      const url = isNew ? `${API}/api/products` : `${API}/api/products/${productId}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      router.back();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#555] text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-[#444] mb-6">
        <button onClick={() => router.back()} className="hover:text-white transition-colors">← Back</button>
      </div>

      <h1 className="text-white text-2xl font-bold tracking-tight mb-8">
        {isNew ? "Add Product" : "Edit Product"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6">

          {/* Left */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#666] text-[11px] tracking-widest uppercase">Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#666] text-[11px] tracking-widest uppercase">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." rows={4}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333] resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#666] text-[11px] tracking-widest uppercase">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" step="0.01" min="0"
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]" />
              </div>
            </div>

            {/* Specs */}
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[#666] text-[11px] tracking-widest uppercase">Specifications</label>
                <button type="button" onClick={addDetailRow}
                  className="text-xs text-[#666] border border-[#2a2a2a] px-3 py-1 rounded-lg hover:text-white hover:border-[#444] transition-colors">
                  + Add Row
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {details.map((detail, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={detail.key} onChange={(e) => updateDetail(i, "key", e.target.value)} placeholder="e.g. Weight"
                      className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]" />
                    <input type="text" value={detail.value} onChange={(e) => updateDetail(i, "value", e.target.value)} placeholder="e.g. 500g"
                      className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#444] transition-colors placeholder:text-[#333]" />
                    <button type="button" onClick={() => removeDetailRow(i)} className="text-[#444] hover:text-red-400 transition-colors px-2">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-72 flex flex-col gap-5">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 flex flex-col gap-3">
              <label className="text-[#666] text-[11px] tracking-widest uppercase">Image</label>
              <ImageUpload value={image} onChange={setImage} height="h-52" />
            </div>

            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <label className="text-[#666] text-[11px] tracking-widest uppercase">Active</label>
                <button type="button" onClick={() => setIsActive(!isActive)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isActive ? "bg-white" : "bg-[#2a2a2a]"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all ${isActive ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={() => router.back()}
            className="text-sm text-[#666] border border-[#2a2a2a] rounded-lg px-6 py-2.5 hover:text-white hover:border-[#444] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="text-sm bg-white text-black font-semibold rounded-lg px-6 py-2.5 hover:bg-neutral-200 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}