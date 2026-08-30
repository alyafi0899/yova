/**
 * YASMIN — Template 02
 * White floral · Champagne gold · Warm ivory
 * Self-contained: import this file, render <Invitation /> with props.
 *
 * Props:
 *   guestName?: string   — displayed on the cover & RSVP
 *   brideName?: string   — bride first name (cover display)
 *   groomName?: string   — groom first name (cover display)
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: '#FFFDF8',
  surface: '#FAF7F1',
  cream: '#F3EBE0',
  gold: '#B8966E',
  goldDark: '#8C6B3A',
  goldLight: '#D4B896',
  ink: '#2C1F0E',
  muted: '#9A8B7A',
  border: '#E6DAC8',
  white: '#FFFFFF',
};

const script = "'Great Vibes', cursive";
const serif = "'Playfair Display', Georgia, serif";
const sans = "'Lato', system-ui, sans-serif";

// ── Unsplash helpers ──────────────────────────────────────────────────────────
function img(id: string, w: number, h: number, crop = 'center') {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=${crop}&auto=format&q=80`;
}

const FLORAL = {
  roseTop: 'photo-1592125661285-79820f2fdf7a',
  roseBouquet: 'photo-1570112008549-e4181988109f',
  roseField: 'photo-1532713031318-db2d14e4b3e1',
  roseClose: 'photo-1625038032128-54ed70feb167',
  roseCluster: 'photo-1615635950368-612392d97dc2',
  peony: 'photo-1685948917497-bb118a732dce',
  peony2: 'photo-1717590432384-a5601edb6cfd',
};

const COUPLES = {
  cover: 'photo-1772241824154-ce6e7c985ff9',
  holdingHands: 'photo-1670014235502-08593dc092b4',
  bride: 'photo-1779144999758-4062528dd799',
  groom: 'photo-1726694064556-c9565e8e81c9',
  portrait: 'photo-1658243862459-145b453dd74e',
  together: 'photo-1644337111604-aa1816b542a1',
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

type RevealDir = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

function useReveal(dir: RevealDir = 'up', delay = 0, threshold = 0.12) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const initialTransform: Record<RevealDir, string> = {
    up: 'translateY(56px)',
    down: 'translateY(-40px)',
    left: 'translateX(-56px)',
    right: 'translateX(56px)',
    fade: 'none',
    scale: 'scale(0.92)',
  };

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : initialTransform[dir],
      transition: `opacity 0.95s ease ${delay}s, transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      willChange: 'opacity, transform',
    } as React.CSSProperties,
  };
}

function useParallax(speed = 0.25) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [target]);

  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

// ── Shared ornaments ──────────────────────────────────────────────────────────

function GoldLine({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${T.gold}60)` }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill={T.gold} opacity="0.8" />
      </svg>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${T.gold}60)` }} />
    </div>
  );
}

function FloralBand({
  photoId,
  height = 160,
  flip = false,
  fromColor = T.bg,
  toColor = T.bg,
}: {
  photoId: string;
  height?: number;
  flip?: boolean;
  fromColor?: string;
  toColor?: string;
}) {
  const pRef = useParallax(0.15);
  return (
    <div
      className="relative w-full overflow-hidden pointer-events-none select-none"
      style={{ height }}
    >
      <div
        ref={pRef}
        className="absolute inset-0 w-full"
        style={{ height: height + 60, top: -30 }}
      >
        <img
          src={img(photoId, 800, height + 60)}
          alt=""
          className="w-full h-full object-cover"
          style={{ transform: flip ? 'scaleX(-1)' : undefined }}
        />
      </div>
      {/* Fade overlay top-to-bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${fromColor} 0%, transparent 35%, transparent 65%, ${toColor} 100%)`,
        }}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="text-[10px] tracking-[0.35em] uppercase text-center"
      style={{ fontFamily: sans, color: T.gold }}
    >
      {children}
    </p>
  );
}

// ── Cover ─────────────────────────────────────────────────────────────────────

function Cover({
  guestName,
  brideName,
  groomName,
  onOpen,
}: {
  guestName: string;
  brideName: string;
  groomName: string;
  onOpen: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: T.bg }}>
      {/* Floral top */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: 200 }}>
        <img
          src={img(FLORAL.roseTop, 900, 400, 'top')}
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${T.bg}10, transparent 30%, transparent 60%, ${T.bg} 100%)` }}
        />
        {/* Bismillah overlay on flowers */}
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1">
          <p
            className="text-base"
            dir="rtl"
            style={{ fontFamily: serif, color: T.goldDark, textShadow: `0 1px 12px ${T.white}` }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        {/* Script headline */}
        <div className="text-center">
          <p
            style={{
              fontFamily: script,
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              color: T.goldDark,
              lineHeight: 1.1,
              letterSpacing: '0.01em',
            }}
          >
            You're
          </p>
          <p
            style={{
              fontFamily: script,
              fontSize: 'clamp(3rem, 10vw, 5.5rem)',
              color: T.gold,
              lineHeight: 0.95,
              letterSpacing: '0.01em',
            }}
          >
            Cordially Invited
          </p>
        </div>

        <GoldLine className="w-52" />

        {/* Couple photo */}
        <div className="relative">
          <div
            className="overflow-hidden mx-auto"
            style={{
              width: 'min(200px, 52vw)',
              aspectRatio: '3/4',
              border: `1px solid ${T.gold}50`,
              boxShadow: `0 20px 60px ${T.ink}15, 0 4px 20px ${T.gold}20`,
            }}
          >
            <img
              src={img(COUPLES.cover, 400, 520)}
              alt={`${brideName} & ${groomName}`}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, transparent 50%, ${T.ink}35 100%)` }}
            />
          </div>
          {/* Offset frame */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '-6px',
              border: `0.5px solid ${T.gold}35`,
            }}
          />
        </div>

        {/* Names */}
        <div className="text-center">
          <p
            className="text-[10px] tracking-[0.35em] uppercase mb-2"
            style={{ fontFamily: sans, color: T.muted }}
          >
            The Wedding of
          </p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 'clamp(1.8rem, 7vw, 3rem)',
              color: T.ink,
              letterSpacing: '0.12em',
              lineHeight: 1.2,
            }}
          >
            {brideName.toUpperCase()} &amp; {groomName.toUpperCase()}
          </h1>
          <p className="text-sm mt-1.5" style={{ fontFamily: sans, color: T.muted }}>
            12 December 2026 · Banda Aceh
          </p>
        </div>

        <GoldLine className="w-52" />

        {/* Guest personalization */}
        <div
          className="text-center px-8 py-4"
          style={{ borderTop: `0.5px solid ${T.gold}40`, borderBottom: `0.5px solid ${T.gold}40` }}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: sans, color: T.muted }}>
            Kepada Yth.
          </p>
          <p className="text-base font-semibold" style={{ fontFamily: serif, color: T.ink }}>
            {guestName}
          </p>
        </div>

        {/* Open button */}
        <div className="text-center flex flex-col items-center gap-3">
          <button
            onClick={onOpen}
            className="relative overflow-hidden group"
            style={{ outline: 'none' }}
          >
            <span
              className="block px-12 py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all duration-500"
              style={{
                fontFamily: sans,
                color: T.bg,
                backgroundColor: T.goldDark,
                letterSpacing: '0.25em',
              }}
            >
              Open Invitation
            </span>
            {/* Shimmer on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: `linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)` }}
            />
          </button>
          <svg className="animate-bounce" width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 2 L8 16 M4 12 L8 16 L12 12" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Floral bottom */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: 180 }}>
        <img
          src={img(FLORAL.peony, 900, 360, 'bottom')}
          alt=""
          className="w-full h-full object-cover object-bottom"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${T.bg}15, transparent 30%, transparent 60%, ${T.bg} 100%)` }}
        />
      </div>
    </div>
  );
}

// ── Quran Section ─────────────────────────────────────────────────────────────

function QuranSection() {
  const a = useReveal('fade', 0);
  const b = useReveal('up', 0.2);
  const c = useReveal('up', 0.45);

  return (
    <section className="relative py-4" style={{ backgroundColor: T.surface }}>
      <FloralBand photoId={FLORAL.roseClose} height={130} fromColor={T.bg} toColor={T.surface} />

      <div className="px-8 py-16 text-center max-w-lg mx-auto flex flex-col items-center gap-8">
        <div ref={a.ref} style={a.style}>
          <SectionLabel>Firman Allah SWT</SectionLabel>
        </div>

        <div ref={b.ref} style={b.style} className="flex flex-col items-center gap-6">
          <GoldLine className="w-48" />
          {/* Rose watermark */}
          <div className="relative">
            <div
              className="absolute -top-8 -left-8 w-24 h-24 opacity-8 pointer-events-none"
              style={{ backgroundImage: `url(${img(FLORAL.roseBouquet, 200, 200)})`, backgroundSize: 'cover', filter: 'sepia(20%) saturate(60%)' }}
            />
            <div
              className="absolute -bottom-6 -right-6 w-20 h-20 opacity-8 pointer-events-none"
              style={{ backgroundImage: `url(${img(FLORAL.roseClose, 160, 160)})`, backgroundSize: 'cover', filter: 'sepia(20%) saturate(60%)', transform: 'rotate(180deg)' }}
            />
            <p
              className="relative text-2xl md:text-3xl leading-relaxed px-6"
              style={{
                fontFamily: serif,
                color: T.ink,
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}
            >
              "And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He placed between you affection and mercy."
            </p>
          </div>
          <GoldLine className="w-48" />
        </div>

        <div ref={c.ref} style={c.style}>
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: sans, color: T.gold }}
          >
            QS. Ar-Rum : 21
          </p>
        </div>
      </div>

      <FloralBand photoId={FLORAL.roseField} height={120} flip toColor={T.bg} fromColor={T.surface} />
    </section>
  );
}

// ── Couple Section ────────────────────────────────────────────────────────────

function CoupleSection({ brideName, groomName }: { brideName: string; groomName: string }) {
  const title = useReveal('fade', 0);
  const bride = useReveal('left', 0.15);
  const groom = useReveal('right', 0.3);

  return (
    <section className="py-24 px-6" style={{ backgroundColor: T.bg }}>
      <div className="max-w-2xl mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-16">
          <SectionLabel>Together in Love</SectionLabel>
          <div className="mt-3 mb-3">
            <p
              style={{
                fontFamily: script,
                fontSize: 'clamp(2.5rem, 8vw, 3.8rem)',
                color: T.goldDark,
                lineHeight: 1.1,
              }}
            >
              The Bride &amp; Groom
            </p>
          </div>
          <GoldLine className="w-40 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Bride */}
          <div ref={bride.ref} style={bride.style} className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div
                className="overflow-hidden mx-auto"
                style={{
                  width: 'min(180px, 46vw)',
                  aspectRatio: '3/4',
                  boxShadow: `0 16px 48px ${T.ink}12, 0 0 0 1px ${T.gold}30`,
                }}
              >
                <img
                  src={img(COUPLES.bride, 360, 480, 'top')}
                  alt={brideName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative rose corner */}
              <div
                className="absolute -bottom-4 -right-4 w-16 h-16 opacity-70 pointer-events-none"
                style={{
                  backgroundImage: `url(${img(FLORAL.roseClose, 120, 120)})`,
                  backgroundSize: 'cover',
                }}
              />
              <div
                className="absolute -top-3 -left-3 w-12 h-12 opacity-60 pointer-events-none"
                style={{
                  backgroundImage: `url(${img(FLORAL.roseBouquet, 100, 100)})`,
                  backgroundSize: 'cover',
                }}
              />
            </div>
            <div>
              <p style={{ fontFamily: script, fontSize: '2rem', color: T.goldDark, lineHeight: 1.1 }}>
                {brideName}
              </p>
              <p className="text-xl mt-1 mb-3" style={{ fontFamily: serif, color: T.ink }}>
                Zahra Aulia Putri
              </p>
              <p className="text-xs mb-1" style={{ fontFamily: sans, color: T.muted }}>Putri dari</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: T.ink }}>
                Bapak Ahmad Fauzi<br />
                <span style={{ color: T.muted }}>&amp;</span><br />
                Ibu Siti Rahmah
              </p>
            </div>
          </div>

          {/* Groom */}
          <div ref={groom.ref} style={groom.style} className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div
                className="overflow-hidden mx-auto"
                style={{
                  width: 'min(180px, 46vw)',
                  aspectRatio: '3/4',
                  boxShadow: `0 16px 48px ${T.ink}12, 0 0 0 1px ${T.gold}30`,
                }}
              >
                <img
                  src={img(COUPLES.groom, 360, 480, 'top')}
                  alt={groomName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 opacity-70 pointer-events-none"
                style={{
                  backgroundImage: `url(${img(FLORAL.roseClose, 120, 120)})`,
                  backgroundSize: 'cover',
                  transform: 'rotate(90deg)',
                }}
              />
              <div
                className="absolute -top-3 -right-3 w-12 h-12 opacity-60 pointer-events-none"
                style={{
                  backgroundImage: `url(${img(FLORAL.roseField, 100, 100)})`,
                  backgroundSize: 'cover',
                }}
              />
            </div>
            <div>
              <p style={{ fontFamily: script, fontSize: '2rem', color: T.goldDark, lineHeight: 1.1 }}>
                {groomName}
              </p>
              <p className="text-xl mt-1 mb-3" style={{ fontFamily: serif, color: T.ink }}>
                Rafi Maulana
              </p>
              <p className="text-xs mb-1" style={{ fontFamily: sans, color: T.muted }}>Putra dari</p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: T.ink }}>
                Bapak Hendra Maulana<br />
                <span style={{ color: T.muted }}>&amp;</span><br />
                Ibu Nur Aisyah
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Story Section ─────────────────────────────────────────────────────────────

const story = [
  { year: '2019', title: 'First Meeting', desc: 'Bertemu untuk pertama kalinya di sebuah acara kampus yang tak terduga dan tak terlupakan.', side: 'left' },
  { year: '2021', title: 'A New Chapter', desc: 'Persahabatan yang tumbuh perlahan menjadi sesuatu yang jauh lebih bermakna dari yang pernah kami bayangkan.', side: 'right' },
  { year: '2025', title: 'The Proposal', desc: 'Rafi melamar Zahra dengan penuh cinta dan doa di bawah langit senja Banda Aceh yang indah.', side: 'left' },
  { year: '2026', title: 'The Beginning of Forever', desc: 'Kami memulai babak baru kehidupan bersama, diikat oleh cinta, doa, dan ridho-Nya.', side: 'right' },
] as const;

function StoryEntry({ s, i }: { s: (typeof story)[number]; i: number }) {
  const { ref, style } = useReveal(s.side === 'left' ? 'left' : 'right', i * 0.15);
  return (
    <div ref={ref} style={style} className={`flex items-start gap-6 ${s.side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ backgroundColor: T.gold + '20', border: `1.5px solid ${T.gold}` }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: T.gold }} />
        </div>
        {i < story.length - 1 && (
          <div className="w-px flex-1 min-h-[60px]" style={{ backgroundColor: `${T.gold}30` }} />
        )}
      </div>
      <div className="pb-8">
        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-1"
          style={{ fontFamily: sans, color: T.gold }}
        >
          {s.year}
        </p>
        <h3
          className="text-2xl mb-2"
          style={{ fontFamily: serif, color: T.ink }}
        >
          {s.title}
        </h3>
        <p className="text-sm leading-relaxed max-w-xs" style={{ fontFamily: sans, color: T.muted }}>
          {s.desc}
        </p>
      </div>
    </div>
  );
}

