import { useState } from 'react'
import { Link } from 'react-router-dom'

const INVITATIONS = [
  {
    id: 1,
    couple: 'Al Yafi & Yova',
    template: 'Noura',
    templateImg: 'photo-1625038032128-54ed70feb167',
    status: 'published',
    date: '10 Jan 2027',
    edited: '2 jam lalu',
    views: 1247,
    rsvp: 118,
    url: 'nikahku.id/i/yafi-yova',
  },
  {
    id: 2,
    couple: 'Rizky & Fatimah',
    template: 'Azzahra',
    templateImg: 'photo-1521129866021-4313ccf20e9e',
    status: 'draft',
    date: '14 Mar 2027',
    edited: '3 hari lalu',
    views: 0,
    rsvp: 0,
    url: '',
  },
]

const STATUS_MAP = {
  published: { label: 'Published', color: 'bg-green-50 text-green-700 border-green-200' },
  draft: { label: 'Draft', color: 'bg-stone-100 text-stone-500 border-stone-200' },
  'ready-to-publish': { label: 'Siap Publish', color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const SIDEBAR = [
  { icon: '⊞', label: 'Undangan Saya', path: '/dashboard', active: true },
  { icon: '＋', label: 'Buat Baru', path: '/templates' },
  { icon: '⚙', label: 'Pengaturan Akun', path: '/dashboard' },
  { icon: '💳', label: 'Billing', path: '/dashboard' },
  { icon: '?', label: 'Bantuan', path: '/dashboard' },
]

function InvitationCard({ inv, onDelete }: { inv: typeof INVITATIONS[0]; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const st = STATUS_MAP[inv.status as keyof typeof STATUS_MAP]

  return (
    <div className="rounded-2xl border overflow-hidden transition-all hover:shadow-md" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
      {/* Template thumbnail */}
      <div className="relative h-36 overflow-hidden" style={{ background: '#F5EFE6' }}>
        <img src={`https://images.unsplash.com/photo-${inv.templateImg}?w=600&h=200&fit=crop&auto=format`} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-stone-600 opacity-70 tracking-widest uppercase">The Wedding of</p>
            <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>{inv.couple}</p>
          </div>
        </div>
        <div className={`absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full border ${st.color}`}>{st.label}</div>
        {/* Menu */}
        <div className="absolute top-2 right-2 relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/10" style={{ color: '#5C4A2A' }}>
            ···
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 rounded-xl shadow-lg border overflow-hidden w-40" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              {['Edit', 'Preview', 'Duplikat', 'Analitik'].map(a => (
                <button key={a} className="w-full text-left px-4 py-2.5 text-xs text-stone-600 hover:bg-stone-50 transition-colors">{a}</button>
              ))}
              <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors border-t" style={{ borderColor: '#F5F5F5' }}>Hapus</button>
            </div>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-stone-800 text-sm">{inv.couple}</h3>
            <p className="text-stone-400 text-xs mt-0.5">Template {inv.template} · {inv.date}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[['views', inv.views.toLocaleString(), 'Dilihat'], ['rsvp', inv.rsvp.toString(), 'RSVP'], ['edited', inv.edited, 'Diedit']].map(([key, val, label]) => (
            <div key={key} className="text-center p-2 rounded-lg" style={{ background: '#F5EFE6' }}>
              <div className="font-semibold text-stone-700 text-sm">{val}</div>
              <div className="text-stone-400 text-[10px] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        {inv.status === 'published' ? (
          <div className="flex gap-2">
            <Link to="/builder" className="flex-1 py-2 rounded-lg text-xs font-medium text-center border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>Edit</Link>
            <button className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
              Salin Tautan
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/builder" className="flex-1 py-2 rounded-lg text-xs font-medium text-center border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>Edit</Link>
            <Link to="/publish" className="flex-1 py-2 rounded-lg text-xs font-medium text-center transition-colors" style={{ background: '#C9A84C', color: '#1B3A4B' }}>Publikasikan</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [invitations, setInvitations] = useState(INVITATIONS)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col w-60 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ background: '#FFFFFF', borderRight: '1px solid #E0D9CF' }}>
        <div className="p-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid #E0D9CF' }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }}>Nikahku</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {SIDEBAR.map(item => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${item.active ? 'font-medium' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}`}
              style={item.active ? { background: '#F5EFE6', color: '#1B3A4B' } : {}}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4" style={{ borderTop: '1px solid #E0D9CF' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F5EFE6' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: '#1B3A4B', color: '#C9A84C' }}>A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-stone-700 truncate">Al Yafi</div>
              <div className="text-xs text-stone-400 truncate">alyafi@email.com</div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="#5C4A2A" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <h1 className="font-semibold text-stone-800">Undangan Saya</h1>
          </div>
          <Link to="/templates" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Buat Undangan
          </Link>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Undangan', value: '2', icon: '📋' },
              { label: 'Total Dilihat', value: '1,247', icon: '👁' },
              { label: 'Total RSVP', value: '118', icon: '✉️' },
              { label: 'Tamu Hadir', value: '98', icon: '✓' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>{s.value}</div>
                <div className="text-stone-400 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Dashboard RSVP', desc: 'Lihat konfirmasi kehadiran', icon: '📊', path: '/rsvp-dashboard', color: '#1B3A4B' },
              { label: 'Manajemen Tamu', desc: 'Kelola daftar tamu', icon: '👥', path: '/dashboard', color: '#5C4A2A' },
              { label: 'Pengaturan Undangan', desc: 'Edit info & tema', icon: '✏️', path: '/builder', color: '#6B4C3E' },
            ].map(q => (
              <Link key={q.label} to={q.path} className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm hover:-translate-y-px" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: '#F5EFE6' }}>{q.icon}</div>
                <div>
                  <div className="font-medium text-stone-800 text-sm">{q.label}</div>
                  <div className="text-stone-400 text-xs">{q.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Invitations grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {invitations.map(inv => (
              <InvitationCard key={inv.id} inv={inv} onDelete={() => setInvitations(prev => prev.filter(i => i.id !== inv.id))} />
            ))}

            {/* Create new CTA */}
            <Link to="/templates" className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 gap-3 transition-all hover:border-amber-300 hover:bg-amber-50/30 group min-h-64" style={{ borderColor: '#E0D9CF' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors group-hover:bg-amber-100" style={{ background: '#F5EFE6' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v14M3 10h14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <div className="text-center">
                <div className="font-medium text-stone-600 text-sm group-hover:text-stone-800 transition-colors">Buat Undangan Baru</div>
                <div className="text-stone-400 text-xs mt-1">Pilih template & mulai kustomisasi</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
