import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import type { InvitationData } from '../../../lib/invitation/types';

// ── Design System ──────────────────────────────────────────────────────────

const C = {
  forest: '#17352F',
  forestDark: '#0A1A17',
  gold: '#C7A96B',
  goldFoil: 'linear-gradient(135deg, #A68B5B 0%, #E5D5A7 50%, #A68B5B 100%)',
  ivory: '#F8F4EC',
  cream: '#FDFCFB',
  ink: '#1A1210',
  muted: '#8D897E',
  accent: '#A68B5B',
  paper: '#FFFDF8'
};

const serif = "'Playfair Display', Georgia, serif";

// ── Shared Visual Components ────────────────────────────────────────────────

function PaperTexture() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply overflow-hidden z-0">
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

function Monogram({ size = 80, opacity = 0.8 }: { size?: number; opacity?: number }) {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size, opacity }}>
       <div className="absolute inset-0 rounded-full border border-gold/30 animate-pulse" />
       <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100" fill="none">
         <path d="M30 30 Q50 10 70 30 T70 70 Q50 90 30 70 T30 30" stroke={C.gold} strokeWidth="1" />
         <text x="50" y="55" textAnchor="middle" fill={C.gold} style={{ fontFamily: serif, fontSize: 24 }}>S</text>
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

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-[180px] mx-auto shrink-0">
      <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
      <div className="rotate-45 w-1 h-1 border border-gold/60" />
      <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
    </div>
  );
}

function OrnamentBorder() {
  return (
    <div className="absolute inset-4 pointer-events-none border border-gold/10 z-10 transition-opacity duration-1000">
       <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-gold/40" />
       <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-gold/40" />
       <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-gold/40" />
       <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-gold/40" />
    </div>
  );
}

// ── Layout Wrappers ──────────────────────────────────────────────────────────

function SectionScene({ id, children, bg = C.ivory, ornament = true }: { id: string, children: React.ReactNode, bg?: string, ornament?: boolean }) {
  return (
    <section
      id={id}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden shrink-0"
      style={{ backgroundColor: bg }}
    >
      <PaperTexture />
      {ornament && <OrnamentBorder />}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </section>
  );
}

