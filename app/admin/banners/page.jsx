"use client";

import { useEffect, useState } from "react";
import ImageUpload from "../../components/admin/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

const TYPE_OPTIONS = [
  { value: "BOTH",    label: "Both",    desc: "Show on all devices" },
  { value: "DESKTOP", label: "Desktop", desc: "Desktop only" },
  { value: "MOBILE",  label: "Mobile",  desc: "Mobile only" },
];

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({ image: "", mobileImage: "", title: "", order: 0, isActive: true, type: "BOTH" });
  const [saving, setSaving]   = useState(false);

  useEffect(() => { fetchBanners(); }, []);

  async function fetchBanners() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/banners`, { credentials: "include" });
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setForm({ image: "", mobileImage: "", title: "", order: banners.length, isActive: true, type: "BOTH" });
    setModal({ mode: "add" });
  }

  function openEdit(banner) {
    setForm({
      image: banner.image, mobileImage: banner.mobileImage || "",
      title: banner.title || "", order: banner.order,
      isActive: banner.isActive, type: banner.type || "BOTH",
    });
    setModal({ mode: "edit", banner });
  }

  async function handleSave() {
    if (!form.image) return alert("Please upload a desktop/main image");
    setSaving(true);
    try {
      const url    = modal.mode === "add" ? `${API}/api/banners` : `${API}/api/banners/${modal.banner.id}`;
      const method = modal.mode === "add" ? "POST" : "PUT";
      const res    = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(form),
      });
      const data = await res.json();
      if (modal.mode === "add") setBanners((p) => [...p, data]);
      else setBanners((p) => p.map((b) => b.id === data.id ? data : b));
      setModal(null);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this banner?")) return;
    await fetch(`${API}/api/banners/${id}`, { method: "DELETE", credentials: "include" });
    setBanners((p) => p.filter((b) => b.id !== id));
  }

  async function toggleActive(banner) {
    const res  = await fetch(`${API}/api/banners/${banner.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    const data = await res.json();
    setBanners((p) => p.map((b) => b.id === data.id ? data : b));
  }

  const typeColor = { BOTH: "text-blue-400 border-blue-500/40 bg-blue-500/10", DESKTOP: "text-purple-400 border-purple-500/40 bg-purple-500/10", MOBILE: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Afişler</h1>
          {/* <p className="text-[#555] text-sm mt-0.5">Manage hero section slider images</p> */}
        </div>
        <button onClick={openAdd} className="bg-[#1e88e5] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1565c0] transition-colors">
          + banner ekle
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-48 bg-[#1a1a1a] rounded-xl animate-pulse" />)}
        </div>
      ) : banners.length === 0 ? (
        <div className="border border-dashed border-[#2a2a2a] rounded-xl py-20 text-center">
          <p className="text-[#444] text-sm">No banners yet</p>
          <button onClick={openAdd} className="mt-3 text-[#1e88e5] text-sm hover:underline">Add your first banner</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-[#111] rounded-xl overflow-hidden border border-[#1f1f1f]">
              <div className="relative aspect-video">
                <img src={banner.image} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5 flex-wrap justify-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor[banner.type] || typeColor.BOTH}`}>
                    {banner.type || "BOTH"}
                  </span>
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${banner.isActive ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-[#222] border-[#333] text-[#555]"}`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                  #{banner.order + 1}
                </div>
                {banner.mobileImage && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    + Mobile img
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{banner.title || <span className="text-[#444]">No title</span>}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(banner)} className="flex-1 py-1.5 text-xs text-[#aaa] border border-[#2a2a2a] rounded-lg hover:border-[#444] hover:text-white transition-colors">Edit</button>
                  <button onClick={() => handleDelete(banner.id)} className="flex-1 py-1.5 text-xs text-red-400 border border-[#2a2a2a] rounded-lg hover:border-red-500/40 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-[15px]">{modal.mode === "add" ? "Add Banner" : "Edit Banner"}</h2>
              <button onClick={() => setModal(null)} className="text-[#555] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">

              {/* Type selector */}
              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-2">Display On</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                      className={`py-2 px-3 rounded-lg border text-left transition-colors ${form.type === opt.value ? "border-[#1e88e5] bg-[#1e88e5]/10" : "border-[#2a2a2a] hover:border-[#444]"}`}
                    >
                      <p className={`text-xs font-bold ${form.type === opt.value ? "text-[#1e88e5]" : "text-white"}`}>{opt.label}</p>
                      <p className="text-[10px] text-[#555] mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main image */}
              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-2">
                  {form.type === "MOBILE" ? "Mobile Image" : "Desktop Image"}
                </label>
                <ImageUpload value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
              </div>

              {/* Mobile image — only shown for BOTH or DESKTOP (so you can provide an alternate mobile crop) */}
              {form.type === "BOTH" && (
                <div>
                  <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-1.5">
                    Mobile Image <span className="text-[#333] normal-case tracking-normal font-normal">(optional — uses desktop if not set)</span>
                  </label>
                  <ImageUpload value={form.mobileImage} onChange={(url) => setForm((f) => ({ ...f, mobileImage: url }))} />
                </div>
              )}

              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-1.5">Title (optional)</label>
                <input
                  type="text" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Banner title or caption"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#333] outline-none focus:border-[#444]"
                />
              </div>

              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-1.5">Order</label>
                <input
                  type="number" value={form.order} min={0}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#444]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isActive ? "bg-[#1e88e5]" : "bg-[#2a2a2a]"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isActive ? "left-5" : "left-0.5"}`} />
                </button>
                <span className="text-sm text-[#aaa]">{form.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-[#aaa] border border-[#2a2a2a] rounded-lg hover:border-[#444] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold bg-[#1e88e5] text-white rounded-lg hover:bg-[#1565c0] disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : "Save Banner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}