import { useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS, type TemplateConfig } from '../components/TemplateRenderer'

const TEMPLATES = Object.values(TEMPLATE_CONFIGS)
const FILTERS = ['Semua', 'Islam', 'Romantis', 'Minimal', 'Mewah', 'Budaya', 'Modern']

const DEFAULT_DATA = {
  groomName: 'Al Yafi',
  brideName: 'Yova',
  weddingDate: '10 Januari 2027',
}

function TemplateCard({ t, onPreview }: { t: TemplateConfig; onPreview: () => void }) {
  return (
    <div className="group rounded-2xl overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer" style={{ borderColor: '#E0D9CF', background: '#FFFFFF' }} onClick={onPreview}>
      {/* Live mini preview */}
      <div className="relative overflow-hidden" style={{ height: 280, background: t.bgColor }}>
        <div className="transform scale-[0.52] origin-top-left absolute inset-0" style={{ width: '192%', height: '192%' }}>
          <TemplateRenderer config={t} data={DEFAULT_DATA} compact showOpening={false} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
          <button onClick={e => { e.stopPropagation(); onPreview() }} className="px-5 py-2 rounded-full text-xs font-medium border transition-colors" style={{ border: '1px solid rgba(255,255,255,0.6)', color: '#fff', backdropFilter: 'blur(8px)' }}>
            Preview Penuh
          </button>
          <Link to={`/builder?template=${t.id}`} onClick={e => e.stopPropagation()} className="px-5 py-2 rounded-full text-xs font-medium transition-colors" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
            Gunakan Template
          </Link>
        </div>
        {t.id === 'noura' && (
          <div className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#C9A84C', color: '#1B3A4B' }}>Terpopuler</div>
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>{t.name}</h3>
          <div className="flex gap-1">
            {[t.primaryColor, t.accentColor, t.bgColor].map(c => (
              <span key={c} className="w-3.5 h-3.5 rounded-full border border-stone-200" style={{ background: c }} />
            ))}
          </div>
        </div>
        <p className="text-stone-400 text-xs mb-3">{t.style}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {t.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{tag}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={e => { e.stopPropagation(); onPreview() }} className="py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            Preview
          </button>
          <Link to={`/builder?template=${t.id}`} onClick={e => e.stopPropagation()} className="py-2 rounded-lg text-xs font-medium text-center transition-colors" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
            Gunakan
          </Link>
        </div>
      </div>
    </div>
  )
}

function FullPreviewModal({ template, onClose }: { template: TemplateConfig; onClose: () => void }) {
  const [mobileView, setMobileView] = useState(true)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="relative w-full max-w-5xl mx-4 flex flex-col" style={{ maxHeight: '95vh' }}>
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3 rounded-t-2xl" style={{ background: '#FFFFFF', borderBottom: '1px solid #E0D9CF' }}>
          <div className="flex items-center gap-3">
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#1B3A4B' }}>{template.name}</div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{template.style}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#F5EFE6' }}>
              <button onClick={() => setMobileView(true)} className="px-3 py-1.5 rounded-md text-xs transition-all" style={mobileView ? { background: '#FFFFFF', color: '#1B3A4B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#9B7B2A' }}>
                📱 Mobile
              </button>
              <button onClick={() => setMobileView(false)} className="px-3 py-1.5 rounded-md text-xs transition-all" style={!mobileView ? { background: '#FFFFFF', color: '#1B3A4B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#9B7B2A' }}>
                🖥 Desktop
              </button>
            </div>
            <Link to={`/builder?template=${template.id}`} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
              Gunakan Template Ini
            </Link>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100" style={{ color: '#5C4A2A' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-hidden rounded-b-2xl flex items-center justify-center p-6" style={{ background: '#1A1A1A' }}>
          {mobileView ? (
            /* Phone mockup */
            <div className="relative flex-shrink-0" style={{ width: 320 }}>
              <div className="rounded-[2.8rem] border-[8px] border-stone-700 shadow-2xl overflow-hidden" style={{ height: 640, background: template.bgColor }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl z-10" style={{ background: '#374151' }} />
                <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  <TemplateRenderer config={template} data={DEFAULT_DATA} showOpening />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full" style={{ background: '#374151' }} />
            </div>
          ) : (
            /* Desktop browser mockup */
            <div className="w-full rounded-xl overflow-hidden border border-stone-700 shadow-2xl" style={{ maxWidth: 800, maxHeight: 560 }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1F2937', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-4 px-3 py-1 rounded-md text-xs" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                  nikahku.id/i/yafi-yova
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 510 }}>
                <div className="max-w-sm mx-auto">
                  <TemplateRenderer config={template} data={DEFAULT_DATA} showOpening={false} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Templates() {
  const [filter, setFilter] = useState('Semua')
  const [preview, setPreview] = useState<TemplateConfig | null>(null)
  const [search, setSearch] = useState('')

  const filtered = TEMPLATES.filter(t => {
    const matchFilter = filter === 'Semua' || t.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.style.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      {/* Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }}>Nikahku</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-stone-500 hover:text-stone-800 px-4 py-2">Masuk</Link>
          <Link to="/auth?mode=signup" className="text-sm px-5 py-2 rounded-full text-white" style={{ background: '#1B3A4B' }}>Daftar Gratis</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-amber-600 mb-3">Koleksi Template</p>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1B3A4B' }}>
            Pilih Template Pernikahan
          </h1>
          <p className="mt-4 text-stone-400 max-w-lg mx-auto text-sm">8 desain premium. Klik card untuk melihat preview langsung.</p>
        </div>

        {/* Filter + search */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-xs transition-all" style={filter === f ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#F5EFE6', color: '#5C4A2A', border: '1px solid #E0D9CF' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari template..." className="px-4 py-2 rounded-full text-sm outline-none w-48" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(t => (
            <TemplateCard key={t.id} t={t} onPreview={() => setPreview(t)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 text-center py-16 text-stone-400">Tidak ada template yang cocok.</div>
          )}
        </div>

        {/* Admin link */}
        <div className="mt-16 text-center">
          <p className="text-xs text-stone-300 mb-2">Kelola template platform</p>
          <Link to="/admin" className="text-xs text-amber-600 hover:text-amber-800 transition-colors">Admin Dashboard →</Link>
        </div>
      </div>

      {preview && <FullPreviewModal template={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
