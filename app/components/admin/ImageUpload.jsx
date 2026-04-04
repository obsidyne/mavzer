// COMPONENT: ImageUpload
// Reusable image upload component used in all modals and forms
// Shows preview, drag & drop, click to upload
// Calls /api/upload and returns the image URL

"use client";

import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ImageUpload({ value, onChange, height = "h-40" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function uploadFile(file) {
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleRemove(e) {
    e.stopPropagation();
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative ${height} rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden
          ${dragging ? "border-white bg-[#222]" : value ? "border-[#2a2a2a]" : "border-[#2a2a2a] hover:border-[#444]"}
          ${uploading ? "opacity-60 cursor-wait" : ""}
        `}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={() => !uploading && inputRef.current?.click()}
                className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-[#444] border-t-white rounded-full animate-spin" />
                <p className="text-[#555] text-xs">Uploading...</p>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" width="28" height="28">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
                </svg>
                <p className="text-[#555] text-xs">
                  Drop image here or <span className="text-white">click to upload</span>
                </p>
                <p className="text-[#333] text-[10px]">JPG, PNG, WEBP up to 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-[11px]">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}