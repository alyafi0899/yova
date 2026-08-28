import { useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS } from '../components/TemplateRenderer'

const config = TEMPLATE_CONFIGS.noura
const data = { groomName: 'Al Yafi', brideName: 'Yova', weddingDate: '10 Januari 2027' }

export default function InvitationDetail() {
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText('https://nikahku.id/i/yafi-yova')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Outfit, sans-serif', background: '#FAF8F4' }}>
      <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}>
        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          Dashboard
        </Link>
        <div className="h-4 w-px" style={{ background: '#E8E3DC' }} />
        <h1 className="text-sm font-semibold text-stone-800">Al Yafi &amp; Yova</h1>
        <div className="ml-auto flex gap-2">
          <Link to="/builder?template=noura" className="px-4 py-2 rounded-xl text-xs font-medium border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>✏ Edit</Link>
          <Link to="/publish" className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: '#C9A84C', color: '#1B3A4B' }}>Publish</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid lg:grid-cols-[320px,1fr] gap-8">
        {/* Preview */}
        <div className="flex-shrink-0">
          <div className="rounded-[2.5rem] border-[7px] border-stone-700 shadow-2xl overflow-hidden sticky top-24" style={{ height: 580 }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-xl z-10" style={{ background: '#374151' }} />
            <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none', background: config.bgColor }}>
              <TemplateRenderer config={config} data={data} showOpening={false} />
            </div>
          </div>
        </div>

        {/* Info & actions */}
        <div className="space-y-6">
          {/* Status */}
          <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-700">Status Undangan</h2>
              <span className="text-[10px] px-3 py-1 rounded-full font-bold" style={{ background: '#E8F5E9', color: '#2E7D32' }}>● Dipublikasi</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-1">Pasangan</p>
                <p className="text-sm font-medium text-stone-700">Al Yafi &amp; Yova</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-1">Tanggal</p>
                <p className="text-sm font-medium text-stone-700">10 Januari 2027</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-1">Template</p>
                <p className="text-sm font-medium text-stone-700">Noura</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide mb-1">Terakhir Diedit</p>
                <p className="text-sm font-medium text-stone-700">2 hari lalu</p>
              </div>
            </div>
          </div>

          {/* URL */}
          <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <h2 className="text-sm font-semibold text-stone-700 mb-3">URL Publik</h2>
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#F5EFE6' }}>
              <span className="flex-1 text-xs font-mono text-stone-600 truncate">nikahku.id/i/yafi-yova</span>
              <button onClick={copyUrl} className="px-3 py-1 rounded-lg text-xs font-medium transition-all" style={{ background: copied ? '#E8F5E9' : '#1B3A4B', color: copied ? '#2E7D32' : '#FAF8F4' }}>
                {copied ? '✓ Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[['142', '👁', 'Total Views'], ['38', '✉', 'RSVP Masuk'], ['28', '✓', 'Hadir']].map(([val, icon, label]) => (
              <div key={label} className="p-4 rounded-2xl text-center border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                <div className="text-lg mb-0.5">{icon}</div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>{val}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <h2 className="text-sm font-semibold text-stone-700 mb-4">Aksi</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: '/builder?template=noura', icon: '✏', label: 'Edit Undangan', primary: false },
                { to: '/i/yafi-yova', icon: '👁', label: 'Lihat Live', primary: false },
                { to: '/rsvp-dashboard', icon: '✉', label: 'RSVP Dashboard', primary: false },
                { to: '/wishes', icon: '💌', label: 'Kelola Ucapan', primary: false },
              ].map(a => (
                <Link key={a.label} to={a.to} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border transition-all hover:shadow-sm" style={a.primary ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#374151' }}>
                  <span>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { icon: '🔗', label: 'Bagikan WhatsApp', action: () => window.open('https://wa.me/?text=nikahku.id/i/yafi-yova') },
                { icon: '⚙', label: 'Pengaturan', action: () => {} },
              ].map(a => (
                <button key={a.label} onClick={a.action} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border transition-all hover:shadow-sm hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#374151' }}>
                  <span>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
