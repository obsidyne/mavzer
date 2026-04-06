"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import ProductsSidebar from "../components/ProductSidebar";
import ProductsGrid from "../components/ProductsGrid";

const API = process.env.NEXT_PUBLIC_API_URL;

// mapping from hero section param keys to possible sector name variations in DB
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
  // try slug first
  let match = list.find((s) => s.slug === p);
  if (match) return match;
  // try mapping
  const aliases = SECTOR_PARAM_MAP[p] || [p];
  match = list.find((s) => aliases.includes(s.name.toLowerCase().replace(/\s+/g, ' ').trim()));
  if (match) return match;
  // try partial match
  match = list.find((s) => s.name.toLowerCase().includes(p) || p.includes(s.name.toLowerCase().replace(/\s+/g, '')));
  return match || null;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");

  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState(3);
  const [context, setContext] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [search, setSearch] = useState("");
  const [autoOpenSector, setAutoOpenSector] = useState(null);
  const [sectorCategories, setSectorCategories] = useState(null);
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

        if (sectorParam && list.length > 0) {
          const matched = matchSector(list, sectorParam);
          if (matched) {
            setAutoOpenSector(matched.id);
            setSectorCategories({ sectorId: matched.id, sectorName: matched.name, categories: matched.categories || [] });
            return;
          }
        }

        // default: show first sector categories
        if (list.length > 0) {
          setSectorCategories({ sectorId: list[0].id, sectorName: list[0].name, categories: list[0].categories || [] });
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
    if (!search.trim()) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, products]);

  const loadProducts = useCallback(async (type, id, label, chain = [], currentLayer = 3) => {
    setProductsLoading(true);
    setSearch("");
    setSectorCategories(null);
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
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const handleSectorClick = useCallback((sector) => {
    setSectorCategories({ sectorId: sector.id, sectorName: sector.name, categories: sector.categories || [] });
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
      setContext(null);
      setProducts([]);
      setFilteredProducts([]);
      setBreadcrumbs([]);
      setLayer(3);
    } else {
      loadProducts(crumb.type, crumb.id, crumb.label, newChain, crumb.layer);
    }
  }, [breadcrumbs, loadProducts]);

  const handleCategorySelect = useCallback((id, label, chain) => {
    loadProducts("category", id, label, chain, 3);
  }, [loadProducts]);

  const resetAll = useCallback(() => {
    setContext(null);
    setProducts([]);
    setFilteredProducts([]);
    setBreadcrumbs([]);
    setLayer(3);
    setSearch("");
    if (sectors.length > 0) {
      setSectorCategories({ sectorId: sectors[0].id, sectorName: sectors[0].name, categories: sectors[0].categories || [] });
    }
  }, [sectors]);

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            Our Catalogue
          </div>
          <h1 className="font-condensed text-[34px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            All Products
          </h1>
          <p className="text-[13px] text-[#9aa3af] mt-1">
            Browse our full range of packaging solutions across all sectors.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex gap-8 items-start">
          <ProductsSidebar
            sectors={sectors}
            loading={loading}
            activeId={context?.id}
            autoOpenSectorId={autoOpenSector}
            onSelectCategory={handleCategorySelect}
            onSelectSector={handleSectorClick}
          />

          <div className="flex-1 min-w-0">
            <div className="relative mb-3">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0b8c4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={context ? `Search in ${context.label}...` : "Select a category to search..."}
                disabled={!context}
                className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#dde4ef] rounded-lg bg-white text-[#071e3d] placeholder:text-[#b0b8c4] outline-none focus:border-[#0a4c8a] focus:shadow-[0_0_0_3px_rgba(10,76,138,0.08)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#9aa3af] mb-5 flex-wrap min-h-[20px]">
              {breadcrumbs.length > 0 && (
                <>
                  <button onClick={resetAll} className="hover:text-[#0a4c8a] transition-colors font-medium">
                    All Products
                  </button>
                  {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="text-[#dde4ef]">›</span>
                      {i === breadcrumbs.length - 1 ? (
                        <span className="text-[#071e3d] font-semibold">{crumb.label}</span>
                      ) : (
                        <button onClick={() => handleBreadcrumbClick(crumb, i)} className="hover:text-[#0a4c8a] hover:underline transition-colors">
                          {crumb.label}
                        </button>
                      )}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Sector categories grid */}
            {sectorCategories && !context && (
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#9aa3af] mb-4">
                  {sectorCategories.sectorName} — Kategoriler
                </p>
                <div className="grid grid-cols-3 gap-5">
                  {sectorCategories.categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id, cat.name, [{ label: sectorCategories.sectorName, id: sectorCategories.sectorId, type: "sector" }])}
                      className="group cursor-pointer rounded-xl border border-[#dde4ef] bg-white overflow-hidden hover:border-[#1e88e5] hover:shadow-[0_8px_32px_rgba(30,136,229,0.1)] transition-all duration-200"
                    >
                      <div className="h-52 bg-[#f4f6fa] flex items-center justify-center overflow-hidden">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="40" height="40">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                          </svg>
                        )}
                      </div>
                      <div className="p-3.5">
                        <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight group-hover:text-[#1e88e5] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-[#9aa3af] mt-1.5 flex items-center gap-1">
                          Browse products
                          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                          </svg>
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