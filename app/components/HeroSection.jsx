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
        key: 'restoran', label: 'Restoran', href: '/products?sector=restoran', from: '#2c1810', to: '#7a4520',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80'
    },
    {
        key: 'kafe', label: 'Kafe', href: '/products?sector=kafe', from: '#1a0e06', to: '#6b3d18',
        img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80'
    },
    {
        key: 'otel', label: 'Otel', href: '/products?sector=otel', from: '#0a1628', to: '#2a5080',
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'
    },
    {
        key: 'kurum', label: 'Resmi Kurum', href: '/products?sector=kurum', from: '#0e1422', to: '#2a3a60',
        img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&q=80'
    },
    {
        key: 'medikal', label: 'Medikal', href: '/products?sector=medikal', from: '#081e2a', to: '#186080',
        img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80'
    },
    {
        key: 'endustri', label: 'Endüstriyel', href: '/products?sector=endustri', from: '#141814', to: '#3a4a2a',
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
            <style>{`
                @keyframes truckMove {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(6px); }
                }
                @keyframes pulse30 {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                @keyframes badgeBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes chevronBlink {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 1; }
                }
                .truck-anim { animation: truckMove 1.6s ease-in-out infinite; }
                .pulse-anim { animation: pulse30 1.8s ease-in-out infinite; }
                .badge-anim { animation: badgeBounce 2s ease-in-out infinite; }
            `}</style>

            <div className="mt-[66px]" style={{ height: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>

                {/* ── Banner — 50% ── */}
                <section className="relative w-full overflow-hidden bg-[#071e3d] shrink-0" style={{ height: '50%' }}>
                    {SLIDES.map((slide, i) => (
                        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                        {SLIDES.map((_, i) => (
                            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                                style={{ width: i === current ? '44px' : '28px' }}
                                className={`h-[3px] border-none cursor-pointer p-0 rounded-sm transition-all duration-300 ${i === current ? 'bg-[#1e88e5]' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-2 right-8 z-10 flex gap-1.5">
                        {[
                            { label: 'Prev', dir: -1, path: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z' },
                            { label: 'Next', dir: 1, path: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z' },
                        ].map(({ label, dir, path }) => (
                            <button key={label} onClick={() => goTo(current + dir)} aria-label={label}
                                className="w-6 h-6 rounded flex items-center justify-center bg-white/10 border border-white/20 cursor-pointer transition-all duration-200 hover:bg-[#0a4c8a] hover:border-[#0a4c8a]"
                            >
                                <svg viewBox="0 0 24 24" fill="white" width="11" height="11"><path d={path} /></svg>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── Badges — 16% ── */}
                <div className="px-10 shrink-0 m-[auto] w-[70%] flex flex-col items-center justify-center" style={{ height: '16%', background: 'linear-gradient(135deg, #0a3a6e 0%, #1565c0 50%, #0a3a6e 100%)', gap: '4px' }}>
                    <div className="flex items-center justify-center divide-x divide-white/20" style={{ width: '60%', maxWidth: '700px' }}>

                        <div className="flex flex-col items-center flex-1" style={{ gap: '4px' }}>
                            <div className="truck-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 px-2 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.15em', padding: '1px 8px' }}>
                                Hızlı Teslimat
                            </span>
                        </div>

                        <div className="flex flex-col items-center flex-1" style={{ gap: '4px' }}>
                            <div className="pulse-anim text-white/90">
                                <div className="w-7 h-7 rounded-full border-2 border-white/80 flex items-center justify-center">
                                    <span className="text-white font-extrabold" style={{ fontSize: '11px' }}>30+</span>
                                </div>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.15em', padding: '1px 8px' }}>
                                30+ Yıllık Tecrübe
                            </span>
                        </div>

                        <div className="flex flex-col items-center flex-1" style={{ gap: '4px' }}>
                            <div className="badge-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.15em', padding: '1px 8px' }}>
                                Kaliteli Üretimi
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/90">
                        <div className="flex flex-col items-center" style={{ gap: '0px' }}>
                            {[0, 1, 2].map((i) => (
                                <svg key={i} viewBox="0 0 24 24" fill="currentColor" width="11" height="11"
                                    style={{ animation: 'chevronBlink 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                                </svg>
                            ))}
                        </div>
                        <span className="font-bold uppercase text-white/80 whitespace-nowrap" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
                            Sektörünüzü Seçerek İhtiyacınız Olabilecek Ürünleri Keşfedin
                        </span>
                        <div className="flex flex-col items-center" style={{ gap: '0px' }}>
                            {[0, 1, 2].map((i) => (
                                <svg key={i} viewBox="0 0 24 24" fill="currentColor" width="11" height="11"
                                    style={{ animation: 'chevronBlink 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Sectors — 36% ── */}
                <div className="flex-1 flex items-center bg-white overflow-hidden">
                    <div className="w-full max-w-5xl mx-auto px-6">
                        <div className="grid grid-cols-6 gap-3">
                            {CATEGORIES.map((cat) => (
                                <Link key={cat.key} href={cat.href} className="no-underline block group">
                                    <div
                                        className="relative rounded-xl overflow-hidden border border-[#dde4ef] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_32px_rgba(10,76,138,0.2)]"
                                        style={{ aspectRatio: '1 / 1' }}
                                    >
                                        <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" />
                                        <div
                                            className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                                            style={{ background: `linear-gradient(160deg, ${cat.from} 0%, ${cat.to} 100%)` }}
                                        />
                                    </div>
                                    <p className="text-center text-[11px] font-semibold text-[#4a5568] mt-1 tracking-wide uppercase">
                                        {cat.label}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Section Title ── */}
            <div className="max-w-5xl mx-auto px-8 pt-10">
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
                            From restaurants and cafes to hospitals and industrial facilities — explore the full range of products tailored to your sector&apos;s needs.
                        </p>
                    </div>
                    <Link href="/products" className="shrink-0 inline-flex items-center gap-2 bg-[#1e88e5] text-white px-6 py-3 rounded text-xs font-bold tracking-widest uppercase no-underline transition-all duration-200 hover:bg-[#1565c0] hover:-translate-y-0.5">
                        View All Products
                    </Link>
                </div>
            </div>
        </>
    );
}