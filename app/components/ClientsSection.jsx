'use client';

import { useEffect, useRef } from 'react';

const CLIENTS = [
    { img: '/client1.webp', name: 'Client 1' },
    { img: '/client2.webp', name: 'Client 2' },
    { img: '/client3.webp', name: 'Client 3' },
    { img: '/client4.webp', name: 'Client 4' },
];

const REPEATED = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];
const SPEED = 0.28; // px per frame — lower = slower

function CarouselTrack({ trackRef, wrapRef }) {
    return (
        <div ref={wrapRef} className="relative w-full overflow-hidden cursor-default">
            <div className="absolute left-0 top-0 bottom-0 w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            <div ref={trackRef} className="flex items-center gap-12 w-max py-4" style={{ willChange: 'transform' }}>
                {REPEATED.map((client, i) => (
                    <div key={i} className="flex-shrink-0 w-[180px] h-[90px] flex items-center justify-center">
                        <img
                            src={client.img}
                            alt={client.name}
                            className="max-w-[160px] max-h-[80px] w-full object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ClientsSection() {
    const track1Ref = useRef(null);
    const track2Ref = useRef(null);
    const wrap1Ref  = useRef(null);
    const wrap2Ref  = useRef(null);
    const rafRef    = useRef(null);
    const stateRef  = useRef({ pos1: 0, pos2: null, paused1: false, paused2: false });

    useEffect(() => {
        const t1 = track1Ref.current;
        const t2 = track2Ref.current;
        const w1 = wrap1Ref.current;
        const w2 = wrap2Ref.current;
        if (!t1 || !t2 || !w1 || !w2) return;

        const s = stateRef.current;

        const onEnter1 = () => { s.paused1 = true; };
        const onLeave1 = () => { s.paused1 = false; };
        const onEnter2 = () => { s.paused2 = true; };
        const onLeave2 = () => { s.paused2 = false; };

        w1.addEventListener('mouseenter', onEnter1);
        w1.addEventListener('mouseleave', onLeave1);
        w2.addEventListener('mouseenter', onEnter2);
        w2.addEventListener('mouseleave', onLeave2);

        function animate() {
            const half1 = t1.scrollWidth / 2;
            const half2 = t2.scrollWidth / 2;

            if (s.pos2 === null) s.pos2 = -half2;

            if (!s.paused1) {
                s.pos1 -= SPEED;
                if (s.pos1 <= -half1) s.pos1 = 0;
                t1.style.transform = `translateX(${s.pos1}px)`;
            }

            if (!s.paused2) {
                s.pos2 += SPEED;
                if (s.pos2 >= 0) s.pos2 = -half2;
                t2.style.transform = `translateX(${s.pos2}px)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        }

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            w1.removeEventListener('mouseenter', onEnter1);
            w1.removeEventListener('mouseleave', onLeave1);
            w2.removeEventListener('mouseenter', onEnter2);
            w2.removeEventListener('mouseleave', onLeave2);
        };
    }, []);

    return (
        <section className="bg-white py-16 border-t border-[#dde4ef] overflow-hidden">
            <div className="text-center mb-5 --px-8 --bg-blue-200">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-3">
                  
                </div>
                <h2 className="font-condensed text-[36px] font-extrabold uppercase text-[#000000] tracking-wide leading-tight mb-3">
<span className="text-[#000000]">REFERANSLARIMIZ</span>
                </h2>
                <p className="text-[13px] --bg-red-200 text-[#6b7380] w-[800px] leading-relaxed max-w-md mx-auto">
                    Farklı sektörlerden önde gelen kurumlar ve şirketler tarafından güvenilen çözüm ortağınız
                </p>
            </div>

            <div className="mb-5">
                <CarouselTrack trackRef={track1Ref} wrapRef={wrap1Ref} />
            </div>
            <CarouselTrack trackRef={track2Ref} wrapRef={wrap2Ref} />
        </section>
    );
}