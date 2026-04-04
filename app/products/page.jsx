"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import ProductsSidebar from "../components/ProductSidebar";
import ProductsGrid from "../components/ProductsGrid";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsPage() {
  const router = useRouter();

  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState(3);
  const [context, setContext] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchSectors() {
      try {
        const res = await fetch(`${API}/api/public/sectors`);
        const data = await res.json();
        setSectors(Array.isArray(data) ? data : []);
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

  async function loadProducts(type, id, label, chain = [], currentLayer = 3) {
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
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  }

  function handleProductClick(product) {
    if (layer === 3 && product.isGroup) {
      loadProducts("group", product.id, product.name, breadcrumbs, 4);
    } else {
      router.push(`/products/${product.id}`);
    }
  }

  function handleBreadcrumbClick(crumb, index) {
    const newChain = breadcrumbs.slice(0, index);
    if (crumb.type === "sector") {
      // clicking sector just resets — sectors don't have products directly
      setContext(null);
      setProducts([]);
      setFilteredProducts([]);
      setBreadcrumbs([]);
      setLayer(3);
    } else {
      loadProducts(crumb.type, crumb.id, crumb.label, newChain, crumb.layer);
    }
  }

  function handleCategorySelect(id, label, chain) {
    setLayer(3);
    loadProducts("category", id, label, chain, 3);
  }

  function resetAll() {
    setContext(null);
    setProducts([]);
    setFilteredProducts([]);
    setBreadcrumbs([]);
    setLayer(3);
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Page header */}
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
            onSelectCategory={handleCategorySelect}
          />

          <div className="flex-1 min-w-0">
            {/* Search */}
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

            {/* Breadcrumbs */}
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
                        <button
                          onClick={() => handleBreadcrumbClick(crumb, i)}
                          className="hover:text-[#0a4c8a] hover:underline transition-colors"
                        >
                          {crumb.label}
                        </button>
                      )}
                    </span>
                  ))}
                </>
              )}
            </div>

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
      </div>
    </div>
  );
}