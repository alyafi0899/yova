import { useState, useEffect, useRef } from 'react';

const C = {
  forest: '#17352F',
  gold: '#C7A96B',
  ivory: '#F8F4EC',
  surface: '#FFFDF8',
  ink: '#252522',
  muted: '#8D897E',
};

const serif = "'Playfair Display', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";

// ── Ornaments ──────────────────────────────────────────────────────────────────

function GoldDivider({ short }: { short?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`h-px ${short ? 'w-12' : 'flex-1'}`}
        style={{ background: `linear-gradient(to right, transparent, ${C.gold}60)` }}
      />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
          fill={C.gold}
          opacity="0.7"
        />
      </svg>
      <div
        className={`h-px ${short ? 'w-12' : 'flex-1'}`}
        style={{ background: `linear-gradient(to left, transparent, ${C.gold}60)` }}
      />
    </div>
  );
}

function IslamicStar({
  size = 64,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }}>
      <polygon
        points="32,4 37,24 57,24 41,36 47,56 32,44 17,56 23,36 7,24 27,24"
        fill={C.gold}
      />
      <polygon
        points="32,12 36,26 50,26 39,34 43,48 32,40 21,48 25,34 14,26 28,26"
        fill={C.forest}
      />
      <circle cx="32" cy="32" r="4" fill={C.gold} opacity="0.6" />
    </svg>
  );
}

// ── Cover ──────────────────────────────────────────────────────────────────────

