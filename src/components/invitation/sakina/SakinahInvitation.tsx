import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import type { InvitationData } from '../../../lib/invitation/types';

const C = {
  forest: '#17352F',
  forestDark: '#0D241F',
  gold: '#C7A96B',
  goldLight: '#E5D5A7',
  ivory: '#F8F4EC',
  surface: '#FFFDF8',
  ink: '#252522',
  muted: '#8D897E',
  accent: '#A68B5B',
};

const serif = "'Playfair Display', Georgia, serif";

// ── Shared Visual Elements ──────────────────────────────────────────────────

function PaperTexture() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply overflow-hidden z-0">
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
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

function IslamicStar({ size = 64, opacity = 0.08, color = C.gold }: { size?: number; opacity?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }}>
      <polygon points="32,4 37,24 57,24 41,36 47,56 32,44 17,56 23,36 7,24 27,24" fill={color} />
      <polygon points="32,12 36,26 50,26 39,34 43,48 32,40 21,48 25,34 14,26 28,26" fill={C.forest} />
      <circle cx="32" cy="32" r="4" fill={color} opacity="0.6" />
    </svg>
  );
}

function OrnamentBorder() {
  return (
    <div className="absolute inset-4 pointer-events-none border border-gold/10 z-10">
       <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-gold/40" />
       <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-gold/40" />
       <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-gold/40" />
       <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-gold/40" />
    </div>
  );
}

// ── Layout Wrappers ──────────────────────────────────────────────────────────

function SectionWrapper({ id, children, light = false, customBg }: { id: string, children: React.ReactNode, light?: boolean, customBg?: string }) {
  return (
    <section
      id={id}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden shrink-0"
      style={{ backgroundColor: customBg || (light ? C.surface : C.ivory) }}
    >
      <PaperTexture />
      <OrnamentBorder />
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
        {children}
      </div>
    </section>
  );
}

