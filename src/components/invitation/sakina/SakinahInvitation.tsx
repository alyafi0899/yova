import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import type { InvitationData } from '../../../lib/invitation/types';

// ── Design System ──────────────────────────────────────────────────────────

const C = {
  forest: '#17352F',
  gold: '#C7A96B',
  cream: '#F9F7F2',
  ivory: '#FAF9F6',
  ink: '#2A2A2A',
  muted: '#8D897E',
  watercolor: '#F4F1EC',
  paper: '#FFFDF9',
  surface: '#FFFDF9'
};

const serif = "'Playfair Display', Georgia, serif";

// Reliable High-Quality Wedding Assets
const FALLBACK_MEDIA = {
  hero: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  bride: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
  groom: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  story: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80"
  ]
};

// ── Shared Visual Components ────────────────────────────────────────────────

function PaperTexture() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply overflow-hidden z-0">
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

function IslamicStar({ size = 64, opacity = 0.08, color = C.gold }: { size?: number; opacity?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }}>
      <polygon points="32,4 37,24 57,24 41,36 47,56 32,44 17,56 23,36 7,24 27,24" fill={color} />
      <polygon points="32,12 36,26 50,26 39,34 43,48 32,40 21,48 25,34 14,26 28,26" fill={C.forest} />
      <circle cx="32" cy="32" r="4" fill={color} opacity="0.6" />
    </svg>
  );
}

function WaveSeparator() {
  return (
    <div className="absolute left-0 right-0 w-full z-20 pointer-events-none" style={{ bottom: '-1px' }}>
      <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '80px', width: '100%' }}>
        <path d="M0.00,49.98 C150.00,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: C.cream }}></path>
      </svg>
    </div>
  );
}

function SectionScene({ id, children, bg = C.cream, minHeight = "100vh" }: { id: string, children: React.ReactNode, bg?: string, minHeight?: string }) {
  return (
    <section
      id={id}
      className="relative w-full flex flex-col items-center shrink-0"
      style={{ backgroundColor: bg, minHeight }}
    >
      <PaperTexture />
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto overflow-hidden">
        {children}
      </div>
    </section>
  );
}

function HorizontalTakeoverSection({ id, title, tagline, children, light = false, bg, itemsCount, containerRef }: { id: string, title: string, tagline?: string, children: React.ReactNode, light?: boolean, bg?: string, itemsCount: number, containerRef: any }) {
  const targetRef = useRef(null);
  const heightFactor = Math.max(2, itemsCount * 1.2);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(itemsCount - 1) * 100}%`]);
  const smoothX = useSpring(x, { stiffness: 120, damping: 20, restDelta: 0.001 });

  return (
    <section ref={targetRef} id={id} className="relative w-full" style={{ height: `${heightFactor * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center pt-16" style={{ backgroundColor: bg || (light ? C.surface : C.ivory) }}>
        <PaperTexture />

        <div className="text-center relative z-30 pointer-events-none shrink-0 px-4">
          <p className="text-[8px] tracking-[0.4em] uppercase mb-0.5 text-gold font-bold">{tagline}</p>
          <h2 className="text-2xl text-ink font-serif italic leading-none">{title}</h2>
          <div className="w-10 h-px bg-gold/20 mx-auto mt-4" />
        </div>

        <div className="w-full relative z-10 overflow-hidden mt-6">
          <motion.div style={{ x: smoothX }} className="flex items-start">
             {children}
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 opacity-30">
           {Array.from({ length: itemsCount }).map((_, i) => (
             <div key={i} className="w-1 h-1 rounded-full border border-gold/40" />
           ))}
        </div>
      </div>
    </section>
  );
}