function Cover({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: C.ivory }}
    >
      {/* Double border frame */}
      <div
        className="absolute inset-3 pointer-events-none"
        style={{ border: `1px solid ${C.gold}40` }}
      />
      <div
        className="absolute inset-5 pointer-events-none"
        style={{ border: `0.5px solid ${C.gold}20` }}
      />

      {/* Corner stars */}
      <div className="absolute top-6 left-6">
        <IslamicStar size={72} opacity={0.12} />
      </div>
      <div className="absolute top-6 right-6 rotate-45">
        <IslamicStar size={72} opacity={0.12} />
      </div>
      <div className="absolute bottom-6 left-6 -rotate-45">
        <IslamicStar size={72} opacity={0.10} />
      </div>
      <div className="absolute bottom-6 right-6 rotate-90">
        <IslamicStar size={72} opacity={0.10} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-between py-14 px-8 gap-8 relative z-10">
        {/* Bismillah */}
        <div className="text-center anim-fade-in">
          <p
            className="text-xl leading-loose mb-1"
            dir="rtl"
            style={{ fontFamily: serif, color: C.gold, letterSpacing: '0.04em' }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ fontFamily: sans, color: C.muted }}
          >
            Bismillahirrahmanirrahim
          </p>
        </div>

        {/* Couple photo */}
        <div className="relative anim-scale-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div
            className="w-52 h-64 overflow-hidden"
            style={{
              boxShadow: `0 24px 60px ${C.forest}25`,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=400&h=520&fit=crop&auto=format"
              alt="Zahra & Rafi"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 55%, ${C.forest}50 100%)`,
              }}
            />
          </div>
          {/* Offset gold frame */}
          <div
            className="absolute -top-2 -left-2 w-full h-full pointer-events-none"
            style={{ border: `1px solid ${C.gold}60` }}
          />
        </div>

        {/* Names */}
        <div
          className="text-center anim-fade-up"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: sans, color: C.muted }}
          >
            The Wedding of
          </p>
          <h1
            className="text-[64px] leading-none"
            style={{ fontFamily: serif, color: C.forest }}
          >
            Zahra
          </h1>
          <p
            className="text-3xl my-1"
            style={{ fontFamily: serif, color: C.gold, fontStyle: 'italic' }}
          >
            &amp;
          </p>
          <h1
            className="text-[64px] leading-none"
            style={{ fontFamily: serif, color: C.forest }}
          >
            Rafi
          </h1>

          <div className="mt-5 mb-5">
            <GoldDivider />
          </div>

          <p
            className="text-xs leading-relaxed max-w-[280px] mx-auto"
            style={{ fontFamily: sans, color: C.muted, fontStyle: 'italic' }}
          >
            "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang
            Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami."
          </p>
        </div>

        {/* Guest personalization */}
        <div
          className="text-center px-8 py-4 w-full max-w-[260px] anim-fade-up"
          style={{
            animationDelay: '0.45s',
            opacity: 0,
            borderTop: `1px solid ${C.gold}35`,
            borderBottom: `1px solid ${C.gold}35`,
          }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-1"
            style={{ fontFamily: sans, color: C.muted }}
          >
            Kepada Yth.
          </p>
          <p
            className="text-base font-semibold"
            style={{ fontFamily: serif, color: C.forest }}
          >
            {guestName}
          </p>
        </div>

        {/* Open button */}
        <div
          className="text-center anim-fade-up"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          <button
            onClick={onOpen}
            className="group flex flex-col items-center gap-3"
          >
            <span
              className="px-10 py-3 text-[11px] tracking-[0.25em] uppercase transition-all duration-500 group-hover:bg-[#17352F] group-hover:text-[#F8F4EC]"
              style={{
                fontFamily: sans,
                color: C.forest,
                border: `1px solid ${C.forest}`,
                letterSpacing: '0.2em',
              }}
            >
              Open Invitation
            </span>
            <svg
              className="animate-bounce"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 3 L8 13 M4 9 L8 13 L12 9"
                stroke={C.gold}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quran Section ──────────────────────────────────────────────────────────────

function QuranSection() {
  return (
    <section
      className="py-24 px-8 text-center relative"
      style={{ backgroundColor: C.surface }}
    >
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-5">
        <IslamicStar size={120} opacity={1} />
      </div>
      <div className="max-w-lg mx-auto relative">
        <GoldDivider />
        <div className="py-12">
          <p
            className="text-[11px] tracking-[0.25em] uppercase mb-8"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Firman Allah SWT
          </p>
          <p
            className="text-2xl leading-relaxed mb-6"
            style={{ fontFamily: serif, color: C.forest, fontStyle: 'italic' }}
          >
            "And among His signs is that He created for you spouses from among
            yourselves so that you may find tranquility in them; and He placed
            between you affection and mercy."
          </p>
          <p
            className="text-xs tracking-[0.15em]"
            style={{ fontFamily: sans, color: C.gold }}
          >
            QS. Ar-Rum : 21
          </p>
        </div>
        <GoldDivider />
      </div>
    </section>
  );
}

// ── Couple Section ─────────────────────────────────────────────────────────────

function CoupleSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: C.ivory }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Together in Love
          </p>
          <h2 className="text-4xl" style={{ fontFamily: serif, color: C.forest }}>
            The Bride &amp; Groom
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Bride */}
          <div className="text-center flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-44 h-56 overflow-hidden"
                style={{ boxShadow: `0 16px 48px ${C.forest}15` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1779144999758-4062528dd799?w=350&h=450&fit=crop&crop=top&auto=format"
                  alt="Zahra Aulia Putri"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-2 -right-2 w-full h-full pointer-events-none"
                style={{ border: `1px solid ${C.gold}50` }}
              />
            </div>
            <div>
              <h3
                className="text-2xl mt-2"
                style={{ fontFamily: serif, color: C.forest }}
              >
                Zahra Aulia Putri
              </h3>
              <p className="text-xs mt-3" style={{ fontFamily: sans, color: C.muted }}>
                Putri dari
              </p>
              <p
                className="text-sm mt-1 leading-relaxed"
                style={{ fontFamily: sans, color: C.ink }}
              >
                Bapak Ahmad Fauzi
                <br />
                <span style={{ color: C.muted }}>&amp;</span>
                <br />
                Ibu Siti Rahmah
              </p>
            </div>
          </div>

          {/* Groom */}
          <div className="text-center flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-44 h-56 overflow-hidden"
                style={{ boxShadow: `0 16px 48px ${C.forest}15` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1726694064556-c9565e8e81c9?w=350&h=450&fit=crop&crop=top&auto=format"
                  alt="Rafi Maulana"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-2 -left-2 w-full h-full pointer-events-none"
                style={{ border: `1px solid ${C.gold}50` }}
              />
            </div>
            <div>
              <h3
                className="text-2xl mt-2"
                style={{ fontFamily: serif, color: C.forest }}
              >
                Rafi Maulana
              </h3>
              <p className="text-xs mt-3" style={{ fontFamily: sans, color: C.muted }}>
                Putra dari
              </p>
              <p
                className="text-sm mt-1 leading-relaxed"
                style={{ fontFamily: sans, color: C.ink }}
              >
                Bapak Hendra Maulana
                <br />
                <span style={{ color: C.muted }}>&amp;</span>
                <br />
                Ibu Nur Aisyah
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Story Section ──────────────────────────────────────────────────────────────

const story = [
  {
    year: '2019',
    title: 'First Meeting',
    desc: 'Bertemu untuk pertama kalinya di sebuah acara kampus yang tak terduga dan tak terlupakan.',
  },
  {
    year: '2021',
    title: 'A New Chapter',
    desc: 'Persahabatan yang tumbuh perlahan menjadi sesuatu yang jauh lebih bermakna.',
  },
  {
    year: '2025',
    title: 'The Proposal',
    desc: 'Rafi melamar Zahra dengan penuh cinta dan doa di bawah langit senja ..',
  },
  {
    year: '2026',
    title: 'The Beginning of Forever',
    desc: 'Kami memulai babak baru kehidupan bersama, diikat oleh cinta dan ridho-Nya.',
  },
];

function StorySection() {
  return (
    <section className="py-24 px-8" style={{ backgroundColor: C.surface }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Perjalanan Kami
          </p>
          <h2 className="text-4xl" style={{ fontFamily: serif, color: C.forest }}>
            Our Story
          </h2>
        </div>

        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-2 top-2 bottom-2 w-px"
            style={{ backgroundColor: `${C.gold}35` }}
          />

          <div className="flex flex-col gap-10">
            {story.map((s, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-[26px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: C.ivory,
                    borderColor: C.gold,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: C.gold }}
                  />
                </div>
                <p
                  className="text-[11px] tracking-[0.2em] uppercase mb-1"
                  style={{ fontFamily: sans, color: C.gold }}
                >
                  {s.year}
                </p>
                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: serif, color: C.forest }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: sans, color: C.muted }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Countdown Section ──────────────────────────────────────────────────────────

function useCountdown(target: Date) {
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
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function CountdownSection() {
  const wedding = new Date(2026, 11, 12, 8, 0, 0);
  const t = useCountdown(wedding);

  return (
    <section
      className="py-24 px-6 text-center relative overflow-hidden"
      style={{ backgroundColor: C.forest }}
    >
      {/* Background ornament */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <IslamicStar size={300} opacity={1} />
      </div>

      <div className="relative">
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3"
          style={{ fontFamily: sans, color: `${C.gold}90` }}
        >
          Menghitung Hari
        </p>
        <h2
          className="text-3xl mb-12"
          style={{ fontFamily: serif, color: C.ivory }}
        >
          Counting Down to Our Day
        </h2>

        <div className="flex justify-center gap-6 md:gap-10">
          {[
            { value: t.days, label: 'Days' },
            { value: t.hours, label: 'Hours' },
            { value: t.minutes, label: 'Minutes' },
            { value: t.seconds, label: 'Seconds' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                style={{ border: `1px solid ${C.gold}40` }}
              >
                <span
                  className="text-3xl md:text-4xl tabular-nums"
                  style={{ fontFamily: serif, color: C.ivory }}
                >
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <span
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: sans, color: `${C.gold}80` }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <GoldDivider />
          <p
            className="text-sm mt-4"
            style={{ fontFamily: serif, color: `${C.ivory}70`, fontStyle: 'italic' }}
          >
            Saturday, 12 December 2026
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Events Section ─────────────────────────────────────────────────────────────

function EventCard({
  title,
  date,
  time,
  venue,
  address,
}: {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.gold}30`,
        boxShadow: `0 8px 32px ${C.forest}08`,
      }}
    >
      {/* Header */}
      <div
        className="px-8 py-5 text-center"
        style={{ backgroundColor: C.forest, borderBottom: `2px solid ${C.gold}60` }}
      >
        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-1"
          style={{ fontFamily: sans, color: `${C.gold}90` }}
        >
          Wedding Event
        </p>
        <h3 className="text-xl" style={{ fontFamily: serif, color: C.ivory }}>
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="px-8 py-8 flex flex-col items-center gap-5 text-center">
        <div>
          <p className="text-xs mb-1" style={{ fontFamily: sans, color: C.muted }}>
            {date.split('\n')[0]}
          </p>
          <p className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>
            {date.split('\n')[1]}
          </p>
        </div>

        <div
          className="w-full h-px"
          style={{ backgroundColor: `${C.gold}25` }}
        />

        <div>
          <p
            className="text-sm font-medium"
            style={{ fontFamily: sans, color: C.ink }}
          >
            {time}
          </p>
        </div>

        <div
          className="w-full h-px"
          style={{ backgroundColor: `${C.gold}25` }}
        />

        <div>
          <p
            className="text-base"
            style={{ fontFamily: serif, color: C.forest }}
          >
            {venue}
          </p>
          <p className="text-xs mt-1" style={{ fontFamily: sans, color: C.muted }}>
            {address}
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#17352F] hover:text-[#F8F4EC]"
            style={{
              fontFamily: sans,
              color: C.forest,
              border: `1px solid ${C.forest}`,
            }}
          >
            View Map
          </button>
          <button
            className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#C7A96B] hover:text-[#FFFDF8]"
            style={{
              fontFamily: sans,
              color: C.gold,
              border: `1px solid ${C.gold}`,
            }}
          >
            + Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: C.ivory }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Save the Date
          </p>
          <h2 className="text-4xl" style={{ fontFamily: serif, color: C.forest }}>
            Wedding Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventCard
            title="Akad Nikah"
            date={"Saturday\n12 December 2026"}
            time="08:00 – 10:00 WIB"
            venue="Masjid Al-Hikmah"
            address=" "
          />
          <EventCard
            title="Walimatul Ursy"
            date={"Saturday\n12 December 2026"}
            time="11:00 – 15:00 WIB"
            venue="Grand Ballroom Hermes Palace"
            address=" h"
          />
        </div>
      </div>
    </section>
  );
}

