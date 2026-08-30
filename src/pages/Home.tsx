import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getWhatsAppLink, type Dress } from '../data/dresses'
import DressCard from '../components/DressCard'

import heroBg from '../assets/bg_hero.png'
import aboutImg from '../assets/pics_home.jpeg'

const SLIDES = [
  {
    image: heroBg,
    title: 'Baju Akad untuk Hari yang Berarti.',
    subtitle: 'Temukan koleksi baju akad terbaik, lihat detail ukuran, dan jadwalkan fitting sebelum hari istimewa Anda.',
    cta: 'Lihat Koleksi',
    path: '/collection',
    secondaryCta: 'Jadwalkan Fitting',
    secondaryPath: '/fitting'
  },
  {
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1920&h=1200&fit=crop&auto=format',
    title: 'Undangan Digital yang Memikat.',
    subtitle: 'Bagikan kebahagiaan Anda dengan desain undangan digital yang elegan, modern, dan mudah dikelola.',
    cta: 'Buat Undangan ✨',
    path: '/invitation',
    color: 'bg-amber-500 hover:bg-amber-600'
  }
]

const ABOUT_IMG = aboutImg

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(s => (s + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true)
      const { data: featuredData } = await supabase
        .from('dresses')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false })

      const { count } = await supabase
        .from('dresses')
        .select('*', { count: 'exact', head: true })

      if (featuredData) {
        const mapped = featuredData.map((d: any) => ({
          ...d,
          collectionCode: d.collection_code,
          includedItems: d.included_items,
          resizeAvailable: d.resize_available,
          fitNotes: d.fit_notes,
          recommendedHeight: d.recommended_height,
          estimatedAvailable: d.estimated_available,
        }))
        setFeatured(mapped)
      }

      if (count !== null) setTotalCount(count)
      setLoading(false)
    }
    fetchHomeData()
  }, [])

  return (
    <div>
      {/* ── Slideable Hero ── */}
      <section className="relative h-screen min-h-[650px] bg-charcoal overflow-hidden">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              activeSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
            <div className="relative h-full flex items-end">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-24 w-full">
                <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase mb-6 font-bold">
                  YOVA · Blangkejeren, Aceh
                </p>
                <h1 className="font-display text-white text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] max-w-3xl mb-8">
                  {slide.title}
                </h1>
                <p className="text-white/70 text-base md:text-xl max-w-xl mb-12 leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate(slide.path)}
                    className={`px-10 py-4 ${slide.color || 'bg-ivory text-charcoal hover:bg-white'} text-[11px] font-bold uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 shadow-xl`}
                    style={{ borderRadius: '2px' }}
                  >
                    {slide.cta}
                  </button>
                  {slide.secondaryCta && (
                    <button
                      onClick={() => navigate(slide.secondaryPath!)}
                      className="px-10 py-4 border border-white/40 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all transform hover:-translate-y-1"
                      style={{ borderRadius: '2px' }}
                    >
                      {slide.secondaryCta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-10 right-10 flex gap-3 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1 transition-all duration-500 ${
                activeSlide === i ? 'w-12 bg-mocha' : 'w-6 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Featured Collection ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-32">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-4 font-bold">Koleksi Pilihan</p>
            <h2 className="font-display text-5xl text-charcoal leading-tight">Temukan Baju Akad Anda</h2>
          </div>
          <button
            onClick={() => navigate('/collection')}
            className="hidden md:flex items-center gap-2 text-[10px] text-mocha font-bold tracking-[0.25em] uppercase hover:gap-4 transition-all"
          >
            Lihat Semua <span>→</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted italic">Mencari koleksi terbaik untuk Anda...</div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featured.map(dress => (
              <DressCard
                key={dress.id}
                dress={dress}
                onClick={() => navigate(`/dress/${dress.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-cream/30 border border-dashed border-nude py-24 text-center text-muted text-sm italic">
            Data list dress belum ditambahkan ke database.
          </div>
        )}
      </section>

      {/* ── About & Stats ── */}
      <section className="bg-cream/40 py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group overflow-hidden bg-soft shadow-2xl">
              <img
                src={ABOUT_IMG}
                alt="Studio YOVA"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-6 font-bold">Tentang YOVA</p>
              <h2 className="font-display text-5xl text-charcoal mb-8 leading-[1.1]">
                Lebih dari Sekadar Sewa Baju Akad
              </h2>
              <p className="text-muted leading-relaxed mb-6 text-lg">
                YOVA hadir sebagai mitra terpercaya calon pengantin di Blangkejeren untuk tampil istimewa tanpa kompromi.
              </p>
              <p className="text-muted leading-relaxed mb-12">
                Kami menggabungkan kemewahan koleksi baju akad dengan teknologi undangan digital terkini, memberikan kemudahan total dalam satu pintu layanan.
              </p>
              <div className="grid grid-cols-3 gap-8 border-t border-nude pt-10">
                {[
                  { label: 'Koleksi', value: `${totalCount}+` },
                  { label: 'Jaminan', value: '150rb' },
                  { label: 'Platform', value: 'Cloud' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl text-charcoal mb-1">{stat.value}</div>
                    <div className="text-[9px] text-muted uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
