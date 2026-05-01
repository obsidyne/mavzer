"use client";
import { useLanguage } from "../context/LanguageContext";

export default function ProductsGrid({ products, loading, context, layer, search, onProductClick }) {
  const { t } = useLanguage();

  if (!context) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-[#dde4ef] rounded-2xl bg-white">
        <div className="w-16 h-16 rounded-2xl bg-[#f0f7ff] flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="1.5" width="28" height="28">
            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" strokeLinecap="round"/>
            <path d="M16 3H8L6 7h12l-2-4z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[13px] font-bold text-[#071e3d] uppercase tracking-widest mb-1">{t.select_sector}</p>
        <p className="text-[12px] text-[#b0b8c4]">{t.select_sector_hint}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-[#dde4ef] bg-white overflow-hidden animate-pulse">
            <div className="h-48 bg-[#f4f6fa]" />
            <div className="p-4">
              <div className="h-3 bg-[#f4f6fa] rounded w-3/4 mb-2" />
              <div className="h-2 bg-[#f4f6fa] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[#dde4ef] rounded-2xl bg-white">
        <p className="text-[13px] font-bold text-[#9aa3af] uppercase tracking-widest">
          {search ? `${t.no_results}: "${search}"` : t.not_found}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9aa3af] mb-4">
        {context.label} — {products.length} {t.products_label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            layer={layer}
            t={t}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}

function ProductGridCard({ product, layer, t, onClick }) {
  const isGroup = product.isGroup;
  const canDrill = isGroup && layer < 3;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-[#dde4ef] bg-white overflow-hidden hover:border-[#1e88e5] hover:shadow-[0_8px_32px_rgba(30,136,229,0.08)] transition-all duration-200"
    >
      <div className="h-48 bg-[#f4f6fa] flex items-center justify-center overflow-hidden relative">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="40" height="40">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
        )}
        {isGroup && (
          <div className="absolute top-2.5 right-2.5 bg-[#071e3d] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
            {canDrill ? t.series_label : t.variant_label}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight line-clamp-2 group-hover:text-[#1e88e5] transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-[#9aa3af] mt-2 flex items-center gap-1">
          {canDrill ? `${product._count?.subProducts ?? 0} ${t.products_label}` : t.view_details}
          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
        </p>
      </div>
    </div>
  );
}