// ── Gallery Section ────────────────────────────────────────────────────────────

const galleryPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1772241824154-ce6e7c985ff9?w=600&h=800&fit=crop&auto=format',
    alt: 'Bride and groom portrait',
  },
  {
    url: 'https://images.unsplash.com/photo-1670014235502-08593dc092b4?w=600&h=500&fit=crop&auto=format',
    alt: 'Couple holding hands',
  },
  {
    url: 'https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=600&h=700&fit=crop&auto=format',
    alt: 'Wedding couple portrait',
  },
  {
    url: 'https://images.unsplash.com/photo-1485700281629-290c5a704409?w=600&h=500&fit=crop&auto=format',
    alt: 'Wedding floral arrangement',
  },
  {
    url: 'https://images.unsplash.com/photo-1586161659865-2ce93be6b95c?w=600&h=650&fit=crop&auto=format',
    alt: 'Wedding roses',
  },
  {
    url: 'https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=600&h=700&fit=crop&auto=format',
    alt: 'Couple together',
  },
];

function GallerySection() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  function prev() {
    setLightboxIdx((i) => (i === null ? 0 : (i - 1 + galleryPhotos.length) % galleryPhotos.length));
  }
  function next() {
    setLightboxIdx((i) => (i === null ? 0 : (i + 1) % galleryPhotos.length));
  }

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx]);

  return (
    <section className="py-24 px-6" style={{ backgroundColor: C.surface }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Momen Berharga
          </p>
          <h2 className="text-4xl" style={{ fontFamily: serif, color: C.forest }}>
            Our Gallery
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryPhotos.map((photo, i) => (
            <button
              key={i}
              className={`overflow-hidden group relative ${i === 0 ? 'row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '3/4' : '4/3' }}
              onClick={() => setLightboxIdx(i)}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: `${C.forest}40` }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 3h6v6M21 3l-9 9M9 21H3v-6M3 21l9-9"
                    stroke={C.ivory}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ backgroundColor: `${C.ink}F0` }}
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[lightboxIdx].url.replace('w=600', 'w=900')}
              alt={galleryPhotos[lightboxIdx].alt}
              className="w-full max-h-[80vh] object-contain anim-scale-in"
            />
            {/* Counter */}
            <p
              className="text-center mt-4 text-xs"
              style={{ fontFamily: sans, color: `${C.ivory}60` }}
            >
              {lightboxIdx + 1} / {galleryPhotos.length}
            </p>
          </div>
          {/* Prev / Next */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
            style={{ border: `1px solid ${C.gold}50` }}
            onClick={prev}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3 L5 8 L10 13" stroke={C.ivory} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
            style={{ border: `1px solid ${C.gold}50` }}
            onClick={next}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3 L11 8 L6 13" stroke={C.ivory} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3 L13 13 M13 3 L3 13" stroke={C.ivory} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

// ── Gift Section ───────────────────────────────────────────────────────────────

function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section className="py-24 px-6" style={{ backgroundColor: C.ivory }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-14">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Hadiah Pernikahan
          </p>
          <h2 className="text-4xl" style={{ fontFamily: serif, color: C.forest }}>
            Wedding Gift
          </h2>
          <p
            className="text-sm mt-4"
            style={{ fontFamily: sans, color: C.muted, fontStyle: 'italic' }}
          >
            Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Bank Transfer */}
          <div
            className="p-7"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.gold}25`,
              boxShadow: `0 4px 24px ${C.forest}06`,
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ backgroundColor: C.forest }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="5" width="12" height="8" rx="1" stroke={C.gold} strokeWidth="1" />
                  <path d="M1 7h12" stroke={C.gold} strokeWidth="1" />
                  <path d="M4 1h6l2 4H2L4 1z" stroke={C.gold} strokeWidth="1" />
                </svg>
              </div>
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: sans, color: C.muted }}
              >
                Bank Transfer
              </p>
            </div>
            <p className="text-2xl mb-1" style={{ fontFamily: serif, color: C.forest }}>
              BCA
            </p>
            <p
              className="text-xl tracking-wider mb-1"
              style={{ fontFamily: sans, color: C.ink }}
            >
              1234567890
            </p>
            <p className="text-xs mb-5" style={{ fontFamily: sans, color: C.muted }}>
              a.n. Zahra Aulia Putri
            </p>
            <button
              onClick={() => copy('1234567890', 'bca')}
              className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                fontFamily: sans,
                color: copied === 'bca' ? C.surface : C.forest,
                backgroundColor: copied === 'bca' ? C.forest : 'transparent',
                border: `1px solid ${C.forest}`,
              }}
            >
              {copied === 'bca' ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6 L5 9 L10 3" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Copied
                </>
              ) : (
                'Copy Account Number'
              )}
            </button>
          </div>

          {/* E-Wallet */}
          <div
            className="p-7"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.gold}25`,
              boxShadow: `0 4px 24px ${C.forest}06`,
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ backgroundColor: C.forest }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="3" width="10" height="8" rx="2" stroke={C.gold} strokeWidth="1" />
                  <circle cx="9" cy="7" r="1.5" stroke={C.gold} strokeWidth="1" />
                </svg>
              </div>
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: sans, color: C.muted }}
              >
                Digital Wallet
              </p>
            </div>
            <p className="text-2xl mb-1" style={{ fontFamily: serif, color: C.forest }}>
              DANA
            </p>
            <p
              className="text-xl tracking-wider mb-1"
              style={{ fontFamily: sans, color: C.ink }}
            >
              081234567890
            </p>
            <p className="text-xs mb-5" style={{ fontFamily: sans, color: C.muted }}>
              a.n. Zahra Aulia Putri
            </p>
            <button
              onClick={() => copy('081234567890', 'dana')}
              className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                fontFamily: sans,
                color: copied === 'dana' ? C.surface : C.forest,
                backgroundColor: copied === 'dana' ? C.forest : 'transparent',
                border: `1px solid ${C.forest}`,
              }}
            >
              {copied === 'dana' ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6 L5 9 L10 3" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Copied
                </>
              ) : (
                'Copy Number'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── RSVP Section ───────────────────────────────────────────────────────────────

function RSVPSection() {
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(1);
  const [attendance, setAttendance] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !attendance) return;
    setSubmitted(true);
  }

  const inputStyle = {
    fontFamily: sans,
    color: C.ink,
    backgroundColor: C.ivory,
    border: `1px solid ${C.gold}35`,
    outline: 'none',
  };

  if (submitted) {
    return (
      <section className="py-24 px-6 text-center" style={{ backgroundColor: C.surface }}>
        <div className="max-w-sm mx-auto flex flex-col items-center gap-6 anim-scale-in">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${C.forest}15`, border: `1px solid ${C.forest}30` }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 14 L11 19 L22 9"
                stroke={C.forest}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-3xl" style={{ fontFamily: serif, color: C.forest }}>
            RSVP Confirmed
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: sans, color: C.muted, fontStyle: 'italic' }}
          >
            "Terima kasih atas konfirmasi dan doa restu Anda. Kehadiran Anda
            adalah kebahagiaan bagi kami."
          </p>
          <p className="text-sm font-medium" style={{ fontFamily: sans, color: C.forest }}>
            — Zahra &amp; Rafi
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6" style={{ backgroundColor: C.surface }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            Konfirmasi Kehadiran
          </p>
          <h2 className="text-4xl" style={{ fontFamily: serif, color: C.forest }}>
            Will You Join Us?
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              className="block text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: sans, color: C.muted }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap Anda"
              className="w-full px-4 py-3 text-sm focus:ring-0 transition-colors"
              style={{
                ...inputStyle,
                borderColor: name ? `${C.forest}50` : `${C.gold}35`,
              }}
            />
          </div>

          <div>
            <label
              className="block text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: sans, color: C.muted }}
            >
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#17352F] hover:text-[#F8F4EC]"
                style={{ border: `1px solid ${C.gold}40`, color: C.forest, fontFamily: sans }}
              >
                −
              </button>
              <span
                className="text-xl w-8 text-center"
                style={{ fontFamily: serif, color: C.forest }}
              >
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#17352F] hover:text-[#F8F4EC]"
                style={{ border: `1px solid ${C.gold}40`, color: C.forest, fontFamily: sans }}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: sans, color: C.muted }}
            >
              Attendance
            </label>
            <div className="flex flex-col gap-2">
              {['Will Attend', 'Unable to Attend', 'Maybe'].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 cursor-pointer px-4 py-3 transition-colors"
                  style={{
                    border: `1px solid ${attendance === opt ? C.forest : `${C.gold}30`}`,
                    backgroundColor: attendance === opt ? `${C.forest}08` : 'transparent',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      border: `1.5px solid ${attendance === opt ? C.forest : C.muted}`,
                    }}
                  >
                    {attendance === opt && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: C.forest }}
                      />
                    )}
                  </div>
                  <input
                    type="radio"
                    className="hidden"
                    value={opt}
                    checked={attendance === opt}
                    onChange={() => setAttendance(opt)}
                  />
                  <span className="text-sm" style={{ fontFamily: sans, color: C.ink }}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: sans, color: C.muted }}
            >
              Message / Wishes
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa untuk Zahra & Rafi..."
              rows={4}
              className="w-full px-4 py-3 text-sm resize-none"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={!name || !attendance}
            className="w-full py-4 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40"
            style={{
              fontFamily: sans,
              backgroundColor: C.forest,
              color: C.ivory,
            }}
          >
            Confirm RSVP
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Closing Section ────────────────────────────────────────────────────────────

