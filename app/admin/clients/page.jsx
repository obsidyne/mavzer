"use client";

import { useEffect, useState } from "react";
import ImageUpload from "../../components/admin/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: "add"|"edit", client?: {} }
  const [form, setForm] = useState({ name: "", logo: "", order: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchClients(); }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/clients/all`, { credentials: "include" });
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setForm({ name: "", logo: "", order: clients.length, isActive: true });
    setModal({ mode: "add" });
  }

  function openEdit(client) {
    setForm({ name: client.name, logo: client.logo, order: client.order, isActive: client.isActive });
    setModal({ mode: "edit", client });
  }

  async function handleSave() {
    if (!form.name) return alert("Name is required");
    if (!form.logo) return alert("Logo is required");
    setSaving(true);
    try {
      const url = modal.mode === "add" ? `${API}/api/clients` : `${API}/api/clients/${modal.client.id}`;
      const method = modal.mode === "add" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (modal.mode === "add") {
        setClients((prev) => [...prev, data]);
      } else {
        setClients((prev) => prev.map((c) => c.id === data.id ? data : c));
      }
      setModal(null);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this client?")) return;
    await fetch(`${API}/api/clients/${id}`, { method: "DELETE", credentials: "include" });
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  async function toggleActive(client) {
    const res = await fetch(`${API}/api/clients/${client.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...client, isActive: !client.isActive }),
    });
    const data = await res.json();
    setClients((prev) => prev.map((c) => c.id === data.id ? data : c));
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
        
       

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Clients</h1>
          <p className="text-[#555] text-sm mt-0.5">Manage client logos shown on the references page</p>
        </div>
        <button onClick={openAdd} className="bg-[#1e88e5] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1565c0] transition-colors">
          + Add Client
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />)}
        </div>
      ) : clients.length === 0 ? (
        <div className="border border-dashed border-[#2a2a2a] rounded-xl py-20 text-center">
          <p className="text-[#444] text-sm">No clients yet</p>
          <button onClick={openAdd} className="mt-3 text-[#1e88e5] text-sm hover:underline">Add your first client</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-[#111] rounded-xl overflow-hidden border border-[#1f1f1f]">
              <div className="relative h-32 bg-white flex items-center justify-center p-4">
                <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
                <button
                  onClick={() => toggleActive(client)}
                  className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${client.isActive ? "bg-green-500/20 border-green-500/40 text-green-600" : "bg-[#f4f4f4] border-[#ddd] text-[#aaa]"}`}
                >
                  {client.isActive ? "Active" : "Inactive"}
                </button>
              </div>
              <div className="p-3">
                <p className="text-white text-[13px] font-semibold truncate">{client.name}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(client)} className="flex-1 py-1.5 text-xs text-[#aaa] border border-[#2a2a2a] rounded-lg hover:border-[#444] hover:text-white transition-colors">Edit</button>
                  <button onClick={() => handleDelete(client.id)} className="flex-1 py-1.5 text-xs text-red-400 border border-[#2a2a2a] rounded-lg hover:border-red-500/40 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-[15px]">{modal.mode === "add" ? "Add Client" : "Edit Client"}</h2>
              <button onClick={() => setModal(null)} className="text-[#555] hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-1.5">Client Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Burger King"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#333] outline-none focus:border-[#444]"
                />
              </div>

              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-2">Logo</label>
                <ImageUpload value={form.logo} onChange={(url) => setForm((f) => ({ ...f, logo: url }))} />
                {form.logo && (
                  <div className="mt-2 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                    <img src={form.logo} alt="preview" className="max-h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#555] text-[11px] uppercase tracking-widest font-bold block mb-1.5">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  min={0}
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
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}