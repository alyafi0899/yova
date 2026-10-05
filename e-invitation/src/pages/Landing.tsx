import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = ['Templates', 'Fitur', 'Harga', 'Tentang']

const TEMPLATES_PREVIEW = [
  { name: 'Noura', style: 'Islamic Elegant', colors: ['#C9A84C', '#F5EFE6', '#1B3A4B'], img: 'photo-1625038032128-54ed70feb167' },
  { name: 'Azzahra', style: 'Floral Romantic', colors: ['#E8A4B8', '#F8F0F4', '#6B4C5E'], img: 'photo-1521129866021-4313ccf20e9e' },
  { name: 'Madinah', style: 'Minimal Islamic', colors: ['#2C3E50', '#ECF0F1', '#BDC3C7'], img: 'photo-1485700281629-290c5a704409' },
  { name: 'Zayyan', style: 'Dark Luxury', colors: ['#1A1A1A', '#C9A84C', '#2D2D2D'], img: 'photo-1549576207-72dd5179984b' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Pilih Template', desc: 'Jelajahi koleksi template pernikahan kami yang dirancang dengan indah.' },
  { step: '02', title: 'Isi Informasi', desc: 'Masukkan detail pernikahan Anda dengan mudah melalui form yang terstruktur.' },
  { step: '03', title: 'Kustomisasi', desc: 'Sesuaikan warna, tipografi, dan konten sesuai selera Anda.' },
  { step: '04', title: 'Publikasikan', desc: 'Bayar sekali, bagikan tautan unik Anda ke semua tamu undangan.' },
]

const FEATURES = [
  { icon: '✦', title: 'Template Premium', desc: 'Lebih dari 20+ desain template islami yang elegan dan modern.' },
  { icon: '✦', title: 'RSVP Otomatis', desc: 'Kelola konfirmasi kehadiran tamu secara real-time di dashboard.' },
  { icon: '✦', title: 'Ucapan Tamu', desc: 'Tampilkan doa dan ucapan dari tamu dalam tampilan yang cantik.' },
  { icon: '✦', title: 'Undangan Personal', desc: 'Buat URL undangan personal untuk setiap tamu dengan nama mereka.' },
  { icon: '✦', title: 'Peta Lokasi', desc: 'Integrasi Google Maps untuk memudahkan tamu menemukan lokasi.' },
  { icon: '✦', title: 'Musik Latar', desc: 'Tambahkan lagu favorit sebagai musik latar undangan Anda.' },
]

const TESTIMONIALS = [
  { name: 'Fatimah & Rizky', city: '.', text: 'Undangan digitalnya sangat cantik dan mudah dibuat. Tamu-tamu kami sangat terkesan!', template: 'Noura' },
  { name: 'Sari & Ahmad', city: 'Jakarta', text: 'Fitur RSVP-nya sangat membantu. Kami bisa pantau konfirmasi kehadiran dengan mudah.', template: 'Azzahra' },
  { name: 'Nabila & Farhan', city: 'Surabaya', text: 'Desain premium dengan harga yang sangat terjangkau. Sangat recommended!', template: 'Madinah' },
]

const FAQS = [
  { q: 'Apakah saya bisa mencoba sebelum membayar?', a: 'Ya! Anda dapat membuat dan mengkustomisasi undangan secara gratis. Pembayaran hanya diperlukan saat Anda ingin mempublikasikan undangan.' },
  { q: 'Berapa lama undangan aktif setelah dipublikasikan?', a: 'Undangan Anda akan aktif selama 2 tahun setelah tanggal pernikahan.' },
  { q: 'Apakah saya bisa mengedit undangan setelah dipublikasikan?', a: 'Ya, Anda tetap bisa mengedit konten undangan meskipun sudah dipublikasikan.' },
  { q: 'Berapa maksimal tamu yang bisa dikelola?', a: 'Tidak ada batasan. Anda bisa mengelola hingga ribuan tamu di dashboard RSVP.' },
  { q: 'Apakah undangan bisa dilihat di smartphone?', a: 'Tentu! Undangan dirancang mobile-first dan dioptimalkan untuk tampilan smartphone.' },
]

function OrnamentDivider() {
  return (
    <div className="flex items-center gap-4 justify-center my-2">
      <div className="h-px flex-1 max-w-16 bg-amber-300/40" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z" fill="#C9A84C" fillOpacity="0.6" />
      </svg>
      <div className="h-px flex-1 max-w-16 bg-amber-300/40" />
    </div>
  )
}

function PhoneMockup() {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(14)
  const [hours, setHours] = useState(3)
  const [days, setDays] = useState(127)

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) { setMinutes(m => { if (m <= 0) { setHours(h => { if (h <= 0) { setDays(d => Math.max(0, d - 1)); return 23 } return h - 1 }); return 59 } return m - 1 }); return 59 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative mx-auto" style={{ width: 220 }}>
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden" style={{ height: 440 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-b-2xl z-10" />
        <div className="w-full h-full overflow-hidden rounded-[1.8rem]" style={{ background: 'linear-gradient(170deg, #1B3A4B 0%, #0D2233 100%)' }}>
          {/* Invitation content */}
          <div className="flex flex-col items-center justify-center h-full text-center px-5 relative">
            <div className="absolute inset-0 geometric-pattern opacity-20" />
            <p className="text-amber-300/70 text-[9px] tracking-[0.2em] uppercase mb-3 font-sans relative z-10">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <p className="text-amber-100/60 text-[8px] tracking-widest uppercase mb-1 relative z-10">The Wedding of</p>
            <h3 className="font-display text-white text-2xl leading-tight relative z-10">Al Yafi</h3>
            <p className="text-amber-400 text-lg font-display italic relative z-10">&amp;</p>
            <h3 className="font-display text-white text-2xl leading-tight relative z-10">Yova</h3>
            <OrnamentDivider />
            <p className="text-amber-100/70 text-[9px] tracking-widest uppercase mt-1 relative z-10">10 Januari 2027</p>
            <div className="mt-4 grid grid-cols-4 gap-2 relative z-10">
              {[['days', days], ['jam', hours], ['mnt', minutes], ['dtk', seconds]].map(([label, val]) => (
                <div key={label as string} className="flex flex-col items-center">
                  <span className="text-amber-400 text-base font-display leading-none">{String(val).padStart(2, '0')}</span>
                  <span className="text-amber-100/40 text-[7px] tracking-widest uppercase mt-0.5">{label}</span>
                </div>
              ))}
            </div>
            <button className="mt-5 relative z-10 px-6 py-1.5 border border-amber-400/60 text-amber-300 text-[9px] tracking-widest uppercase rounded-full hover:bg-amber-400/10 transition-colors">
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-amber-400/20 blur-2xl rounded-full" />
    </div>
  )
}