function VerticalTakeoverSection({ id, title, tagline, children, itemsCount, containerRef, bg = C.cream }: { id: string, title: string, tagline?: string, children: React.ReactNode, itemsCount: number, containerRef: any, bg?: string }) {
  const targetRef = useRef(null);
  const heightFactor = Math.max(2.5, itemsCount * 1.5);
  const { scrollYProgress } = useScroll({ target: targetRef, container: containerRef, offset: ["start start", "end end"] });

  return (
    <section ref={targetRef} id={id} className="relative w-full" style={{ height: `${heightFactor * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center pt-16" style={{ backgroundColor: bg }}>
        <PaperTexture />

        <div className="text-center relative z-50 pointer-events-none shrink-0 px-4">
          <p className="text-[9px] tracking-[0.6em] uppercase text-gold font-bold mb-0.5">{tagline}</p>
          <h2 className="text-4xl text-ink leading-none italic" style={{ fontFamily: serif }}>{title}</h2>
          <div className="w-8 h-px bg-gold/30 mx-auto mt-4" />
        </div>

        <div className="w-full relative z-10 overflow-hidden flex-1 min-h-0">
           {children && Array.isArray(children) ? children.map((child, i) => {
              const start = i / itemsCount;
              const end = (i + 1) / itemsCount;
              const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);
              const exitY = useTransform(scrollYProgress, [end, end + 0.1], ["0%", "-20%"]);
              const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

              return (
                <motion.div
                  key={i}
                  style={{ y: i === 0 ? exitY : y, opacity }}
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-start pt-6"
                >
                   {child}
                </motion.div>
              );
           }) : children}
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 opacity-30">
           {Array.from({ length: itemsCount }).map((_, i) => (
             <div key={i} className="w-[1.5px] h-6 rounded-full border border-gold/20 relative overflow-hidden bg-gold/5">
                <motion.div
                   style={{ height: useTransform(scrollYProgress, [i/itemsCount, (i+1)/itemsCount], ["0%", "100%"]) }}
                   className="absolute top-0 left-0 w-full bg-gold"
                />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}

// ── Section Components ───────────────────────────────────────────────────────

function EnvelopeReveal({ guestName, onOpen, data }: { guestName: string, onOpen: () => void, data: InvitationData }) {
  const [isOpening, setIsOpening] = useState(false);
  const brideFirst = data?.couple?.bride?.name?.split(' ')[0] || 'Bride';
  const groomFirst = data?.couple?.groom?.name?.split(' ')[0] || 'Groom';

  return (
    <div className="fixed inset-0 z-[1000] bg-ivory flex items-center justify-center overflow-hidden">
      <PaperTexture />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#E8E4DF_100%)] opacity-50" />
      <div className="relative w-[340px] h-[480px] perspective-2000 flex flex-col items-center">
        <div className="relative w-full h-[240px] mt-20">
          <motion.div
            initial={{ y: 0 }}
            animate={isOpening ? { y: -180, z: 100, scale: 1.05 } : { y: 0 }}
            transition={{ delay: 0.8, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-2 bg-white shadow-2xl p-6 text-center flex flex-col items-center justify-center border border-gold/10 z-10"
            style={{ backgroundImage: 'radial-gradient(circle at top right, #FDFCFB 0%, #F4F1EC 100%)' }}
          >
            <div className="w-12 h-12 opacity-10 mb-4"><IslamicStar size={48} /></div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-muted mb-3 font-bold">Official Invitation</p>
            <h2 className="text-3xl text-forest font-serif italic leading-tight">{brideFirst} & {groomFirst}</h2>
            <div className="w-8 h-px bg-gold/30 my-6" />
            <div className="space-y-1">
               <p className="text-[9px] uppercase tracking-widest text-muted">Kepada Yth.</p>
               <p className="text-xl text-ink font-serif italic">{guestName}</p>
            </div>
          </motion.div>
          <div className="absolute inset-0 bg-[#E0DDD5] shadow-2xl z-20" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 50% 45%)' }} />
          <div className="absolute inset-0 bg-[#D8D4CC] z-30 shadow-inner" style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }} />
          <div className="absolute inset-0 bg-[#D8D4CC] z-30 shadow-inner" style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }} />
          <div className="absolute inset-0 bg-[#EBE7DF] z-40 border-t border-white/20 shadow-[-5px_-5px_20px_rgba(0,0,0,0.03)]" style={{ clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)' }} />
          <motion.div
            animate={isOpening ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 50 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#F4F1EA] origin-top border-b border-black/5 shadow-2xl"
            style={{ clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%)', backfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg border-[3px] border-white/30">
               <span className="text-white text-lg font-serif">S</span>
               <div className="absolute inset-0 rounded-full border border-forest/10 m-1" />
            </div>
          </motion.div>
        </div>
        {!isOpening && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-24 flex flex-col items-center gap-6">
            <div className="text-center">
               <p className="text-[10px] tracking-[0.6em] uppercase text-gold font-bold mb-2">You're Invited</p>
               <h3 className="text-2xl text-charcoal font-serif italic">{brideFirst} & {groomFirst}</h3>
            </div>
            <button onClick={() => { setIsOpening(true); setTimeout(onOpen, 3500); }} className="group relative px-12 py-4 bg-forest text-gold text-[10px] font-bold uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all overflow-hidden"><span className="relative z-10">Buka Undangan</span><div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" /></button>
          </motion.div>
        )}
      </div>
      <AnimatePresence>{isOpening && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 2.8, duration: 1 }} className="absolute inset-0 bg-cream z-[2000] flex items-center justify-center"><motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20"><IslamicStar size={80} /></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}

function HeroSection({ config, data, guestName }: { config: any, data: InvitationData, guestName: string }) {
  const photo = config?.couplePhoto || FALLBACK_MEDIA.hero;
  const brideFirst = data?.couple?.bride?.name?.split(' ')[0] || 'Bride';
  const groomFirst = data?.couple?.groom?.name?.split(' ')[0] || 'Groom';

  return (
    <SectionScene id="cover" bg={C.cream}>
       <div className="absolute top-0 left-0 w-full h-[55%] overflow-hidden bg-muted/10">
          <img src={photo} className="w-full h-full object-cover object-[center_20%]" alt="The Couple" />
          <WaveSeparator />
       </div>
       <div className="absolute bottom-0 left-0 w-full h-[50%] flex flex-col items-center justify-start px-8 text-center z-30 pt-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-4 w-full">
             <h1 className="text-6xl sm:text-7xl text-ink font-normal leading-none" style={{ fontFamily: serif, fontStyle: 'italic', letterSpacing: '-0.02em' }}>{brideFirst} <span className="text-xl font-sans text-muted align-middle not-italic lowercase mx-2">and</span> {groomFirst}</h1>
             <p className="text-[12px] tracking-[0.4em] text-gold font-bold uppercase mt-4">{config?.tagline || 'invite you to their wedding'}</p>
             <div className="pt-6 space-y-2">
                <p className="text-[11px] font-bold tracking-[0.4em] text-ink uppercase">{config?.dateText || 'Saturday 12/12/26 • 17:00'}</p>
                <p className="text-[10px] tracking-[0.2em] text-muted uppercase">{config?.locationText || 'The Grand Ballroom • Santa Clara'}</p>
             </div>
             <div className="pt-12 flex flex-col items-center gap-3 opacity-30"><div className="w-10 h-px bg-gold" /><p className="text-[8px] tracking-[0.4em] uppercase text-ink font-bold">Scroll Down</p></div>
          </motion.div>
       </div>
    </SectionScene>
  );
}

function IntroductionSection({ config }: { config: any }) {
  const text = config?.invitationText || "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.";
  return (
    <SectionScene id="introduction">
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-10">
        <div className="w-20 h-20 opacity-10"><IslamicStar size={80} /></div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} className="text-lg leading-relaxed text-muted font-serif italic px-4">{text}</motion.p>
        <div className="w-12 h-px bg-gold/40" />
      </div>
    </SectionScene>
  );
}

function QuranSection({ config }: { config: any }) {
  const verse = config?.verse || "And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He placed between you affection and mercy.";
  const refText = config?.reference || "QS. Ar-Rum : 21";
  return (
    <SectionScene id="quran" bg={C.paper}>
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-12">
        <p className="text-[10px] tracking-[0.6em] uppercase text-gold font-bold italic opacity-60">The Holy Verse</p>
        <motion.p initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} className="text-3xl leading-snug text-ink font-serif italic max-w-xs px-2">"{verse}"</motion.p>
        <p className="text-[11px] tracking-[0.4em] text-gold font-bold uppercase">{refText}</p>
      </div>
    </SectionScene>
  );
}

function CoupleCard({ person, isBride }: { person: any, isBride: boolean }) {
  const photo = person?.image || (isBride ? FALLBACK_MEDIA.bride : FALLBACK_MEDIA.groom);
  return (
    <div className="min-w-full h-full flex shrink-0 items-start justify-center p-4 overflow-hidden">
       <div className="w-full max-w-[280px] flex flex-col items-center relative">
          <div className="w-full aspect-[4/5] relative z-20 overflow-hidden shadow-2xl rounded-t-[5rem] border-[6px] border-white"><img src={photo} className="w-full h-full object-cover" alt={person?.name} /></div>
          <div className="mt-8 text-center space-y-2">
             <h3 className="text-3xl text-ink font-serif italic leading-tight">{person?.name || (isBride ? 'Bride' : 'Groom')}</h3>
             <div className="flex flex-col items-center gap-1.5 opacity-60 mb-2"><div className="w-6 h-[0.5px] bg-gold/40" /><p className="text-[9px] text-muted tracking-widest font-bold uppercase">{isBride ? 'Daughter of' : 'Son of'}</p></div>
             <p className="text-sm text-ink font-serif italic">{person?.parents || 'Parents Name'}</p>
          </div>
       </div>
    </div>
  );
}

function StoryCard({ item, index }: { item: any, index: number }) {
  const photo = item?.image || FALLBACK_MEDIA.story;
  return (
    <div className="w-full flex flex-col items-center gap-2 px-10">
       <div className="flex flex-col items-center shrink-0"><div className="w-px h-6 bg-ink/20" /><div className="bg-cream p-1 rounded-full shadow-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill={C.ink}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
       <div className="flex items-center gap-6 w-full max-w-md">
          <div className="flex-1 flex justify-end"><div className="bg-white p-2 pb-6 shadow-2xl border border-black/5 rounded-sm origin-center w-full max-w-[160px]" style={{ transform: `rotate(${index % 2 === 0 ? '-3' : '3'}deg)` }}><div className="aspect-square overflow-hidden bg-muted/5"><img src={photo} className="w-full h-full object-cover" alt="Moment" /></div></div></div>
          <div className="flex-1 text-left space-y-1.5 min-w-0"><p className="text-[11px] font-bold tracking-[0.4em] uppercase text-gold italic leading-none">{item?.year || '20xx'}</p><h3 className="text-lg font-bold tracking-widest text-ink uppercase leading-tight truncate">{item?.title || 'Our Story'}</h3><div className="w-6 h-[0.5px] bg-gold/40" /><p className="text-sm leading-relaxed text-muted font-serif italic line-clamp-4">{item?.desc || 'Description of our beautiful memory goes here.'}</p></div>
       </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="min-w-full h-full flex shrink-0 items-start justify-center p-4">
       <div className="w-full max-w-[300px] bg-paper p-10 text-center space-y-10 shadow-2xl relative border border-gold/10">
          <div className="space-y-2"><p className="text-[10px] font-bold text-gold uppercase tracking-[0.5em] italic">{event?.name || 'Wedding Event'}</p><p className="text-4xl text-ink font-serif italic tracking-tighter">{event?.date || '12.12.2026'}</p><p className="text-[11px] font-bold text-muted uppercase tracking-[0.4em] pt-2">{event?.time || '08:00 - End'}</p></div>
          <div className="w-full h-px bg-gold/20" />
          <div className="space-y-2"><p className="text-xl font-serif text-ink italic leading-tight">{event?.venue || 'The Venue Name'}</p><p className="text-[10px] text-muted uppercase tracking-[0.2em]">{event?.address || 'Address Details'}</p></div>
          {event?.mapsLink ? <a href={event.mapsLink} target="_blank" rel="noopener noreferrer" className="block w-full py-4 border border-ink text-ink text-[9px] font-bold uppercase tracking-[0.4em] active:scale-95 transition-all shadow-sm hover:bg-ink/5 text-center">Google Map</a> : <button className="w-full py-4 border border-ink text-ink text-[9px] font-bold uppercase tracking-[0.4em] active:scale-95 transition-all shadow-sm hover:bg-ink/5">Google Map</button>}
       </div>
    </div>
  );
}

function GalleryCard({ url, index }: { url: string, index: number }) {
  const photo = url || FALLBACK_MEDIA.gallery[index % 4];
  return (
    <div className="min-w-full h-full flex shrink-0 items-start justify-center p-4 overflow-hidden">
       <div className="w-[85%] max-w-[320px] aspect-[3/4] shadow-2xl relative overflow-hidden rounded-sm border-[6px] border-white bg-muted/5 flex items-center justify-center"><img src={photo} className="w-full h-full object-cover" alt="Gallery" /><div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" /></div>
    </div>
  );
}

function CountdownSection({ config }: { config: any }) {
  const targetDate = config?.targetDate || '2026-12-12T08:00:00';
  const target = new Date(targetDate);
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <SectionScene id="countdown" bg={C.forest}>
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-16">
        <p className="text-[11px] tracking-[0.8em] uppercase text-ivory font-bold opacity-80">The Grand Countdown</p>
        <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
          {[{ v: t.days, l: 'Days' }, { v: t.hours, l: 'Hours' }, { v: t.minutes, l: 'Mins' }, { v: t.seconds, l: 'Secs' }].map((unit, i) => (
            <div key={i} className="flex flex-col items-center"><div className="w-14 h-20 bg-white/5 border border-gold/20 flex items-center justify-center mb-3 rounded-sm"><span className="text-3xl text-white font-serif tabular-nums">{String(unit.v).padStart(2, '0')}</span></div><span className="text-[8px] uppercase tracking-[0.4em] text-ivory font-bold italic opacity-80">{unit.l}</span></div>
          ))}
        </div>
        <p className="text-lg italic text-ivory font-serif tracking-[0.2em] border-y border-white/10 py-4 px-10 uppercase opacity-90">{target.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </SectionScene>
  );
}

function GiftSection({ config }: { config: any }) {
  const [copied, setCopied] = useState<string | null>(null);
  const accounts = config?.accounts || [];

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000); }).catch(() => fallbackCopy(text, key));
    } else { fallbackCopy(text, key); }
  };

  const fallbackCopy = (text: string, key: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch (err) {}
    document.body.removeChild(textArea);
  };

  return (
    <SectionScene id="gift" bg={C.cream}>
      <div className="h-full flex flex-col justify-center p-8 items-center space-y-8 overflow-hidden w-full max-w-sm">
        <div className="text-center space-y-2 shrink-0 px-4"><p className="text-[10px] tracking-[0.6em] uppercase text-gold font-bold italic">Wedding Gift</p><h2 className="text-3xl text-ink font-serif italic tracking-tight leading-tight">{config?.title || 'Wedding Gift'}</h2><p className="text-[12px] leading-relaxed text-muted font-serif italic line-clamp-2">{config?.description || 'Your presence is the greatest gift for us.'}</p></div>
        <div className="w-full space-y-3 overflow-y-auto pr-1 inv-scroll max-h-[50vh] px-4">
          {accounts.map((acc: any, i: number) => (
            <div key={i} className="w-full bg-white p-4 border border-gold/10 shadow-sm flex items-center gap-4 relative group rounded-sm"><div className="w-12 h-12 flex items-center justify-center bg-ivory/50 rounded shrink-0 border border-gold/5"><span className="text-xs font-bold text-forest">{acc.bank?.substring(0, 3)}</span></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><p className="text-[11px] font-bold text-ink uppercase tracking-wider">{acc.bank}</p>{i === 0 && <span className="text-[7px] px-1.5 py-0.5 bg-mocha text-white rounded-full uppercase font-bold">Utama</span>}</div><p className="text-[13px] text-ink font-mono tracking-widest truncate">{acc.number}</p><p className="text-[9px] text-muted uppercase font-medium truncate opacity-60">a.n. {acc.holder}</p></div><button onClick={() => copyToClipboard(acc.number, `acc-${i}`)} className={`p-2 rounded-full transition-all shrink-0 ${copied === `acc-${i}` ? 'bg-forest text-white' : 'bg-gold/10 text-gold hover:bg-gold/20'}`}>{copied === `acc-${i}` ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.653 2H10a2 2 0 00-2 2z" /><path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" /></svg>}</button></div>
          ))}
        </div>
      </div>
    </SectionScene>
  );
}

function RSVPSection({ config, onSubmit }: { config: any, onSubmit: (data: any) => void }) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !attendance) return;
    onSubmit({ name, guests: 1, attendance, message });
    setSubmitted(true);
  }

  return (
    <SectionScene id="rsvp" bg={C.forest}>
       <div className="absolute inset-0 opacity-[0.05] grayscale bg-[url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200)] bg-cover" />
       <div className="h-full flex flex-col items-center justify-center p-10 text-center relative z-20 overflow-hidden">
          {submitted ? (
            <div className="space-y-10 animate-in fade-in zoom-in duration-700"><div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center mx-auto shadow-2xl bg-white/10"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div className="space-y-4"><h3 className="text-4xl text-white font-serif italic">Thank You</h3><div className="w-12 h-px bg-white/40 mx-auto" /><p className="text-lg text-white font-serif italic leading-loose px-4 max-w-xs mx-auto">"Kehadiran dan doa restu Anda adalah kado terindah bagi kami."</p></div></div>
          ) : (
            <>
               <div className="space-y-3 mb-10 shrink-0"><p className="text-[11px] tracking-[0.8em] uppercase text-white font-bold italic">R.S.V.P</p><h2 className="text-5xl text-white font-serif italic tracking-tight leading-tight">{config?.title || 'Will You Join Us?'}</h2></div>
               <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8 bg-white/5 backdrop-blur-3xl p-10 border border-white/20 shadow-2xl overflow-y-auto pr-2 inv-scroll max-h-[75vh]">
                  <div className="space-y-2 text-left"><label className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b-2 border-white/60 p-3 text-xl text-white focus:outline-none focus:border-white font-serif italic transition-all placeholder:text-white/40" placeholder="Your name..." /></div>
                  <div className="space-y-4 text-left"><label className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Attendance</label><div className="flex flex-col gap-3">{['Hadir', 'InsyaAllah', 'Tidak'].map(opt => (<button key={opt} type="button" onClick={() => setAttendance(opt)} className={`py-4 text-[11px] font-bold border-2 tracking-[0.3em] uppercase transition-all ${attendance === opt ? 'bg-white text-forest border-white shadow-2xl scale-[1.02]' : 'border-white text-white hover:bg-white/10'}`}>{opt}</button>))}</div></div>
                  <div className="space-y-2 text-left"><label className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Message / Wishes</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-transparent border-2 border-white/30 p-4 text-base text-white focus:outline-none focus:border-white font-serif italic transition-all h-32 resize-none placeholder:text-white/30 rounded-sm" placeholder="Tinggalkan pesan doa..." /></div>
                  <button type="submit" disabled={!name || !attendance} className="w-full py-6 bg-white text-forest text-xs font-bold uppercase tracking-[0.8em] disabled:opacity-20 shadow-2xl hover:bg-ivory active:scale-95 transition-all mt-6 shrink-0">Confirm RSVP</button>
               </form>
            </>
          )}
       </div>
    </SectionScene>
  );
}

function ClosingSection({ config, onBackToTop }: { config: any, onBackToTop: () => void }) {
  return (
    <SectionScene id="closing" bg={C.ivory}>
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-16 max-w-sm mx-auto relative z-20 overflow-hidden">
        <div className="w-20 h-20 opacity-20"><IslamicStar size={80} /></div>
        <p className="text-xl leading-[1.8] italic text-muted font-serif px-6">{config?.message || 'Thank you for your warm wishes.'}</p>
        <div className="space-y-4">
          <p className="text-6xl text-ink leading-tight" style={{ fontFamily: serif, fontStyle: 'italic' }}>{config?.names || 'Zahra & Rafi'}</p>
          <div className="flex items-center justify-center gap-6"><div className="h-px w-12 bg-gold/30" /><p className="text-[13px] tracking-[0.6em] text-gold font-bold uppercase italic">{config?.date || '12.12.2026'}</p><div className="h-px w-12 bg-gold/30" /></div>
        </div>
        <button onClick={onBackToTop} className="flex flex-col items-center gap-6 text-[10px] uppercase tracking-[0.8em] text-muted group pt-24 transition-all hover:text-gold active:scale-90"><div className="w-16 h-16 border border-gold/20 rounded-full flex items-center justify-center transition-all duration-700 group-hover:bg-gold group-hover:border-gold group-hover:text-white group-hover:-translate-y-6 shadow-2xl"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></div><span className="font-bold">Top</span></button>
      </div>
    </SectionScene>
  );
}

function SideNavigation({ activeSection, sections, onNavigate }: { activeSection: string, sections: string[], onNavigate: (id: string) => void }) {
  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-10 scale-75 origin-right">
      {sections.map((id) => (
        <button key={id} className={`w-[1px] rounded-full transition-all duration-1000 group relative ${activeSection === id ? 'bg-gold h-16 shadow-[0_0_20px_rgba(199,169,107,1)]' : 'bg-gold/20 h-3 hover:bg-gold/60'}`} onClick={() => onNavigate(id)}>
           <span className={`absolute right-full mr-8 text-[9px] uppercase tracking-[0.6em] font-bold text-gold opacity-0 transition-all duration-500 whitespace-nowrap pointer-events-none group-hover:opacity-100 group-hover:-translate-x-4 ${activeSection === id ? 'opacity-100 -translate-x-4' : ''}`}>{id === 'cover' ? 'Title' : id === 'introduction' ? 'Start' : id === 'quran' ? 'Divine' : id === 'couple' ? 'The Union' : id === 'story' ? 'Legend' : id === 'event' ? 'Gala' : id === 'countdown' ? 'Moments' : id === 'gallery' ? 'Exhibition' : id === 'gift' ? 'Registry' : id === 'rsvp' ? 'RSVP' : 'End'}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main Invitation ────────────────────────────────────────────────────────────

export default function SakinahInvitation({
  data,
  guestName = 'Bapak Ahmad & Keluarga',
  previewMode = false,
  onRSVP,
  externalIndex
}: {
  data: InvitationData,
  guestName?: string,
  previewMode?: boolean,
  onRSVP?: (rsvp: any) => void,
  externalIndex?: number
}) {
  const [opened, setOpened] = useState(previewMode);
  const [musicOn, setMusicOn] = useState(false);
  const [activeSection, setActiveSection] = useState('cover');
  const containerRef = useRef<HTMLDivElement>(null);

  const ALL_SECTION_IDS = ['cover', 'introduction', 'quran', 'couple', 'story', 'event', 'countdown', 'gallery', 'gift', 'rsvp', 'closing'];

  const getSection = (id: string) => data?.sections?.find(s => s.id === id);
  const isSectionEnabled = (id: string) => {
    const s = getSection(id);
    return s ? s.enabled !== false : true;
  };

  const activeSectionIds = ALL_SECTION_IDS.filter(id => isSectionEnabled(id));

  // Record viewed status if guestSlug is present
  useEffect(() => {
    if (opened && !previewMode) {
       const params = new URLSearchParams(window.location.search)
       const guestSlug = params.get('to')
       if (guestSlug) {
          // In a real production DB, this triggers the 'opened' status
       }
    }
  }, [opened]);

  useEffect(() => {
    if (externalIndex !== undefined && externalIndex >= 0) {
       const targetId = ALL_SECTION_IDS[externalIndex];
       if (targetId && isSectionEnabled(targetId)) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
       }
    }
  }, [externalIndex]);

  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });},
      { threshold: 0.5, root: containerRef.current }
    );
    activeSectionIds.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [opened, activeSectionIds.join(',')]);

  if (!opened) return <EnvelopeReveal guestName={guestName} data={data} onOpen={() => setOpened(true)} />;

  return (
    <div className={`${previewMode ? 'absolute' : 'fixed'} inset-0 bg-cream overflow-y-auto overflow-x-hidden scroll-smooth inv-scroll select-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]`} ref={containerRef}>
      <div className="anim-fade-in relative min-h-full">
        <SideNavigation activeSection={activeSection} sections={activeSectionIds} onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} />
        <button onClick={() => setMusicOn((v) => !v)} className="fixed top-12 left-10 z-[150] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000 bg-forest shadow-2xl border border-gold/30 hover:scale-110 active:scale-95 group overflow-hidden"><div className="relative w-full h-full flex items-center justify-center"><motion.div animate={musicOn ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1.5px] border-gold/10 border-t-gold/50 m-2" /><span className="text-xl relative z-10">{musicOn ? '🔇' : '🎵'}</span></div></button>
        {isSectionEnabled('cover') && <HeroSection config={getSection('cover')?.config} data={data} guestName={guestName} />}
        {isSectionEnabled('introduction') && <IntroductionSection config={getSection('introduction')?.config} />}
        {isSectionEnabled('quran') && <QuranSection config={getSection('quran')?.config} />}
        {isSectionEnabled('couple') && <HorizontalTakeoverSection id="couple" title="The Union" tagline="Divine Love" itemsCount={2} containerRef={containerRef}><CoupleCard person={data?.couple?.bride} isBride={true} /><CoupleCard person={data?.couple?.groom} isBride={false} /></HorizontalTakeoverSection>}

        {isSectionEnabled('story') && <VerticalTakeoverSection id="story" title="story" tagline="Our Love" itemsCount={getSection('story')?.config?.items?.length || 1} containerRef={containerRef}>
           {(getSection('story')?.config?.items || []).map((item: any, i: number) => <StoryCard key={i} item={item} index={i} />)}
        </VerticalTakeoverSection>}

        {isSectionEnabled('event') && <HorizontalTakeoverSection id="event" title="The Gala" tagline="Wedding Ceremony" itemsCount={getSection('event')?.config?.events?.length || 1} containerRef={containerRef}>{(getSection('event')?.config?.events || []).map((ev: any, i: number) => <EventCard key={i} event={ev} />)}</HorizontalTakeoverSection>}
        {isSectionEnabled('countdown') && <CountdownSection config={getSection('countdown')?.config} />}

        {isSectionEnabled('gallery') && <HorizontalTakeoverSection id="gallery" title="The Exhibition" tagline="Captured Moments" itemsCount={Math.min(3, getSection('gallery')?.config?.images?.length || 1)} bg={C.paper} containerRef={containerRef}>
           {(getSection('gallery')?.config?.images || []).slice(0, 3).map((img: string, i: number) => <GalleryCard key={i} url={img} index={i} />)}
        </HorizontalTakeoverSection>}
        {isSectionEnabled('gift') && <GiftSection config={getSection('gift')?.config} />}
        {isSectionEnabled('rsvp') && <RSVPSection config={getSection('rsvp')?.config} onSubmit={(rsvp) => onRSVP?.(rsvp)} />}
        {isSectionEnabled('closing') && <ClosingSection config={getSection('closing')?.config} onBackToTop={() => document.getElementById(activeSectionIds[0] || 'cover')?.scrollIntoView({ behavior: 'smooth' })} />}
      </div>
    </div>
  );
}
