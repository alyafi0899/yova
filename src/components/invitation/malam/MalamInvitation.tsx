/**
 * MALAM — Template 03
 * Dark luxury · Animated gold floral frame · Envelope opening
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InvitationData } from '../../../lib/invitation/types';

// ── tokens ────────────────────────────────────────────────────────────────────
const T = {
  bg: '#2D0B0F',         // Deep Burgundy
  surface: '#3D1217',    // Deep Wine
  elevated: '#4A181D',   // Rich Maroon
  high: '#5C1F26',       // Bright Maroon
  gold: '#E0B394',       // Rose Gold
  goldBright: '#F7D7C4', // Soft Rose Gold
  goldDim: '#8A5A44',    // Muted Bronze
  goldBorder: '#632B2E', // Dark Wine Border
  cream: '#F7E7E8',      // Warm Ivory with Pink Hint
  muted: '#A37F7F',      // Muted Mauve
  blush: '#D48C8C',      // Deep Blush
  wax: '#5C0A0A',        // Deep Blood Red Wax
  border: '#4A181D',     // Maroon Border
  vine: '#4A5D23',       // Olive Vine
  leaf: '#3A4B1C',       // Dark Olive Leaf
};

const serif = "'Playfair Display', Georgia, serif";
const script = "'Great Vibes', cursive";
const sans = "'Lato', system-ui, sans-serif";

function un(id: string, w: number, h: number, crop = 'center') {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=${crop}&auto=format&q=80`;
}

const PH = {
  cover: 'photo-1772241824154-ce6e7c985ff9',
  bride: 'photo-1779144999758-4062528dd799',
  groom: 'photo-1726694064556-c9565e8e81c9',
  couple2: 'photo-1670014235502-08593dc092b4',
  couple3: 'photo-1658243862459-145b453dd74e',
  couple4: 'photo-1644337111604-aa1816b542a1',
  dark1: 'photo-1487528742387-d53d4f12488d',
  dark2: 'photo-1647496087770-be3541b9a468',
};

// ── CSS animations ────────────────────────────────────────────────────────────
function AnimStyles() {
  return (
    <style>{`
      @keyframes floatPetal {
        0%   { opacity:0;   transform: translateY(-20px) translateX(0px)   rotate(0deg); }
        10%  { opacity:0.6; }
        90%  { opacity:0.2; }
        100% { opacity:0;   transform: translateY(108vh) translateX(50px) rotate(700deg); }
      }
      @keyframes floatPetalL {
        0%   { opacity:0;   transform: translateY(-20px) translateX(0px)    rotate(0deg); }
        10%  { opacity:0.5; }
        90%  { opacity:0.15; }
        100% { opacity:0;   transform: translateY(108vh) translateX(-55px) rotate(-640deg); }
      }
      @keyframes roseBreathe {
        0%,100% { transform: scale(1); }
        50%     { transform: scale(1.06); }
      }
      @keyframes leafSway {
        0%,100% { transform: rotate(0deg); }
        33%     { transform: rotate(6deg); }
        66%     { transform: rotate(-5deg); }
      }
      @keyframes vineDraw {
        to { stroke-dashoffset: 0; }
      }
      @keyframes petalBloom {
        from { transform: scale(0) rotate(-110deg); opacity:0; }
        to   { transform: scale(1) rotate(0deg);   opacity:1; }
      }
      @keyframes twinkle {
        0%,100% { opacity:0.1; transform:scale(0.6); }
        50%     { opacity:1;   transform:scale(1.3); }
      }
      @keyframes subtleFloat {
        0%,100% { transform: translateY(0px); }
        50%     { transform: translateY(-7px); }
      }
      @keyframes envelopeFlap {
        0%  { transform: rotateX(0deg);    opacity:1;   }
        65% { transform: rotateX(-175deg); opacity:0.2; }
        100%{ transform: rotateX(-180deg); opacity:0;   }
      }
      @keyframes cardEmerge {
        0%   { transform: translateY(0); }
        100% { transform: translateY(-64%); }
      }
      @keyframes sealOut {
        0%   { transform: scale(1) rotate(0deg);  opacity:1; }
        100% { transform: scale(0.5) rotate(20deg); opacity:0; }
      }
      @keyframes malamFadeIn {
        from { opacity:0; }
        to   { opacity:1; }
      }
      @keyframes shimmerGold {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes borderDraw {
        from { clip-path: inset(0 100% 0 0); }
        to   { clip-path: inset(0 0% 0 0); }
      }
      @keyframes countTick {
        from { opacity:0; transform:translateY(14px) scale(0.88); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes progressGrow {
        from { transform:scaleX(0); }
        to   { transform:scaleX(1); }
      }
      .gold-shimmer-text {
        background: linear-gradient(90deg, #E0B394 0%, #F7D7C4 30%, #E0B394 50%, #F7D7C4 70%, #E0B394 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmerGold 3.5s linear infinite;
      }
      .env-flap-open { animation: envelopeFlap 1s cubic-bezier(0.4,0,0.2,1) forwards; }
      .env-card-rise  { animation: cardEmerge 1.3s cubic-bezier(0.16,1,0.3,1) 0.5s forwards; }
      .seal-out       { animation: sealOut 0.5s ease forwards; }
    `}</style>
  );
}

// ── hooks ─────────────────────────────────────────────────────────────────────
type RevDir = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

function useReveal(dir: RevDir = 'up', delay = 0, threshold = 0.12) {
  const ref = useRef<any>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  const map: Record<RevDir, string> = {
    up: 'translateY(52px)', down: 'translateY(-36px)',
    left: 'translateX(-52px)', right: 'translateX(52px)',
    fade: 'none', scale: 'scale(0.9)',
  };
  return {
    ref,
    style: {
      opacity: v ? 1 : 0,
      transform: v ? 'none' : map[dir],
      transition: `opacity 1s ease ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      willChange: 'opacity, transform',
    } as React.CSSProperties,
  };
}

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const d = target.getTime() - Date.now();
    if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [calc]);
  return t;
}

// ── floating petals ───────────────────────────────────────────────────────────
interface PetalDef { id: number; left: number; size: number; delay: number; dur: number; anim: string; }

function Petal({ p }: { p: PetalDef }) {
  return (
    <div
      key={p.id}
      style={{
        position: 'absolute',
        left: `${p.left}%`,
        top: '-30px',
        width: p.size,
        height: p.size * 0.6,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: T.gold,
        opacity: 0,
        animation: `${p.anim} ${p.dur}s ease-in ${p.delay}s infinite`,
        pointerEvents: 'none',
      }}
    />
  );
}

function FloatingPetals() {
  const petals = useMemo<PetalDef[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: 5 + (i * 6.8) % 90,
      size: 5 + (i * 3.7) % 9,
      delay: (i * 1.3) % 9,
      dur: 7 + (i * 2.1) % 8,
      anim: i % 2 === 0 ? 'floatPetal' : 'floatPetalL',
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
      {petals.map((p) => <Petal key={p.id} p={p} />)}
    </div>
  );
}

// ── floral frame SVG ──────────────────────────────────────────────────────────
function FloralCorner({ animated }: { animated: boolean }) {
  const vineStyle = (len: number, delay: number): React.CSSProperties => animated
    ? { strokeDasharray: len, strokeDashoffset: len, animation: `vineDraw 1.4s cubic-bezier(0.4,0,0.2,1) ${delay}s forwards` }
    : { strokeDasharray: len, strokeDashoffset: 0 };

  const roseStyle = (delay: number): React.CSSProperties => ({
    transformBox: 'fill-box', transformOrigin: 'center',
    ...(animated
      ? { transform: 'scale(0)', animation: `petalBloom 0.9s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards, roseBreathe 4s ease-in-out ${delay + 1}s infinite` }
      : { animation: 'roseBreathe 4s ease-in-out infinite' }),
  });

  const leafStyle = (delay: number): React.CSSProperties => ({
    transformBox: 'fill-box', transformOrigin: 'center',
    ...(animated
      ? { transform: 'scale(0)', animation: `petalBloom 0.7s ease ${delay}s backwards, leafSway 5s ease-in-out ${delay + 0.7}s infinite` }
      : { animation: 'leafSway 5s ease-in-out infinite' }),
  });

  return (
    <svg width="210" height="210" viewBox="0 0 210 210" fill="none" overflow="visible">
      <path d="M 4 4 C 35 20 65 50 100 100 C 120 130 138 148 155 165" stroke={T.goldDim} strokeWidth="1.3" strokeLinecap="round" style={vineStyle(225, 0.1)} />
      <path d="M 4 4 C 45 2 90 4 125 12" stroke={T.goldDim} strokeWidth="1" strokeLinecap="round" style={vineStyle(125, 0.6)} />
      <path d="M 4 4 C 2 45 4 90 12 125" stroke={T.goldDim} strokeWidth="1" strokeLinecap="round" style={vineStyle(125, 0.6)} />
      <path d="M 60 68 Q 80 48 98 58" stroke={T.goldDim} strokeWidth="0.8" strokeLinecap="round" style={vineStyle(55, 1.0)} />
      <path d="M 68 60 Q 48 80 58 98" stroke={T.goldDim} strokeWidth="0.8" strokeLinecap="round" style={vineStyle(55, 1.0)} />
      <path d="M 85 12 Q 90 4 100 8 Q 97 18 88 16" stroke={T.goldDim} strokeWidth="0.7" strokeLinecap="round" style={vineStyle(48, 1.2)} />
      <path d="M 12 85 Q 4 90 8 100 Q 18 97 16 88" stroke={T.goldDim} strokeWidth="0.7" strokeLinecap="round" style={vineStyle(48, 1.2)} />
      <path d="M 55 45 C 32 28 20 8 38 4 C 50 22 55 45" fill={T.leaf} opacity="0.85" style={leafStyle(1.0)} />
      <path d="M 45 55 C 28 32 8 20 4 38 C 22 50 45 55" fill={T.leaf} opacity="0.85" style={leafStyle(1.1)} />
      <path d="M 88 88 C 65 68 58 45 72 40 C 78 62 88 88" fill={T.leaf} opacity="0.8" style={leafStyle(1.3)} />
      <path d="M 25 50 C 8 36 12 14 28 12 C 32 30 25 50" fill={T.leaf} opacity="0.7" style={leafStyle(1.2)} />
      <path d="M 50 25 C 36 8 14 12 12 28 C 30 32 50 25" fill={T.leaf} opacity="0.7" style={leafStyle(1.2)} />
      <g transform="translate(100,100)" style={roseStyle(1.7)}>
        {[0,60,120,180,240,300].map(deg => (
          <path key={deg} d="M 0 -23 C -9 -16,-13 -7,-7 0 C -3 -4,3 -4,7 0 C 13 -7,9 -16,0 -23 Z" fill={T.gold} opacity="0.72" transform={`rotate(${deg})`} />
        ))}
        {[30,90,150,210,270,330].map(deg => (
          <path key={deg} d="M 0 -14 C -5 -10,-8 -4,-4 0 C -1.5 -2.5,1.5 -2.5,4 0 C 8 -4,5 -10,0 -14 Z" fill={T.goldBright} opacity="0.9" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="4.5" fill={T.goldBright} />
      </g>
      <g transform="translate(115,12)" style={roseStyle(2.1)}>
        {[0,72,144,216,288].map(deg => (
          <path key={deg} d="M 0 -13 C -5 -9,-7 -3,-4 0 C -1.5 -2,1.5 -2,4 0 C 7 -3,5 -9,0 -13 Z" fill={T.blush} opacity="0.88" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="3" fill={T.gold} />
      </g>
      <g transform="translate(12,115)" style={roseStyle(2.2)}>
        {[0,72,144,216,288].map(deg => (
          <path key={deg} d="M 0 -13 C -5 -9,-7 -3,-4 0 C -1.5 -2,1.5 -2,4 0 C 7 -3,5 -9,0 -13 Z" fill={T.blush} opacity="0.88" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="3" fill={T.gold} />
      </g>
      <g transform="translate(155,165)" style={roseStyle(2.4)}>
        {[0,72,144,216,288].map(deg => (
          <path key={deg} d="M 0 -10 C -4 -7,-5 -2,-3 0 C -1 -1.5,1 -1.5,3 0 C 5 -2,4 -7,0 -10 Z" fill={T.gold} opacity="0.75" transform={`rotate(${deg})`} />
        ))}
        <circle cx="0" cy="0" r="2.5" fill={T.goldBright} />
      </g>
      {([[45,22],[22,45],[72,35],[35,72],[55,10],[10,55]] as [number,number][]).map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={T.gold} opacity="0.5" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `twinkle ${2.2 + i * 0.6}s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
    </svg>
  );
}

function FloralFrame({ animate }: { animate: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      <div className="absolute top-0 left-0"><FloralCorner animated={animate} /></div>
      <div className="absolute top-0 right-0" style={{ transform: 'scaleX(-1)' }}><FloralCorner animated={animate} /></div>
      <div className="absolute bottom-0 left-0" style={{ transform: 'scaleY(-1)' }}><FloralCorner animated={animate} /></div>
      <div className="absolute bottom-0 right-0" style={{ transform: 'scale(-1)' }}><FloralCorner animated={animate} /></div>
    </div>
  );
}

// ── scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct(el.scrollTop / (el.scrollHeight - el.clientHeight));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]" style={{ backgroundColor: `${T.goldBorder}` }}>
      <div className="h-full origin-left transition-transform duration-100" style={{ transform: `scaleX(${pct})`, backgroundColor: T.gold }} />
    </div>
  );
}

// ── shared components ─────────────────────────────────────────────────────────
function GoldLine({ className = '', short = false }: { className?: string; short?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`h-px ${short ? 'w-10' : 'flex-1'}`} style={{ background: `linear-gradient(to right, transparent, ${T.gold}55)` }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill={T.gold} opacity="0.7" /></svg>
      <div className={`h-px ${short ? 'w-10' : 'flex-1'}`} style={{ background: `linear-gradient(to left, transparent, ${T.gold}55)` }} />
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return <p className="text-[10px] tracking-[0.35em] uppercase text-center" style={{ fontFamily: sans, color: T.gold }}>{children}</p>;
}

// ── envelope cover ────────────────────────────────────────────────────────────
function EnvelopeCover({
  guestName, brideName, groomName, onFullyOpen,
}: {
  guestName: string; brideName: string; groomName: string; onFullyOpen: () => void;
}) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  function handleOpen() { setPhase(1); setTimeout(() => { setPhase(2); }, 1600); setTimeout(() => { onFullyOpen(); }, 3200); }
  const EW = 'min(300px, 78vw)';
  const EH_NUM = 200;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: T.bg }}>
      <div className="absolute inset-0 pointer-events-none"><img src={un(PH.dark1, 900, 700)} alt="" className="w-full h-full object-cover opacity-15" /><div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${T.bg}90 30%, ${T.bg} 100%)` }} /></div>
      <div className="relative z-10 text-center mb-10" style={{ animation: 'malamFadeIn 1.2s ease 0.3s both' }}><p dir="rtl" style={{ fontFamily: serif, fontSize: '1.15rem', color: T.gold, letterSpacing: '0.04em' }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><p className="text-[9px] tracking-[0.3em] uppercase mt-1" style={{ fontFamily: sans, color: T.muted }}>Bismillahirrahmanirrahim</p></div>
      <div className="relative z-10" style={{ width: EW, perspective: '1100px', perspectiveOrigin: 'center top' }}>
        <div className={phase >= 1 ? 'env-card-rise' : ''} style={{ position: 'absolute', left: '8%', right: '8%', bottom: 16, height: EH_NUM * 0.9, backgroundColor: T.elevated, border: `1px solid ${T.gold}40`, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20, overflow: 'hidden' }}><div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url(${un(PH.dark2, 400, 200)})`, backgroundSize: 'cover' }} /><p style={{ fontFamily: script, fontSize: '1.6rem', color: T.gold, lineHeight: 1 }}>{brideName} &amp; {groomName}</p><p className="text-[9px] tracking-[0.25em] uppercase" style={{ fontFamily: sans, color: T.muted }}>12 · 12 · 2026</p><GoldLine className="w-24" /><p className="text-[8px] text-center leading-loose tracking-wider" style={{ fontFamily: sans, color: `${T.cream}60` }}>You're Cordially Invited</p></div>
        <div style={{ position: 'relative', width: '100%', height: EH_NUM, backgroundColor: T.surface, border: `1px solid ${T.gold}50`, zIndex: 3 }}><svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M 0 100 L 50 55 L 100 100" stroke={`${T.gold}25`} strokeWidth="0.5" fill="none" /><path d="M 0 0 L 50 45 L 100 0" stroke={`${T.gold}20`} strokeWidth="0.3" fill="none" /><path d="M 0 0 L 0 100" stroke={`${T.gold}20`} strokeWidth="0.3" /><path d="M 100 0 L 100 100" stroke={`${T.gold}20`} strokeWidth="0.3" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center gap-2"><p style={{ fontFamily: serif, fontSize: '1.3rem', color: T.cream, letterSpacing: '0.12em' }}>{brideName.toUpperCase()} &amp; {groomName.toUpperCase()}</p><p style={{ fontFamily: sans, fontSize: '0.6rem', color: T.muted, letterSpacing: '0.2em' }}>12 DECEMBER 2026</p></div></div>
        <div style={{ position: 'absolute', top: 0, left: '-1px', right: '-1px', height: EH_NUM * 0.55, zIndex: 4, perspective: 1100, perspectiveOrigin: 'top center' }}><div className={phase === 1 ? 'env-flap-open' : ''} style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 50% 82%)', backgroundColor: T.elevated, border: `1px solid ${T.gold}55`, transformOrigin: 'top center', backfaceVisibility: 'hidden', zIndex: 4 }}><div className={phase === 1 ? 'seal-out' : ''} style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', width: 38, height: 38, borderRadius: '50%', backgroundColor: T.wax, border: `1.5px solid ${T.goldDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 12px ${T.wax}80` }}><p style={{ fontFamily: serif, fontSize: '0.62rem', color: T.goldBright, letterSpacing: '0.05em' }}>Z&amp;R</p></div></div></div>
      </div>
      <div className="relative z-10 text-center mt-8" style={{ animation: 'malamFadeIn 1s ease 0.8s both' }}><p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: sans, color: T.muted }}>Kepada Yth.</p><p style={{ fontFamily: serif, fontSize: '1rem', color: T.cream }}>{guestName}</p></div>
      {phase === 0 && (<button onClick={handleOpen} className="relative z-10 mt-8 group" style={{ animation: 'malamFadeIn 1s ease 1.2s both' }}><span className="block px-10 py-3 text-[11px] tracking-[0.3em] uppercase relative overflow-hidden" style={{ fontFamily: sans, color: T.gold, border: `1px solid ${T.gold}70` }}><span className="relative z-10">Open Invitation</span><span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ backgroundColor: T.gold + '25' }} /></span><svg className="mx-auto mt-3 animate-bounce" width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M7 2 L7 14 M3 10 L7 14 L11 10" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>)}
      {phase === 2 && (<p className="relative z-10 mt-6 text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: sans, color: T.muted, animation: 'malamFadeIn 0.6s ease forwards' }}>Opening your invitation…</p>)}
    </div>
  );
}

// ── quran section ─────────────────────────────────────────────────────────────
function QuranSection({ config }: { config: any }) {
  const a = useReveal('fade', 0);
  const b = useReveal('up', 0.2);
  const c = useReveal('up', 0.45);
  return (
    <section className="relative py-28 px-8" style={{ backgroundColor: T.surface }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden"><img src={un(PH.dark2, 900, 400)} alt="" className="w-full h-full object-cover opacity-8" /><div className="absolute inset-0" style={{ background: `linear-gradient(${T.surface}E0, ${T.surface}C0, ${T.surface}E8)` }} /></div>
      <div className="max-w-lg mx-auto relative flex flex-col items-center gap-8 text-center">
        <div ref={a.ref} style={a.style}><Tag>Firman Allah SWT</Tag></div>
        <div ref={b.ref} style={b.style} className="flex flex-col items-center gap-7 w-full">
          <GoldLine />
          <div className="relative px-8 py-10" style={{ border: `1px solid ${T.goldBorder}` }}><div className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: T.gold }} /><div className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: T.gold }} /><div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: T.gold }} /><div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: T.gold }} /><p style={{ fontFamily: serif, fontSize: 'clamp(1.2rem,3.5vw,1.7rem)', color: T.cream, fontStyle: 'italic', lineHeight: 1.75 }}>{config?.verse || '"And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He placed between you affection and mercy."'}</p></div>
          <GoldLine />
        </div>
        <div ref={c.ref} style={c.style}><p className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: sans, color: T.gold }}>{config?.reference || 'QS. Ar-Rum : 21'}</p></div>
      </div>
    </section>
  );
}

// ── couple section ────────────────────────────────────────────────────────────
function CoupleSection({ data, config }: { data: InvitationData, config: any }) {
  const title = useReveal('fade');
  const bride = useReveal('left', 0.15);
  const groom = useReveal('right', 0.3);
  return (
    <section className="py-28 px-6" style={{ backgroundColor: T.bg }}>
      <div className="max-w-2xl mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-16">
          <Tag>{config?.tagline || 'Together in Love'}</Tag>
          <p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(2.2rem,8vw,3.8rem)', color: T.gold }}>{config?.title || 'The Bride & Groom'}</p>
          <GoldLine className="w-48 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {[
            { who: data.couple.bride.name.split(' ')[0], full: data.couple.bride.name, par: 'Putri', parents: data.couple.bride.parents, photo: data.couple.bride.image || PH.bride, anim: bride },
            { who: data.couple.groom.name.split(' ')[0], full: data.couple.groom.name, par: 'Putra', parents: data.couple.groom.parents, photo: data.couple.groom.image || PH.groom, anim: groom },
          ].map((p) => (
            <div key={p.who} ref={p.anim.ref} style={p.anim.style} className="flex flex-col items-center gap-5 text-center">
              <div className="relative group">
                <div className="overflow-hidden mx-auto transition-transform duration-700 group-hover:scale-[1.02]" style={{ width: 'min(180px,46vw)', aspectRatio: '3/4', border: `1px solid ${T.goldBorder}`, boxShadow: `0 20px 60px ${T.bg}80, 0 0 0 1px ${T.goldDim}30` }}><img src={p.photo.startsWith('http') ? p.photo : un(p.photo, 360, 480, 'top')} alt={p.full} className="w-full h-full object-cover" /><div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 55%, ${T.bg}50 100%)` }} /></div>
                {[['top-0 left-0', 'border-t border-l'], ['top-0 right-0', 'border-t border-r'], ['bottom-0 left-0', 'border-b border-l'], ['bottom-0 right-0', 'border-b border-r']].map(([pos, border]) => (<div key={pos} className={`absolute ${pos} w-5 h-5 ${border}`} style={{ borderColor: T.gold }} />))}
              </div>
              <div><p style={{ fontFamily: script, fontSize: '2rem', color: T.gold, lineHeight: 1.1 }}>{p.who}</p><p className="text-lg mt-1" style={{ fontFamily: serif, color: T.cream }}>{p.full}</p><p className="text-xs mt-3 mb-1" style={{ fontFamily: sans, color: T.muted }}>{p.par} dari</p><p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: `${T.cream}80` }}>{p.parents}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── story section ─────────────────────────────────────────────────────────────
function StoryEntry({ s, i, total }: { s: any; i: number; total: number }) {
  const side = i % 2 === 0 ? 'left' : 'right';
  const { ref, style } = useReveal(side, i * 0.15);
  return (
    <div ref={ref} style={style} className={`flex items-start gap-5 ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0"><div className="w-10 h-10 flex items-center justify-center" style={{ border: `1px solid ${T.gold}70` }}><div className="w-2.5 h-2.5" style={{ backgroundColor: T.gold }} /></div>{i < total - 1 && <div className="w-px min-h-[56px] flex-1" style={{ backgroundColor: `${T.goldBorder}` }} />}</div>
      <div className="pb-8"><p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: sans, color: T.gold }}>{s?.year || '20xx'}</p><h3 className="text-2xl mb-2" style={{ fontFamily: serif, color: T.cream }}>{s?.title || 'Our Story'}</h3><p className="text-sm leading-relaxed max-w-xs" style={{ fontFamily: sans, color: T.muted }}>{s?.desc || 'Story description...'}</p></div>
    </div>
  );
}

function StorySection({ config }: { config: any }) {
  const title = useReveal('fade');
  const items = config?.items || [];
  return (
    <section className="py-28 px-8" style={{ backgroundColor: T.surface }}>
      <div className="max-w-md mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-16"><Tag>{config?.tagline || 'Perjalanan Kami'}</Tag><p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(2rem,8vw,3.5rem)', color: T.gold }}>{config?.title || 'Our Story'}</p><GoldLine className="w-44 mx-auto mt-4" /></div>
        {items.map((s: any, i: number) => <StoryEntry key={i} s={s} i={i} total={items.length} />)}
      </div>
    </section>
  );
}

// ── countdown ─────────────────────────────────────────────────────────────────
function CountdownSection({ brideName, groomName, config }: { brideName: string; groomName: string; config: any }) {
  const wedding = new Date(config?.targetDate || '2026-12-12T08:00:00');
  const t = useCountdown(wedding);
  const { ref: titleRef, style: titleStyle } = useReveal('fade');
  const { ref: numsRef, style: numsStyle } = useReveal('scale', 0.25);
  const { ref: subRef, style: subStyle } = useReveal('up', 0.5);

  return (
    <section className="relative py-28 px-6 overflow-hidden text-center" style={{ backgroundColor: T.bg }}>
      <div className="absolute inset-0 pointer-events-none"><div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${T.elevated}90, ${T.bg} 80%)` }} />{[140, 200, 260].map((r) => (<div key={r} className="absolute rounded-full" style={{ top: '50%', left: '50%', width: r * 2, height: r * 2, marginTop: -r, marginLeft: -r, border: `1px solid ${T.gold}${r === 140 ? '18' : '0C'}`, animation: `subtleFloat ${3 + r / 80}s ease-in-out infinite alternate` }} />))}</div>
      <div className="relative max-w-xl mx-auto flex flex-col items-center gap-10">
        <div ref={titleRef} style={titleStyle} className="flex flex-col items-center gap-3"><Tag>{config?.tagline || 'Menghitung Hari'}</Tag><p className="gold-shimmer-text" style={{ fontFamily: script, fontSize: 'clamp(2rem,8vw,3.5rem)', lineHeight: 1.1 }}>{config?.title || 'Counting Down to Our Day'}</p><GoldLine className="w-48" /></div>
        <div ref={numsRef} style={numsStyle} className="flex justify-center gap-4 md:gap-7">{[{ v: t.days, l: 'Days' }, { v: t.hours, l: 'Hours' }, { v: t.minutes, l: 'Min' }, { v: t.seconds, l: 'Sec' }].map(({ v, l }) => (<div key={l} className="flex flex-col items-center gap-2"><div className="relative flex items-center justify-center" style={{ width: 'min(74px,19vw)', height: 'min(80px,20vw)', border: `1px solid ${T.goldBorder}`, backgroundColor: T.elevated }}><div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: T.gold }} /><div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: T.gold }} /><div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: T.gold }} /><div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: T.gold }} /><span key={v} className="tabular-nums" style={{ fontFamily: serif, fontSize: 'clamp(1.6rem,5vw,2.4rem)', color: T.cream, animation: 'countTick 0.3s ease' }}>{String(v).padStart(2, '0')}</span></div><span className="text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: sans, color: T.gold }}>{l}</span></div>))}</div>
        <div ref={subRef} style={subStyle} className="flex flex-col items-center gap-2"><GoldLine className="w-48" /><p style={{ fontFamily: serif, fontSize: '1.1rem', color: `${T.cream}70`, fontStyle: 'italic' }}>{wedding.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p><p style={{ fontFamily: script, fontSize: '1.8rem', color: T.gold }}>{brideName} &amp; {groomName}</p></div>
      </div>
    </section>
  );
}

// ── events section ────────────────────────────────────────────────────────────
function DarkEventCard({ ev, delay }: { ev: any; delay: number }) {
  const { ref, style } = useReveal('up', delay);
  return (
    <div ref={ref} style={{ ...style, flex: 1 }}>
      <div className="h-full flex flex-col overflow-hidden group transition-all duration-500 hover:shadow-2xl" style={{ border: `1px solid ${T.goldBorder}`, boxShadow: `0 8px 40px ${T.bg}60` }}>
        <div className="relative overflow-hidden" style={{ height: 90 }}><img src={un(PH.dark1, 500, 180)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'brightness(0.5) saturate(60%)' }} /><div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${T.bg}40` }}><h3 style={{ fontFamily: serif, fontSize: '1.1rem', color: T.cream, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{ev.name}</h3></div><div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: T.gold + '60' }} /></div>
        <div className="flex flex-col items-center gap-4 px-6 py-7 flex-1 text-center" style={{ backgroundColor: T.surface }}>
          <div><p className="text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: sans, color: T.muted }}>Tanggal</p><p className="text-xl" style={{ fontFamily: serif, color: T.cream }}>{ev.date}</p></div>
          <div className="w-full h-px" style={{ backgroundColor: T.goldBorder }} />
          <p className="text-sm font-medium" style={{ fontFamily: sans, color: T.gold }}>{ev.time}</p>
          <div className="w-full h-px" style={{ backgroundColor: T.goldBorder }} />
          <div><p className="text-base" style={{ fontFamily: serif, color: T.cream }}>{ev.venue}</p><p className="text-xs mt-1" style={{ fontFamily: sans, color: T.muted }}>{ev.address}</p></div>
          <div className="flex gap-2 w-full mt-auto">
            {ev.mapsLink && <a href={ev.mapsLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#D4A553] hover:text-[#110C08] text-center" style={{ fontFamily: sans, color: T.gold, border: `1px solid ${T.goldBorder}` }}>View Map</a>}
            <button className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#D4A553] hover:text-[#110C08]" style={{ fontFamily: sans, color: T.gold, border: `1px solid ${T.goldBorder}` }}>+ Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsSection({ config }: { config: any }) {
  const title = useReveal('fade');
  const events = config?.events || [];
  return (
    <section className="py-28 px-6" style={{ backgroundColor: T.elevated }}>
      <div ref={title.ref} style={title.style} className="text-center mb-14"><Tag>{config?.tagline || 'Save the Date'}</Tag><p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(2rem,8vw,3.5rem)', color: T.gold }}>{config?.title || 'Wedding Events'}</p></div>
      <div className="flex flex-col md:flex-row gap-5 max-w-2xl mx-auto">{events.map((ev: any, i: number) => <DarkEventCard key={i} ev={ev} delay={i * 0.15 + 0.1} />)}</div>
    </section>
  );
}

// ── gallery ───────────────────────────────────────────────────────────────────
function GalItem({ url, i, onOpen }: { url: string; i: number; onOpen: (i: number) => void }) {
  const { ref, style } = useReveal('scale', i * 0.07);
  const isTall = i % 4 === 0 || i % 4 === 3;
  return (
    <div ref={ref} style={{ ...style, gridRow: isTall ? 'span 2' : 'span 1', aspectRatio: isTall ? '3/4' : '4/3', cursor: 'pointer' }} className="overflow-hidden group relative" onClick={() => onOpen(i)}><img src={url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center" style={{ backgroundColor: `${T.bg}50` }}><div className="w-10 h-10 flex items-center justify-center" style={{ border: `1px solid ${T.gold}` }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 2h4v4M12 2l-5 5M6 12H2v-4M2 12l5-5" stroke={T.gold} strokeWidth="1.2" strokeLinecap="round" /></svg></div></div><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ border: `1px solid ${T.gold}60` }} /></div>
  );
}

function GallerySection({ config }: { config: any }) {
  const [lb, setLb] = useState<number | null>(null);
  const title = useReveal('fade');
  const images = config?.images || [];
  const prev = () => setLb((i) => i === null ? 0 : (i - 1 + images.length) % images.length);
  const next = () => setLb((i) => i === null ? 0 : (i + 1) % images.length);
  useEffect(() => { if (lb === null) return; const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [lb, images.length]);
  return (
    <section className="py-28 px-6" style={{ backgroundColor: T.bg }}>
      <div ref={title.ref} style={title.style} className="text-center mb-12"><Tag>{config?.tagline || 'Momen Berharga'}</Tag><p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(2rem,8vw,3.5rem)', color: T.gold }}>Our Gallery</p><GoldLine className="w-40 mx-auto mt-4" /></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-w-2xl mx-auto">{images.map((url: string, i: number) => <GalItem key={i} url={url} i={i} onOpen={setLb} />)}</div>
      {lb !== null && (<div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ backgroundColor: `${T.bg}F5` }} onClick={() => setLb(null)}><div className="relative max-w-xl w-full px-4" onClick={(e) => e.stopPropagation()}><img key={lb} src={images[lb]} alt="Gallery" className="w-full max-h-[80vh] object-contain" style={{ border: `1px solid ${T.goldBorder}`, animation: 'malamFadeIn 0.35s ease' }} /><p className="text-center text-xs mt-3" style={{ fontFamily: sans, color: T.muted }}>{lb + 1} / {images.length}</p></div>{[{ fn: prev, d: 'left-4', path: 'M10 3 L5 8 L10 13' }, { fn: next, d: 'right-4', path: 'M6 3 L11 8 L6 13' }].map(({ fn, d, path }) => (<button key={d} className={`absolute ${d} top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center`} style={{ border: `1px solid ${T.gold}60` }} onClick={fn}><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d={path} stroke={T.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>))}<button className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${T.gold}50` }} onClick={() => setLb(null)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2 L10 10 M10 2 L2 10" stroke={T.cream} strokeWidth="1.5" strokeLinecap="round" /></svg></button></div>)}
    </section>
  );
}

// ── gift section ──────────────────────────────────────────────────────────────
function DarkGiftCard({ acc, copied, onCopy, delay }: { acc: any; copied: string | null; onCopy: (r: string, k: string) => void; delay: number }) {
  const { ref, style } = useReveal('up', delay);
  const key = `${acc.bank}-${acc.number}`;
  const done = copied === key;
  return (
    <div ref={ref} style={{ ...style, border: `1px solid ${T.goldBorder}`, backgroundColor: T.surface, padding: '1.75rem' }}>
      <p className="text-[10px] tracking-[0.25em] uppercase mb-5" style={{ fontFamily: sans, color: T.muted }}>{acc.type}</p>
      <p className="text-2xl mb-1" style={{ fontFamily: serif, color: T.cream }}>{acc.bank}</p>
      <p className="text-xl tracking-widest my-1" style={{ fontFamily: sans, color: T.gold, letterSpacing: '0.15em' }}>{acc.number}</p>
      <p className="text-xs mb-5" style={{ fontFamily: sans, color: T.muted }}>a.n. {acc.holder}</p>
      <button onClick={() => onCopy(acc.number, key)} className="w-full py-3 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-400" style={{ fontFamily: sans, color: done ? T.bg : T.gold, backgroundColor: done ? T.gold : 'transparent', border: `1px solid ${T.goldBorder}` }}>{done ? 'Copied' : 'Copy Number'}</button>
    </div>
  );
}

function GiftSection({ config }: { config: any }) {
  const [copied, setCopied] = useState<string | null>(null);
  const title = useReveal('fade');
  const accounts = config?.accounts || [];
  function copy(raw: string, key: string) { navigator.clipboard.writeText(raw).catch(() => {}); setCopied(key); setTimeout(() => setCopied(null), 2200); }
  return (
    <section className="py-28 px-6" style={{ backgroundColor: T.elevated }}>
      <div ref={title.ref} style={title.style} className="text-center mb-12 max-w-md mx-auto"><Tag>{config?.tagline || 'Hadiah Pernikahan'}</Tag><p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(2rem,8vw,3.5rem)', color: T.gold }}>Wedding Gift</p><p className="text-sm mt-3" style={{ fontFamily: sans, color: T.muted, fontStyle: 'italic' }}>{config?.description}</p></div>
      <div className="flex flex-col gap-5 max-w-md mx-auto">{accounts.map((acc: any, i: number) => <DarkGiftCard key={i} acc={acc} copied={copied} onCopy={copy} delay={i * 0.15 + 0.1} />)}</div>
    </section>
  );
}

// ── rsvp section ──────────────────────────────────────────────────────────────
function RSVPSection({ brideName, groomName, onRSVP }: { brideName: string; groomName: string; onRSVP?: (rsvp: any) => void }) {
  const [name, setName] = useState('');
  const [att, setAtt] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const title = useReveal('fade');
  const form = useReveal('up', 0.2);
  const inp: React.CSSProperties = { fontFamily: sans, color: T.cream, backgroundColor: T.surface, border: `1px solid ${T.goldBorder}`, outline: 'none', width: '100%', padding: '0.7rem 1rem', fontSize: '0.875rem' };

  if (done) {
    return (
      <section className="py-28 px-6 text-center" style={{ backgroundColor: T.bg }}>
        <div className="max-w-xs mx-auto flex flex-col items-center gap-7" style={{ animation: 'malamFadeIn 0.7s ease forwards' }}><div className="w-16 h-16 flex items-center justify-center" style={{ border: `1px solid ${T.gold}60` }}><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14 L11 19 L22 9" stroke={T.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div><p className="gold-shimmer-text" style={{ fontFamily: script, fontSize: 'clamp(2.5rem,10vw,4rem)', lineHeight: 1.1 }}>Thank You</p><GoldLine className="w-44" /><p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: T.muted, fontStyle: 'italic' }}>"Terima kasih atas konfirmasi dan doa restu Anda."</p><p style={{ fontFamily: serif, fontSize: '1.1rem', color: T.cream }}>— {brideName} &amp; {groomName}</p></div>
      </section>
    );
  }

  return (
    <section className="py-28 px-6" style={{ backgroundColor: T.bg }}>
      <div className="max-w-md mx-auto">
        <div ref={title.ref} style={title.style} className="text-center mb-12"><Tag>Konfirmasi Kehadiran</Tag><p className="mt-4" style={{ fontFamily: script, fontSize: 'clamp(2rem,8vw,3.5rem)', color: T.gold }}>Will You Join Us?</p><GoldLine className="w-44 mx-auto mt-4" /></div>
        <form ref={form.ref} style={form.style} onSubmit={(e) => { e.preventDefault(); if (name && att) { onRSVP?.({ name, attendance: att, message: msg, guests: 1 }); setDone(true); } }} className="flex flex-col gap-5">
          <div><label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap Anda" style={inp} /></div>
          <div><label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>Attendance</label><div className="flex flex-col gap-2">{['Hadir', 'InsyaAllah', 'Tidak'].map((opt) => (<label key={opt} className="flex items-center gap-3 cursor-pointer px-4 py-3 transition-all duration-200" style={{ border: `1px solid ${att === opt ? T.gold : T.goldBorder}`, backgroundColor: att === opt ? `${T.gold}10` : 'transparent' }}><div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${att === opt ? T.gold : T.muted}` }}>{att === opt && <div className="w-2 h-2" style={{ backgroundColor: T.gold }} />}</div><input type="radio" className="hidden" value={opt} checked={att === opt} onChange={() => setAtt(opt)} /><span className="text-sm" style={{ fontFamily: sans, color: T.cream }}>{opt}</span></label>))}</div></div>
          <div><label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: sans, color: T.muted }}>Message / Wishes</label><textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={`Ucapan dan doa untuk ${brideName} & ${groomName}...`} rows={4} style={{ ...inp, resize: 'none' }} /></div>
          <button type="submit" disabled={!name || !att} className="py-4 text-[11px] tracking-[0.28em] uppercase transition-all duration-400 disabled:opacity-30 relative overflow-hidden group" style={{ fontFamily: sans, backgroundColor: T.gold + '20', color: T.gold, border: `1px solid ${T.gold}` }}><span className="relative z-10">Confirm RSVP</span><span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: T.gold + '20' }} /></button>
        </form>
      </div>
    </section>
  );
}

// ── closing ───────────────────────────────────────────────────────────────────
function ClosingSection({ brideName, groomName, config, onBackToTop }: { brideName: string; groomName: string; config: any; onBackToTop: () => void }) {
  const a = useReveal('fade');
  const b = useReveal('up', 0.3);
  const c = useReveal('up', 0.6);
  return (
    <section className="relative py-32 px-8 text-center overflow-hidden" style={{ backgroundColor: T.surface }}>
      <div className="absolute inset-0 pointer-events-none"><img src={un(PH.dark1, 900, 500)} alt="" className="w-full h-full object-cover opacity-10" /><div className="absolute inset-0" style={{ background: `linear-gradient(${T.surface}E5, ${T.surface}C0, ${T.surface}E5)` }} /></div>
      <div className="relative max-w-sm mx-auto flex flex-col items-center gap-9">
        <div ref={a.ref} style={a.style}><p className="gold-shimmer-text" style={{ fontFamily: script, fontSize: 'clamp(3rem,12vw,5.5rem)', lineHeight: 1 }}>Thank You</p></div>
        <div ref={b.ref} style={b.style} className="flex flex-col items-center gap-6"><GoldLine /><p className="text-base leading-relaxed" style={{ fontFamily: serif, color: `${T.cream}80`, fontStyle: 'italic' }}>{config?.message || '"Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."'}</p><GoldLine /></div>
        <div ref={c.ref} style={c.style} className="flex flex-col items-center gap-4"><p style={{ fontFamily: script, fontSize: '2.6rem', color: T.gold }}>{brideName} &amp; {groomName}</p><p className="text-xs tracking-[0.3em]" style={{ fontFamily: sans, color: T.muted }}>{config?.date || '12 · 12 · 2026'}</p><button onClick={onBackToTop} className="flex items-center gap-2 mt-3 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-50" style={{ fontFamily: sans, color: T.muted }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9 L6 3 M3 5 L6 3 L9 5" stroke={T.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>Back to Top</button></div>
      </div>
    </section>
  );
}

// ── music button ──────────────────────────────────────────────────────────────
function MusicBtn() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(v => !v)} className="fixed top-5 left-5 z-[150] w-10 h-10 flex items-center justify-center transition-all duration-300 rounded-full" style={{ backgroundColor: T.elevated, border: `1px solid ${T.goldBorder}`, boxShadow: `0 4px 20px ${T.bg}` }} title={on ? 'Pause' : 'Play'}>{on ? '🔇' : '🎵'}</button>
  );
}

// ── section progress dots ─────────────────────────────────────────────────────
function SectionDots({ count }: { count: number }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const secs = document.querySelectorAll('[data-malam-section]');
    const obs = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.malamSection)); }), { threshold: 0.5 });
    secs.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[150] flex flex-col gap-2 pointer-events-none">{Array.from({ length: count }).map((_, i) => (<div key={i} className="rounded-full transition-all duration-400" style={{ width: active === i ? 7 : 4, height: active === i ? 7 : 4, backgroundColor: active === i ? T.gold : `${T.goldDim}60` }} />))}</div>
  );
}

// ── main export ───────────────────────────────────────────────────────────────
export default function MalamInvitation({
  data,
  guestName = 'Bapak Ahmad & Keluarga',
  onRSVP,
  externalIndex
}: {
  data: InvitationData;
  guestName?: string;
  onRSVP?: (rsvp: any) => void;
  externalIndex?: number;
}) {
  const [opened, setOpened] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [frameAnimated, setFrameAnimated] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const sectionIds = ['cover', 'quran', 'couple', 'story', 'countdown', 'event', 'gallery', 'gift', 'rsvp', 'closing'];

  useEffect(() => {
    if (externalIndex !== undefined && externalIndex >= 0) {
       const id = sectionIds[externalIndex];
       if (id) {
          if (!opened && id !== 'cover') { setOpened(true); setCoverGone(true); setFrameAnimated(true); }
          setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 100);
       }
    }
  }, [externalIndex, opened]);

  const getSection = (id: string) => data?.sections?.find(s => s.id === id);

  function handleFullyOpen() { setOpened(true); setTimeout(() => { setCoverGone(true); setFrameAnimated(true); }, 600); }
  function backToTop() { topRef.current?.scrollIntoView({ behavior: 'smooth' }); }

  const bName = data?.couple?.bride?.name?.split(' ')[0] || 'Bride';
  const gName = data?.couple?.groom?.name?.split(' ')[0] || 'Groom';

  return (
    <div ref={topRef} className="fixed inset-0 overflow-y-auto bg-[#2D0B0F] scroll-smooth" style={{ backgroundColor: T.bg, fontFamily: sans }}>
      <AnimStyles />
      <FloatingPetals />
      <FloralFrame animate={frameAnimated} />
      {opened && <ScrollProgress />}
      {opened && <SectionDots count={8} />}
      {opened && <MusicBtn />}

      {!coverGone && (
        <div style={{ opacity: opened ? 0 : 1, transition: 'opacity 0.7s ease', pointerEvents: opened ? 'none' : 'auto' }}>
          <EnvelopeCover guestName={guestName} brideName={bName} groomName={gName} onFullyOpen={handleFullyOpen} />
        </div>
      )}

      {opened && (
        <div className="relative animate-in fade-in duration-1000">
          <div data-malam-section="1" id="quran"><QuranSection config={getSection('quran')?.config} /></div>
          <div data-malam-section="2" id="couple"><CoupleSection data={data} config={getSection('couple')?.config} /></div>
          <div data-malam-section="3" id="story"><StorySection config={getSection('story')?.config} /></div>
          <div data-malam-section="4" id="countdown"><CountdownSection brideName={bName} groomName={gName} config={getSection('countdown')?.config} /></div>
          <div data-malam-section="5" id="event"><EventsSection config={getSection('event')?.config} /></div>
          <div data-malam-section="6" id="gallery"><GallerySection config={getSection('gallery')?.config} /></div>
          <div data-malam-section="7" id="gift"><GiftSection config={getSection('gift')?.config} /></div>
          <div data-malam-section="8" id="rsvp" className="pb-20"><RSVPSection brideName={bName} groomName={gName} onRSVP={onRSVP} /></div>
          <div id="closing"><ClosingSection brideName={bName} groomName={gName} config={getSection('closing')?.config} onBackToTop={backToTop} /></div>
        </div>
      )}
    </div>
  );
}
