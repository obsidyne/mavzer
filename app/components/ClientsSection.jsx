'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CLIENTS = [
  { img: '/client1.webp', name: 'Client 1' },
  { img: '/client2.webp', name: 'Client 2' },
  { img: '/client3.webp', name: 'Client 3' },
  { img: '/client4.webp', name: 'Client 4' },
];

const REPEATED = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];
const SPEED = 0.28;

function CarouselTrack({ trackRef, wrapRef }) {
  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden cursor-default">
      {/* Fade edges — narrower on mobile, wider on desktop */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

      <div
        ref={trackRef}
        className="flex items-center gap-8 sm:gap-12 w-max py-4"
        style={{ willChange: 'transform' }}
      >
        {REPEATED.map((client, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[130px] h-[65px] sm:w-[160px] sm:h-[80px] lg:w-[180px] lg:h-[90px] flex items-center justify-center"
          >
            <img
              src={client.img}
              alt={client.name}
              className="max-w-[110px] sm:max-w-[140px] lg:max-w-[160px] max-h-[60px] sm:max-h-[70px] lg:max-h-[80px] w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsSection() {
  const { t } = useLanguage();
  const track1Ref = useRef(null);
  const wrap1Ref  = useRef(null);
  const rafRef    = useRef(null);
  const stateRef  = useRef({ pos1: 0, paused1: false });

  useEffect(() => {
    const track = track1Ref.current;
    const wrap  = wrap1Ref.current;
    if (!track || !wrap) return;

    const s = stateRef.current;
    const onEnter = () => { s.paused1 = true; };
    const onLeave = () => { s.paused1 = false; };

    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);

    function animate() {
      const half = track.scrollWidth / 2;
      if (!s.paused1) {
        s.pos1 -= SPEED;
        if (s.pos1 <= -half) s.pos1 = 0;
        track.style.transform = `translateX(${s.pos1}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 pb-12 sm:pb-16 lg:pb-32 border-t border-[#dde4ef] overflow-hidden">
      <div className="text-center mb-5 sm:mb-7 px-4">
        <h2 className="font-condensed text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold uppercase text-[#000000] tracking-wide leading-tight mb-3">
          {t.clients_section_title}
        </h2>
        <p className="text-[13px] text-[#6b7380] leading-relaxed max-w-[90vw] sm:max-w-md mx-auto">
          {t.clients_section_subtitle}
        </p>
      </div>
      <div className="mb-5">
        <CarouselTrack trackRef={track1Ref} wrapRef={wrap1Ref} />
      </div>
    </section>
  );
}