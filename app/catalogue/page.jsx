"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import ProductsGrid from "../components/ProductsGrid";
import { useLanguage } from "../context/LanguageContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const SECTOR_PARAM_MAP = {
  restoran: ["restoran", "restaurant", "restorant"],
  kafe:     ["kafe", "cafe", "kafé"],
  otel:     ["otel", "hotel"],
  kurum:    ["kurum", "resmi kurum", "resmi", "government", "kurumsal"],
  medikal:  ["medikal", "medical", "sağlık"],
  endustri: ["endustri", "endüstri", "endüstriyel", "industrial", "industry"],
};

const SECTOR_COLORS = [
  { from: "#2c1810", to: "#7a4520" },
  { from: "#1a0e06", to: "#6b3d18" },
  { from: "#0a1628", to: "#2a5080" },
  { from: "#0e1422", to: "#2a3a60" },
  { from: "#081e2a", to: "#186080" },
  { from: "#141814", to: "#3a4a2a" },
];

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

function CatalogueContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");

  const [sectors, setSectors]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeSector, setActiveSector] = useState(null);
  const [products, setProducts]         = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsLoading, setProductsLoading]   = useState(false);
  const [layer, setLayer]               = useState(1);
  const [context, setContext]           = useState(null);
  const [breadcrumbs, setBreadcrumbs]   = useState([]);
  const [search, setSearch]             = useState("");
  const fetchedRef = useRef(false);

  const loadSectorProducts = useCallback(async (sector) => {
    setSearch("");
    setLayer(1);
    setActiveSector(sector);
    setContext({ type: "sector", id: sector.id, label: sector.name });
    setBreadcrumbs([{ label: sector.name, id: sector.id, type: "sector", layer: 1 }]);
    setProductsLoading(true);
    try {
      const res  = await fetch(`${API}/api/public/sector-products?sectorId=${sector.id}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (e) { console.error(e); }
    finally { setProductsLoading(false); }
  }, []);

  const loadGroupProducts = useCallback(async (group, chain, nextLayer) => {
    setSearch("");
    setLayer(nextLayer);
    setContext({ type: "group", id: group.id, label: group.name });
    setBreadcrumbs([...chain, { label: group.name, id: group.id, type: "group", layer: nextLayer }]);
    setProductsLoading(true);
    try {
      const res  = await fetch(`${API}/api/public/products?parentId=${group.id}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (e) { console.error(e); }
    finally { setProductsLoading(false); }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const res  = await fetch(`${API}/api/public/sectors`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setSectors(list);
        if (list.length === 0) return;
        const initial = sectorParam ? (matchSector(list, sectorParam) ?? list[0]) : list[0];
        await loadSectorProducts(initial);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [loadSectorProducts]);

  useEffect(() => {
    if (!search.trim()) setFilteredProducts(products);
    else setFilteredProducts(products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  const handleProductClick = useCallback((product) => {
    if (product.isGroup && layer < 3) {
      loadGroupProducts(product, breadcrumbs, layer + 1);
    } else {
      router.push(`/products/${product.id}`);
    }
  }, [layer, breadcrumbs, loadGroupProducts, router]);

  const handleBreadcrumbClick = useCallback((crumb, index) => {
    const chain = breadcrumbs.slice(0, index);
    if (crumb.type === "sector") {
      loadSectorProducts({ id: crumb.id, name: crumb.label });
    } else {
      loadGroupProducts({ id: crumb.id, name: crumb.label }, chain, crumb.layer);
    }
  }, [breadcrumbs, loadSectorProducts, loadGroupProducts]);

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Header */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-1">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            {t.fast_delivery}
          </div>
          <h1 className="font-condensed text-[28px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            {t.quality_prod}
          </h1>
          <p className="text-[13px] text-[#9aa3af] mt-1">{t.page_subtitle}</p>
        </div>

        {/* Sector card tabs */}
        <div className="max-w-5xl mx-auto px-8 pb-5">
          {loading ? (
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-28 w-24 bg-[#eef1f6] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center items-end">
              {sectors.map((sector, idx) => {
                const isActive = activeSector?.id === sector.id;
                const colors = SECTOR_COLORS[idx % SECTOR_COLORS.length];
                return (
                  <div
                    key={sector.id}
                    onClick={() => loadSectorProducts(sector)}
                    className="cursor-pointer flex-shrink-0"
                    style={{
                      width: isActive ? "105px" : "95px",
                      transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                      transform: isActive ? "scale(1.05) translateY(-4px)" : "scale(1) translateY(0px)",
                      opacity: activeSector && !isActive ? 0.85 : 1,
                      position: "relative",
                      zIndex: isActive ? 10 : 1,
                    }}
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${isActive ? "border-[#1e88e5]" : "border-[#dde4ef]"}`}
                      style={{ aspectRatio: "4/5" }}
                    >
                      {sector.image
                        ? <img src={sector.image} alt={sector.name} className="absolute inset-0 w-full h-full object-cover" />
                        : <div className="absolute inset-0 bg-[#dde4ef]" />
                      }
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(160deg, ${colors.from} 0%, ${colors.to} 100%)`,
                          opacity: isActive ? 0.5 : 0.4,
                        }}
                      />
                      {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e88e5]" />}
                    </div>
                    <p
                      className={`text-center mt-1.5 tracking-wide uppercase transition-colors duration-200 ${isActive ? "text-[#1e88e5]" : "text-[#4a5568]"}`}
                      style={{ fontSize: "9px", fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {sector.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#9aa3af] mb-5 flex-wrap min-h-[20px]">
          <button
            onClick={() => activeSector && loadSectorProducts(activeSector)}
            className="hover:text-[#0a4c8a] transition-colors font-medium"
          >
            {t.catalogue}
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-[#dde4ef]">›</span>
              {i === breadcrumbs.length - 1
                ? <span className="text-[#071e3d] font-semibold">{crumb.label}</span>
                : <button onClick={() => handleBreadcrumbClick(crumb, i)} className="hover:text-[#0a4c8a] hover:underline transition-colors">{crumb.label}</button>
              }
            </span>
          ))}
        </div>

        {/* Search — only when drilling into a group */}
        {layer > 1 && (
          <div className="relative mb-6 max-w-xs">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0b8c4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={context ? `${context.label} ${t.search_in}` : "..."}
              className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#dde4ef] rounded-lg bg-white text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all"
            />
          </div>
        )}

        {/* Products grid */}
        <ProductsGrid
          products={filteredProducts}
          loading={productsLoading}
          context={context}
          layer={layer}
          search={search}
          onProductClick={handleProductClick}
        />
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center">
        <div className="text-[#9aa3af] text-sm">Loading...</div>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}