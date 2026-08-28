import { useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS } from '../components/TemplateRenderer'

type InvStatus = 'published' | 'draft'

type Invitation = {
  id: string
  groomName: string
  brideName: string
  weddingDate: string
  templateId: string
  status: InvStatus
  lastEdited: string
  views: number
  rsvp: number
  slug: string
}

const SAMPLE: Invitation[] = [
  { id: '1', groomName: 'Al Yafi', brideName: 'Yova', weddingDate: '10 Jan 2027', templateId: 'noura', status: 'published', lastEdited: '2 hari lalu', views: 142, rsvp: 38, slug: 'yafi-yova' },
  { id: '2', groomName: 'Fadhil', brideName: 'Layla', weddingDate: '14 Feb 2027', templateId: 'azzahra', status: 'draft', lastEdited: '5 jam lalu', views: 0, rsvp: 0, slug: 'fadhil-layla' },
]

function Sidebar({ active }: { active: string }) {
  const links = [
    { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { to: '/templates', icon: '✦', label: 'Templates' },
    { to: '/rsvp-dashboard', icon: '✉', label: 'RSVP' },
  ]
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-screen sticky top-0" style={{ background: '#FFFFFF', borderRight: '1px solid #E8E3DC' }}>
      <div className="px-5 py-5 border-b" style={{ borderColor: '#E8E3DC' }}>
        <Link to="/" className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>Nikahku</span>
        </Link>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {links.map(l => (
          <Link key={l.to} to={l.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all" style={active === l.label ? { background: '#F5EFE6', color: '#1B3A4B', fontWeight: 500 } : { color: '#78716C' }}>
            <span className="text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: '#E8E3DC' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#1B3A4B' }}>AY</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-stone-700 truncate">Al Yafi</div>
            <div className="text-[10px] text-stone-400 truncate">al@email.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function InvCard({ inv, onDelete }: { inv: Invitation; onDelete: (id: string) => void }) {
  const [menu, setMenu] = useState(false)
  const config = TEMPLATE_CONFIGS[inv.templateId] || TEMPLATE_CONFIGS.noura

  return (
    <div className="rounded-2xl overflow-hidden border bg-white transition-all hover:shadow-lg group" style={{ borderColor: '#E0D9CF' }}>
      <div className="relative overflow-hidden" style={{ height: 200, background: config.bgColor }}>
        <div className="absolute inset-0" style={{ transform: 'scale(0.48)', transformOrigin: 'top left', width: '208%', height: '208%' }}>
          <TemplateRenderer config={config} data={{ groomName: inv.groomName, brideName: inv.brideName, weddingDate: inv.weddingDate }} showOpening={false} />
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={inv.status === 'published' ? { background: '#E8F5E9', color: '#2E7D32' } : { background: '#FFF8E1', color: '#F57F17' }}>
            {inv.status === 'published' ? '● Dipublikasi' : '○ Draft'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={() => setMenu(m => !m)} className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="#374151"/><circle cx="7" cy="7" r="1" fill="#374151"/><circle cx="7" cy="11" r="1" fill="#374151"/></svg>
          </button>
          {menu && (
            <div className="absolute top-8 right-0 w-36 py-1 rounded-xl shadow-xl z-10" style={{ background: '#FFFFFF', border: '1px solid #E0D9CF' }} onMouseLeave={() => setMenu(false)}>
              {[
                { label: 'Edit', icon: '✏', to: `/builder?template=${inv.templateId}` },
                { label: 'Preview', icon: '👁', to: `/i/${inv.slug}` },
                { label: 'Hapus', icon: '🗑', to: null, danger: true },
              ].map(a => a.to ? (
                <Link key={a.label} to={a.to} className="flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-stone-50" style={{ color: a.danger ? '#9B5C5C' : '#374151' }}><span>{a.icon}</span>{a.label}</Link>
              ) : (
                <button key={a.label} onClick={() => { if (a.label === 'Hapus') onDelete(inv.id); setMenu(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors hover:bg-stone-50" style={{ color: (a as any).danger ? '#9B5C5C' : '#374151' }}><span>{a.icon}</span>{a.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, color: '#1B3A4B' }}>{inv.groomName} &amp; {inv.brideName}</h3>
          <p className="text-xs text-stone-400 mt-0.5">{inv.weddingDate} · diedit {inv.lastEdited}</p>
        </div>
        {inv.status === 'published' && (
          <div className="flex items-center gap-4 mb-3 py-2.5 px-3 rounded-xl" style={{ background: '#F9F7F4' }}>
            <div className="text-center">
              <div className="text-sm font-semibold text-stone-700">{inv.views}</div>
              <div className="text-[9px] text-stone-400 uppercase tracking-wide">Views</div>
            </div>
            <div className="w-px h-6" style={{ background: '#E0D9CF' }} />
            <div className="text-center">
              <div className="text-sm font-semibold text-stone-700">{inv.rsvp}</div>
              <div className="text-[9px] text-stone-400 uppercase tracking-wide">RSVP</div>
            </div>
            <div className="w-px h-6" style={{ background: '#E0D9CF' }} />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-stone-400 uppercase tracking-wide mb-1">URL Publik</div>
              <div className="text-[10px] text-stone-500 truncate">nikahku.id/i/{inv.slug}</div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/builder?template=${inv.templateId}`} className="py-2 text-center rounded-xl text-xs font-medium border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            ✏ Edit
          </Link>
          {inv.status === 'published' ? (
            <Link to={`/i/${inv.slug}`} className="py-2 text-center rounded-xl text-xs font-medium transition-colors" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
              Lihat Live →
            </Link>
          ) : (
            <Link to="/publish" className="py-2 text-center rounded-xl text-xs font-medium transition-colors" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
              Publish
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" fill="#F5EFE6" />
          <rect x="35" y="40" width="50" height="45" rx="6" fill="#FFFFFF" stroke="#E0D9CF" strokeWidth="1.5" />
          <rect x="42" y="50" width="36" height="3" rx="1.5" fill="#C9A84C" opacity=".6" />
          <rect x="42" y="57" width="28" height="2" rx="1" fill="#D0C8BA" />
          <rect x="42" y="63" width="32" height="2" rx="1" fill="#D0C8BA" />
          <rect x="42" y="69" width="20" height="2" rx="1" fill="#D0C8BA" />
          <circle cx="85" cy="38" r="14" fill="#1B3A4B" />
          <path d="M85 32v6M85 38h6" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>Belum ada undangan</h3>
      <p className="mt-2 text-sm text-stone-400 max-w-xs leading-relaxed">Buat undangan digital pertamamu dan bagikan hari spesialmu ke semua tamu.</p>
      <Link to="/templates" className="mt-6 px-8 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
        + Buat Undangan Pertama
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const [invitations, setInvitations] = useState<Invitation[]>(SAMPLE)

  const deleteInv = (id: string) => setInvitations(prev => prev.filter(i => i.id !== id))

  const stats = [
    { label: 'Total Undangan', value: invitations.length, icon: '📋', color: '#1B3A4B' },
    { label: 'Dipublikasi', value: invitations.filter(i => i.status === 'published').length, icon: '✓', color: '#2E7D32' },
    { label: 'Total Views', value: invitations.reduce((s, i) => s + i.views, 0), icon: '👁', color: '#9B7B2A' },
    { label: 'Total RSVP', value: invitations.reduce((s, i) => s + i.rsvp, 0), icon: '✉', color: '#7B4BA4' },
  ]

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Outfit, sans-serif', background: '#FAF8F4' }}>
      <Sidebar active="Dashboard" />

      <main className="flex-1 overflow-auto">
        {/* Hero */}
        <div className="px-8 pt-10 pb-8" style={{ borderBottom: '1px solid #EDE8E0' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-amber-600 uppercase tracking-widest mb-2">✦ Selamat Datang</p>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#1B3A4B', lineHeight: 1.2 }}>
                Create an invitation<br />worth remembering.
              </h1>
              <p className="mt-3 text-sm text-stone-400 max-w-md leading-relaxed">Pilih desain, personalisasi setiap detail, dan bagikan hari spesialmu.</p>
            </div>
            <Link to="/templates" className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90 shadow-sm" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
              <span>+</span> Buat Undangan
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {stats.map(s => (
              <div key={s.label} className="p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid #E8E3DC' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs text-stone-400">{s.label}</span>
                </div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Invitations */}
        <div className="px-8 py-8">
          {invitations.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-stone-700">Undangan Saya</h2>
                <Link to="/templates" className="text-xs text-amber-700 hover:text-amber-900 transition-colors">+ Buat baru</Link>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {invitations.map(inv => <InvCard key={inv.id} inv={inv} onDelete={deleteInv} />)}
                <Link to="/templates" className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center py-16 px-6 transition-all hover:border-amber-300 hover:bg-amber-50/20 group" style={{ borderColor: '#D0C8BA' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{ background: '#F5EFE6' }}>
                    <span className="text-2xl text-amber-600">+</span>
                  </div>
                  <div className="text-sm font-medium text-stone-500 group-hover:text-stone-700 transition-colors">Buat Undangan Baru</div>
                  <div className="text-xs text-stone-300 mt-1">Pilih template dan mulai</div>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick links */}
        <div className="px-8 pb-10">
          <h2 className="text-base font-semibold text-stone-700 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { to: '/templates', icon: '✦', title: 'Template Gallery', desc: '8 desain premium' },
              { to: '/rsvp-dashboard', icon: '✉', title: 'RSVP Dashboard', desc: 'Kelola tamu undangan' },
              { to: '/admin', icon: '⚙', title: 'Admin Panel', desc: 'Kelola platform' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="p-5 rounded-2xl border transition-all hover:shadow-md group" style={{ background: '#FFFFFF', borderColor: '#E8E3DC' }}>
                <div className="text-2xl mb-2">{l.icon}</div>
                <div className="text-sm font-semibold text-stone-700 group-hover:text-stone-900 transition-colors">{l.title}</div>
                <div className="text-xs text-stone-400 mt-0.5">{l.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
