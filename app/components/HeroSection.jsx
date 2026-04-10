'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

const FALLBACK_SLIDES = [
    { url: '/slider1.jpeg', alt: 'Restaurant' },
    { url: '/slider2.jpeg', alt: 'Hotel' },
];

const SECTOR_COLORS = [
    { from: '#2c1810', to: '#7a4520' },
    { from: '#1a0e06', to: '#6b3d18' },
    { from: '#0a1628', to: '#2a5080' },
    { from: '#0e1422', to: '#2a3a60' },
    { from: '#081e2a', to: '#186080' },
    { from: '#141814', to: '#3a4a2a' },
];

export default function HeroSection() {
    const router = useRouter();
    const [slides, setSlides] = useState(FALLBACK_SLIDES);
    const [sectors, setSectors] = useState([]);
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const [activeSectorId, setActiveSectorId] = useState(null);
    const [activeSector, setActiveSector] = useState(null);
    const [gridState, setGridState] = useState('categories');
    const [gridItems, setGridItems] = useState([]);
    const [gridLoading, setGridLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [layer, setLayer] = useState(3);
    const gridRef = useRef(null);
    const sectorRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const res = await fetch(`${API}/api/public/banners`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setSlides(data.map((b) => ({ url: b.image, alt: b.title || 'Banner' })));
                }
            } catch (err) { }
        }
        async function fetchSectors() {
            try {
                const res = await fetch(`${API}/api/public/sectors`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) setSectors(data);
            } catch (err) { }
        }
        fetchBanners();
        fetchSectors();
    }, []);

    // Auto-open first sector + first category on load
    // useEffect(() => {
    //     if (initializedRef.current || sectors.length === 0) return;
    //     initializedRef.current = true;
    //     const firstSector = sectors[0];
    //     const firstCategory = firstSector.categories?.[0];
    //     setActiveSectorId(firstSector.id);
    //     setActiveSector({ ...firstSector, colorIdx: 0 });
    //     if (firstCategory) {
    //         setGridState('products');
    //         setBreadcrumbs([
    //             { label: firstSector.name, id: firstSector.id, type: 'sector' },
    //             { label: firstCategory.name, id: firstCategory.id, type: 'category' },
    //         ]);
    //         setGridLoading(true);
    //         fetch(`${API}/api/public/products?categoryId=${firstCategory.id}`)
    //             .then((r) => r.json())
    //             .then((d) => setGridItems(Array.isArray(d) ? d : []))
    //             .catch(() => setGridItems([]))
    //             .finally(() => setGridLoading(false));
    //     } else {
    //         setGridState('categories');
    //         setGridItems(firstSector.categories || []);
    //         setBreadcrumbs([{ label: firstSector.name, id: firstSector.id, type: 'sector' }]);
    //     }
    // }, [sectors]);
    useEffect(() => {
        if (initializedRef.current || sectors.length === 0) return;
        initializedRef.current = true;
        const firstSector = sectors[0];
        setActiveSectorId(firstSector.id);
        setActiveSector({ ...firstSector, colorIdx: 0 });
        setGridState('categories');
        setGridItems(firstSector.categories || []);
        setBreadcrumbs([{ label: firstSector.name, id: firstSector.id, type: 'sector' }]);
    }, [sectors]);

    useEffect(() => {
        setCurrent(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
        return () => clearInterval(timerRef.current);
    }, [slides]);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    };
    const goTo = (n) => { setCurrent((n + slides.length) % slides.length); startTimer(); };

    // const handleSectorClick = useCallback((sector, idx) => {
    //     const firstCategory = sector.categories?.[0];
    //     setActiveSectorId(sector.id);
    //     setActiveSector({ ...sector, colorIdx: idx });
    //     setLayer(3);
    //     if (firstCategory) {
    //         setGridState('products');
    //         setBreadcrumbs([
    //             { label: sector.name, id: sector.id, type: 'sector' },
    //             { label: firstCategory.name, id: firstCategory.id, type: 'category' },
    //         ]);
    //         setGridLoading(true);
    //         fetch(`${API}/api/public/products?categoryId=${firstCategory.id}`)
    //             .then((r) => r.json())
    //             .then((d) => setGridItems(Array.isArray(d) ? d : []))
    //             .catch(() => setGridItems([]))
    //             .finally(() => setGridLoading(false));
    //     } else {
    //         setGridState('categories');
    //         setGridItems(sector.categories || []);
    //         setBreadcrumbs([{ label: sector.name, id: sector.id, type: 'sector' }]);
    //     }
    //     setTimeout(() => sectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    // }, []);

    const handleSectorClick = useCallback((sector, idx) => {
        setActiveSectorId(sector.id);
        setActiveSector({ ...sector, colorIdx: idx });
        setLayer(3);
        setGridState('categories');
        setGridItems(sector.categories || []);
        setBreadcrumbs([{ label: sector.name, id: sector.id, type: 'sector' }]);
        setTimeout(() => sectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, []);

    // const handleCategoryClick = useCallback(async (cat) => {
    //     setGridLoading(true);
    //     setGridState('products');
    //     setBreadcrumbs((prev) => {
    //         const sectorCrumb = prev.find((c) => c.type === 'sector');
    //         return sectorCrumb
    //             ? [sectorCrumb, { label: cat.name, id: cat.id, type: 'category' }]
    //             : [{ label: cat.name, id: cat.id, type: 'category' }];
    //     });
    //     setLayer(3);
    //     try {
    //         const res = await fetch(`${API}/api/public/products?categoryId=${cat.id}`);
    //         const data = await res.json();
    //         setGridItems(Array.isArray(data) ? data : []);
    //     } catch (err) { setGridItems([]); }
    //     finally { setGridLoading(false); }
    // }, []);
    const handleCategoryClick = useCallback((cat) => {
        if (!activeSector) return;
        const sectorParam = activeSector.slug || activeSector.name?.toLowerCase();
        router.push(`/catalogue?sector=${sectorParam}&category=${cat.id}`);
    }, [activeSector, router]);

    const handleProductClick = useCallback(async (product) => {
        if (layer === 3 && product.isGroup) {
            setGridLoading(true);
            setBreadcrumbs((prev) => [...prev, { label: product.name, id: product.id, type: 'group' }]);
            setLayer(4);
            try {
                const res = await fetch(`${API}/api/public/products?parentId=${product.id}`);
                const data = await res.json();
                setGridItems(Array.isArray(data) ? data : []);
            } catch (err) { setGridItems([]); }
            finally { setGridLoading(false); }
        } else {
            router.push(`/products/${product.id}`);
        }
    }, [layer, router]);

    const handleBreadcrumbClick = useCallback(async (crumb, index) => {
        const newCrumbs = breadcrumbs.slice(0, index + 1);
        setBreadcrumbs(newCrumbs);
        if (crumb.type === 'sector') {
            setGridState('categories');
            setGridItems(activeSector?.categories || []);
            setLayer(3);
        } else {
            setGridLoading(true);
            const url = crumb.type === 'category'
                ? `${API}/api/public/products?categoryId=${crumb.id}`
                : `${API}/api/public/products?parentId=${crumb.id}`;
            setLayer(crumb.type === 'category' ? 3 : 4);
            try {
                const res = await fetch(url);
                const data = await res.json();
                setGridItems(Array.isArray(data) ? data : []);
            } catch (err) { setGridItems([]); }
            finally { setGridLoading(false); }
        }
    }, [breadcrumbs, activeSector]);

    const handleBackToCategories = useCallback(() => {
        if (!activeSector) return;
        setGridState('categories');
        setGridItems(activeSector.categories || []);
        setLayer(3);
        setBreadcrumbs([{ label: activeSector.name, id: activeSector.id, type: 'sector' }]);
    }, [activeSector]);

    return (
        <>
            <style>{`
                @keyframes truckMove { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
                @keyframes pulse30 { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
                @keyframes badgeBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
                @keyframes clockTick { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(15deg)} }
                @keyframes chevronBlink { 0%,100%{opacity:0.15} 50%{opacity:1} }
                @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
                @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
                @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .truck-anim{animation:truckMove 1.6s ease-in-out infinite}
                .pulse-anim{animation:pulse30 1.8s ease-in-out infinite}
                .badge-anim{animation:badgeBounce 2s ease-in-out infinite}
                .clock-anim{animation:clockTick 2s ease-in-out infinite}
                .slide-left{animation:slideInLeft 0.7s ease-out both}
                .slide-left-2{animation:slideInLeft 0.7s ease-out 0.15s both}
                .slide-right{animation:slideInRight 0.7s ease-out both}
                .slide-right-2{animation:slideInRight 0.7s ease-out 0.15s both}
                .fade-slide-up{animation:fadeSlideUp 0.35s ease-out both}
            `}</style>

            <div className="mt-[66px]" style={{ display: 'flex', flexDirection: 'column' }}>

                {/* Banner */}
                <section className="relative w-full overflow-hidden bg-[#071e3d] shrink-0" style={{ height: '50vh' }}>
                    {slides.map((slide, i) => (
                        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                                style={{ width: i === current ? '44px' : '28px' }}
                                className={`h-[3px] border-none cursor-pointer p-0 rounded-sm transition-all duration-300 ${i === current ? 'bg-[#1e88e5]' : 'bg-white/30'}`} />
                        ))}
                    </div>
                    <div className="absolute bottom-2 right-8 z-10 flex gap-1.5">
                        {[{ label: 'Prev', dir: -1, path: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z' }, { label: 'Next', dir: 1, path: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z' }].map(({ label, dir, path }) => (
                            <button key={label} onClick={() => goTo(current + dir)} aria-label={label}
                                className="w-6 h-6 rounded flex items-center justify-center bg-white/20 border border-white/40 cursor-pointer transition-all duration-200 hover:bg-white hover:border-white">
                                <svg viewBox="0 0 24 24" fill="white" width="11" height="11"><path d={path} /></svg>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Badges strip */}
                <div className="shrink-0 w-full flex items-center justify-between overflow-hidden" style={{ height: '55px', background: 'linear-gradient(135deg, #0a3a6e 0%, #1565c0 50%, #0a3a6e 100%)' }}>
                    <div className="flex items-center h-full divide-x divide-white/20 shrink-0">
                        <div className="slide-left flex flex-col items-center justify-center h-full" style={{ gap: '3px', padding: '0 2.5vw', minWidth: '10vw' }}>
                            <div className="truck-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '1.4vw', height: '1.4vw', minWidth: '16px', minHeight: '16px' }}>
                                    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: 'clamp(8px,0.65vw,11px)', letterSpacing: '0.12em', padding: '1px 0.5vw' }}>Hızlı Teslimat</span>
                        </div>
                        <div className="slide-left-2 flex flex-col items-center justify-center h-full" style={{ gap: '3px', padding: '0 2.5vw', minWidth: '10vw' }}>
                            <div className="pulse-anim text-white/90" style={{ width: '1.4vw', height: '1.4vw', minWidth: '16px', minHeight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="rounded-full border-2 border-white/80 flex items-center justify-center w-full h-full">
                                    <span className="text-white font-extrabold" style={{ fontSize: 'clamp(7px,0.6vw,10px)', lineHeight: 1 }}>30+</span>
                                </div>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: 'clamp(8px,0.65vw,11px)', letterSpacing: '0.12em', padding: '1px 0.5vw' }}>30+ Yıllık Tecrübe</span>
                        </div>
                    </div>
                    <div className="flex items-center flex-1 justify-center min-w-0 px-2" style={{ gap: '0.5vw' }}>
                        <div className="flex flex-col items-center shrink-0">
                            {[0, 1, 2].map((i) => (<svg key={i} viewBox="0 0 24 24" fill="white" style={{ width: 'clamp(10px,1vw,16px)', height: 'clamp(10px,1vw,16px)', animation: 'chevronBlink 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>))}
                        </div>
                        <span className="font-bold uppercase text-white whitespace-nowrap" style={{ fontSize: '14px', letterSpacing: '0.08em' }}>Sektörünüzü Seçerek İhtiyacınız Olabilecek Ürünleri Keşfedin</span>
                        <div className="flex flex-col items-center shrink-0">
                            {[0, 1, 2].map((i) => (<svg key={i} viewBox="0 0 24 24" fill="white" style={{ width: 'clamp(10px,1vw,16px)', height: 'clamp(10px,1vw,16px)', animation: 'chevronBlink 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>))}
                        </div>
                    </div>
                    <div className="flex items-center h-full divide-x divide-white/20 shrink-0">
                        <div className="slide-right flex flex-col items-center justify-center h-full" style={{ gap: '3px', padding: '0 2.5vw', minWidth: '10vw' }}>
                            <div className="badge-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '1.4vw', height: '1.4vw', minWidth: '16px', minHeight: '16px' }}>
                                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: 'clamp(8px,0.65vw,11px)', letterSpacing: '0.12em', padding: '1px 0.5vw' }}>Kaliteli Üretimi</span>
                        </div>
                        <div className="slide-right-2 flex flex-col items-center justify-center h-full" style={{ gap: '3px', padding: '0 2.5vw', minWidth: '10vw' }}>
                            <div className="clock-anim text-white/90">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '1.4vw', height: '1.4vw', minWidth: '16px', minHeight: '16px' }}>
                                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-white font-extrabold uppercase border border-white/40 whitespace-nowrap" style={{ fontSize: 'clamp(8px,0.65vw,11px)', letterSpacing: '0.12em', padding: '1px 0.5vw' }}>Zamanında Üretim</span>
                        </div>
                    </div>
                </div>

                {/* Sector Cards */}
                {/* <div ref={sectorRef} className="w-full bg-white pt-5 pb-10" style={{ overflow: 'visible' }}> */}
                <div  style={{ minHeight: 'calc(100vh - 0px)' }}>
                <div  ref={sectorRef} className="w-full bg-white pt-5 pb-10" style={{ overflow: 'visible', scrollMarginTop: '66px'  }}>

                    <div className="w-full max-w-[1150px] mx-auto px-6" style={{ overflow: 'visible' }}>
                        <div className="grid grid-cols-6 gap-3" style={{ position: 'relative', overflow: 'visible' }}>
                            {sectors.map((sector, idx) => {
                                const colors = SECTOR_COLORS[idx % SECTOR_COLORS.length];
                                const isActive = activeSectorId === sector.id;
                                const hasSomeActive = activeSectorId !== null;
                                return (
                                    <div
                                        key={sector.id}
                                        onClick={() => handleSectorClick(sector, idx)}
                                        className="no-underline block cursor-pointer"
                                        style={{
                                            position: 'relative',
                                            transform: isActive
                                                ? 'scale(1.05)'
                                                : hasSomeActive
                                                    ? 'scale(00.98)'
                                                    : 'scale(1)',
                                            transformOrigin: 'center top',
                                            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s',
                                            opacity: hasSomeActive && !isActive ? 0.6 : 1,
                                            zIndex: isActive ? 10 : 1,
                                        }}
                                    >
                                        <div
                                            className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${isActive ? 'border-[#1e88e5]' : 'border-[#dde4ef]'}`}
                                            style={{ aspectRatio: '4/5' }}
                                        >
                                            {sector.image
                                                ? <img src={sector.image} alt={sector.name} className="absolute inset-0 w-full h-full object-cover" />
                                                : <div className="absolute inset-0 bg-[#dde4ef]" />}
                                            <div
                                                className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-60' : 'opacity-40'}`}
                                                style={{ background: `linear-gradient(160deg, ${colors.from} 0%, ${colors.to} 100%)` }}
                                            />
                                            {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e88e5]" />}
                                        </div>
                                        <p className={`text-center text-[11px] font-semibold mt-1 tracking-wide uppercase transition-colors duration-200 ${isActive ? 'text-[#1e88e5]' : 'text-[#4a5568]'}`}>
                                            {sector.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Product Grid — always visible */}
                <div ref={gridRef} className="w-full  bg-[#f4f6fa] " >
                    <div className="w-full bg max-w-[1150px] mx-auto px-6 py-8">

                        {/* Top row: back button (left) + view all button (right) */}
                        <div className="flex items-center justify-between mb-4 min-h-[28px]">
                            {gridState === 'products' ? (
                                <button
                                    onClick={handleBackToCategories}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b7380] hover:text-[#0a4c8a] transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" /></svg>
                                    Kategorilere Dön
                                </button>
                            ) : (
                                <span />
                            )}

                            {/* {gridItems.length > 6 && ( */}
                            {activeSector && (
                                <button
                                    onClick={() => router.push(`/catalogue?sector=${activeSector?.slug || activeSector?.name?.toLowerCase()}`)}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#071e3d] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#0a4c8a] transition-colors"
                                >
                                    Tümünü Görüntüle
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                                </button>
                            )}
                        </div>

                        {sectors.length === 0 || gridLoading ? (
                            <div className="grid grid-cols-4 gap-5">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="rounded-xl border border-[#dde4ef] bg-white overflow-hidden animate-pulse">
                                        <div className="h-48 bg-[#eef1f6]" />
                                        <div className="p-4"><div className="h-3 bg-[#eef1f6] rounded w-3/4 mb-2" /><div className="h-2 bg-[#eef1f6] rounded w-1/2" /></div>
                                    </div>
                                ))}
                            </div>
                        ) : gridItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#dde4ef] rounded-2xl bg-white">
                                <p className="text-[13px] font-bold text-[#9aa3af] uppercase tracking-widest">Ürün bulunamadı</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-5 gap-5 fade-slide-up">
                                {gridItems.slice(0, 6).map((item) => (
                                    <InlineCard
                                        key={item.id}
                                        item={item}
                                        isProduct={gridState === 'products'}
                                        layer={layer}
                                        onClick={() => gridState === 'categories' ? handleCategoryClick(item) : handleProductClick(item)}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
                </div>

            </div>
        </>
    );
}

function InlineCard({ item, isProduct, layer, onClick }) {
    return (
        <div onClick={onClick} className="group cursor-pointer rounded-xl border border-[#dde4ef] bg-white overflow-hidden hover:border-[#1e88e5] hover:shadow-[0_8px_32px_rgba(30,136,229,0.1)] transition-all duration-200">
            <div className="h-48 bg-[#f4f6fa] flex items-center justify-center overflow-hidden relative">
                {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="#dde4ef" strokeWidth="1" width="40" height="40"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>}
                {isProduct && item.isGroup && (
                    <div className="absolute top-2.5 right-2.5 bg-[#071e3d] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Series</div>
                )}
            </div>
            <div className="p-3.5">
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#071e3d] leading-tight group-hover:text-[#1e88e5] transition-colors line-clamp-2">{item.name}</h3>
                <p className="text-[11px] text-[#9aa3af] mt-1.5 flex items-center gap-1">
                    {!isProduct ? 'Ürünleri Gör' : item.isGroup ? `${item._count?.subProducts ?? 0} varyant` : 'Detayları Gör'}
                    <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
                </p>
            </div>
        </div>
    );
}