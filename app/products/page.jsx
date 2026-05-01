"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import ProductsSidebar from "../components/ProductSidebar";
import ProductsGrid from "../components/ProductsGrid";

const API = process.env.NEXT_PUBLIC_API_URL;

const SECTOR_PARAM_MAP = {
  restoran: ["restoran", "restaurant", "restorant"],
  kafe:     ["kafe", "cafe", "kafé"],
  otel:     ["otel", "hotel"],
  kurum:    ["kurum", "resmi kurum", "resmi", "government", "kurumsal"],
  medikal:  ["medikal", "medical", "sağlık"],
  endustri: ["endustri", "endüstri", "endüstriyel", "industrial", "industry"],
};

function matchSector(list, param) {
  if (!param) return null;
  const p = param.toLowerCase();
  let match = list.find((s) => s.slug === p);
  if (match) return match;
  const aliases = SECTOR_PARAM_MAP[p] || [p];
  match = list.find((s) => aliases.includes(s.name.toLowerCase().trim()));
  if (match) return match;
  return list.find((s) => s.name.toLowerCase().includes(p)) || null;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");

  const [sectors, setSectors]                   = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [activeSector, setActiveSector]         = useState(null);
  const [products, setProducts]                 = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsLoading, setProductsLoading]   = useState(false);
  const [layer, setLayer]                       = useState(1);
  const [breadcrumbs, setBreadcrumbs]           = useState([]);
  const [search, setSearch]                     = useState("");
  const [isGeneralActive, setIsGeneralActive]   = useState(false);
  const [generalProducts, setGeneralProducts]   = useState(null);
  const fetchedRef = useRef(false);

  // ── initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const res  = await fetch(`${API}/api/public/sectors`);
        const list = await res.json();
        const data = Array.isArray(list) ? list : [];
        setSectors(data);
        if (data.length === 0) return;
        const initial = sectorParam ? (matchSector(data, sectorParam) ?? data[0]) : data[0];
        await loadSectorProducts(initial, data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  // ── search filter ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!search.trim()) setFilteredProducts(products);
    else setFilteredProducts(products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  // ── load sector products ───────────────────────────────────────────────────
  async function loadSectorProducts(sector, sectorList = sectors) {
    setIsGeneralActive(false);
    setGeneralProducts(null);
    setActiveSector(sector);
    setSearch("");
    setLayer(1);
    setBreadcrumbs([{ label: sector.name, id: sector.id, type: "sector", layer: 1 }]);
    setProductsLoading(true);
    try {
      const res  = await fetch(`${API}/api/public/sector-products?sectorId=${sector.id}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setProductsLoading(false); }
  }

  // ── drill into group ───────────────────────────────────────────────────────
  async function loadGroupProducts(group, chain, nextLayer) {
    setSearch("");
    setLayer(nextLayer);
    setBreadcrumbs([...chain, { label: group.name, id: group.id, type: "group", layer: nextLayer }]);
    setProductsLoading(true);
    try {
      const res  = await fetch(`${API}/api/public/products?parentId=${group.id}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setProductsLoading(false); }
  }

  // ── general (all products) ─────────────────────────────────────────────────
  async function handleSelectGeneral() {
    setIsGeneralActive(true);
    setActiveSector(null);
    setBreadcrumbs([]);
    setSearch("");
    setProducts([]);
    setFilteredProducts([]);
    try {
      const res  = await fetch(`${API}/api/product-sectors/all-products`);
      const data = await res.json();
      setGeneralProducts(Array.isArray(data) ? data : []);
    } catch (e) { setGeneralProducts([]); }
  }

  // ── product card click ─────────────────────────────────────────────────────
  const handleProductClick = useCallback((product) => {
    if (product.isGroup && layer < 3) {
      loadGroupProducts(product, breadcrumbs, layer + 1);
    } else {
      router.push(`/products/${product.id}`);
    }
  }, [layer, breadcrumbs]);

  // ── breadcrumb click ───────────────────────────────────────────────────────
  const handleBreadcrumbClick = useCallback((crumb, index) => {
    const chain = breadcrumbs.slice(0, index);
    if (crumb.type === "sector") {
      loadSectorProducts({ id: crumb.id, name: crumb.label });
    } else {
      loadGroupProducts({ id: crumb.id, name: crumb.label }, chain, crumb.layer);
    }
  }, [breadcrumbs]);

  const context = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* page header */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            HIZLI TESLİMAT
          </div>
          <h1 className="font-condensed text-[34px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            KALİTELİ ÜRETİM
          </h1>
          <p className="text-[13px] text-[#9aa3af] mt-1">
            Tüm sektörlere yönelik ambalaj çözümlerimizin tamamını inceleyin.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex gap-8 items-start">

          <ProductsSidebar
            sectors={sectors}
            loading={loading}
            activeSectorId={activeSector?.id ?? null}
            isGeneralActive={isGeneralActive}
            onSelectSector={loadSectorProducts}
            onSelectGeneral={handleSelectGeneral}
          />

          <div className="flex-1 min-w-0">

            {/* search */}
            <div className="relative mb-3">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0b8c4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={context ? `${context.label} içinde ara...` : "Ara..."}
                disabled={!context && !isGeneralActive}
                className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#dde4ef] rounded-lg bg-white text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            {/* breadcrumbs */}
            {breadcrumbs.length > 1 && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#9aa3af] mb-5 flex-wrap">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[#dde4ef]">›</span>}
                    {i === breadcrumbs.length - 1 ? (
                      <span className="text-[#071e3d] font-semibold">{crumb.label}</span>
                    ) : (
                      <button onClick={() => handleBreadcrumbClick(crumb, i)} className="hover:text-[#0a4c8a] hover:underline transition-colors">
                        {crumb.label}
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* general view */}
            {isGeneralActive && (
              <ProductsGrid
                products={generalProducts ?? []}
                loading={generalProducts === null}
                context={{ label: "Tüm Ürünler" }}
                layer={1}
                search={search}
                onProductClick={handleProductClick}
              />
            )}

            {/* sector products */}
            {!isGeneralActive && (
              <ProductsGrid
                products={filteredProducts}
                loading={productsLoading}
                context={context}
                layer={layer}
                search={search}
                onProductClick={handleProductClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center">
        <div className="text-[#9aa3af] text-sm">Loading...</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}