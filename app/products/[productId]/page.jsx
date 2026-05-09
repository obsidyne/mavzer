"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── ImageGallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images = [], alt = "" }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => { setActive(0); }, [images.join(",")]);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!zoomed) return;
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setZoomed(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, prev, next]);

  if (!images.length) {
    return (
      <div className="w-full md:w-72 md:shrink-0 bg-[#f8fafc] border-b md:border-b-0 md:border-r border-[#dde4ef] flex items-center justify-center" style={{ minHeight: 200 }}>
        <div className="flex flex-col items-center gap-2 text-[#dde4ef]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" width="48" height="48">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
          </svg>
          <p className="text-[10px] tracking-widest uppercase">Görsel yok</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl font-thin w-12 h-12 flex items-center justify-center"
          >
            ‹
          </button>
          <img
            src={images[active]}
            alt={alt}
            className="max-h-[85vh] max-w-[85vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl font-thin w-12 h-12 flex items-center justify-center"
          >
            ›
          </button>
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-5 right-6 text-white/60 hover:text-white text-xl"
          >
            ✕
          </button>
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActive(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inline gallery */}
      <div className="w-full md:w-72 md:shrink-0 border-b md:border-b-0 md:border-r border-[#dde4ef] flex flex-col" style={{ minHeight: 200 }}>
        {/* Main image */}
        <div
          className="flex-1 bg-[#f8fafc] relative overflow-hidden cursor-zoom-in group"
          style={{ minHeight: 220 }}
          onClick={() => setZoomed(true)}
        >
          <img
            src={images[active]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ maxHeight: 340 }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow text-[#071e3d] text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow text-[#071e3d] text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ›
              </button>
              <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
                {active + 1} / {images.length}
              </div>
            </>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/40 text-white text-[9px] px-2 py-1 rounded-full flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="white" width="9" height="9">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              Büyüt
            </div>
          </div>
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="flex gap-1.5 p-2 bg-white border-t border-[#dde4ef] overflow-x-auto">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-12 h-12 rounded border-2 overflow-hidden shrink-0 transition-all ${
                  i === active ? "border-[#0a4c8a]" : "border-[#dde4ef] hover:border-[#9aa3af]"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const productRes = await fetch(`${API}/api/public/products/${productId}`);
        const productData = await productRes.json();
        setProduct(productData);

        if (productData.isGroup) {
          const subRes = await fetch(`${API}/api/public/products?parentId=${productId}`);
          const subs = await subRes.json();
          const subList = Array.isArray(subs) ? subs : [];
          setVariants(subList);
          if (subList.length > 0) {
            const firstRes = await fetch(`${API}/api/public/products/${subList[0].id}`);
            setSelectedVariant(await firstRes.json());
          }
        }

        const sectorId = productData.sectors?.[0]?.sectorId;
        if (sectorId) {
          const recRes = await fetch(`${API}/api/public/sector-products?sectorId=${sectorId}`);
          const recData = await recRes.json();
          setRecommended(
            Array.isArray(recData)
              ? recData.filter((p) => p.id !== productId).slice(0, 6)
              : []
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  async function handleVariantClick(variant) {
    if (selectedVariant?.id === variant.id) return;
    setSelectedVariant(null);
    try {
      const res = await fetch(`${API}/api/public/products/${variant.id}`);
      setSelectedVariant(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  const isGroup = product?.isGroup;
  const display = isGroup ? selectedVariant : product;

  const displayImages =
    Array.isArray(display?.images) && display.images.length
      ? display.images
      : display?.image
      ? [display.image]
      : Array.isArray(product?.images) && product.images.length
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const sectorName = product?.sectors?.[0]?.sector?.name;

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Header / breadcrumb */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-4 py-4 md:px-8 md:py-6">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9aa3af] flex-wrap">
            <Link href="/products" className="hover:text-[#0a4c8a] transition-colors font-medium">
              Ürünler
            </Link>
            {sectorName && (
              <>
                <span className="text-[#dde4ef]">›</span>
                <Link
                  href={`/products?sector=${encodeURIComponent(sectorName)}`}
                  className="hover:text-[#0a4c8a] transition-colors"
                >
                  {sectorName}
                </Link>
              </>
            )}
            {isGroup && (
              <>
                <span className="text-[#dde4ef]">›</span>
                <span className="text-[#6b7380]">{product?.name}</span>
              </>
            )}
            {display && (
              <>
                <span className="text-[#dde4ef]">›</span>
                <span className="text-[#071e3d] font-semibold">{display.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 md:px-8 md:py-8">
        {loading ? (
          <div className="bg-white rounded-xl border border-[#dde4ef] p-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-72 h-52 md:h-72 bg-[#f4f6fa] rounded-lg md:shrink-0" />
              <div className="flex-1 flex flex-col gap-3 pt-2">
                <div className="h-7 bg-[#f4f6fa] rounded w-3/4" />
                <div className="h-4 bg-[#f4f6fa] rounded" />
                <div className="h-4 bg-[#f4f6fa] rounded w-2/3" />
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="bg-white rounded-xl border border-[#dde4ef] p-12 text-center">
            <p className="text-[#9aa3af] text-sm">Ürün bulunamadı.</p>
            <Link href="/products" className="mt-3 inline-block text-[#1e88e5] text-sm font-semibold">
              ← Ürünlere Dön
            </Link>
          </div>
        ) : (
          <>
            {/* Main product card */}
            <div className="bg-white rounded-xl border border-[#dde4ef] shadow-[0_1px_12px_rgba(7,30,61,0.05)] overflow-hidden">
              {/* CHANGED: flex-col on mobile, flex-row on desktop */}
              <div className="flex flex-col md:flex-row">
                {/* Gallery */}
                <ImageGallery images={displayImages} alt={display?.name || product.name} />

                {/* Details */}
                <div className="flex-1 p-4 md:p-7 flex flex-col">
                  {isGroup && (
                    <div className="inline-flex items-center gap-1.5 bg-[#eef6ff] border border-[#bdd9f5] text-[#0a4c8a] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 self-start">
                      {variants.length} Varyant
                    </div>
                  )}

                  <h1 className="font-condensed text-[22px] md:text-[28px] font-extrabold uppercase text-[#071e3d] leading-tight">
                    {display?.name || product.name}
                  </h1>
                  {isGroup && display && display.name !== product.name && (
                    <p className="text-[12px] text-[#9aa3af] mt-1">{product.name}</p>
                  )}

                  {(display?.description || product.description) && (
                    <p className="text-[13px] text-[#6b7380] leading-relaxed mt-4 pt-4 border-t border-[#f0f3f8]">
                      {display?.description || product.description}
                    </p>
                  )}

                  {/* {display?.price && (
                    <div className="mt-4 py-3 border-t border-[#f0f3f8]">
                      <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9aa3af]">
                        Birim Fiyat
                      </span>
                      <div className="text-[32px] font-extrabold text-[#071e3d] leading-none mt-0.5">
                        ₺{display.price}
                      </div>
                    </div>
                  )} */}

                  {/* Specs */}
                  {display?.details && Object.keys(display.details).length > 0 && (
                    <div className="mt-4">
                      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9aa3af] mb-2 flex items-center gap-2">
                        <span className="block w-4 h-px bg-[#1e88e5]" />
                        Özellikler
                      </div>
                      <div className="border border-[#dde4ef] rounded-lg overflow-hidden">
                        {Object.entries(display.details).map(([key, value], i) => (
                          <div
                            key={key}
                            className={`flex text-[12px] ${i > 0 ? "border-t border-[#dde4ef]" : ""}`}
                          >
                            <div className="w-2/5 px-4 py-2 bg-[#f8fafc] font-semibold text-[#071e3d] uppercase tracking-wide text-[11px]">
                              {key}
                            </div>
                            <div className="w-3/5 px-4 py-2 text-[#4a5568]">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variant selector */}
                  {isGroup && variants.length > 0 && (
                    <div className="mt-5">
                      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9aa3af] mb-3 flex items-center gap-2">
                        <span className="block w-4 h-px bg-[#1e88e5]" />
                        Varyant Seçin
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => {
                          const isSelected = selectedVariant?.id === variant.id;
                          const vImg =
                            Array.isArray(variant.images) && variant.images.length
                              ? variant.images[0]
                              : variant.image || null;
                          return (
                            <button
                              key={variant.id}
                              onClick={() => handleVariantClick(variant)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all
                                ${isSelected
                                  ? "border-[#0a4c8a] bg-[#eef6ff]"
                                  : "border-[#dde4ef] bg-white hover:border-[#0a4c8a]/40"
                                }`}
                            >
                              {vImg && (
                                <div className="w-9 h-9 rounded border border-[#dde4ef] overflow-hidden shrink-0">
                                  <img src={vImg} alt={variant.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div>
                                <p
                                  className={`text-[11px] font-bold uppercase tracking-wide leading-tight ${
                                    isSelected ? "text-[#0a4c8a]" : "text-[#071e3d]"
                                  }`}
                                >
                                  {variant.name}
                                </p>
                                {variant.price && (
                                  <p className="text-[10px] text-[#9aa3af] mt-0.5">₺{variant.price}</p>
                                )}
                              </div>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#0a4c8a] flex items-center justify-center ml-1 shrink-0">
                                  <svg viewBox="0 0 24 24" fill="white" width="9" height="9">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => router.back()}
                    className="mt-auto pt-5 self-start text-[11px] font-bold tracking-widest uppercase text-[#9aa3af] hover:text-[#071e3d] transition-colors flex items-center gap-1.5"
                  >
                    ← Geri
                  </button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contact#form"
              className="mt-4 flex items-center justify-between bg-[#071e3d] text-white px-4 py-3 md:px-7 md:py-4 rounded-xl hover:bg-[#0a2d5a] transition-colors group no-underline"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#1e88e5] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <p className="text-[12px] md:text-[13px] font-medium text-white/90">
                  İlgili ürüne dair teklif almak ya da özel taleplerinizi iletmek için tıklayınız.
                </p>
              </div>
              <svg
                viewBox="0 0 24 24" fill="white" width="18" height="18"
                className="shrink-0 ml-4 md:ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </Link>

            {/* Recommended */}
            {recommended.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-1">
                  <span className="block w-5 h-px bg-[#1e88e5]" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">
                    {sectorName} Sektöründen
                  </span>
                </div>
                <h2 className="font-condensed text-[22px] font-extrabold uppercase text-[#071e3d] mb-5">
                  Bunları da Beğenebilirsiniz
                </h2>
                {/* CHANGED: 2 cols on mobile, 3 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recommended.map((rec) => {
                    const recImg =
                      Array.isArray(rec.images) && rec.images.length
                        ? rec.images[0]
                        : rec.image || null;
                    return (
                      <Link
                        key={rec.id}
                        href={`/products/${rec.id}`}
                        className="group bg-white rounded-xl border border-[#dde4ef] overflow-hidden hover:border-[#0a4c8a] hover:shadow-[0_4px_20px_rgba(10,76,138,0.1)] transition-all duration-200 no-underline"
                      >
                        <div className="h-28 md:h-36 bg-[#f8fafc] flex items-center justify-center overflow-hidden border-b border-[#dde4ef]">
                          {recImg ? (
                            <img
                              src={recImg}
                              alt={rec.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="28" height="28">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                            </svg>
                          )}
                        </div>
                        <div className="p-3 md:p-4">
                          {rec.isGroup && (
                            <span className="inline-block text-[9px] font-bold tracking-widest uppercase text-[#0a4c8a] bg-[#eef6ff] px-2 py-0.5 rounded mb-2">
                              Seri
                            </span>
                          )}
                          <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight line-clamp-2 group-hover:text-[#0a4c8a] transition-colors mb-2">
                            {rec.name}
                          </h3>
                          {rec.description && (
                            <p className="text-[11px] text-[#9aa3af] line-clamp-2 leading-relaxed">
                              {rec.description}
                            </p>
                          )}
                          <div className="mt-3 pt-3 border-t border-[#f0f3f8] flex items-center justify-between">
                            {rec.price ? (
                              <span className="text-[13px] font-extrabold text-[#071e3d]">₺{rec.price}</span>
                            ) : (
                              <span className="text-[11px] text-[#9aa3af]">
                                {rec._count?.subProducts ?? 0} varyant
                              </span>
                            )}
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#1e88e5] flex items-center gap-1">
                              Gör
                              <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}