function ClosingSection({ onBackToTop }: { onBackToTop: () => void }) {
  return (
    <section
      className="py-24 px-8 text-center relative overflow-hidden"
      style={{ backgroundColor: C.ivory }}
    >
      {/* Decorative floral from gallery */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-5"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1485700281629-290c5a704409?w=800&h=600&fit=crop&auto=format)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${C.ivory}, ${C.ivory}F5, ${C.ivory})` }}
      />

      <div className="relative max-w-sm mx-auto flex flex-col items-center gap-8">
        <div>
          <IslamicStar size={48} opacity={0.15} />
        </div>

        <GoldDivider />

        <p
          className="text-base leading-relaxed"
          style={{ fontFamily: serif, color: C.muted, fontStyle: 'italic' }}
        >
          "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."
        </p>

        <div>
          <p className="text-3xl" style={{ fontFamily: serif, color: C.forest }}>
            Zahra &amp; Rafi
          </p>
          <p
            className="text-xs tracking-[0.2em] mt-2"
            style={{ fontFamily: sans, color: C.gold }}
          >
            12.12.2026
          </p>
        </div>

        <GoldDivider />

        <button
          onClick={onBackToTop}
          className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
          style={{ fontFamily: sans, color: C.muted }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 9 L6 3 M3 5 L6 3 L9 5"
              stroke={C.muted}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Top
        </button>
      </div>
    </section>
  );
}

// ── Main Invitation ────────────────────────────────────────────────────────────

export default function Invitation({ guestName = 'Bapak Ahmad & Keluarga' }: { guestName?: string }) {
  const [opened, setOpened] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  function handleOpen() {
    setOpened(true);
    setTimeout(() => setCoverGone(true), 700);
  }

  function backToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="h-full overflow-y-auto" ref={topRef}>
      {/* Cover overlay */}
      {!coverGone && (
        <div
          className="transition-opacity duration-700"
          style={{ opacity: opened ? 0 : 1, pointerEvents: opened ? 'none' : 'auto' }}
        >
          <Cover guestName={guestName} onOpen={handleOpen} />
        </div>
      )}

      {/* Main invitation body */}
      {coverGone && (
        <div className="anim-fade-in">
          {/* Floating music btn */}
          <button
            onClick={() => setMusicOn((v) => !v)}
            className="fixed top-5 left-5 z-[150] w-10 h-10 flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.gold}40`,
              boxShadow: `0 4px 16px ${C.forest}15`,
            }}
            title={musicOn ? 'Pause music' : 'Play music'}
          >
            {musicOn ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2" width="3" height="10" fill={C.forest} />
                <rect x="9" y="2" width="3" height="10" fill={C.forest} />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2 L3 12 L12 7 Z" fill={C.forest} />
              </svg>
            )}
          </button>

          <QuranSection />
          <CoupleSection />
          <StorySection />
          <CountdownSection />
          <EventsSection />
          <GallerySection />
          <GiftSection />
          <RSVPSection />
          <ClosingSection onBackToTop={backToTop} />
        </div>
      )}
    </div>
  );
}