export default function Landing() {
  const [activeTemplate, setActiveTemplate] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Outfit, sans-serif', background: '#FAF8F4' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
            <polygon points="14,7 22,11 22,17 14,21 6,17 6,11" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>Nikahku</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth" className="text-sm text-stone-600 hover:text-stone-900 px-4 py-2 transition-colors">Masuk</Link>
          <Link to="/auth?mode=signup" className="text-sm px-5 py-2 rounded-full text-white transition-colors" style={{ background: '#1B3A4B' }}>Daftar Gratis</Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-stone-700" />
            <span className="block w-4 h-0.5 bg-stone-700" />
            <span className="block w-6 h-0.5 bg-stone-700" />
          </div>
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-16" style={{ background: 'rgba(250,248,244,0.98)' }}>
          <div className="flex flex-col items-center gap-6 pt-12">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-xl text-stone-700">{l}</a>
            ))}
            <Link to="/auth" onClick={() => setMenuOpen(false)} className="text-xl text-stone-700">Masuk</Link>
            <Link to="/auth?mode=signup" onClick={() => setMenuOpen(false)} className="px-8 py-3 rounded-full text-white text-lg" style={{ background: '#1B3A4B' }}>Daftar Gratis</Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <img src="https://images.unsplash.com/photo-1779501678407-c212cd23af9f?w=800&h=900&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase mb-8" style={{ background: 'rgba(201,168,76,0.12)', color: '#9B7B2A', border: '1px solid rgba(201,168,76,0.25)' }}>
              <span>✦</span> Platform Undangan Digital Pernikahan #1 Indonesia
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, color: '#1B3A4B' }}>
              Buat Undangan<br />
              <em style={{ color: '#C9A84C' }}>Pernikahan</em><br />
              yang Indah
            </h1>
            <p className="mt-6 text-stone-500 leading-relaxed max-w-md" style={{ fontSize: 17 }}>
              Rancang, kustomisasi, dan bagikan undangan digital pernikahan Anda yang elegan. Gratis hingga siap dipublikasikan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/auth?mode=signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: '#1B3A4B' }}>
                Buat Undangan Sekarang
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link to="/templates" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all" style={{ border: '1px solid rgba(201,168,76,0.4)', color: '#9B7B2A', background: 'rgba(201,168,76,0.06)' }}>
                Lihat Template
              </Link>
            </div>
            <div className="mt-12 flex gap-8">
              {[['2.400+', 'Pasangan'], ['98%', 'Puas'], ['20+', 'Template']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#1B3A4B' }}>{val}</div>
                  <div className="text-stone-400 text-xs tracking-widest uppercase mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <PhoneMockup />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #FAF8F4)' }} />
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Template Pilihan</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1B3A4B' }}>
            Desain yang Menawan untuk<br />Hari Istimewa Anda
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TEMPLATES_PREVIEW.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTemplate(i)}
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] group transition-all ${activeTemplate === i ? 'ring-2 ring-amber-400 scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <img src={`https://images.unsplash.com/photo-${t.img}?w=300&h=400&fit=crop&auto=format`} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 transition-opacity" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))` }} />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-white font-display text-lg">{t.name}</span>
                <span className="text-white/60 text-xs">{t.style}</span>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                {t.colors.map(c => <span key={c} className="w-3 h-3 rounded-full border border-white/40" style={{ background: c }} />)}
              </div>
            </button>
          ))}
        </div>
        <div className="text-center">
          <Link to="/templates" className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Lihat semua template
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="fitur" className="py-24" style={{ background: '#F5EFE6' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Cara Kerja</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1B3A4B' }}>
              Selesai dalam 4 Langkah
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-3/4 w-1/2 h-px" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }} />
                )}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: '#1B3A4B', color: '#C9A84C', fontFamily: 'DM Serif Display, serif', fontSize: 18 }}>
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-stone-800">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Fitur Lengkap</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1B3A4B' }}>
            Semua yang Anda Butuhkan
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-2xl border hover:shadow-sm transition-all group" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              <div className="text-amber-500 text-xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-stone-800 mb-2 group-hover:text-amber-800 transition-colors">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Feature Showcase */}
      <section className="py-24" style={{ background: '#1B3A4B' }}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-amber-400 mb-4">Manajemen RSVP</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#FAF8F4' }}>
              Kelola Konfirmasi<br />Kehadiran dengan<br />Mudah
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed max-w-md">
              Dashboard RSVP real-time menampilkan data kehadiran tamu, ucapan, dan statistik lengkap. Export ke Excel untuk memudahkan koordinasi dengan katering dan venue.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['142', 'Total Tamu'], ['118', 'Hadir'], ['24', 'Tidak Hadir']].map(([val, label]) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#C9A84C' }}>{val}</div>
                  <div className="text-white/40 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Dashboard RSVP</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-400/20 text-green-400">Live</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'Ahmad Fauzan', guests: 2, status: 'Hadir', time: '2j lalu' },
                { name: 'Siti Rahma', guests: 1, status: 'Hadir', time: '4j lalu' },
                { name: 'Budi Santoso', guests: 3, status: 'Tidak Hadir', time: '5j lalu' },
                { name: 'Dewi Rahayu', guests: 2, status: 'Hadir', time: '1h lalu' },
                { name: 'Rizky Pratama', guests: 4, status: 'Hadir', time: '1h lalu' },
              ].map(r => (
                <div key={r.name} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 text-sm truncate">{r.name}</div>
                    <div className="text-white/30 text-xs">{r.guests} tamu · {r.time}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'Hadir' ? 'bg-green-400/15 text-green-400' : 'bg-red-400/15 text-red-400'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Harga</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1B3A4B' }}>
            Gratis Buat, Bayar Saat<br />Siap Dipublikasikan
          </h2>
          <p className="mt-4 text-stone-500 max-w-lg mx-auto">Tidak ada biaya langganan. Buat dan preview undangan Anda secara gratis. Bayar sekali saat ingin dipublikasikan.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <h3 className="font-semibold text-stone-800 text-lg mb-1">Gratis</h3>
            <p className="text-stone-400 text-sm mb-6">Buat & preview undangan</p>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 40, color: '#1B3A4B' }}>Rp 0</div>
            <ul className="mt-6 space-y-3">
              {['Pilih template premium', 'Edit informasi pernikahan', 'Kustomisasi warna & font', 'Preview real-time', 'Simpan sebagai draft'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-stone-600">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#C9A84C" strokeWidth="1.2" /><path d="M5 8l2 2 4-4" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/auth?mode=signup" className="mt-8 block text-center py-3 rounded-full text-sm font-medium transition-all border" style={{ borderColor: '#1B3A4B', color: '#1B3A4B' }}>
              Mulai Gratis
            </Link>
          </div>
          <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: '#1B3A4B' }}>
            <div className="absolute inset-0 geometric-pattern opacity-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white text-lg">Publikasi</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>Terpopuler</span>
              </div>
              <p className="text-white/50 text-sm mb-6">Publikasikan & bagikan undangan</p>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 40, color: '#C9A84C' }}>Rp 49.000</div>
              <p className="text-white/40 text-xs mt-1">Bayar sekali, aktif 2 tahun</p>
              <ul className="mt-6 space-y-3">
                {['Semua fitur gratis', 'URL undangan unik', 'RSVP management', 'Ucapan tamu', 'Undangan personal per tamu', 'Export data RSVP', 'Dukungan prioritas'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#C9A84C" strokeWidth="1.2" /><path d="M5 8l2 2 4-4" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=signup" className="mt-8 block text-center py-3 rounded-full text-sm font-medium transition-all" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
                Buat Undangan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" style={{ background: '#F5EFE6' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Testimoni</p>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1B3A4B' }}>
              Dipercaya 2.400+ Pasangan
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E0D9CF' }}>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4 italic" style={{ fontFamily: 'Lora, serif' }}>"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-800 text-sm">{t.name}</div>
                    <div className="text-stone-400 text-xs">{t.city}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#9B7B2A' }}>{t.template}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">FAQ</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1B3A4B' }}>
            Pertanyaan Umum
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: '#E0D9CF' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-stone-50"
              >
                <span className="font-medium text-stone-800 text-sm pr-4">{faq.q}</span>
                <span className={`text-amber-600 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-stone-500 text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 mx-6 mb-12 rounded-3xl overflow-hidden relative" style={{ background: '#1B3A4B' }}>
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <p className="text-xs tracking-widest uppercase text-amber-400 mb-4">Mulai Sekarang</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FAF8F4', lineHeight: 1.2 }}>
            Wujudkan Undangan<br />
            <em style={{ color: '#C9A84C' }}>Impian</em> Anda
          </h2>
          <p className="mt-6 text-white/60 leading-relaxed">Buat undangan pernikahan digital yang cantik, elegan, dan berkesan. Gratis untuk dicoba.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/auth?mode=signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-lg" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
              Buat Undangan Gratis
            </Link>
            <Link to="/templates" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all border" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
              Jelajahi Template
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: '#E0D9CF' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
              <polygon points="14,7 22,11 22,17 14,21 6,17 6,11" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
              <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
            </svg>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }}>Nikahku</span>
          </div>
          <p className="text-stone-400 text-xs">© 2026 Nikahku. Platform undangan digital pernikahan Indonesia.</p>
          <div className="flex gap-6 text-xs text-stone-400">
            <a href="#" className="hover:text-stone-600">Privasi</a>
            <a href="#" className="hover:text-stone-600">Syarat</a>
            <a href="#" className="hover:text-stone-600">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
