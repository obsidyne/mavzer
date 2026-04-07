'use client';

export default function Footer() {
    return (
        <div className="relative mt-24">

            {/* ── Video — half overflowing above footer ── */}
            <div className="flex justify-center">
                <div
                    className="relative z-10 w-full max-w-2xl mx-auto bg-white rounded-2xl p-4 --shadow-[0_8px_48px_rgba(0,0,0,0.3)]"
                    style={{ marginBottom: '-140px' }}
                >
                <div className="rounded-xl overflow-hidden border border-[#dde4ef]">
                    {/* Fake YouTube top bar */}
                    {/* <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#ff0000] flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                                <path d="M10 15l5.19-3L10 9v6z"/>
                                <path d="M21.56 7.17c-.26-.96-1.02-1.72-1.99-1.98C17.73 4.69 12 4.69 12 4.69s-5.73 0-7.57.5c-.97.26-1.73 1.02-1.99 1.98C2 9 2 12 2 12s0 3 .44 4.83c.26.96 1.02 1.72 1.99 1.98C6.27 19.31 12 19.31 12 19.31s5.73 0 7.57-.5c.97-.26 1.73-1.02 1.99-1.98C22 15 22 12 22 12s0-3-.44-4.83z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white text-[12px] font-semibold leading-tight">Mavzer Ambalaj</p>
                            <p className="text-white/40 text-[10px]">Mavzer Pazarlama</p>
                        </div>
                        <div className="ml-auto flex items-center gap-3 text-white/40">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                        </div>
                    </div> */}

                    {/* Video */}
                    <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
                        <video
                            controls
                            loop
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                            // poster="/slider1.png"
                        >
                            <source src="mavzer.webm" type="video/mp4"></source>
                        </video>

                    </div>

                    {/* Fake YouTube bottom bar */}
                    {/* <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/40">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            <span className="text-[10px] text-white/40">0:00 / 2:47</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/40">
                            <span className="text-[10px] text-white/50 border border-white/20 px-2 py-0.5 rounded">More videos</span>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                        </div>
                    </div> */}
                </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="bg-[#0d1117] pt-40 pb-10">
                <div className="max-w-5xl mx-auto px-8">
                    <div className="grid grid-cols-3 gap-12 pb-8 border-b border-white/10">

                        {/* Company name */}
                        <div>
                            <h3 className="text-white text-[13px] font-extrabold uppercase tracking-widest mb-3">
                                Mavzer Ambalaj
                            </h3>
                            <p className="text-white/50 text-[12px] leading-relaxed">
                                Mavzer Pazarlama Matbaacılık Reklam Ambalaj Gıda Kimya Sanayi ve Ticaret Ltd. Şti.
                            </p>
                        </div>

                        {/* Address */}
                        <div>
                            <h3 className="text-white text-[11px] font-bold uppercase tracking-widest mb-3">
                                Adres
                            </h3>
                            <p className="text-white/50 text-[12px] leading-relaxed">
                                Çamlıca, 137. Sk. No: 2<br />
                                06200 Yenimahalle / Ankara
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white text-[11px] font-bold uppercase tracking-widest mb-3">
                                İletişim
                            </h3>
                            <div className="flex flex-col gap-1">
                                <p className="text-white/50 text-[12px]">0312 397 3935</p>
                                <p className="text-white/50 text-[12px]">0533 681 9127</p>
                                <p className="text-white/50 text-[12px]">mavzer@mavzerambalaj.com.tr</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col items-center gap-4">
                        {/* Social media icons */}
                        <div className="flex items-center gap-5">
                            {/* X (Twitter) */}
                            <a href="https://x.com/mavzerambalaj" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a href="https://www.facebook.com/mavzerambalaj" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://www.instagram.com/mavzerambalaj" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </a>
                        </div>
                        <p className="text-white/30 text-[11px]">
                            © {new Date().getFullYear()} Mavzer Ambalaj. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </footer>

            {/* ── Created by AsarMedia ── */}
            <div className="bg-[#060809] py-3 flex items-center justify-center gap-2.5 border-t border-white/5">
                <span className="text-white/20 text-[11px]">Created by</span>
                <span className="text-white text-[11px]"><a href="https://www.asarmedia.com.tr">AsarMedia</a></span>
                {/* <img src="/asarmedia_logo.png" alt="AsarMedia" className="h-5 object-contain opacity-50 hover:opacity-100 transition-opacity" /> */}
            </div>
        </div>
    );
}