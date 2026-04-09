"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import ProductsGrid from "../components/ProductsGrid";

const API = process.env.NEXT_PUBLIC_API_URL;

const SECTOR_PARAM_MAP = {
  restoran: ['restoran', 'restaurant', 'restorant'],
  kafe: ['kafe', 'cafe', 'kafé'],
  otel: ['otel', 'hotel'],
  kurum: ['kurum', 'resmi kurum', 'resmi', 'government', 'kurumsal'],
  medikal: ['medikal', 'medical', 'sağlık'],
  endustri: ['endustri', 'endüstri', 'endüstriyel', 'industrial', 'industry'],
};

function matchSector(list, param) {
  if (!param) return null;
  const p = param.toLowerCase();
  let match = list.find((s) => s.slug === p);
  if (match) return match;
  const aliases = SECTOR_PARAM_MAP[p] || [p];
  match = list.find((s) => aliases.includes(s.name.toLowerCase().replace(/\s+/g, ' ').trim()));
  if (match) return match;
  match = list.find((s) => s.name.toLowerCase().includes(p) || p.includes(s.name.toLowerCase().replace(/\s+/g, '')));
  return match || null;
}

function CatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");

  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState(null);
  // tabMode: 'sectors' | 'categories'
  const [tabMode, setTabMode] = useState('sectors');
  const [layer, setLayer] = useState(3);
  const [context, setContext] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [search, setSearch] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    async function fetchSectors() {
      try {
        const res = await fetch(`${API}/api/public/sectors`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setSectors(list);
        const initial = sectorParam ? matchSector(list, sectorParam) : null;
        const first = initial || (list.length > 0 ? list[0] : null);
        if (first) {
          setActiveSector(first);
          // If arrived via sector param, go straight to category tab mode
          if (initial) {
            setTabMode('categories');
            setBreadcrumbs([{ label: first.name, id: first.id, type: 'sector' }]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSectors();
  }, []);

  useEffect(() => {
    if (!search.trim()) setFilteredProducts(products);
    else setFilteredProducts(products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  const loadProducts = useCallback(async (type, id, label, chain = [], currentLayer = 3) => {
    setProductsLoading(true);
    setSearch("");
    setContext({ type, id, label });
    setLayer(currentLayer);
    setBreadcrumbs([...chain, { label, id, type, layer: currentLayer }]);
    try {
      const url = type === "category"
        ? `${API}/api/public/products?categoryId=${id}`
        : `${API}/api/public/products?parentId=${id}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setProductsLoading(false); }
  }, []);

  // Clicking a sector tab → switch tabs to categories of that sector
  const handleSectorTabClick = useCallback((sector) => {
    setActiveSector(sector);
    setTabMode('categories');
    setContext(null);
    setProducts([]);
    setFilteredProducts([]);
    setBreadcrumbs([{ label: sector.name, id: sector.id, type: 'sector' }]);
    setSearch("");
  }, []);

  // Back to sectors tab list
  const handleBackToSectors = useCallback(() => {
    setTabMode('sectors');
    setContext(null);
    setProducts([]);
    setFilteredProducts([]);
    setBreadcrumbs([]);
    setSearch("");
  }, []);

  const handleProductClick = useCallback((product) => {
    if (layer === 3 && product.isGroup) {
      loadProducts("group", product.id, product.name, breadcrumbs, 4);
    } else {
      router.push(`/products/${product.id}`);
    }
  }, [layer, breadcrumbs, loadProducts, router]);

  const handleBreadcrumbClick = useCallback((crumb, index) => {
    const newChain = breadcrumbs.slice(0, index);
    if (crumb.type === "sector") {
      setContext(null); setProducts([]); setFilteredProducts([]);
      setBreadcrumbs([{ label: crumb.label, id: crumb.id, type: 'sector' }]);
      setLayer(3); setTabMode('categories');
    } else {
      loadProducts(crumb.type, crumb.id, crumb.label, newChain, crumb.layer);
    }
  }, [breadcrumbs, loadProducts]);

  const handleCategorySelect = useCallback((id, label, chain) => {
    loadProducts("category", id, label, chain, 3);
  }, [loadProducts]);

  // Back from products to categories
  const handleBackToCategories = useCallback(() => {
    setContext(null);
    setProducts([]);
    setFilteredProducts([]);
    setLayer(3);
    setSearch("");
    setBreadcrumbs(activeSector ? [{ label: activeSector.name, id: activeSector.id, type: 'sector' }] : []);
  }, [activeSector]);

  const categories = activeSector?.categories || [];

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Header */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-1">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            HIZLI TESLİMAT
          </div>
          <h1 className="font-condensed text-[28px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            KALİTELİ ÜRETİM
          </h1>
          <p className="text-[13px] text-[#9aa3af] mt-1">
            Tüm sektörlere yönelik ambalaj çözümlerimizin tamamını inceleyin.
          </p>
        </div>

        {/* Tab buttons row — centered pill style */}
        <div className="max-w-5xl mx-auto px-8 pb-5">
          {loading ? (
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="h-9 w-24 bg-[#eef1f6] rounded-full animate-pulse" />
              ))}
            </div>
          ) : tabMode === 'sectors' ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {sectors.map((sector) => {
                const isActive = activeSector?.id === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => handleSectorTabClick(sector)}
                    className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#071e3d] text-white border-[#071e3d] shadow-md'
                        : 'bg-white text-[#4a5568] border-[#dde4ef] hover:border-[#0a4c8a] hover:text-[#0a4c8a] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    {sector.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {/* Back to sectors button */}
              <button
                onClick={handleBackToSectors}
                className="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border border-[#dde4ef] bg-[#f4f6fa] text-[#6b7380] hover:border-[#0a4c8a] hover:text-[#0a4c8a] transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
                Sektörler
              </button>
              <span className="text-[#dde4ef] text-sm">|</span>
              {categories.map((cat) => {
                const isActive = context?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id, cat.name, [{ label: activeSector.name, id: activeSector.id, type: 'sector' }])}
                    className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1e88e5] text-white border-[#1e88e5] shadow-md'
                        : 'bg-white text-[#4a5568] border-[#dde4ef] hover:border-[#1e88e5] hover:text-[#1e88e5] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Breadcrumb — always visible */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#9aa3af] mb-5 flex-wrap min-h-[20px]">
          <button onClick={handleBackToSectors} className="hover:text-[#0a4c8a] transition-colors font-medium">
            Katalog
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-[#dde4ef]">›</span>
              {i === breadcrumbs.length - 1
                ? <span className="text-[#071e3d] font-semibold">{crumb.label}</span>
                : <button onClick={() => handleBreadcrumbClick(crumb, i)} className="hover:text-[#0a4c8a] hover:underline transition-colors">{crumb.label}</button>}
            </span>
          ))}
        </div>

        {/* Search bar */}
        {context && (
          <div className="relative mb-6 max-w-xs">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0b8c4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search in ${context.label}...`}
              className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#dde4ef] rounded-lg bg-white text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all"
            />
          </div>
        )}

        {/* Back to categories button (when products are shown) */}
        {context && (
          <div className="mb-4">
            <button
              onClick={handleBackToCategories}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b7380] hover:text-[#0a4c8a] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
              Kategorilere Dön
            </button>
          </div>
        )}

        {/* Sector category grid (when no product context and in category tab mode) */}
        {!context && tabMode === 'categories' && activeSector && (
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#9aa3af] mb-4">
              {activeSector.name} — Kategoriler
            </p>
            <div className="grid grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id, cat.name, [{ label: activeSector.name, id: activeSector.id, type: "sector" }])}
                  className="group cursor-pointer rounded-xl border border-[#dde4ef] bg-white overflow-hidden hover:border-[#1e88e5] hover:shadow-[0_8px_32px_rgba(30,136,229,0.1)] transition-all duration-200"
                >
                  <div className="h-52 bg-[#f4f6fa] flex items-center justify-center overflow-hidden">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="40" height="40"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight group-hover:text-[#1e88e5] transition-colors">{cat.name}</h3>
                    <p className="text-[11px] text-[#9aa3af] mt-1.5 flex items-center gap-1">
                      Browse products
                      <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sector list (when in sector tab mode and no context) */}
        {!context && tabMode === 'sectors' && (
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#9aa3af] mb-4">
              Sektörler
            </p>
            <div className="grid grid-cols-3 gap-5">
              {sectors.map((sector) => (
                <div
                  key={sector.id}
                  onClick={() => handleSectorTabClick(sector)}
                  className="group cursor-pointer rounded-xl border border-[#dde4ef] bg-white overflow-hidden hover:border-[#1e88e5] hover:shadow-[0_8px_32px_rgba(30,136,229,0.1)] transition-all duration-200"
                >
                  <div className="h-52 bg-[#f4f6fa] flex items-center justify-center overflow-hidden">
                    {sector.image
                      ? <img src={sector.image} alt={sector.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="40" height="40"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight group-hover:text-[#1e88e5] transition-colors">{sector.name}</h3>
                    <p className="text-[11px] text-[#9aa3af] mt-1.5 flex items-center gap-1">
                      Kategorileri Gör
                      <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        {context && (
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
