'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const SLIDES = [
    { url: '/slider1.jpeg', alt: 'Restaurant' },
    { url: '/slider2.jpeg', alt: 'Hotel' },
    // { url: '/slider3.png', alt: 'Food' },
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
                @keyframes clockTick {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(15deg); }
                }
                @keyframes chevronBlink {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .truck-anim { animation: truckMove 1.6s ease-in-out infinite; }
                .pulse-anim { animation: pulse30 1.8s ease-in-out infinite; }
                .badge-anim { animation: badgeBounce 2s ease-in-out infinite; }
                .clock-anim { animation: clockTick 2s ease-in-out infinite; }
                .slide-left { animation: slideInLeft 0.7s ease-out both; }
                .slide-left-2 { animation: slideInLeft 0.7s ease-out 0.15s both; }
                .slide-right { animation: slideInRight 0.7s ease-out both; }
                .slide-right-2 { animation: slideInRight 0.7s ease-out 0.15s both; }
            `}</style>

            <div className="mt-[66px]" style={{ height: 'calc(100vh - 66px)', display: 'flex', flexDirection: 'column' }}>

                {/* ── Banner — 50% ── */}
                <section className="relative w-full overflow-hidden bg-[#071e3d] shrink-0" style={{ height: '55%' }}>
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
                                className="w-6 h-6 rounded flex items-center justify-center bg-white/20 border border-white/40 cursor-pointer transition-all duration-200 hover:bg-white hover:border-white"
                            >
                                <svg viewBox="0 0 24 24" fill="white" width="11" height="11"><path d={path} /></svg>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── Badges — 11% ── */}
                <div className="shrink-0 w-full flex items-center justify-between" style={{ height: '11%', background: 'linear-gradient(135deg, #0a3a6e 0%, #1565c0 50%, #0a3a6e 100%)' }}>

                    {/* Left 2 badges — slide in from left */}
                    <div className="flex items-center h-full divide-x divide-white/20">
                        {/* Badge 1 */}
                        <div className="slide-left flex flex-col items-center justify-center h-full px-10" style={{ gap: '3px', minWidth: '160px' }}>
                            <div className="truck-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.12em', padding: '1px 8px' }}>
                                Hızlı Teslimat
                            </span>
                        </div>
                        {/* Badge 2 */}
                        <div className="slide-left-2 flex flex-col items-center justify-center h-full px-10" style={{ gap: '3px', minWidth: '160px' }}>
                            <div className="pulse-anim text-white/90" style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="rounded-full border-2 border-white/80 flex items-center justify-center" style={{ width: '22px', height: '22px' }}>
                                    <span className="text-white font-extrabold" style={{ fontSize: '9px', lineHeight: 1 }}>30+</span>
                                </div>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.12em', padding: '1px 8px' }}>
                                30+ Yıllık Tecrübe
                            </span>
                        </div>
                    </div>

                    {/* Center sentence */}
                    <div className="flex items-center gap-2 shrink-0 px-4">
                        <div className="flex flex-col items-center" style={{ gap: '0px' }}>
                            {[0, 1, 2].map((i) => (
                                <svg key={i} viewBox="0 0 24 24" fill="white" width="16" height="16"
                                    style={{ animation: 'chevronBlink 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                                </svg>
                            ))}
                        </div>
                        <span className="font-bold uppercase text-white whitespace-nowrap" style={{ fontSize: '20px', letterSpacing: '0.12em' }}>
                            Sektörünüzü Seçerek İhtiyacınız Olabilecek Ürünleri Keşfedin
                        </span>
                        <div className="flex flex-col items-center" style={{ gap: '0px' }}>
                            {[0, 1, 2].map((i) => (
                                <svg key={i} viewBox="0 0 24 24" fill="white" width="16" height="16"
                                    style={{ animation: 'chevronBlink 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}>
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                                </svg>
                            ))}
                        </div>
                    </div>

                    {/* Right 2 badges — slide in from right */}
                    <div className="flex items-center h-full divide-x divide-white/20">
                        {/* Badge 3 */}
                        <div className="slide-right flex flex-col items-center justify-center h-full px-10" style={{ gap: '3px', minWidth: '160px' }}>
                            <div className="badge-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.12em', padding: '1px 8px' }}>
                                Kaliteli Üretimi
                            </span>
                        </div>
                        {/* Badge 4 */}
                        <div className="slide-right-2 flex flex-col items-center justify-center h-full px-10" style={{ gap: '3px', minWidth: '160px' }}>
                            <div className="clock-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 6v6l4 2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: '10px', letterSpacing: '0.12em', padding: '1px 8px' }}>
                                Zamanında Üretim
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Sectors — remaining ── */}
                <div className="flex-1 flex items-start pt-4 bg-white overflow-hidden">
                    <div className="w-full max-w-[1150px] mx-auto px-6">
                        <div className="grid grid-cols-6 gap-3">
                            {CATEGORIES.map((cat) => (
                                <Link key={cat.key} href={cat.href} className="no-underline block group">
                                    <div
                                        className="relative rounded-xl overflow-hidden border border-[#dde4ef] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_32px_rgba(10,76,138,0.2)]"
                                        style={{ aspectRatio: '4 / 5' }}
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
        </>
    );
}