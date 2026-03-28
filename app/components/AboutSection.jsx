import Link from 'next/link';

const STATS = [
  { num: '30',  sup: '+', label: 'Years of Experience'   },
  { num: '500', sup: '+', label: 'Active References'     },
  { num: '6',   sup: '',  label: 'Sectors Served'        },
  { num: '100', sup: '%', label: 'Customer Satisfaction' },
];

const BADGES = [
  { label: 'Fast Delivery',     sub: 'Nationwide logistics' },
  { label: 'Custom Design',     sub: 'Tailored to your needs' },
  { label: 'Certified Quality', sub: 'Controlled production' },
  { label: 'Reliable Service',  sub: 'Consistent partnership' },
];

export default function AboutSection() {
  return (
    <section className="grid grid-cols-2 gap-16 items-start px-16 py-24 bg-white">

      {/* ── Left ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-8 h-px bg-[#0a4c8a]" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0a4c8a]">
            About Us
          </span>
        </div>

        <h2 className="font-condensed text-[38px] font-extrabold uppercase text-[#071e3d] leading-[1.1] mb-5">
          Mavzer Ambalaj —<br />
          <span className="text-[#1e88e5]">Trusted Supplier</span><br />
          Since 1997
        </h2>

        <p className="text-[13px] text-[#6b7380] leading-relaxed mb-8 max-w-sm">
          A sector leader serving cafes, hotels, medical facilities, and industrial plants.
          Over 25 years delivering quality packaging without compromise.
        </p>

        <Link
          href="/corporate"
          className="inline-flex items-center gap-2 border border-[#0a4c8a] text-[#0a4c8a] px-6 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase no-underline transition-all duration-200 hover:bg-[#0a4c8a] hover:text-white"
        >
          Learn More
          <span className="text-base leading-none">→</span>
        </Link>

        <div className="grid grid-cols-2 gap-px mt-10 border border-[#dde4ef] bg-[#dde4ef]">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white px-5 py-6"
            >
              <div className="font-condensed text-[40px] font-extrabold text-[#071e3d] leading-none tracking-tight">
                {s.num}
                {s.sup && (
                  <sup className="text-[#1e88e5] text-lg">{s.sup}</sup>
                )}
              </div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-[#9aa3af] mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right ── */}
      <div className="pt-2">
        <div className="bg-[#071e3d] px-8 py-9 mb-px relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.3) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(255,255,255,0.3) 24px)',
            }}
          />
          <div className="relative">
            <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/25 mb-4">
              Our Commitment
            </div>
            <div className="font-condensed text-[22px] font-bold uppercase text-white mb-2 leading-tight">
              Quality Guaranteed
            </div>
            <p className="text-[12px] text-white/45 leading-relaxed max-w-xs">
              Every product is rigorously controlled from production to delivery,
              meeting the highest standards before it reaches you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#dde4ef] border border-[#dde4ef]">
          {BADGES.map((b) => (
            <div
              key={b.label}
              className="bg-white px-5 py-5 group"
            >
              <div className="w-5 h-px bg-[#1e88e5] mb-3 transition-all duration-300 group-hover:w-8" />
              <div className="text-[11px] font-bold tracking-wider uppercase text-[#071e3d] mb-1">
                {b.label}
              </div>
              <div className="text-[10px] text-[#9aa3af]">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}