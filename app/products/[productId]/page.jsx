"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import ProductsSidebar from "../../components/ProductSidebar";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [sectorsRes, productRes] = await Promise.all([
          fetch(`${API}/api/public/sectors`),
          fetch(`${API}/api/public/products/${productId}`),
        ]);
        const sectorsData = await sectorsRes.json();
        const productData = await productRes.json();

        setSectors(Array.isArray(sectorsData) ? sectorsData : []);
        setProduct(productData);

        if (productData.isGroup) {
          const subRes = await fetch(`${API}/api/public/products?parentId=${productId}`);
          const subs = await subRes.json();
          setVariants(Array.isArray(subs) ? subs : []);
          if (subs.length > 0) {
            const firstRes = await fetch(`${API}/api/public/products/${subs[0].id}`);
            setSelectedVariant(await firstRes.json());
          }
        }

        const categoryId = productData.categories?.[0]?.categoryId;
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
    fetchAll();
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

  function handleCategorySelect(id) {
    router.push(`/products?categoryId=${id}`);
  }

  const isGroup = product?.isGroup;
  const display = isGroup ? selectedVariant : product;
  const breadcrumbCat = product?.categories?.[0];
  const sector = breadcrumbCat?.category?.sector;
  const category = breadcrumbCat?.category;

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Page header — matches products page */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            {/* <span className="block w-5 h-px bg-[#1e88e5]" /> */}
            Our Catalogue
          </div>
          {/* Breadcrumb */}
          {/* <div className="flex items-center gap-1.5 text-[12px] text-[#9aa3af] flex-wrap">
            <Link href="/products" className="hover:text-[#0a4c8a] transition-colors font-medium">All Products</Link>
            {sector && (
              <>
                <span className="text-[#dde4ef]">›</span>
                <span className="text-[#6b7380]">{sector.name}</span>
              </>
            )}
            {category && (
              <>
                <span className="text-[#dde4ef]">›</span>
                <Link href={`/products`} className="text-[#6b7380] hover:text-[#0a4c8a] transition-colors">
                  {category.name}
                </Link>
              </>
            )}
            {isGroup && (
              <>
                <span className="text-[#dde4ef]">›</span>
                <span className="text-[#6b7380]">{product?.name}</span>
              </>
            )}
            <span className="text-[#dde4ef]">›</span>
            <span className="text-[#071e3d] font-semibold">{display?.name || product?.name}</span>
          </div> */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          {/* <ProductsSidebar
            sectors={sectors}
            loading={loading}
            activeId={category?.id}
            onSelectCategory={handleCategorySelect}
          /> */}

          {/* Main content area */}
          <div className="flex-1 min-w-0">

            {loading ? (
              <div className="bg-white rounded-xl border border-[#dde4ef] p-8 animate-pulse">
                <div className="flex gap-8">
                  <div className="w-64 h-64 bg-[#f4f6fa] rounded-lg shrink-0" />
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-6 bg-[#f4f6fa] rounded w-3/4" />
                    <div className="h-4 bg-[#f4f6fa] rounded" />
                    <div className="h-4 bg-[#f4f6fa] rounded w-2/3" />
                  </div>
                </div>
              </div>
            ) : !product ? (
              <div className="bg-white rounded-xl border border-[#dde4ef] p-12 text-center">
                <p className="text-[#9aa3af] text-sm">Product not found.</p>
                <Link href="/products" className="mt-3 inline-block text-[#1e88e5] text-sm font-semibold">← Back to Products</Link>
              </div>
            ) : (
              <>
                {/* Product card */}
                <div className="bg-white rounded-xl border border-[#dde4ef] shadow-[0_1px_12px_rgba(7,30,61,0.05)] overflow-hidden">
                  <div className="flex">

                    {/* Image */}
                    <div className="w-72 shrink-0 bg-[#f8fafc] border-r border-[#dde4ef] flex items-center justify-center" style={{ minHeight: "320px" }}>
                      {display?.image || product.image ? (
                        <img
                          src={display?.image || product.image}
                          alt={display?.name || product.name}
                          className="w-full h-full object-cover"
                          style={{ maxHeight: "380px" }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#dde4ef]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" width="48" height="48">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                          </svg>
                          <p className="text-[10px] tracking-widest uppercase">No image</p>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-7 flex flex-col">
                      {isGroup && (
                        <div className="inline-flex items-center gap-1.5 bg-[#eef6ff] border border-[#bdd9f5] text-[#0a4c8a] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 self-start">
                          {variants.length} Variants Available
                        </div>
                      )}

                      <h1 className="font-condensed text-[28px] font-extrabold uppercase text-[#071e3d] leading-tight">
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

                      {display?.price && (
                        <div className="mt-4 py-3 border-t border-[#f0f3f8]">
                          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9aa3af]">Unit Price</span>
                          <div className="text-[32px] font-extrabold text-[#071e3d] leading-none mt-0.5">
                            ₹{display.price}
                          </div>
                        </div>
                      )}

                      {/* Specs */}
                      {display?.details && Object.keys(display.details).length > 0 && (
                        <div className="mt-4">
                          <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9aa3af] mb-2 flex items-center gap-2">
                            <span className="block w-4 h-px bg-[#1e88e5]" />
                            Specifications
                          </div>
                          <div className="border border-[#dde4ef] rounded-lg overflow-hidden">
                            {Object.entries(display.details).map(([key, value], i) => (
                              <div key={key} className={`flex text-[12px] ${i > 0 ? "border-t border-[#dde4ef]" : ""}`}>
                                <div className="w-2/5 px-4 py-2 bg-[#f8fafc] font-semibold text-[#071e3d] uppercase tracking-wide text-[11px]">{key}</div>
                                <div className="w-3/5 px-4 py-2 text-[#4a5568]">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Variants */}
                      {isGroup && variants.length > 0 && (
                        <div className="mt-5">
                          <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#9aa3af] mb-3 flex items-center gap-2">
                            <span className="block w-4 h-px bg-[#1e88e5]" />
                            Select Variant
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {variants.map((variant) => {
                              const isSelected = selectedVariant?.id === variant.id;
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
                                  {variant.image && (
                                    <div className="w-9 h-9 rounded border border-[#dde4ef] overflow-hidden shrink-0">
                                      <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <p className={`text-[11px] font-bold uppercase tracking-wide leading-tight ${isSelected ? "text-[#0a4c8a]" : "text-[#071e3d]"}`}>
                                      {variant.name}
                                    </p>
                                    {variant.price && <p className="text-[10px] text-[#9aa3af] mt-0.5">₹{variant.price}</p>}
                                  </div>
                                  {isSelected && (
                                    <div className="w-4 h-4 rounded-full bg-[#0a4c8a] flex items-center justify-center ml-1 shrink-0">
                                      <svg viewBox="0 0 24 24" fill="white" width="9" height="9"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
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
                        ← Back
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/contact#form"
                  className="mt-4 flex items-center justify-between bg-[#071e3d] text-white px-7 py-4 rounded-xl hover:bg-[#0a2d5a] transition-colors group no-underline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1e88e5] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <p className="text-[13px] font-medium text-white/90">
                      İlgili ürüne dair teklif almak ya da özel taleplerinizi iletmek için tıklayınız.
                    </p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="white" width="18" height="18" className="shrink-0 ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                  </svg>
                </Link>

                {/* Recommended */}
                {recommended.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="block w-5 h-px bg-[#1e88e5]" />
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">From the Same Category</span>
                    </div>
                    <h2 className="font-condensed text-[22px] font-extrabold uppercase text-[#071e3d] mb-5">
                      You May Also Like
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                      {recommended.map((rec) => (
                        <Link
                          key={rec.id}
                          href={`/products/${rec.id}`}
                          className="group bg-white rounded-xl border border-[#dde4ef] overflow-hidden hover:border-[#0a4c8a] hover:shadow-[0_4px_20px_rgba(10,76,138,0.1)] transition-all duration-200 no-underline"
                        >
                          {/* Image */}
                          <div className="h-36 bg-[#f8fafc] flex items-center justify-center overflow-hidden border-b border-[#dde4ef]">
                            {rec.image
                              ? <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              : <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                            }
                          </div>

                          {/* Info */}
                          <div className="p-4">
                            {rec.isGroup && (
                              <span className="inline-block text-[9px] font-bold tracking-widest uppercase text-[#0a4c8a] bg-[#eef6ff] px-2 py-0.5 rounded mb-2">
                                Series
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
                              {rec.price
                                ? <span className="text-[13px] font-extrabold text-[#071e3d]">₹{rec.price}</span>
                                : <span className="text-[11px] text-[#9aa3af]">{rec._count?.subProducts ?? 0} variants</span>
                              }
                              <span className="text-[10px] font-bold tracking-widest uppercase text-[#1e88e5] flex items-center gap-1">
                                View
                                <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}