function StorySection() {
  const title = useReveal('fade');
  return (
    <section className="py-4" style={{ backgroundColor: T.surface }}>
      <FloralBand photoId={FLORAL.roseBouquet} height={140} fromColor={T.bg} toColor={T.surface} />

      <div className="py-16 px-8 max-w-md mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-14">
          <SectionLabel>Perjalanan Kami</SectionLabel>
          <p
            className="mt-3"
            style={{ fontFamily: script, fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', color: T.goldDark }}
          >
            Our Story
          </p>
        </div>

        <div>
          {story.map((s, i) => (
            <StoryEntry key={i} s={s} i={i} />
          ))}
        </div>
      </div>

      <FloralBand photoId={FLORAL.roseCluster} height={130} flip fromColor={T.surface} toColor={T.bg} />
    </section>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function CountdownSection({ brideName, groomName }: { brideName: string; groomName: string }) {
  const wedding = new Date(2026, 11, 12, 8, 0, 0);
  const t = useCountdown(wedding);
  const aTitle = useReveal('fade');
  const aNums = useReveal('scale', 0.2);
  const aSub = useReveal('up', 0.4);

  return (
    <section className="relative py-24 px-6 text-center overflow-hidden" style={{ backgroundColor: T.bg }}>
      {/* Floral bg with strong overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={img(FLORAL.roseTop, 900, 500)}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(40%) brightness(110%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${T.bg}E0, ${T.bg}D0, ${T.bg}E8)` }}
        />
      </div>

      <div className="relative max-w-xl mx-auto flex flex-col items-center gap-10">
        <div ref={aTitle.ref} style={aTitle.style} className="flex flex-col items-center gap-3">
          <SectionLabel>Menghitung Hari</SectionLabel>
          <p style={{ fontFamily: script, fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: T.goldDark }}>
            Counting Down to Our Day
          </p>
          <GoldLine className="w-48" />
        </div>

        <div ref={aNums.ref} style={aNums.style} className="flex justify-center gap-4 md:gap-8">
          {[
            { v: t.days, l: 'Days' },
            { v: t.hours, l: 'Hours' },
            { v: t.minutes, l: 'Minutes' },
            { v: t.seconds, l: 'Seconds' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 'min(72px, 18vw)',
                  height: 'min(80px, 20vw)',
                  border: `1px solid ${T.gold}50`,
                  backgroundColor: T.white + '80',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span
                  className="tabular-nums"
                  style={{ fontFamily: serif, fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', color: T.ink }}
                >
                  {String(v).padStart(2, '0')}
                </span>
              </div>
              <span
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: sans, color: T.gold }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>

        <div ref={aSub.ref} style={aSub.style} className="flex flex-col items-center gap-2">
          <GoldLine className="w-48" />
          <p className="text-sm" style={{ fontFamily: serif, color: T.muted, fontStyle: 'italic' }}>
            Saturday, 12 December 2026
          </p>
          <p style={{ fontFamily: script, fontSize: '1.8rem', color: T.gold }}>
            {brideName} &amp; {groomName}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Events Section ────────────────────────────────────────────────────────────

function EventCard({
  title,
  time,
  venue,
  address,
  delay,
}: {
  title: string;
  time: string;
  venue: string;
  address: string;
  delay: number;
}) {
  const { ref, style } = useReveal('up', delay);
  return (
    <div ref={ref} style={{ ...style, flex: 1 }}>
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          border: `1px solid ${T.border}`,
          boxShadow: `0 8px 40px ${T.ink}06`,
        }}
      >
        {/* Photo header */}
        <div className="relative overflow-hidden" style={{ height: 100 }}>
          <img
            src={img(FLORAL.peony2, 400, 200, 'center')}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(50%) brightness(110%)' }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: `${T.ink}55` }}
          >
            <h3
              className="text-lg tracking-widest uppercase"
              style={{ fontFamily: serif, color: T.white, letterSpacing: '0.2em' }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex flex-col items-center gap-4 px-6 py-7 flex-1 text-center"
          style={{ backgroundColor: T.surface }}
        >
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: sans, color: T.muted }}>
              Saturday
            </p>
            <p className="text-2xl" style={{ fontFamily: serif, color: T.ink }}>
              12 December 2026
            </p>
          </div>

          <div className="w-full h-px" style={{ backgroundColor: `${T.gold}30` }} />

          <p className="text-sm font-medium" style={{ fontFamily: sans, color: T.goldDark }}>
            {time}
          </p>

          <div className="w-full h-px" style={{ backgroundColor: `${T.gold}30` }} />

          <div>
            <p className="text-base" style={{ fontFamily: serif, color: T.ink }}>{venue}</p>
            <p className="text-xs mt-1" style={{ fontFamily: sans, color: T.muted }}>{address}</p>
          </div>

          <div className="flex gap-2 w-full">
            <button
              className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#8C6B3A] hover:text-white"
              style={{ fontFamily: sans, color: T.goldDark, border: `1px solid ${T.gold}` }}
            >
              View Map
            </button>
            <button
              className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#B8966E] hover:text-white"
              style={{ fontFamily: sans, color: T.gold, border: `1px solid ${T.gold}60` }}
            >
              + Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsSection() {
  const title = useReveal('fade');
  return (
    <section className="py-4" style={{ backgroundColor: T.surface }}>
      <FloralBand photoId={FLORAL.roseField} height={130} fromColor={T.bg} toColor={T.surface} />

      <div className="py-16 px-6">
        <div ref={title.ref} style={title.style} className="text-center mb-12">
          <SectionLabel>Save the Date</SectionLabel>
          <p className="mt-3" style={{ fontFamily: script, fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: T.goldDark }}>
            Wedding Events
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 max-w-2xl mx-auto">
          <EventCard title="Akad Nikah" time="08:00 – 10:00 WIB" venue="Masjid Al-Hikmah" address="Banda Aceh" delay={0.1} />
          <EventCard title="Walimatul Ursy" time="11:00 – 15:00 WIB" venue="Grand Ballroom Hermes Palace" address="Banda Aceh" delay={0.25} />
        </div>
      </div>

      <FloralBand photoId={FLORAL.roseTop} height={120} flip fromColor={T.surface} toColor={T.bg} />
    </section>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────

const galleryPhotos = [
  { id: COUPLES.cover, alt: 'Bride and groom portrait', tall: true },
  { id: COUPLES.holdingHands, alt: 'Couple holding hands', tall: false },
  { id: COUPLES.portrait, alt: 'Wedding couple posing', tall: false },
  { id: FLORAL.roseTop, alt: 'White roses arrangement', tall: false },
  { id: COUPLES.together, alt: 'Couple together', tall: true },
  { id: FLORAL.peony, alt: 'White peonies', tall: false },
];

function GalleryItem({
  p,
  i,
  onOpen,
}: {
  p: (typeof galleryPhotos)[number];
  i: number;
  onOpen: (i: number) => void;
}) {
  const { ref, style } = useReveal('scale', i * 0.08);
  return (
    <div
      ref={ref}
      style={{ ...style, gridRow: p.tall ? 'span 2' : 'span 1', aspectRatio: p.tall ? '3/4' : '4/3' }}
      className="overflow-hidden group relative cursor-pointer"
      onClick={() => onOpen(i)}
    >
      <img
        src={img(p.id, 500, p.tall ? 650 : 350)}
        alt={p.alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center"
        style={{ backgroundColor: `${T.gold}25` }}
      >
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{ border: `1px solid ${T.white}`, backgroundColor: `${T.white}30` }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2h4v4M14 2l-6 6M6 14H2v-4M2 14l6-6" stroke={T.white} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const title = useReveal('fade');

  const prev = () => setLightbox((i) => (i === null ? 0 : (i - 1 + galleryPhotos.length) % galleryPhotos.length));
  const next = () => setLightbox((i) => (i === null ? 0 : (i + 1) % galleryPhotos.length));

  useEffect(() => {
    if (lightbox === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightbox]);

  return (
    <section className="py-24 px-6" style={{ backgroundColor: T.bg }}>
      <div ref={title.ref} style={title.style} className="text-center mb-12">
        <SectionLabel>Momen Berharga</SectionLabel>
        <p className="mt-3" style={{ fontFamily: script, fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: T.goldDark }}>
          Our Gallery
        </p>
        <GoldLine className="w-40 mx-auto mt-3" />
      </div>

      {/* Masonry grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-w-2xl mx-auto">
        {galleryPhotos.map((p, i) => (
          <GalleryItem key={i} p={p} i={i} onOpen={setLightbox} />
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ backgroundColor: `${T.ink}F2` }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            <img
              key={lightbox}
              src={img(galleryPhotos[lightbox].id, 900, 700)}
              alt={galleryPhotos[lightbox].alt}
              className="w-full max-h-[80vh] object-contain"
              style={{ animation: 'fadeIn 0.3s ease' }}
            />
            <p className="text-center text-xs mt-3" style={{ fontFamily: sans, color: `${T.white}60` }}>
              {lightbox + 1} / {galleryPhotos.length}
            </p>
          </div>
          {[
            { onClick: prev, path: 'M10 3 L5 8 L10 13', side: 'left-4' },
            { onClick: next, path: 'M6 3 L11 8 L6 13', side: 'right-4' },
          ].map(({ onClick, path, side }) => (
            <button
              key={side}
              className={`absolute ${side} top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center`}
              style={{ border: `1px solid ${T.gold}60` }}
              onClick={onClick}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d={path} stroke={T.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
          <button
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center"
            style={{ border: `1px solid ${T.gold}50` }}
            onClick={() => setLightbox(null)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2 L12 12 M12 2 L2 12" stroke={T.white} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

// ── Gift Section ──────────────────────────────────────────────────────────────

interface GiftItem { key: string; label: string; bank: string; number: string; raw: string; holder: string; icon: string; }

function GiftCard({ item, copied, onCopy, delay }: { item: GiftItem; copied: string | null; onCopy: (raw: string, key: string) => void; delay: number }) {
  const { ref, style } = useReveal('up', delay);
  const isCopied = copied === item.key;
  return (
    <div ref={ref} style={{ ...style, backgroundColor: T.bg, border: `1px solid ${T.border}` }} className="p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 flex items-center justify-center text-base" style={{ backgroundColor: T.cream, border: `1px solid ${T.border}` }}>
          {item.icon}
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: sans, color: T.muted }}>{item.label}</p>
      </div>
      <p className="text-2xl" style={{ fontFamily: serif, color: T.ink }}>{item.bank}</p>
      <p className="text-xl tracking-widest my-1" style={{ fontFamily: sans, color: T.goldDark, letterSpacing: '0.15em' }}>{item.number}</p>
      <p className="text-xs mb-5" style={{ fontFamily: sans, color: T.muted }}>a.n. {item.holder}</p>
      <button
        onClick={() => onCopy(item.raw, item.key)}
        className="w-full py-3 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-400"
        style={{ fontFamily: sans, color: isCopied ? T.bg : T.goldDark, backgroundColor: isCopied ? T.goldDark : 'transparent', border: `1px solid ${T.gold}` }}
      >
        {isCopied ? (
          <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6 L5 9 L10 3" stroke={T.bg} strokeWidth="1.5" strokeLinecap="round" /></svg>Copied to Clipboard</>
        ) : 'Copy Number'}
      </button>
    </div>
  );
}

function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const title = useReveal('fade');

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  }

  return (
    <section className="py-4" style={{ backgroundColor: T.surface }}>
      <FloralBand photoId={FLORAL.roseCluster} height={130} fromColor={T.bg} toColor={T.surface} />

      <div className="py-16 px-6 max-w-md mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-12">
          <SectionLabel>Hadiah Pernikahan</SectionLabel>
          <p className="mt-3" style={{ fontFamily: script, fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: T.goldDark }}>
            Wedding Gift
          </p>
          <p className="text-sm mt-3" style={{ fontFamily: sans, color: T.muted, fontStyle: 'italic' }}>
            Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami.
          </p>
        </div>

        <div className="flex flex-col gap-5">
            <GiftCard item={{ key: 'bca', label: 'Bank Transfer', bank: 'BCA', number: '1234 5678 90', raw: '1234567890', holder: 'Zahra Aulia Putri', icon: '🏦' }} copied={copied} onCopy={copy} delay={0.1} />
          <GiftCard item={{ key: 'dana', label: 'Digital Wallet · DANA', bank: 'DANA', number: '0812 3456 7890', raw: '081234567890', holder: 'Zahra Aulia Putri', icon: '💳' }} copied={copied} onCopy={copy} delay={0.25} />
        </div>
      </div>

      <FloralBand photoId={FLORAL.roseBouquet} height={120} flip fromColor={T.surface} toColor={T.bg} />
    </section>
  );
}

// ── RSVP Section ──────────────────────────────────────────────────────────────

function RSVPSection({ brideName, groomName }: { brideName: string; groomName: string }) {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(1);
  const [attendance, setAttendance] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const title = useReveal('fade');
  const form = useReveal('up', 0.2);

  const inputStyle: React.CSSProperties = {
    fontFamily: sans,
    color: T.ink,
    backgroundColor: T.surface,
    border: `1px solid ${T.border}`,
    outline: 'none',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
  };

  if (submitted) {
    return (
      <section className="py-24 px-6 text-center" style={{ backgroundColor: T.bg }}>
        <div className="max-w-sm mx-auto flex flex-col items-center gap-7">
          {/* Floral ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage: `url(${img(FLORAL.roseTop, 200, 200)})`,
                backgroundSize: 'cover',
                opacity: 0.25,
              }}
            />
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16 L13 22 L26 10" stroke={T.goldDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ fontFamily: script, fontSize: '3.5rem', color: T.goldDark, lineHeight: 1.1 }}>
            Thank You!
          </p>
          <GoldLine className="w-40" />
          <p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: T.muted, fontStyle: 'italic' }}>
            "Terima kasih atas konfirmasi dan doa restu Anda. Kehadiran Anda adalah kebahagiaan yang tak ternilai bagi kami."
          </p>
          <p style={{ fontFamily: serif, fontSize: '1.25rem', color: T.ink }}>
            — {brideName} &amp; {groomName}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6" style={{ backgroundColor: T.bg }}>
      <div className="max-w-md mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-12">
          <SectionLabel>Konfirmasi Kehadiran</SectionLabel>
          <p className="mt-3" style={{ fontFamily: script, fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: T.goldDark }}>
            Will You Join Us?
          </p>
          <GoldLine className="w-44 mx-auto mt-4" />
        </div>

        <form
          ref={form.ref}
          style={form.style}
          onSubmit={(e) => {
            e.preventDefault();
            if (name && attendance) setSubmitted(true);
          }}
          className="flex flex-col gap-5"
        >
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap Anda"
              style={{ ...inputStyle, borderColor: name ? `${T.gold}70` : T.border }}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              {['−', '+'].map((op, i) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setGuests((g) => i === 0 ? Math.max(1, g - 1) : Math.min(10, g + 1))}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#B8966E] hover:text-white"
                  style={{ border: `1px solid ${T.gold}60`, fontFamily: sans, color: T.goldDark, fontSize: '1.2rem' }}
                >
                  {op}
                </button>
              ))}
              <span className="text-2xl min-w-[1.5rem] text-center" style={{ fontFamily: serif, color: T.ink }}>
                {guests}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>
              Attendance
            </label>
            <div className="flex flex-col gap-2">
              {['Will Attend', 'Unable to Attend', 'Maybe'].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 cursor-pointer px-4 py-3 transition-all duration-200"
                  style={{
                    border: `1px solid ${attendance === opt ? T.gold : T.border}`,
                    backgroundColor: attendance === opt ? `${T.gold}10` : 'transparent',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `1.5px solid ${attendance === opt ? T.goldDark : T.muted}` }}
                  >
                    {attendance === opt && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: T.goldDark }} />}
                  </div>
                  <input type="radio" className="hidden" value={opt} checked={attendance === opt} onChange={() => setAttendance(opt)} />
                  <span className="text-sm" style={{ fontFamily: sans, color: T.ink }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>
              Message / Wishes
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa untuk Zahra & Rafi..."
              rows={4}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={!name || !attendance}
            className="py-4 text-[11px] tracking-[0.28em] uppercase transition-all duration-400 disabled:opacity-40 relative overflow-hidden group"
            style={{ fontFamily: sans, backgroundColor: T.goldDark, color: T.bg }}
          >
            Confirm RSVP
            <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ background: 'white' }} />
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Closing ───────────────────────────────────────────────────────────────────

function ClosingSection({
  brideName,
  groomName,
  onBackToTop,
}: {
  brideName: string;
  groomName: string;
  onBackToTop: () => void;
}) {
  const a = useReveal('fade');
  const b = useReveal('up', 0.25);
  const c = useReveal('up', 0.5);

  return (
    <section className="relative py-4 overflow-hidden" style={{ backgroundColor: T.surface }}>
      <FloralBand photoId={FLORAL.roseTop} height={180} fromColor={T.bg} toColor={T.surface} />

      <div className="py-20 px-8 text-center max-w-sm mx-auto flex flex-col items-center gap-8">
        <div ref={a.ref} style={a.style}>
          <p style={{ fontFamily: script, fontSize: 'clamp(3rem, 12vw, 5rem)', color: T.goldDark, lineHeight: 1.1 }}>
            Thank You
          </p>
        </div>

        <div ref={b.ref} style={b.style} className="flex flex-col items-center gap-5">
          <GoldLine className="w-48" />
          <p className="text-base leading-relaxed" style={{ fontFamily: serif, color: T.muted, fontStyle: 'italic' }}>
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."
          </p>
          <GoldLine className="w-48" />
        </div>

        <div ref={c.ref} style={c.style} className="flex flex-col items-center gap-4">
          <p style={{ fontFamily: script, fontSize: '2.5rem', color: T.ink }}>
            {brideName} &amp; {groomName}
          </p>
          <p className="text-xs tracking-[0.25em]" style={{ fontFamily: sans, color: T.gold }}>
            12 · 12 · 2026
          </p>

          <button
            onClick={onBackToTop}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase mt-4 transition-opacity hover:opacity-50"
            style={{ fontFamily: sans, color: T.muted }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 9 L6 3 M3 5 L6 3 L9 5" stroke={T.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Top
          </button>
        </div>
      </div>

      <FloralBand photoId={FLORAL.peony} height={160} flip fromColor={T.surface} toColor={T.bg} />
    </section>
  );
}

// ── Section progress indicator ────────────────────────────────────────────────

const SECTION_COUNT = 8;

function ProgressDots({ count }: { count: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.section);
            setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[150] flex flex-col gap-2 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-400"
          style={{
            width: active === i ? 6 : 4,
            height: active === i ? 6 : 4,
            backgroundColor: active === i ? T.goldDark : `${T.gold}50`,
          }}
        />
      ))}
    </div>
  );
}

// ── Floating music button ────────────────────────────────────────────────────

function MusicButton() {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="fixed top-5 left-5 z-[150] w-10 h-10 flex items-center justify-center transition-all duration-300"
      style={{
        backgroundColor: T.bg + 'E0',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${T.gold}50`,
        boxShadow: `0 4px 20px ${T.ink}12`,
      }}
      title={on ? 'Pause music' : 'Play music'}
    >
      {on ? (
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <rect x="1" y="1" width="3.5" height="12" rx="1" fill={T.goldDark} />
          <rect x="7.5" y="1" width="3.5" height="12" rx="1" fill={T.goldDark} />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2 L3 12 L12 7 Z" fill={T.goldDark} />
        </svg>
      )}
    </button>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface InvitationProps {
  guestName?: string;
  brideName?: string;
  groomName?: string;
}

export default function Invitation({
  guestName = 'Bapak Ahmad & Keluarga',
  brideName = 'Zahra',
  groomName = 'Rafi',
}: InvitationProps) {
  const [opened, setOpened] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  function handleOpen() {
    setOpened(true);
    setTimeout(() => setCoverGone(true), 750);
  }

  function backToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div
      className="h-full overflow-y-auto"
      ref={topRef}
      style={{ fontFamily: sans, backgroundColor: T.bg }}
    >
      {/* Cover */}
      {!coverGone && (
        <div
          style={{
            opacity: opened ? 0 : 1,
            transition: 'opacity 0.75s ease',
            pointerEvents: opened ? 'none' : 'auto',
          }}
        >
          <Cover
            guestName={guestName}
            brideName={brideName}
            groomName={groomName}
            onOpen={handleOpen}
          />
        </div>
      )}

      {/* Invitation body */}
      {coverGone && (
        <div style={{ opacity: 0, animation: 'fadeIn 0.8s ease 0.1s forwards' }}>
          <MusicButton />
          <ProgressDots count={SECTION_COUNT} />

          <div data-section="0"><QuranSection /></div>
          <div data-section="1"><CoupleSection brideName={brideName} groomName={groomName} /></div>
          <div data-section="2"><StorySection /></div>
          <div data-section="3"><CountdownSection brideName={brideName} groomName={groomName} /></div>
          <div data-section="4"><EventsSection /></div>
          <div data-section="5"><GallerySection /></div>
          <div data-section="6"><GiftSection /></div>
          <div data-section="7">
            <RSVPSection brideName={brideName} groomName={groomName} />
          </div>
          <ClosingSection
            brideName={brideName}
            groomName={groomName}
            onBackToTop={backToTop}
          />
        </div>
      )}
    </div>
  );
}
