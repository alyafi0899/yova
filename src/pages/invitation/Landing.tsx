import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
  { name: 'Fatimah & Rizky', city: 'Banda Aceh', text: 'Undangan digitalnya sangat cantik dan mudah dibuat. Tamu-tamu kami sangat terkesan!', template: 'Noura' },
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
      <div className="relative rounded-[2.5rem] border-[6px] border-charcoal bg-charcoal shadow-2xl overflow-hidden" style={{ height: 440 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-charcoal rounded-b-2xl z-10" />
        <div className="w-full h-full overflow-hidden rounded-[1.8rem]" style={{ background: 'linear-gradient(170deg, #1A1210 0%, #000000 100%)' }}>
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
  const navigate = useNavigate()
  const [activeTemplate, setActiveTemplate] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-ivory font-sans">
      {/* Reduced Hero / Introduction */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-widest uppercase mb-8 bg-mocha/10 text-mocha border border-mocha/20">
            <span>✦</span> Platform Undangan Digital Terintegrasi
          </div>
          <h1 className="font-display text-charcoal text-5xl md:text-6xl mb-6">
            Undangan <em className="text-mocha italic">Digital</em> Elegan
          </h1>
          <p className="mt-6 text-muted leading-relaxed max-w-2xl mx-auto text-lg">
            Satu-satunya platform undangan digital di Blangkejeren yang terintegrasi langsung dengan koleksi baju akad Anda.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <button onClick={() => navigate('/invitation/builder')} className="px-10 py-4 bg-mocha text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-mocha-dark transition-all transform hover:-translate-y-1">
              Buat Undangan Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.22em] uppercase text-mocha mb-3 font-bold">Template Pilihan</p>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
            Desain yang Menawan untuk<br />Hari Istimewa Anda
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TEMPLATES_PREVIEW.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTemplate(i)}
              className={`relative rounded-sm overflow-hidden aspect-[3/4] group transition-all ${activeTemplate === i ? 'ring-2 ring-mocha scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <img src={`https://images.unsplash.com/photo-${t.img}?w=300&h=400&fit=crop&auto=format`} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 transition-opacity" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(26,18,16,0.8))` }} />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-ivory font-display text-lg">{t.name}</span>
                <span className="text-ivory/60 text-[10px] uppercase tracking-wider">{t.style}</span>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                {t.colors.map(c => <span key={c} className="w-3 h-3 rounded-full border border-white/40" style={{ background: c }} />)}
              </div>
            </button>
          ))}
        </div>
        <div className="text-center">
          <Link to="/invitation/templates" className="inline-flex items-center gap-2 text-[10px] text-mocha font-bold tracking-[0.25em] uppercase hover:gap-4 transition-all">
            Lihat semua template <span>→</span>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="fitur" className="py-24 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.22em] uppercase text-mocha mb-3 font-bold">Cara Kerja</p>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
              Selesai dalam 4 Langkah
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-3/4 w-1/2 h-px bg-nude" />
                )}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-charcoal text-ivory font-display text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-charcoal text-sm uppercase tracking-wide">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.22em] uppercase text-mocha mb-3 font-bold">Fitur Lengkap</p>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
            Semua yang Anda Butuhkan
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-8 bg-white border border-nude hover:shadow-md transition-all group">
              <div className="text-mocha text-2xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-charcoal text-sm uppercase tracking-wide mb-2 group-hover:text-mocha transition-colors">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Feature Showcase */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-mocha-light mb-4 font-bold">Manajemen RSVP</p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory leading-tight">
              Kelola Konfirmasi<br />Kehadiran dengan<br />Mudah
            </h2>
            <p className="mt-6 text-ivory/60 leading-relaxed max-w-md">
              Dashboard RSVP real-time menampilkan data kehadiran tamu, ucapan, dan statistik lengkap. Export ke Excel untuk memudahkan koordinasi dengan katering dan venue.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['142', 'Total Tamu'], ['118', 'Hadir'], ['24', 'Tidak Hadir']].map(([val, label]) => (
                <div key={label} className="p-4 bg-white/5 border border-white/10">
                  <div className="font-display text-3xl text-mocha-light">{val}</div>
                  <div className="text-ivory/40 text-[9px] uppercase tracking-widest mt-1 font-bold">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-ivory/60 text-[10px] font-bold uppercase tracking-widest">Dashboard RSVP</span>
                <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold uppercase">Live</span>
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
                <div key={r.name} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <div className="w-8 h-8 bg-mocha/20 text-mocha-light flex items-center justify-center text-xs font-bold">
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-ivory/80 text-sm truncate">{r.name}</div>
                    <div className="text-ivory/30 text-[10px]">{r.guests} tamu · {r.time}</div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${r.status === 'Hadir' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'}`}>
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
          <p className="text-[10px] tracking-[0.22em] uppercase text-mocha mb-3 font-bold">Harga</p>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
            Gratis Buat, Bayar Saat<br />Siap Dipublikasikan
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto text-sm">Tidak ada biaya langganan. Buat dan preview undangan Anda secara gratis. Bayar sekali saat ingin dipublikasikan.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-10 bg-white border border-nude shadow-sm">
            <h3 className="font-bold text-charcoal text-sm uppercase tracking-widest mb-1">Gratis</h3>
            <p className="text-muted text-[10px] uppercase mb-8">Buat & preview undangan</p>
            <div className="font-display text-5xl text-charcoal mb-8">Rp 0</div>
            <ul className="space-y-4 mb-10">
              {['Pilih template premium', 'Edit informasi pernikahan', 'Kustomisasi warna & font', 'Preview real-time', 'Simpan sebagai draft'].map(f => (
                <li key={f} className="flex items-center gap-3 text-xs text-muted">
                  <span className="text-mocha text-lg">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/invitation/auth?mode=signup" className="block text-center py-4 bg-transparent border border-charcoal text-charcoal text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-charcoal hover:text-ivory transition-all">
              Mulai Gratis
            </Link>
          </div>
          <div className="p-10 bg-charcoal text-ivory relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 geometric-pattern opacity-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-ivory text-sm uppercase tracking-widest">Publikasi</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-mocha text-ivory font-bold uppercase">Terpopuler</span>
              </div>
              <p className="text-ivory/50 text-[10px] uppercase mb-8">Publikasikan & bagikan undangan</p>
              <div className="font-display text-5xl text-mocha-light mb-2">Rp 70.000</div>
              <p className="text-ivory/30 text-[9px] uppercase tracking-widest mb-8">Bayar sekali, aktif 2 tahun</p>
              <ul className="space-y-4 mb-10">
                {['Semua fitur gratis', 'URL undangan unik', 'RSVP management', 'Ucapan tamu', 'Undangan personal per tamu', 'Export data RSVP', 'Dukungan prioritas'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-xs text-ivory/80">
                    <span className="text-mocha-light text-lg">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/invitation/auth?mode=signup" className="block text-center py-4 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-mocha-dark transition-all">
                Buat Undangan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.22em] uppercase text-mocha mb-3 font-bold">Testimoni</p>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
              Dipercaya 2.400+ Pasangan
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-8 bg-white border border-nude shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-mocha text-sm">★</span>)}
                </div>
                <p className="text-muted text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center justify-between pt-6 border-t border-nude">
                  <div>
                    <div className="font-bold text-charcoal text-xs uppercase tracking-wide">{t.name}</div>
                    <div className="text-muted text-[10px] uppercase tracking-widest mt-1">{t.city}</div>
                  </div>
                  <span className="text-[9px] px-2 py-1 rounded-full bg-mocha/10 text-mocha font-bold uppercase tracking-wider">{t.template}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.22em] uppercase text-mocha mb-3 font-bold">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
            Pertanyaan Umum
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-nude overflow-hidden bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-ivory"
              >
                <span className="font-bold text-charcoal text-sm uppercase tracking-wide pr-4">{faq.q}</span>
                <span className={`text-mocha flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-muted text-sm leading-relaxed border-t border-nude/50 pt-4">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.22em] uppercase text-mocha-light mb-6 font-bold">Mulai Sekarang</p>
          <h2 className="font-display text-5xl md:text-6xl text-ivory mb-8 leading-[1.1]">
            Wujudkan Undangan<br />
            <em className="text-mocha-light italic">Impian</em> Anda
          </h2>
          <p className="text-ivory/60 leading-relaxed mb-12 text-lg">Buat undangan pernikahan digital yang cantik, elegan, dan berkesan. Gratis untuk dicoba.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/invitation/auth?mode=signup" className="px-10 py-4 bg-mocha text-ivory text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-mocha-dark transition-all transform hover:-translate-y-1">
              Buat Undangan Gratis
            </Link>
            <Link to="/invitation/templates" className="px-10 py-4 border border-white/20 text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Jelajahi Template
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="font-display text-xl tracking-wide text-ivory">YOVA</div>
            <div className="text-[9px] tracking-[0.22em] uppercase text-ivory/30">Undangan Digital · Blangkejeren</div>
          </div>
          <p className="text-ivory/30 text-[10px] uppercase tracking-widest font-bold">© 2026 YOVA. Platform undangan digital pernikahan Indonesia.</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-ivory/30">
            <a href="#" className="hover:text-mocha-light transition-colors">Privasi</a>
            <a href="#" className="hover:text-mocha-light transition-colors">Syarat</a>
            <a href="#" className="hover:text-mocha-light transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
