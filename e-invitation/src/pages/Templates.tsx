import { useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS, type TemplateConfig } from '../components/TemplateRenderer'

const TEMPLATES = Object.values(TEMPLATE_CONFIGS)

const CATEGORIES = ['All', 'Minimal', 'Elegant', 'Luxury', 'Floral', 'Islamic', 'Traditional', 'Modern', 'Romantic']

const DEFAULT_DATA = { groomName: 'Al Yafi', brideName: 'Yova', weddingDate: '10 Januari 2027' }

const PREMIUM_IDS = ['zayyan', 'madinah', 'alya']

type SortKey = 'Popular' | 'Newest' | 'Free' | 'Premium'

function isPremium(t: TemplateConfig) { return PREMIUM_IDS.includes(t.id) }

function categoryMatch(t: TemplateConfig, cat: string): boolean {
  if (cat === 'All') return true
  const tags = t.tags.map(tg => tg.toLowerCase())
  const style = t.style.toLowerCase()
  const c = cat.toLowerCase()
  if (c === 'luxury') return tags.includes('mewah') || tags.includes('luxury')
  if (c === 'floral') return tags.includes('floral') || tags.includes('bunga')
  if (c === 'islamic') return tags.includes('islami') || tags.includes('islam') || t.ornamentStyle === 'geometric'
  if (c === 'traditional') return tags.includes('budaya') || tags.includes('tradisional') || style.includes('batik')
  if (c === 'romantic') return tags.includes('romantis') || tags.includes('romantic')
  if (c === 'modern') return tags.includes('modern')
  if (c === 'minimal') return tags.includes('minimalis') || tags.includes('minimal')
  if (c === 'elegant') return tags.includes('elegan') || tags.includes('elegant')
  return false
}