function HorizontalTakeoverSection({ id, title, tagline, children, light = false, itemsCount, containerRef }: { id: string, title: string, tagline?: string, children: React.ReactNode, light?: boolean, itemsCount: number, containerRef: any }) {
  const targetRef = useRef(null);
  const heightFactor = Math.max(3, itemsCount * 2);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(itemsCount - 1) * 100}%`]);
  const smoothX = useSpring(x, { stiffness: 80, damping: 25, restDelta: 0.001 });

  return (
    <section ref={targetRef} id={id} className="relative w-full" style={{ height: `${heightFactor * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center bg-white/50" style={{ backgroundColor: light ? C.surface : C.ivory }}>
        <PaperTexture />
        <OrnamentBorder />

        {/* Tight Header Area */}
        <div className="text-center pt-24 pb-4 relative z-30 pointer-events-none shrink-0 px-4">
          <p className="text-[8px] tracking-[0.4em] uppercase mb-1 text-gold font-bold">{tagline}</p>
          <h2 className="text-3xl text-forest font-serif italic leading-tight">{title}</h2>
          <div className="mt-2 shrink-0"><GoldDivider /></div>
        </div>

        {/* Content Area - No flex-1 to keep it tight to header */}
        <div className="w-full relative z-10 overflow-hidden flex items-start justify-center mt-4">
          <motion.div style={{ x: smoothX }} className="flex">
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

// ── Sections ────────────────────────────────────────────────────────────

function Envelope({ guestName, onOpen, data }: { guestName: string, onOpen: () => void, data: InvitationData }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpen = () => {
    setIsAnimating(true);
    setTimeout(onOpen, 1500);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-forest flex items-center justify-center overflow-hidden">
      <PaperTexture />
      <motion.div
        animate={isAnimating ? { rotateX: -110, y: '-100%', opacity: 0 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
        className="absolute inset-0 w-full h-1/2 bg-forestDark border-b border-gold/30 z-40 flex items-end justify-center pb-12 origin-top shadow-2xl"
      >
        <div className="scale-125 mb-4"><IslamicStar size={120} opacity={0.15} /></div>
      </motion.div>
      <motion.div
        animate={isAnimating ? { rotateX: 110, y: '100%', opacity: 0 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-forest border-t border-gold/30 z-40 flex items-start justify-center pt-12 origin-bottom shadow-2xl"
      >
        <button onClick={handleOpen} className="group relative px-14 py-5 bg-transparent border border-gold text-gold uppercase tracking-[0.5em] text-[11px] font-bold overflow-hidden transition-all hover:text-forest active:scale-95 z-50">
          <span className="relative z-10">Buka Undangan</span>
          <div className="absolute inset-0 bg-gold transition-transform duration-700 -translate-x-full group-hover:translate-x-0" />
        </button>
      </motion.div>
      <div className="absolute inset-0 bg-ivory flex flex-col items-center justify-center p-12 text-center overflow-hidden">
         <OrnamentBorder />
         <div className="space-y-8 w-full max-w-xs mx-auto">
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted font-bold">The Wedding of</p>
              <h2 className="text-4xl text-forest font-serif italic truncate">
                {data.couple.bride.name.split(' ')[0]} <span className="text-2xl font-sans not-italic text-gold">&</span> {data.couple.groom.name.split(' ')[0]}
              </h2>
            </div>
            <div className="w-16 h-px bg-gold/40 mx-auto" />
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted font-medium">Spesial Untuk</p>
              <p className="text-xl font-serif text-forest border-b border-gold/20 pb-1 inline-block px-4">{guestName}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function HeroSection({ config, data, guestName }: { config: any, data: InvitationData, guestName: string }) {
  return (
    <SectionWrapper id="cover">
       <div className="flex-1 flex flex-col items-center justify-between py-4 w-full relative z-10 overflow-hidden">
        <div className="text-center shrink-0">
          <p className="text-base leading-loose mb-0.5 text-gold tracking-[0.04em] font-serif" dir="rtl">
            {config.bismillah || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
          </p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-muted font-bold opacity-60">
            {config.bismillahTranslation || 'Bismillahirrahmanirrahim'}
          </p>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden min-h-0">
          <div className="h-full aspect-[4/5] max-h-[300px] overflow-hidden shadow-2xl relative z-10 rounded-sm">
            <img src={config.couplePhoto} alt="Bride & Groom" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
          </div>
          <div className="absolute top-2 left-2 w-[calc(100%-8px)] h-[calc(100%-8px)] border border-gold/30 z-0 opacity-40 translate-x-1.5 translate-y-1.5" />
        </div>

        <div className="text-center space-y-2 shrink-0 pb-2">
          <div className="space-y-0">
            <p className="text-[8px] tracking-[0.4em] uppercase text-gold font-bold leading-none mb-1">{config.tagline || 'The Wedding of'}</p>
            <h1 className="text-4xl leading-tight text-forest font-serif truncate">{data.couple.bride.name.split(' ')[0]}</h1>
            <p className="text-xl text-gold font-serif italic font-light leading-none my-0.5">&</p>
            <h1 className="text-4xl leading-tight text-forest font-serif truncate">{data.couple.groom.name.split(' ')[0]}</h1>
          </div>
          <div className="pt-1">
             <GoldDivider />
             <div className="mt-2 px-4 py-1 border-y border-gold/10 inline-block">
                <p className="text-sm font-serif italic text-forest font-bold tracking-widest">{guestName}</p>
             </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function IntroductionSection({ config }: { config: any }) {
  return (
    <SectionWrapper id="introduction">
      <div className="max-w-xs text-center space-y-6 flex flex-col items-center justify-center">
        <GoldDivider />
        <p className="text-[13px] leading-relaxed text-muted font-serif italic px-4 line-clamp-[10]">{config.invitationText}</p>
        <GoldDivider />
        <div className="pt-8 flex flex-col items-center gap-2 opacity-20 shrink-0">
           <p className="text-[7px] tracking-[0.4em] text-gold font-bold">Scroll Down</p>
           <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </SectionWrapper>
  );
}

function QuranSection({ config }: { config: any }) {
  return (
    <SectionWrapper id="quran" light>
      <div className="absolute top-0 right-0 p-8 opacity-5 scale-75"><IslamicStar size={200} /></div>
      <div className="max-w-xs text-center space-y-6 relative z-10 px-4">
        <div className="space-y-4">
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold font-bold">Ayat Suci</p>
          <p className="text-xl leading-relaxed text-forest font-serif italic overflow-hidden line-clamp-[8]">"{config.verse}"</p>
          <div className="flex flex-col items-center gap-2 pt-2">
             <div className="w-8 h-px bg-gold/20" />
             <p className="text-[9px] tracking-[0.2em] text-accent font-bold uppercase">{config.reference}</p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function CoupleCard({ person, isBride }: { person: any, isBride: boolean }) {
  return (
    <div className="min-w-full flex shrink-0 items-center justify-center p-4">
       <div className="text-center flex flex-col items-center gap-4 max-w-[280px] w-full">
          <div className="relative shrink-0">
            <div className="w-40 h-52 overflow-hidden shadow-xl relative z-10 rounded-sm border-[4px] border-white">
              <img src={person.image} className="w-full h-full object-cover" alt={person.name} />
            </div>
            <div className={`absolute -bottom-2 ${isBride ? '-right-2' : '-left-2'} w-full h-full border border-gold/30 z-0 opacity-40`} />
          </div>
          <div className="space-y-1 w-full">
            <h3 className="text-2xl text-forest font-serif italic tracking-tight truncate">{person.name}</h3>
            <div className="flex flex-col items-center gap-1.5">
               <div className="w-6 h-[0.5px] bg-gold/40" />
               <p className="text-[9px] text-muted tracking-widest font-bold uppercase italic opacity-60">
                  {isBride ? 'Putri Tercinta dari' : 'Putra Tercinta dari'}
               </p>
            </div>
            <p className="text-xs text-forest font-serif leading-relaxed px-4 line-clamp-2">{person.parents}</p>
          </div>
       </div>
    </div>
  );
}

function StoryCard({ item }: { item: any }) {
  return (
    <div className="min-w-full flex shrink-0 items-center justify-center p-4">
       <div className="max-w-[260px] space-y-4 text-center relative w-full">
          <div className="inline-block px-4 py-1 bg-forest text-[9px] tracking-[0.4em] uppercase text-gold font-bold shadow-lg">{item.year}</div>
          <h3 className="text-xl text-forest font-serif italic leading-tight line-clamp-2">{item.title}</h3>
          <div className="w-8 h-px bg-gold/40 mx-auto" />
          <p className="text-[13px] leading-relaxed text-muted font-serif italic px-2 line-clamp-[6]">{item.desc}</p>
       </div>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <div className="min-w-full flex shrink-0 items-center justify-center p-4">
       <div className="w-full max-w-[280px] bg-surface border border-gold/10 p-6 text-center space-y-6 shadow-xl relative">
          <div className="space-y-3">
            <p className="text-[9px] font-bold text-gold uppercase tracking-[0.4em]">{event.name}</p>
            <p className="text-2xl text-forest font-serif italic tracking-tighter leading-none">{event.date}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] opacity-70">{event.time}</p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="space-y-2 px-2">
            <p className="text-base font-serif text-forest font-medium truncate">{event.venue}</p>
            <p className="text-[10px] text-muted uppercase tracking-widest leading-tight line-clamp-2">{event.address}</p>
          </div>
          <button className="w-full py-3 bg-forest text-goldLight text-[9px] font-bold uppercase tracking-[0.3em] active:scale-95 transition-transform">Lihat Lokasi Maps</button>
       </div>
    </div>
  );
}

function GalleryCard({ url }: { url: string }) {
  return (
    <div className="min-w-full flex shrink-0 items-center justify-center p-6">
       <div className="w-full aspect-[3/4] max-h-[340px] shadow-2xl relative overflow-hidden rounded-sm border-2 border-white">
          <img src={url} className="w-full h-full object-cover" alt="Gallery" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-40" />
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
    <SectionWrapper id="countdown">
      <div className="absolute inset-0 bg-forestDark" />
      <div className="relative z-10 text-center w-full px-8 flex flex-col items-center justify-center h-full">
        <p className="text-[9px] tracking-[0.6em] uppercase text-gold/60 mb-6 font-bold shrink-0">Wedding Timeline</p>
        <h2 className="text-2xl text-ivory font-serif italic mb-10 tracking-tight leading-tight shrink-0">{config.title}</h2>

        <div className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto shrink-0">
          {[
            { v: t.days, l: 'Days' }, { v: t.hours, l: 'Hours' }, { v: t.minutes, l: 'Mins' }, { v: t.seconds, l: 'Secs' }
          ].map((unit, i) => (
            <div key={i} className="flex flex-col items-center">
               <div className="w-12 h-16 bg-forest border border-gold/20 flex items-center justify-center mb-3 rounded-sm shadow-2xl relative">
                  <span className="text-2xl text-ivory font-serif tabular-nums tracking-tighter">{String(unit.v).padStart(2, '0')}</span>
               </div>
               <span className="text-[8px] uppercase tracking-[0.4em] text-gold/50 font-bold italic">{unit.l}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3 shrink-0">
           <GoldDivider />
           <p className="text-xs italic text-ivory/80 font-serif tracking-[0.1em] pt-1 uppercase opacity-80">
              {target.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </p>
        </div>
      </div>
    </SectionWrapper>
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
    <SectionWrapper id="gift">
      <div className="text-center mb-4 shrink-0 px-4">
          <p className="text-[9px] tracking-[0.4em] uppercase mb-1 text-gold font-bold">Kado Pernikahan</p>
          <h2 className="text-3xl text-forest font-serif italic tracking-tight">{config.title}</h2>
          <p className="text-[11px] mt-1 italic text-muted max-w-[220px] mx-auto leading-relaxed font-serif line-clamp-3">{config.description}</p>
      </div>
      <div className="w-full max-w-[280px] space-y-3 overflow-y-auto pr-1 inv-scroll max-h-[60vh]">
        {config.accounts.map((acc: any, i: number) => (
          <div key={i} className="bg-surface p-6 border border-gold/10 text-center shadow-lg relative group shrink-0">
             <p className="text-[8px] uppercase tracking-[0.4em] text-muted mb-4 font-bold opacity-70 italic">{acc.type}</p>
             <p className="text-xl text-forest font-serif mb-1 leading-tight">{acc.bank}</p>
             <p className="text-lg text-forest tracking-[0.1em] mb-1 font-bold">{acc.number}</p>
             <p className="text-[9px] text-muted mb-4 italic uppercase font-medium">a.n. {acc.holder}</p>
             <button onClick={() => copy(acc.number, `acc-${i}`)} className={`w-full py-3 text-[9px] font-bold uppercase tracking-[0.3em] transition-all border ${copied === `acc-${i}` ? 'bg-forest text-gold border-forest shadow-lg scale-[0.98]' : 'border-forest/20 text-forest hover:bg-forest/5'}`}>
               {copied === `acc-${i}` ? 'Copied' : 'Salin Rekening'}
             </button>
          </div>
        ))}
      </div>
    </SectionWrapper>
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

  if (submitted) {
    return (
      <SectionWrapper id="rsvp" light>
        <div className="text-center space-y-6 px-8">
           <div className="w-20 h-20 rounded-full bg-forest/5 border border-gold/20 flex items-center justify-center mx-auto shadow-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.forest} strokeWidth="1.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </div>
           <h3 className="text-2xl text-forest font-serif italic tracking-tight">Terima Kasih</h3>
           <p className="text-sm text-muted font-serif italic leading-relaxed px-4">"Konfirmasi Anda telah kami simpan. Kehadiran dan doa restu Anda adalah kebahagiaan bagi kami."</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="rsvp" light>
       <div className="text-center mb-4 shrink-0">
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold font-bold mb-1">Kehadiran</p>
          <h2 className="text-3xl text-forest font-serif italic tracking-tight leading-tight">{config.title}</h2>
       </div>
       <form onSubmit={handleSubmit} className="w-full max-w-[280px] space-y-4 bg-surface p-6 border border-gold/5 shadow-xl rounded-sm">
          <div className="space-y-1 shrink-0">
             <label className="text-[8px] uppercase tracking-[0.4em] text-muted font-bold opacity-80 italic">Nama Lengkap</label>
             <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-ivory border-b border-gold/30 p-2 text-sm focus:outline-none focus:border-forest font-serif italic transition-all" placeholder="Nama Anda..." />
          </div>
          <div className="space-y-2 shrink-0">
             <label className="text-[8px] uppercase tracking-[0.4em] text-muted font-bold opacity-80 italic">Konfirmasi</label>
             <div className="flex gap-2">
                {['Hadir', 'Tidak'].map(opt => (
                  <button key={opt} type="button" onClick={() => setAttendance(opt)} className={`flex-1 py-2.5 text-[10px] font-bold border tracking-[0.2em] uppercase transition-all ${attendance === opt ? 'bg-forest text-gold border-forest shadow-lg' : 'border-gold/20 text-forest hover:bg-forest/5'}`}>{opt}</button>
                ))}
             </div>
          </div>
          <div className="space-y-2 shrink-0">
             <label className="text-[8px] uppercase tracking-[0.4em] text-muted font-bold opacity-80 italic">Jumlah Tamu</label>
             <div className="flex items-center justify-between border border-gold/20 bg-ivory p-1.5 rounded-sm">
                <button type="button" onClick={() => setGuests(Math.max(1, guests-1))} className="w-8 h-8 text-forest text-xl font-light hover:bg-gold/10 transition-colors rounded-full">-</button>
                <span className="text-lg font-serif italic text-forest font-bold">{guests}</span>
                <button type="button" onClick={() => setGuests(guests+1)} className="w-8 h-8 text-forest text-xl font-light hover:bg-gold/10 transition-colors rounded-full">+</button>
             </div>
          </div>
          <button type="submit" disabled={!name || !attendance} className="w-full py-4 bg-forest text-goldLight text-[10px] font-bold uppercase tracking-[0.5em] disabled:opacity-30 shadow-lg hover:bg-forestDark transition-all mt-1 shrink-0">Konfirmasi</button>
       </form>
    </SectionWrapper>
  );
}

function ClosingSection({ config, onBackToTop }: { config: any, onBackToTop: () => void }) {
  return (
    <SectionWrapper id="closing">
      <div className="absolute inset-0 opacity-[0.06] grayscale mix-blend-multiply bg-cover bg-center shrink-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1485700281629-290c5a704409?w=800)' }} />
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full space-y-8 max-w-xs px-6">
        <IslamicStar size={64} opacity={0.4} />
        <div className="w-10 h-[0.5px] bg-gold/40 shrink-0" />
        <p className="text-sm leading-relaxed italic text-muted font-serif line-clamp-4 shrink-0 px-2">{config.message}</p>
        <div className="space-y-2 shrink-0">
          <p className="text-4xl text-forest font-serif italic tracking-tighter truncate leading-none">{config.names}</p>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-6 bg-gold/25" />
             <p className="text-[10px] tracking-[0.4em] text-gold font-bold uppercase">{config.date}</p>
             <div className="h-px w-6 bg-gold/25" />
          </div>
        </div>
        <div className="w-10 h-[0.5px] bg-gold/40 shrink-0" />
        <button onClick={onBackToTop} className="flex flex-col items-center gap-3 text-[9px] uppercase tracking-[0.6em] text-muted group pt-8 transition-all hover:text-gold shrink-0">
          <div className="w-10 h-10 border border-gold/20 rounded-full flex items-center justify-center transition-all duration-700 group-hover:bg-forest group-hover:border-forest group-hover:text-gold group-hover:-translate-y-2 shadow-xl"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <span className="font-bold tracking-[0.4em]">Ke Atas</span>
        </button>
      </div>
    </SectionWrapper>
  );
}

function SideNavigation({ activeSection, sections, onNavigate }: { activeSection: string, sections: string[], onNavigate: (id: string) => void }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-6 scale-90 sm:scale-100">
      {sections.map((id) => (
        <button
          key={id}
          className={`w-[2px] rounded-full transition-all duration-1000 group relative ${activeSection === id ? 'bg-gold h-12 shadow-[0_0_15px_rgba(199,169,107,0.8)]' : 'bg-forest/15 h-1.5 hover:bg-gold/40'}`}
          onClick={() => onNavigate(id)}
        >
           <span className={`absolute right-full mr-5 text-[8px] uppercase tracking-[0.4em] font-bold text-gold opacity-0 transition-all duration-500 whitespace-nowrap pointer-events-none group-hover:opacity-100 group-hover:-translate-x-1 ${activeSection === id ? 'opacity-100 -translate-x-1' : ''}`}>
              {id === 'cover' ? 'Awal' : id === 'introduction' ? 'Mulai' : id === 'quran' ? 'Ayat' : id === 'couple' ? 'Mempelai' : id === 'story' ? 'Cerita' : id === 'event' ? 'Acara' : id === 'countdown' ? 'Waktu' : id === 'gallery' ? 'Momen' : id === 'gift' ? 'Kado' : id === 'rsvp' ? 'RSVP' : 'Akhir'}
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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, root: containerRef.current }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [opened]);

  const getSection = (id: string) => data.sections.find(s => s.id === id);

  if (!opened) {
    return <Envelope guestName={guestName} data={data} onOpen={() => setOpened(true)} />;
  }

  return (
    <div className={`${previewMode ? 'absolute' : 'fixed'} inset-0 bg-ivory overflow-y-auto overflow-x-hidden scroll-smooth inv-scroll select-none`} ref={containerRef}>
      <div className="anim-fade-in relative min-h-full">
        <SideNavigation activeSection={activeSection} sections={sectionIds} onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} />
        <button onClick={() => setMusicOn((v) => !v)} className="fixed top-10 left-10 z-[150] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-1000 bg-forest shadow-xl border border-gold/30 hover:scale-110 active:scale-95 group overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
             <motion.div animate={musicOn ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[1px] border-gold/10 border-t-gold/30 m-2" />
             <span className="text-xl relative z-10">{musicOn ? '🔇' : '🎵'}</span>
          </div>
        </button>

        <HeroSection config={getSection('cover')?.config} data={data} guestName={guestName} />
        <IntroductionSection config={getSection('introduction')?.config} />
        <QuranSection config={getSection('quran')?.config} />

        <HorizontalTakeoverSection id="couple" title="Mempelai Utama" tagline="The Bride & Groom" itemsCount={2} containerRef={containerRef}>
           <CoupleCard person={data.couple.bride} isBride={true} />
           <CoupleCard person={data.couple.groom} isBride={false} />
        </HorizontalTakeoverSection>

        <HorizontalTakeoverSection id="story" title="Kisah Cinta" tagline="Our Story" itemsCount={getSection('story')?.config.items.length || 1} light containerRef={containerRef}>
           {getSection('story')?.config.items.map((item: any, i: number) => <StoryCard key={i} item={item} />)}
        </HorizontalTakeoverSection>

        <HorizontalTakeoverSection id="event" title="Acara Bahagia" tagline="Wedding Events" itemsCount={getSection('event')?.config.events.length || 1} containerRef={containerRef}>
           {getSection('event')?.config.events.map((ev: any, i: number) => <EventCard key={i} event={ev} />)}
        </HorizontalTakeoverSection>

        <CountdownSection config={getSection('countdown')?.config} />

        <HorizontalTakeoverSection id="gallery" title="Galeri Foto" tagline="Our Gallery" itemsCount={getSection('gallery')?.config.images.length || 1} light containerRef={containerRef}>
           {getSection('gallery')?.config.images.map((img: string, i: number) => <GalleryCard key={i} url={img} />)}
        </HorizontalTakeoverSection>

        <GiftSection config={getSection('gift')?.config} />
        <RSVPSection config={getSection('rsvp')?.config} onSubmit={(rsvp) => onRSVP?.(rsvp)} />
        <ClosingSection config={getSection('closing')?.config} onBackToTop={() => document.getElementById('cover')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>
    </div>
  );
}