function VerticalTakeover({ id, title, tagline, children, bg = C.cream, itemsCount, containerRef }: { id: string, title: string, tagline?: string, children: React.ReactNode, bg?: string, itemsCount: number, containerRef: any }) {
  const targetRef = useRef(null);
  const heightFactor = Math.max(3, itemsCount * 2);
  const { scrollYProgress } = useScroll({ target: targetRef, container: containerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0%", `-${(itemsCount - 1) * 100}%`]);
  const smoothX = useSpring(x, { stiffness: 60, damping: 25, restDelta: 0.001 });

  return (
    <section ref={targetRef} id={id} className="relative w-full" style={{ height: `${heightFactor * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col" style={{ backgroundColor: bg }}>
        <PaperTexture />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="px-10 pt-20 pb-4 relative z-30 pointer-events-none">
          <p className="text-[9px] tracking-[0.6em] uppercase text-gold font-bold mb-1">{tagline}</p>
          <h2 className="text-3xl text-forest font-serif italic">{title}</h2>
          <div className="mt-4"><GoldDivider /></div>
        </div>

        <div className="flex-1 w-full relative z-10 overflow-hidden -mt-4">
          <motion.div style={{ x: smoothX }} className="flex h-full">
             {children}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-10 flex gap-4 z-30 items-center opacity-40">
           <span className="text-[8px] tracking-[0.4em] uppercase text-gold font-bold">Journey</span>
           <div className="flex gap-2">
             {Array.from({ length: itemsCount }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full border border-gold/40" />
             ))}
           </div>
        </div>
      </div>
    </section>
  );
}

// ── Section Components ───────────────────────────────────────────────────────

function Envelope({ guestName, onOpen, data }: { guestName: string, onOpen: () => void, data: InvitationData }) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="fixed inset-0 z-[500] bg-forest flex items-center justify-center overflow-hidden">
      <PaperTexture />
      <motion.div
        animate={isAnimating ? { rotateX: -110, y: '-100%', opacity: 0 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 w-full h-1/2 bg-forestDark border-b border-gold/20 z-40 flex items-end justify-center pb-12 origin-top shadow-2xl"
      >
        <Monogram size={100} opacity={0.15} />
      </motion.div>
      <motion.div
        animate={isAnimating ? { rotateX: 110, y: '100%', opacity: 0 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-forest border-t border-gold/20 z-40 flex items-start justify-center pt-16 origin-bottom shadow-2xl"
      >
        <button onClick={() => { setIsAnimating(true); setTimeout(onOpen, 1600); }} className="group relative px-16 py-5 bg-transparent border border-gold/60 text-gold uppercase tracking-[0.6em] text-[10px] font-bold overflow-hidden transition-all hover:border-gold active:scale-95 z-50">
          <span className="relative z-10">Buka Undangan</span>
          <div className="absolute inset-0 bg-gold/10 transition-transform duration-700 -translate-x-full group-hover:translate-x-0" />
        </button>
      </motion.div>
      <div className="absolute inset-0 bg-paper flex flex-col items-center justify-center p-12 text-center">
         <div className="space-y-10 max-w-sm">
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.5em] uppercase text-muted font-bold">The Wedding of</p>
              <h2 className="text-6xl text-forest font-serif italic leading-none">
                {data.couple.bride.name.split(' ')[0]} <br/>
                <span className="text-3xl font-sans not-italic text-gold my-2 block">&</span>
                {data.couple.groom.name.split(' ')[0]}
              </h2>
            </div>
            <div className="w-16 h-px bg-gold/30 mx-auto" />
            <div className="space-y-4">
              <p className="text-[9px] tracking-[0.4em] uppercase text-muted font-medium italic">Spesial Untuk</p>
              <p className="text-3xl font-serif text-ink border-b border-gold/10 pb-4 inline-block px-8">{guestName}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function HeroSection({ config, data, guestName }: { config: any, data: InvitationData, guestName: string }) {
  return (
    <SectionScene id="cover" bg={C.cream}>
       <div className="h-full flex flex-col justify-between py-16 px-10 relative">
          <div className="flex justify-between items-start">
             <div className="text-left space-y-1 shrink-0">
                <p className="text-xl text-gold font-serif" dir="rtl">{config.bismillah || 'بِسْمِ اللَّهِ'}</p>
                <p className="text-[8px] tracking-[0.3em] uppercase text-muted font-bold opacity-50">As-Salaam-Alaikum</p>
             </div>
             <Monogram size={50} opacity={0.3} />
          </div>
          <div className="relative flex flex-col items-end flex-1 justify-center min-h-0">
             <div className="absolute left-0 bottom-16 z-20 text-left pointer-events-none w-full">
                <motion.h1 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} className="text-[80px] leading-[0.8] text-forest font-serif italic drop-shadow-2xl">{data.couple.bride.name.split(' ')[0]}</motion.h1>
                <div className="flex items-center gap-4 my-4"><div className="w-8 h-px bg-gold" /><span className="text-3xl font-serif text-gold">&</span><div className="w-8 h-px bg-gold" /></div>
                <motion.h1 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[80px] leading-[0.8] text-forest font-serif italic drop-shadow-2xl">{data.couple.groom.name.split(' ')[0]}</motion.h1>
             </div>
             <div className="w-[85%] aspect-[3/4] max-h-[380px] relative z-10 overflow-hidden rounded-t-[10rem] border-4 border-white shadow-2xl">
                <img src={config.couplePhoto} className="w-full h-full object-cover" alt="The Couple" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
             </div>
          </div>
          <div className="flex justify-between items-end border-t border-gold/10 pt-6 shrink-0">
             <div className="space-y-1">
                <p className="text-[8px] tracking-[0.4em] uppercase text-gold font-bold italic">Honored Guest</p>
                <p className="text-lg font-serif italic text-ink truncate max-w-[200px]">{guestName}</p>
             </div>
             <p className="text-[9px] tracking-[0.4em] text-muted font-bold uppercase italic opacity-40">2024 Ceremony</p>
          </div>
       </div>
    </SectionScene>
  );
}

function IntroductionSection({ config }: { config: any }) {
  return (
    <SectionScene id="introduction">
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-10">
        <IslamicStar size={60} opacity={0.15} />
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 2 }} className="text-lg leading-[1.8] text-muted font-serif italic max-w-xs px-4">{config.invitationText}</motion.p>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="pt-10 flex flex-col items-center gap-4 opacity-20 animate-bounce">
           <p className="text-[7px] tracking-[0.6em] text-gold font-bold uppercase">Begin Scrolling</p>
           <div className="w-px h-10 bg-gold" />
        </div>
      </div>
    </SectionScene>
  );
}

function QuranSection({ config }: { config: any }) {
  return (
    <SectionScene id="quran" bg={C.paper}>
      <div className="absolute inset-0 opacity-[0.03] grayscale bg-[url(https://images.unsplash.com/photo-1584281723351-9d92ff1f8194?w=1200)] bg-cover" />
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-10 relative">
        <p className="text-[10px] tracking-[0.6em] uppercase text-gold font-bold border-b border-gold/10 pb-4 shrink-0">The Holy Verse</p>
        <motion.p initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="text-2xl leading-[1.6] text-forest font-serif italic max-w-xs">{config.verse}</motion.p>
        <div className="flex flex-col items-center gap-4 shrink-0">
           <div className="w-12 h-[0.5px] bg-gold/30" />
           <p className="text-[10px] tracking-[0.4em] text-accent font-bold uppercase">{config.reference}</p>
        </div>
      </div>
    </SectionScene>
  );
}

function CoupleCard({ person, isBride }: { person: any, isBride: boolean }) {
  return (
    <div className="min-w-full h-full flex shrink-0 items-center justify-center p-10 overflow-hidden">
       <div className={`w-full max-w-sm flex flex-col ${isBride ? 'items-start' : 'items-end'} relative`}>
          <div className="w-[75%] aspect-[3/4] max-h-[340px] relative z-20 overflow-hidden shadow-2xl rounded-t-full border-[8px] border-white shrink-0">
             <img src={person.image} className="w-full h-full object-cover" alt={person.name} />
             <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
          </div>
          <div className={`absolute ${isBride ? 'right-0 top-1/2' : 'left-0 top-1/2'} -translate-y-1/2 z-30 text-center w-full max-w-[180px] bg-white/10 backdrop-blur-xl p-6 border border-white/20 shadow-2xl rounded-sm`}>
             <h3 className="text-2xl text-forest font-serif italic tracking-tight mb-3 leading-tight">{person.name}</h3>
             <div className="w-6 h-[0.5px] bg-gold/40 mx-auto mb-3" />
             <p className="text-[9px] text-muted tracking-[0.3em] uppercase font-bold mb-1 opacity-60">Beloved {isBride ? 'Daughter' : 'Son'} of</p>
             <p className="text-xs text-ink font-serif italic leading-relaxed">{person.parents}</p>
          </div>
       </div>
    </div>
  );
}

function StoryCard({ item }: { item: any }) {
  return (
    <div className="min-w-full h-full flex shrink-0 items-center justify-center p-8 overflow-hidden">
       <div className="w-full max-w-xs relative flex flex-col justify-center">
          <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-gold/10 -translate-x-1/2" />
          <div className="relative z-10 bg-paper p-10 border border-gold/10 shadow-2xl text-center space-y-6">
             <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-forest text-gold text-[10px] tracking-[0.5em] uppercase font-bold shadow-xl">{item.year}</div>
             <h3 className="text-xl text-forest font-serif italic pt-3 leading-tight truncate">{item.title}</h3>
             <div className="w-10 h-px bg-gold/40 mx-auto" />
             <p className="text-base leading-relaxed text-muted font-serif italic px-2 line-clamp-6">{item.desc}</p>
          </div>
       </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="min-w-full h-full flex shrink-0 items-center justify-center p-8 overflow-hidden">
       <div className="w-full max-w-xs bg-paper border border-gold/10 p-10 text-center space-y-10 shadow-2xl relative overflow-hidden group">
          <div className="space-y-3">
            <p className="text-[9px] font-bold text-gold uppercase tracking-[0.5em] opacity-80 italic">{event.name}</p>
            <p className="text-3xl text-forest font-serif italic tracking-tighter leading-none">{event.date}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] pt-2">{event.time}</p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="space-y-3">
            <p className="text-xl font-serif text-ink italic leading-tight truncate">{event.venue}</p>
            <p className="text-[10px] text-muted uppercase tracking-[0.2em] leading-relaxed line-clamp-2">{event.address}</p>
          </div>
          <button className="relative w-full py-4 border border-forest text-forest text-[9px] font-bold uppercase tracking-[0.4em] overflow-hidden group/btn active:scale-95 transition-all"><span className="relative z-10 group-hover/btn:text-white transition-colors duration-500">View Map</span><div className="absolute inset-0 bg-forest translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" /></button>
       </div>
    </div>
  );
}

function GalleryCard({ url, index }: { url: string, index: number }) {
  return (
    <div className="min-w-full h-full flex shrink-0 items-center justify-center p-10 overflow-hidden">
       <div className={`w-full max-w-xs h-[60vh] relative ${index % 2 === 0 ? 'mt-8' : '-mt-8'}`}>
          <div className="w-full h-full overflow-hidden shadow-2xl relative z-10 rounded-sm border-2 border-white">
             <img src={url} className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-110" alt="Gallery" />
             <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent opacity-40" />
          </div>
          <div className="absolute -bottom-8 -right-4 text-right opacity-20 pointer-events-none"><p className="text-[32px] font-serif italic leading-none text-gold">#{String(index + 1).padStart(2, '0')}</p></div>
       </div>
    </div>
  );
}

function CountdownSection({ config }: { config: any }) {
  const target = new Date(config.targetDate);
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [config.targetDate]);

  return (
    <SectionScene id="countdown" bg={C.forestDark}>
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-16 relative">
        <div className="space-y-4 relative z-10 shrink-0">
           <p className="text-[10px] tracking-[0.8em] uppercase text-gold font-bold opacity-60">The Grand Countdown</p>
           <h2 className="text-3xl text-ivory font-serif italic tracking-tight leading-tight">{config.title}</h2>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto relative z-10 shrink-0">
          {[
            { v: t.days, l: 'Days' }, { v: t.hours, l: 'Hours' }, { v: t.minutes, l: 'Mins' }, { v: t.seconds, l: 'Secs' }
          ].map((unit, i) => (
            <div key={i} className="flex flex-col items-center group">
               <div className="w-14 h-20 bg-forest border border-gold/10 flex items-center justify-center mb-3 rounded-sm shadow-2xl relative transition-colors group-hover:border-gold/40">
                  <span className="text-3xl text-ivory font-serif tabular-nums tracking-tighter">{String(unit.v).padStart(2, '0')}</span>
               </div>
               <span className="text-[8px] uppercase tracking-[0.4em] text-gold/40 font-bold italic">{unit.l}</span>
            </div>
          ))}
        </div>
        <div className="pt-8 relative z-10 shrink-0">
           <p className="text-base italic text-gold/80 font-serif tracking-[0.2em] border-y border-gold/10 py-3 px-8 inline-block uppercase">
              {target.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
           </p>
        </div>
      </div>
    </SectionScene>
  );
}

function GiftSection({ config }: { config: any }) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <SectionScene id="gift" bg={C.cream}>
      <div className="h-full flex flex-col justify-center p-12 items-center space-y-10 overflow-hidden">
        <div className="text-center space-y-4 max-w-xs shrink-0 px-4">
            <p className="text-[10px] tracking-[0.6em] uppercase text-gold font-bold">Wedding Registry</p>
            <h2 className="text-3xl text-forest font-serif italic tracking-tight leading-tight">{config.title}</h2>
            <p className="text-sm leading-relaxed text-muted font-serif italic line-clamp-3">{config.description}</p>
        </div>
        <div className="w-full max-w-xs space-y-4 overflow-y-auto pr-2 inv-scroll max-h-[50vh] flex flex-col py-2 min-h-0">
          {config.accounts.map((acc: any, i: number) => (
            <div key={i} className="bg-paper p-8 border border-gold/5 text-center shadow-xl relative group shrink-0">
               <div className="absolute top-0 right-0 p-4 opacity-[0.05]"><IslamicStar size={50} /></div>
               <p className="text-[8px] uppercase tracking-[0.4em] text-muted mb-6 font-bold opacity-60">{acc.type}</p>
               <p className="text-2xl text-forest font-serif mb-1 leading-none">{acc.bank}</p>
               <p className="text-lg text-ink tracking-[0.1em] mb-1 font-bold">{acc.number}</p>
               <p className="text-[10px] text-muted mb-8 italic uppercase font-medium tracking-widest truncate">a.n. {acc.holder}</p>
               <button onClick={() => copy(acc.number, `acc-${i}`)} className="relative w-full py-3.5 bg-forest text-gold text-[9px] font-bold uppercase tracking-[0.4em] overflow-hidden group/btn active:scale-95 transition-all shrink-0"><span className="relative z-10">{copied === `acc-${i}` ? 'Account Copied' : 'Copy Number'}</span><div className="absolute inset-0 bg-forestDark translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" /></button>
            </div>
          ))}
        </div>
      </div>
    </SectionScene>
  );
}

function RSVPSection({ config, onSubmit }: { config: any, onSubmit: (data: any) => void }) {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(1);
  const [attendance, setAttendance] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !attendance) return;
    onSubmit({ name, guests, attendance, message: '' });
    setSubmitted(true);
  }

  return (
    <SectionScene id="rsvp" bg={C.forestDark}>
       <div className="absolute inset-0 opacity-[0.05] grayscale bg-[url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200)] bg-cover" />
       <div className="h-full flex flex-col items-center justify-center p-10 text-center relative z-20 overflow-hidden">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
               <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mx-auto shadow-2xl"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
               <h3 className="text-3xl text-ivory font-serif italic">Terima Kasih</h3>
               <p className="text-base text-gold/60 font-serif italic leading-loose px-4 max-w-xs mx-auto">"Kehadiran dan doa restu Anda adalah kado terindah bagi kami."</p>
            </motion.div>
          ) : (
            <>
               <div className="space-y-3 mb-10 shrink-0">
                  <p className="text-[10px] tracking-[0.8em] uppercase text-gold font-bold">R.S.V.P</p>
                  <h2 className="text-4xl text-ivory font-serif italic tracking-tight">{config.title}</h2>
               </div>
               <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-white/5 backdrop-blur-3xl p-10 border border-white/10 shadow-2xl shrink-0 min-h-0">
                  <div className="space-y-1.5 text-left shrink-0">
                     <label className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold italic opacity-60">Full Name</label>
                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-3 text-lg text-ivory focus:outline-none focus:border-gold font-serif italic transition-all placeholder:text-white/10" placeholder="Your name..." />
                  </div>
                  <div className="space-y-3 text-left shrink-0">
                     <label className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold italic opacity-60">Attendance</label>
                     <div className="flex gap-3">
                        {['Hadir', 'Tidak'].map(opt => (
                          <button key={opt} type="button" onClick={() => setAttendance(opt)} className={`flex-1 py-3 text-[10px] font-bold border tracking-[0.3em] uppercase transition-all ${attendance === opt ? 'bg-gold text-forest border-gold shadow-2xl scale-[1.02]' : 'border-white/10 text-white hover:bg-white/5'}`}>{opt}</button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-3 text-left shrink-0">
                     <label className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold italic opacity-60">Guest Count</label>
                     <div className="flex items-center justify-between border border-white/10 p-1.5 rounded-sm bg-white/5">
                        <button type="button" onClick={() => setGuests(Math.max(1, guests-1))} className="w-10 h-10 text-gold text-2xl font-light hover:bg-white/5 transition-colors rounded-full">-</button>
                        <span className="text-xl font-serif italic text-white font-bold">{guests}</span>
                        <button type="button" onClick={() => setGuests(guests+1)} className="w-10 h-10 text-gold text-2xl font-light hover:bg-white/5 transition-colors rounded-full">+</button>
                     </div>
                  </div>
                  <button type="submit" disabled={!name || !attendance} className="w-full py-5 bg-gold text-forest text-[10px] font-bold uppercase tracking-[0.6em] disabled:opacity-20 shadow-2xl hover:brightness-110 active:scale-95 transition-all mt-4 shrink-0">Confirm RSVP</button>
               </form>
            </>
          )}
       </div>
    </SectionScene>
  );
}

function ClosingSection({ config, onBackToTop }: { config: any, onBackToTop: () => void }) {
  return (
    <SectionScene id="closing" bg={C.forestDark}>
      <div className="absolute inset-0 opacity-[0.15] grayscale contrast-125 mix-blend-screen bg-[url(https://images.unsplash.com/photo-1485700281629-290c5a704409?w=1200)] bg-cover" />
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-12 max-w-sm mx-auto relative z-20 overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="opacity-30 scale-125 shrink-0"><IslamicStar size={80} opacity={0.6} /></motion.div>
        <div className="w-16 h-[0.5px] bg-gold/40 shrink-0" />
        <p className="text-lg leading-[1.8] italic text-gold/60 font-serif px-6 shrink-0">{config.message}</p>
        <div className="space-y-4 shrink-0">
          <p className="text-6xl leading-none text-ivory font-serif italic tracking-tighter truncate w-full">{config.names}</p>
          <div className="flex items-center justify-center gap-6"><div className="h-px w-8 bg-gold/30" /><p className="text-[11px] tracking-[0.6em] text-gold font-bold uppercase italic">{config.date}</p><div className="h-px w-8 bg-gold/30" /></div>
        </div>
        <div className="w-16 h-[0.5px] bg-gold/40 shrink-0" />
        <button onClick={onBackToTop} className="flex flex-col items-center gap-4 text-[9px] uppercase tracking-[0.8em] text-gold/40 group pt-16 transition-all hover:text-gold active:scale-90 shrink-0"><div className="w-14 h-14 border border-gold/20 rounded-full flex items-center justify-center transition-all duration-700 group-hover:bg-gold group-hover:border-gold group-hover:text-forest group-hover:-translate-y-4 shadow-2xl"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></div><span className="font-bold">Restart</span></button>
      </div>
    </SectionScene>
  );
}

function SideNavigation({ activeSection, sections, onNavigate }: { activeSection: string, sections: string[], onNavigate: (id: string) => void }) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-8 scale-90 sm:scale-100">
      {sections.map((id) => (
        <button key={id} className={`w-[1px] rounded-full transition-all duration-1000 group relative ${activeSection === id ? 'bg-gold h-14 shadow-[0_0_20px_rgba(199,169,107,1)]' : 'bg-gold/20 h-2 hover:bg-gold/60'}`} onClick={() => onNavigate(id)}>
           <span className={`absolute right-full mr-6 text-[8px] uppercase tracking-[0.6em] font-bold text-gold opacity-0 transition-all duration-500 whitespace-nowrap pointer-events-none group-hover:opacity-100 group-hover:-translate-x-2 ${activeSection === id ? 'opacity-100 -translate-x-2' : ''}`}>
              {id === 'cover' ? 'Title' : id === 'introduction' ? 'Start' : id === 'quran' ? 'Divine' : id === 'couple' ? 'The Union' : id === 'story' ? 'Legend' : id === 'event' ? 'Gala' : id === 'countdown' ? 'Moments' : id === 'gallery' ? 'Exhibition' : id === 'gift' ? 'Registry' : id === 'rsvp' ? 'RSVP' : 'End'}
           </span>
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

  const sectionIds = ['cover', 'introduction', 'quran', 'couple', 'story', 'event', 'countdown', 'gallery', 'gift', 'rsvp', 'closing'];

  useEffect(() => {
    if (externalIndex !== undefined && externalIndex >= 0 && externalIndex < sectionIds.length) {
       const id = sectionIds[externalIndex];
       document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [externalIndex]);

  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });},
      { threshold: 0.5, root: containerRef.current }
    );
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [opened]);

  const getSection = (id: string) => data.sections.find(s => s.id === id);

  if (!opened) return <Envelope guestName={guestName} data={data} onOpen={() => setOpened(true)} />;

  return (
    <div className={`${previewMode ? 'absolute' : 'fixed'} inset-0 bg-paper overflow-y-auto overflow-x-hidden scroll-smooth inv-scroll select-none`} ref={containerRef}>
      <div className="anim-fade-in relative min-h-full">
        <SideNavigation activeSection={activeSection} sections={sectionIds} onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} />
        <button onClick={() => setMusicOn((v) => !v)} className="fixed top-10 left-10 z-[150] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000 bg-forest shadow-2xl border border-gold/30 hover:scale-110 active:scale-95 group overflow-hidden"><div className="relative w-full h-full flex items-center justify-center"><motion.div animate={musicOn ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-gold/10 border-t-gold/50 m-2" /><span className="text-xl relative z-10">{musicOn ? '🔇' : '🎵'}</span></div></button>
        <HeroSection config={getSection('cover')?.config} data={data} guestName={guestName} />
        <IntroductionSection config={getSection('introduction')?.config} />
        <QuranSection config={getSection('quran')?.config} />
        <VerticalTakeover id="couple" title="The Union" tagline="Divine Love" itemsCount={2} containerRef={containerRef}><CoupleCard person={data.couple.bride} isBride={true} /><CoupleCard person={data.couple.groom} isBride={false} /></VerticalTakeover>
        <VerticalTakeover id="story" title="The Legend" tagline="Our Odyssey" itemsCount={getSection('story')?.config.items.length || 1} bg={C.paper} containerRef={containerRef}>{getSection('story')?.config.items.map((item: any, i: number) => <StoryCard key={i} item={item} />)}</VerticalTakeover>
        <VerticalTakeover id="event" title="The Gala" tagline="Wedding Ceremony" itemsCount={getSection('event')?.config.events.length || 1} containerRef={containerRef}>{getSection('event')?.config.events.map((ev: any, i: number) => <EventCard key={i} event={ev} />)}</VerticalTakeover>
        <CountdownSection config={getSection('countdown')?.config} />
        <VerticalTakeover id="gallery" title="The Exhibition" tagline="Captured Moments" itemsCount={getSection('gallery')?.config.images.length || 1} bg={C.paper} containerRef={containerRef}>{getSection('gallery')?.config.images.map((img: string, i: number) => <GalleryCard key={i} url={img} index={i} />)}</VerticalTakeover>
        <GiftSection config={getSection('gift')?.config} />
        <RSVPSection config={getSection('rsvp')?.config} onSubmit={(rsvp) => onRSVP?.(rsvp)} />
        <ClosingSection config={getSection('closing')?.config} onBackToTop={() => document.getElementById('cover')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>
    </div>
  );
}