function TemplateCard({ t, onPreview, featured }: { t: TemplateConfig; onPreview: () => void; featured?: boolean }) {
  const premium = isPremium(t)
  return (
    <div className={`group rounded-2xl overflow-hidden border transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${featured ? 'col-span-2 row-span-2' : ''}`} style={{ borderColor: '#E0D9CF', background: '#FFFFFF' }} onClick={onPreview}>
      <div className="relative overflow-hidden" style={{ height: featured ? 480 : 280, background: t.bgColor }}>
        <div className="transform origin-top-left absolute" style={{ scale: featured ? '0.7' : '0.52', width: featured ? '143%' : '192%', height: featured ? '143%' : '192%' }}>
          <TemplateRenderer config={t} data={DEFAULT_DATA} compact showOpening={false} />
        </div>
        {/* Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {premium ? (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: '#1B3A4B', color: '#C9A84C' }}>✦ Premium</span>
          ) : (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Free</span>
          )}
          {t.id === 'noura' && <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: '#FFF3E0', color: '#E65100' }}>🔥 Popular</span>}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}>
          <button onClick={e => { e.stopPropagation(); onPreview() }} className="px-6 py-2.5 rounded-full text-sm font-medium border transition-all hover:bg-white/10" style={{ border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff' }}>
            Preview Penuh
          </button>
          <Link to={`/builder?template=${t.id}`} onClick={e => e.stopPropagation()} className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
            Gunakan Template →
          </Link>
        </div>
      </div>
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }}>{t.name}</h3>
            <p className="text-xs text-stone-400 mt-0.5">{t.style}</p>
          </div>
          <div className="flex gap-1 items-center">
            {[t.primaryColor, t.accentColor].map(c => (
              <span key={c} className="w-4 h-4 rounded-full border" style={{ background: c, borderColor: '#E0D9CF' }} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {t.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FullPreviewModal({ template, onClose }: { template: TemplateConfig; onClose: () => void }) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const premium = isPremium(template)

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)' }}>
      {/* Left — preview */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {device === 'mobile' ? (
          <div className="relative flex-shrink-0" style={{ width: 320 }}>
            <div className="rounded-[2.8rem] border-[8px] border-stone-700 shadow-2xl overflow-hidden" style={{ height: 640, background: template.bgColor }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl z-10" style={{ background: '#374151' }} />
              <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <TemplateRenderer config={template} data={DEFAULT_DATA} showOpening />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full" style={{ background: '#374151' }} />
          </div>
        ) : device === 'tablet' ? (
          <div className="rounded-2xl border-[5px] border-stone-700 shadow-2xl overflow-hidden" style={{ width: 480, height: 640, background: template.bgColor }}>
            <div className="overflow-y-auto h-full" style={{ scrollbarWidth: 'none' }}>
              <TemplateRenderer config={template} data={DEFAULT_DATA} showOpening={false} />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-[3px] border-stone-700 shadow-2xl overflow-hidden" style={{ width: 720, maxHeight: 560 }}>
            <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: '#1F2937' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-3 px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>nikahku.id/i/yafi-yova</div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 510, background: template.bgColor }}>
              <div className="max-w-sm mx-auto">
                <TemplateRenderer config={template} data={DEFAULT_DATA} showOpening={false} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right — info */}
      <div className="w-80 flex flex-col" style={{ background: '#FFFFFF', flexShrink: 0 }}>
        <div className="p-6 border-b" style={{ borderColor: '#E8E3DC' }}>
          <button onClick={onClose} className="mb-4 flex items-center gap-2 text-xs text-stone-400 hover:text-stone-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Kembali ke katalog
          </button>
          <div className="flex items-center gap-2 mb-1">
            {premium ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#1B3A4B', color: '#C9A84C' }}>✦ Premium</span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Free</span>
            )}
          </div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }}>{template.name}</h2>
          <p className="text-sm text-stone-400 mt-1">{template.style}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {template.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Device switcher */}
        <div className="p-4 border-b" style={{ borderColor: '#E8E3DC' }}>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Preview di</p>
          <div className="flex gap-2">
            {(['mobile', 'tablet', 'desktop'] as const).map(d => (
              <button key={d} onClick={() => setDevice(d)} className="flex-1 py-2 rounded-xl text-xs capitalize transition-all" style={device === d ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#F5EFE6', color: '#5C4A2A' }}>{d}</button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3">Fitur Template</p>
          <div className="space-y-2">
            {[
              'Cover pernikahan elegan',
              'Info pasangan & orang tua',
              'Ayat Quran pilihan',
              'Detail event (Akad & Resepsi)',
              'Countdown otomatis',
              'Galeri foto',
              'RSVP interaktif',
              'Ucapan tamu',
              template.ornamentStyle !== 'none' ? `Ornamen ${template.ornamentStyle}` : null,
            ].filter(Boolean).map(f => (
              <div key={f!} className="flex items-center gap-2.5 text-sm text-stone-600">
                <span className="text-amber-500 flex-shrink-0">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: '#E8E3DC' }}>
          <Link to={`/builder?template=${template.id}`} className="block w-full py-3.5 text-center rounded-2xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
            Gunakan Template Ini
          </Link>
          <p className="text-center text-xs text-stone-400">
            {premium ? 'Rp 49.000 untuk publish' : 'Gratis · Bayar saat publish'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Templates() {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<SortKey>('Popular')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState<TemplateConfig | null>(null)

  const filtered = TEMPLATES.filter(t => {
    const matchCat = categoryMatch(t, category)
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.style.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tg => tg.toLowerCase().includes(search.toLowerCase()))
    const matchSort = sort === 'Free' ? !isPremium(t) : sort === 'Premium' ? isPremium(t) : true
    return matchCat && matchSearch && matchSort
  })

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      {/* Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(250,248,244,0.93)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }}>Nikahku</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-stone-500 hover:text-stone-800 px-4 py-2">Dashboard</Link>
          <Link to="/auth" className="text-sm px-5 py-2 rounded-full" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>Masuk</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C9A84C' }}>✦ Koleksi Premium</p>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1B3A4B' }}>
            Choose your invitation
          </h1>
          <p className="mt-4 max-w-sm mx-auto text-sm text-stone-400">Start with a design that feels like you.</p>
        </div>

        {/* Category tab bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className="px-4 py-2 rounded-full text-xs font-medium transition-all" style={category === cat ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#F5EFE6', color: '#5C4A2A', border: '1px solid #E0D9CF' }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex gap-1.5">
              {(['Popular', 'Newest', 'Free', 'Premium'] as SortKey[]).map(s => (
                <button key={s} onClick={() => setSort(s)} className="px-3 py-1.5 rounded-full text-[11px] transition-all" style={sort === s ? { background: '#C9A84C', color: '#1B3A4B', fontWeight: 600 } : { background: '#F5EFE6', color: '#9B7B2A' }}>{s}</button>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari template..." className="px-4 py-2 rounded-full text-xs outline-none w-40" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1B3A4B' }}>Tidak ditemukan</h3>
            <p className="mt-2 text-sm text-stone-400">Coba kata kunci atau filter yang berbeda.</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-4 text-sm text-amber-700 hover:text-amber-900">Reset filter</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t, i) => (
              <TemplateCard key={t.id} t={t} onPreview={() => setPreview(t)} featured={i === 0 && category === 'All' && !search} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-xs text-stone-300 mb-1">Platform admin</p>
          <Link to="/admin" className="text-xs text-amber-600 hover:text-amber-800 transition-colors">Admin Dashboard →</Link>
        </div>
      </div>

      {preview && <FullPreviewModal template={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
