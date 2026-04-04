"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/public/products/${productId}`);
        const data = await res.json();
        setProduct(data);

        if (data.isGroup) {
          const subRes = await fetch(`${API}/api/public/products?parentId=${productId}`);
          const subs = await subRes.json();
          setVariants(Array.isArray(subs) ? subs : []);
          if (subs.length > 0) {
            const firstRes = await fetch(`${API}/api/public/products/${subs[0].id}`);
            setSelectedVariant(await firstRes.json());
          }
        }

        const categoryId = data.categories?.[0]?.categoryId;
        if (categoryId) {
          const recRes = await fetch(`${API}/api/public/products?categoryId=${categoryId}`);
          const recData = await recRes.json();
          setRecommended(
            Array.isArray(recData)
              ? recData.filter((p) => p.id !== productId).slice(0, 6)
              : []
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  async function handleVariantClick(variant) {
    if (selectedVariant?.id === variant.id) return;
    setSelectedVariant(null);
    try {
      const res = await fetch(`${API}/api/public/products/${variant.id}`);
      setSelectedVariant(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fa]">
        <Navbar />
        <div className="pt-[66px]">
          <div className="max-w-5xl mx-auto px-8 py-12 animate-pulse">
            <div className="h-3 bg-[#e8ecf2] rounded w-64 mb-10" />
            <div className="grid grid-cols-2 gap-10">
              <div className="aspect-square bg-[#e8ecf2] rounded-2xl" />
              <div className="flex flex-col gap-4 pt-2">
                <div className="h-7 bg-[#e8ecf2] rounded w-3/4" />
                <div className="h-4 bg-[#e8ecf2] rounded" />
                <div className="h-4 bg-[#e8ecf2] rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f4f6fa]">
        <Navbar />
        <div className="pt-[66px] flex flex-col items-center justify-center py-32">
          <p className="text-[#9aa3af]">Product not found.</p>
          <Link href="/products" className="mt-4 text-[#1e88e5] text-sm font-semibold">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const isGroup = product.isGroup;
  const display = isGroup ? selectedVariant : product;
  const breadcrumbCat = product.categories?.[0];
  const sector = breadcrumbCat?.category?.sector;
  const category = breadcrumbCat?.category;

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      <div className="pt-[66px]">

        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-[#dde4ef]">
          <div className="max-w-5xl mx-auto px-8 py-3 flex items-center gap-2 text-[11px] text-[#9aa3af] flex-wrap">
            <Link href="/products" className="hover:text-[#0a4c8a] transition-colors font-medium">Products</Link>
            {sector && <><span className="text-[#dde4ef]">›</span><span>{sector.name}</span></>}
            {category && <><span className="text-[#dde4ef]">›</span><span>{category.name}</span></>}
            {isGroup && <><span className="text-[#dde4ef]">›</span><span>{product.name}</span></>}
            <span className="text-[#dde4ef]">›</span>
            <span className="text-[#071e3d] font-semibold">{display?.name || product.name}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-10">

          {/* Product card */}
          <div className="bg-white rounded-2xl border border-[#dde4ef] shadow-[0_2px_24px_rgba(7,30,61,0.06)] overflow-hidden">
            <div className="flex gap-0">

              {/* Image */}
              <div className="w-[420px] shrink-0 bg-[#f4f6fa] border-r border-[#dde4ef] flex items-center justify-center" style={{ minHeight: "420px" }}>
                {display?.image || product.image ? (
                  <img
                    src={display?.image || product.image}
                    alt={display?.name || product.name}
                    className="w-full h-full object-cover"
                    style={{ maxHeight: "420px" }}
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="0.8" width="64" height="64">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                  </svg>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-8 flex flex-col">
                {isGroup && (
                  <div className="inline-flex items-center gap-1.5 bg-[#f0f7ff] border border-[#bdd9f5] text-[#1e88e5] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 self-start">
                    {variants.length} Variants Available
                  </div>
                )}

                <h1 className="font-condensed text-[32px] font-extrabold uppercase text-[#071e3d] leading-tight mb-1">
                  {display?.name || product.name}
                </h1>
                {isGroup && display && display.name !== product.name && (
                  <p className="text-[13px] text-[#9aa3af] mb-4">{product.name}</p>
                )}

                {(display?.description || product.description) && (
                  <p className="text-[13px] text-[#6b7380] leading-relaxed mt-4 pb-4 border-b border-[#f0f3f8]">
                    {display?.description || product.description}
                  </p>
                )}

                {display?.price && (
                  <div className="mt-4 mb-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af]">Price</span>
                    <div className="text-[36px] font-extrabold text-[#071e3d] leading-none mt-0.5">
                      ₹{display.price}
                    </div>
                  </div>
                )}

                {/* Specs */}
                {display?.details && Object.keys(display.details).length > 0 && (
                  <div className="mt-4 flex-1">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af] mb-3 flex items-center gap-2">
                      <span className="block w-4 h-0.5 bg-[#1e88e5]" />
                      Specifications
                    </div>
                    <div className="border border-[#dde4ef] rounded-xl overflow-hidden">
                      {Object.entries(display.details).map(([key, value], i) => (
                        <div key={key} className={`flex text-[12px] ${i > 0 ? "border-t border-[#dde4ef]" : ""}`}>
                          <div className="w-2/5 px-4 py-2.5 bg-[#f8fafc] font-semibold text-[#071e3d] uppercase tracking-wide text-[11px]">
                            {key}
                          </div>
                          <div className="w-3/5 px-4 py-2.5 text-[#4a5568]">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants */}
                {isGroup && variants.length > 0 && (
                  <div className="mt-6">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#9aa3af] mb-3 flex items-center gap-2">
                      <span className="block w-4 h-0.5 bg-[#1e88e5]" />
                      Select Variant
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantClick(variant)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all duration-150
                              ${isSelected
                                ? "border-[#1e88e5] bg-[#f0f7ff]"
                                : "border-[#dde4ef] bg-white hover:border-[#1e88e5]/50 hover:bg-[#f8fbff]"
                              }`}
                          >
                            {variant.image && (
                              <div className="w-10 h-10 rounded-md border border-[#dde4ef] overflow-hidden shrink-0">
                                <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <p className={`text-[11px] font-bold uppercase tracking-wide leading-tight ${isSelected ? "text-[#1e88e5]" : "text-[#071e3d]"}`}>
                                {variant.name}
                              </p>
                              {variant.price && (
                                <p className="text-[10px] text-[#9aa3af]">₹{variant.price}</p>
                              )}
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#1e88e5] flex items-center justify-center ml-1 shrink-0">
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
                  className="mt-6 self-start inline-flex items-center gap-2 border border-[#dde4ef] text-[#6b7380] px-5 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase hover:border-[#071e3d] hover:text-[#071e3d] transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <Link
            href="/contact#form"
            className="mt-6 flex items-center justify-between bg-[#071e3d] text-white px-8 py-5 rounded-xl hover:bg-[#0a2d5a] transition-colors group no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1e88e5] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <p className="text-[13px] font-medium leading-relaxed text-white/90 max-w-xl">
                İlgili ürüne dair teklif almak ya da özel taleplerinizi iletmek için tıklayınız.
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20" className="shrink-0 ml-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </Link>

          {/* Recommended */}
          {recommended.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-2">
                <span className="block w-6 h-0.5 bg-[#1e88e5]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#1e88e5]">
                  From the Same Category
                </span>
              </div>
              <h2 className="font-condensed text-[26px] font-extrabold uppercase text-[#071e3d] mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {recommended.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/products/${rec.id}`}
                    className="group rounded-xl border border-[#dde4ef] bg-white overflow-hidden hover:border-[#1e88e5] hover:shadow-[0_6px_24px_rgba(30,136,229,0.1)] transition-all duration-200 no-underline"
                  >
                    <div className="h-28 bg-[#f4f6fa] flex items-center justify-center overflow-hidden">
                      {rec.image
                        ? <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                      }
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight line-clamp-2 group-hover:text-[#1e88e5] transition-colors">
                        {rec.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}