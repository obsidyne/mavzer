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
                            src="/video.mp4"
                            controls
                            className="w-full h-full object-cover"
                            poster="/slider1.png"
                        />
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

                    <div className="pt-6 text-center">
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