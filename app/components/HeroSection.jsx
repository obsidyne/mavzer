'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SLIDES = [
    { url: '/slider1.png', alt: 'Restaurant' },
    { url: '/slider2.png', alt: 'Hotel' },
    { url: '/slider3.png', alt: 'Food' },
];

const CATEGORIES = [
    {
        key: 'restoran', label: 'Restaurant', href: '/products/restaurant', from: '#2c1810', to: '#7a4520',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80'
    },
    {
        key: 'kafe', label: 'Cafe', href: '/products/cafe', from: '#1a0e06', to: '#6b3d18',
        img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80'
    },
    {
        key: 'otel', label: 'Hotel', href: '/products/hotel', from: '#0a1628', to: '#2a5080',
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'
    },
    {
        key: 'kurum', label: 'Government', href: '/products/government', from: '#0e1422', to: '#2a3a60',
        img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&q=80'
    },
    {
        key: 'medikal', label: 'Medical', href: '/products/medical', from: '#081e2a', to: '#186080',
        img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80'
    },
    {
        key: 'endustri', label: 'Industrial', href: '/products/industrial', from: '#141814', to: '#3a4a2a',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80'
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((c) => (c + 1) % SLIDES.length);
        }, 5000);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const goTo = (n) => {
        setCurrent((n + SLIDES.length) % SLIDES.length);
        startTimer();
    };

    return (
        <>
            {/* ── Banner Slider ── */}
            <section className="mt-[66px] relative h-[350px] overflow-hidden bg-[#071e3d]">

                {SLIDES.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{ backgroundImage: `url('${slide.url}')` }}
                        role="img"
                        aria-label={slide.alt}
                    />
                ))}

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Slide ${i + 1}`}
                            style={{ width: i === current ? '44px' : '28px' }}
                            className={`h-[3px] border-none cursor-pointer p-0 rounded-sm transition-all duration-300 ${i === current ? 'bg-[#1e88e5]' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <div className="absolute bottom-3 right-12 z-10 flex gap-2">
                    {[
                        { label: 'Prev', dir: -1, path: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z' },
                        { label: 'Next', dir: 1, path: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z' },
                    ].map(({ label, dir, path }) => (
                        <button
                            key={label}
                            onClick={() => goTo(current + dir)}
                            aria-label={label}
                            className="w-10 h-10 rounded flex items-center justify-center bg-white/10 border border-white/20 cursor-pointer transition-all duration-200 hover:bg-[#0a4c8a] hover:border-[#0a4c8a]"
                        >
                            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                <path d={path} />
                            </svg>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Categories Card ── */}
            <div className="relative z-10 px-12 -mt-9">
                <div className="bg-white rounded-xl shadow-[0_8px_48px_rgba(7,30,61,0.13)] px-8 pt-6 pb-6 border border-[#dde4ef]">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#6b7380]">
                            <span className="block w-5 h-0.5 bg-[#1e88e5] shrink-0" />
                            Explore by Sector
                        </div>
                        <Link
                            href="/products"
                            className="flex items-center gap-1 text-[10.5px] font-bold tracking-widest uppercase text-[#0a4c8a] no-underline transition-all duration-200 hover:gap-2"
                        >
                            View All Products
                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                            </svg>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-6 gap-3">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.key}
                                href={cat.href}
                                className="relative rounded-lg overflow-hidden border border-[#dde4ef] no-underline block transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(10,76,138,0.2)]"
                                style={{ aspectRatio: '1 / 0.88' }}
                            >
                                {/* Background image */}
                                <img
                                    src={cat.img}
                                    alt={cat.label}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Color tint overlay to maintain brand feel */}
                                <div
                                    className="absolute inset-0 opacity-50"
                                    style={{ background: `linear-gradient(160deg, ${cat.from} 0%, ${cat.to} 100%)` }}
                                />
                                {/* Bottom label */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-4 pb-2 px-2 text-[11px] font-bold tracking-wider uppercase text-white text-center">
                                    {cat.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Section Title ── */}
            <div className="px-12 pt-12">
                <div className="border-b-2 border-[#dde4ef] pb-8 flex items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#1e88e5] mb-2">
                            <span className="inline-block w-5 h-0.5 bg-[#1e88e5] shrink-0" />
                            Discover Our Sectors
                        </div>
                        <h2 className="font-condensed text-[38px] font-extrabold uppercase tracking-wide text-[#071e3d] leading-tight">
                            Packaging Solutions for{' '}
                            <span className="text-[#1e88e5]">Every Industry</span>
                        </h2>
                        <p className="text-sm text-[#6b7380] mt-2 leading-relaxed max-w-xl">
                            From restaurants and cafes to hospitals and industrial facilities — explore the full
                            range of products tailored to your sector&apos;s needs.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="shrink-0 inline-flex items-center gap-2 bg-[#1e88e5] text-white px-6 py-3 rounded text-xs font-bold tracking-widest uppercase no-underline transition-all duration-200 hover:bg-[#1565c0] hover:-translate-y-0.5"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </>
    );
}