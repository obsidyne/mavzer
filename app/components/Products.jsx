'use client';
import { useState } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  {
    id: 1,
    name: 'Toz Zekar Amabaliji',
    category: 'Restaurant',
    img: '/products/product1.png',
    tag: 'Eco-Friendly',
    href: '/products/kraft-paper-bag',
  },
 
  {
    id: 3,
    name: 'Kobra Kaseleri',
    category: 'Hotel',
    img: '/products/product3.png',
    tag: 'Premium',
    href: '/products/hotel-amenity-kit',
  },
  {
    id: 4,
    name: 'Kagit Canda',
    category: 'Medical',
    img: '/products/product4.png',
    tag: 'ISO Certified',
    href: '/products/sterile-wrap',
  },
  {
    id: 5,
    name: 'Nylon Poset',
    category: 'Industrial',
    img: '/products/product5.png',
    tag: 'Heavy Duty',
    href: '/products/industrial-sack',
  },
  {
    id: 6,
    name: 'Office Supply Box',
    category: 'Government',
    img: '/products/product6.png',
    tag: 'Bulk Order',
    href: '/products/office-supply-box',
  },
  {
    id: 7,
    name: 'Deli Wrap Sheet',
    category: 'Restaurant',
    img: '/products/product7.png',
    tag: 'Food Safe',
    href: '/products/deli-wrap',
  },
 
];

const COLS = 5;

export default function ProductsSection() {
  const [rows, setRows] = useState(1);
  const shown = rows * COLS;
  const hasMore = shown < PRODUCTS.length;

  return (
    <section className="bg-[#f5f7fa] py-20 px-12">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1e88e5] mb-2">
            Our Range
          </p>
          <h2 className="font-condensed text-[38px] font-extrabold uppercase text-[#071e3d] leading-tight">
            Featured <span className="text-[#1e88e5]">Products</span>
          </h2>
        </div>
        <Link
          href="/products"
          className="text-[11px] font-bold tracking-widest uppercase text-[#1e88e5] no-underline border-b border-[#1e88e5]/40 pb-0.5 hover:border-[#1e88e5] transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRODUCTS.slice(0, shown).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Show More */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setRows((r) => r + 1)}
              className="group inline-flex items-center gap-3 bg-[#071e3d] text-white px-8 py-3.5 rounded text-[11px] font-bold tracking-widest uppercase transition-all duration-200 hover:bg-[#1e88e5] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,136,229,0.3)]"
            >
              Show More
             
              <svg
                width="14" height="14" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5}
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <Link
      href={product.href}
      className="group relative bg-white rounded-xl overflow-hidden no-underline border border-[#e8edf5] flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(7,30,61,0.12)] hover:border-[#1e88e5]/30"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#eef1f7]" style={{ aspectRatio: '1 / 1' }}>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1 flex-1">
        {/* <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1e88e5]">
          {product.category}
        </span> */}
        <h3 className="text-[13px] font-bold text-[#071e3d] leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#071e3d]/40 group-hover:text-[#1e88e5] transition-colors">
            View Details
          </span>
          <svg
            width="13" height="13" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}
            className="text-[#071e3d]/30 group-hover:text-[#1e88e5] transition-all duration-200 group-hover:translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </div>
      </div>
    </Link>
  );
}