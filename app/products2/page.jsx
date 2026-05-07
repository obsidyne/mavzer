"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const API = process.env.NEXT_PUBLIC_API_URL;

function GroupsContent() {
  const { t } = useLanguage();
  const router = useRouter();

  const [groups, setGroups]                 = useState([]);
  const [loading, setLoading]               = useState(true);
  const [stack, setStack]                   = useState([]);
  const [currentItems, setCurrentItems]     = useState([]);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs]       = useState([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    async function fetchGroups() {
      try {
        const res  = await fetch(`${API}/api/public/groups`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setGroups(list);
        setCurrentItems(list);
        setBreadcrumbs([]);
        setStack([{ type: "groups", items: list }]);
      } catch (err) {
        console.error(err);
        setGroups([]);
        setCurrentItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  const handleGroupClick = useCallback(async (group) => {
    if (stack.length === 1 || group.isGroup || group._count?.subProducts > 0 || group.subProducts?.length > 0) {
      setCurrentLoading(true);
      setBreadcrumbs((prev) => [...prev, { label: group.name, id: group.id }]);
      try {
        let items = [];
        if (stack.length === 1) {
          const res  = await fetch(`${API}/api/public/groups/${group.id}`);
          const data = await res.json();
          items = Array.isArray(data.products) ? data.products : [];
        } else {
          const res  = await fetch(`${API}/api/public/products/${group.id}/subproducts`);
          const data = await res.json();
          items = Array.isArray(data) ? data : [];
        }
        setCurrentItems(items);
        setStack((prev) => [...prev, { type: "subProducts", id: group.id, label: group.name, items }]);
      } catch (err) {
        setCurrentItems([]);
      } finally {
        setCurrentLoading(false);
      }
    } else {
      router.push(`/products/${group.id}`);
    }
  }, [router, stack]);

  const handleProductClick = useCallback((product) => {
    if (product.isGroup || product._count?.subProducts > 0 || product.subProducts?.length > 0) {
      handleGroupClick(product);
    } else {
      router.push(`/products/${product.id}`);
    }
  }, [handleGroupClick, router]);

  const handleBreadcrumbClick = useCallback((index) => {
    if (index < 0) {
      setCurrentItems(groups);
      setBreadcrumbs([]);
      setStack([{ type: "groups", items: groups }]);
    } else {
      const newCrumbs = breadcrumbs.slice(0, index + 1);
      const newStack  = stack.slice(0, index + 2);
      setBreadcrumbs(newCrumbs);
      setStack(newStack);
      setCurrentItems(newStack[newStack.length - 1]?.items || []);
    }
  }, [breadcrumbs, stack, groups]);

  const handleBack = useCallback(() => {
    if (stack.length <= 1) return;
    const newStack  = stack.slice(0, -1);
    const newCrumbs = breadcrumbs.slice(0, -1);
    setStack(newStack);
    setBreadcrumbs(newCrumbs);
    setCurrentItems(newStack[newStack.length - 1]?.items || []);
  }, [stack, breadcrumbs]);

  const isRoot = breadcrumbs.length === 0;

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Page header */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="font-condensed text-[24px] sm:text-[28px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            {t.nav_products}
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#9aa3af] mt-1">{t.page_subtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#9aa3af] mb-4 flex-wrap min-h-[20px]">
          <button
            onClick={() => handleBreadcrumbClick(-1)}
            className={`font-medium transition-colors ${isRoot ? "text-[#071e3d] font-semibold" : "hover:text-[#0a4c8a]"}`}
          >
            {t.nav_categories}
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-[#dde4ef]">›</span>
              {i === breadcrumbs.length - 1
                ? <span className="text-[#071e3d] font-semibold truncate max-w-[120px] sm:max-w-none">{crumb.label}</span>
                : <button onClick={() => handleBreadcrumbClick(i)} className="hover:text-[#0a4c8a] hover:underline transition-colors truncate max-w-[80px] sm:max-w-none">{crumb.label}</button>
              }
            </span>
          ))}
        </div>

        {/* Back button + count row */}
        <div className="flex items-center justify-between mb-4 gap-2">
          {!isRoot ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b7380] hover:text-[#0a4c8a] transition-colors py-1"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
              </svg>
              {t.back}
            </button>
          ) : <span />}

          <p className="text-[11px] font-bold tracking-widest uppercase text-[#9aa3af]">
            {!loading && currentItems.length > 0 && `${currentItems.length} ${t.products_label}`}
          </p>
        </div>

        {/* Grid */}
        {loading || currentLoading ? (
          /* Skeleton — square cards */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#dde4ef] bg-white overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#f4f6fa]" />
              </div>
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#dde4ef] rounded-2xl bg-white">
            <div className="w-14 h-14 rounded-2xl bg-[#f0f7ff] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="1.5" width="26" height="26">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" strokeLinecap="round" />
                <path d="M16 3H8L6 7h12l-2-4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[12px] font-bold text-[#9aa3af] uppercase tracking-widest">{t.not_found}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {currentItems.map((item) => (
              <GroupCard
                key={item.id}
                item={item}
                isRoot={isRoot}
                t={t}
                onClick={() => isRoot ? handleGroupClick(item) : handleProductClick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GroupCard({ item, isRoot, t, onClick }) {
  const hasChildren =
    item.isGroup ||
    (item._count?.subProducts > 0) ||
    (item.subProducts?.length > 0);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-[#dde4ef] bg-white overflow-hidden
                 hover:border-[#1e88e5] hover:shadow-[0_6px_24px_rgba(30,136,229,0.12)]
                 transition-all duration-200 active:scale-[0.97]"
    >
      {/* Square image area */}
      <div className="relative aspect-square bg-[#f4f6fa] overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="36" height="36">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}

        {/* Subtle gradient overlay at bottom for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* "Group" badge */}
        {(isRoot || hasChildren) && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1e88e5] border border-[#dde4ef]">
            {isRoot ? t.nav_categories : `${item._count?.subProducts ?? 0}`}
          </div>
        )}
      </div>

      {/* Name row */}
      <div className="px-3 py-2.5">
        <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight line-clamp-2 group-hover:text-[#1e88e5] transition-colors">
          {item.name}
        </h3>
        <p className="text-[10px] text-[#b0b8c4] mt-1 flex items-center gap-0.5">
          {isRoot
            ? t.nav_categories
            : hasChildren
              ? t.variants_label
              : t.view_details}
          <svg viewBox="0 0 24 24" fill="currentColor" width="9" height="9">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </p>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f6fa] flex items-center justify-center">
        <div className="text-[#9aa3af] text-sm">Loading...</div>
      </div>
    }>
      <GroupsContent />
    </Suspense>
  );
}