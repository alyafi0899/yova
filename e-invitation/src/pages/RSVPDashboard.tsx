import { useState } from 'react'
import { Link } from 'react-router-dom'

const GUESTS = [
  { id: 1, name: 'Ahmad Fauzan', phone: '081234567890', guests: 2, status: 'hadir', wish: 'Baarakallahu laka wa baaraka alaika. Semoga menjadi keluarga sakinah mawaddah warahmah.', rsvpTime: '2 jam lalu' },
  { id: 2, name: 'Siti Rahma Dewi', phone: '082345678901', guests: 1, status: 'hadir', wish: 'Selamat menempuh hidup baru! Semoga bahagia selalu.', rsvpTime: '4 jam lalu' },
  { id: 3, name: 'Budi Santoso', phone: '083456789012', guests: 3, status: 'tidak-hadir', wish: 'Mohon maaf tidak bisa hadir. Semoga diberkahi pernikahannya.', rsvpTime: '5 jam lalu' },
  { id: 4, name: 'Dewi Rahayu', phone: '084567890123', guests: 2, status: 'hadir', wish: '', rsvpTime: '1 hari lalu' },
  { id: 5, name: 'Rizky Pratama', phone: '085678901234', guests: 4, status: 'hadir', wish: 'MasyaAllah, semoga menjadi pasangan yang penuh berkah.', rsvpTime: '1 hari lalu' },
  { id: 6, name: 'Nurul Aini', phone: '086789012345', guests: 1, status: 'pending', wish: '', rsvpTime: '' },
  { id: 7, name: 'Fajar Hidayat', phone: '087890123456', guests: 2, status: 'hadir', wish: 'Selamat ya! Semoga langgeng.', rsvpTime: '2 hari lalu' },
  { id: 8, name: 'Indah Permata', phone: '088901234567', guests: 3, status: 'hadir', wish: 'Barakallah! Semoga menjadi keluarga yang bahagia dunia akhirat.', rsvpTime: '2 hari lalu' },
  { id: 9, name: 'Hasan Abdullah', phone: '089012345678', guests: 5, status: 'tidak-hadir', wish: '', rsvpTime: '3 hari lalu' },
  { id: 10, name: 'Laila Fitriani', phone: '081123456789', guests: 2, status: 'pending', wish: '', rsvpTime: '' },
]

const CHART_DATA = [
  { day: 'Sen', hadir: 12, tidak: 2 },
  { day: 'Sel', hadir: 18, tidak: 3 },
  { day: 'Rab', hadir: 25, tidak: 5 },
  { day: 'Kam', hadir: 22, tidak: 4 },
  { day: 'Jum', hadir: 30, tidak: 6 },
  { day: 'Sab', hadir: 8, tidak: 1 },
  { day: 'Min', hadir: 3, tidak: 1 },
]

const maxVal = Math.max(...CHART_DATA.map(d => d.hadir + d.tidak))

export default function RSVPDashboard() {
  const [tab, setTab] = useState<'list' | 'wishes'>('list')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const stats = {
    total: GUESTS.length,
    hadir: GUESTS.filter(g => g.status === 'hadir').reduce((sum, g) => sum + g.guests, 0),
    tidakHadir: GUESTS.filter(g => g.status === 'tidak-hadir').length,
    pending: GUESTS.filter(g => g.status === 'pending').length,
  }

  const filtered = GUESTS.filter(g => {
    const matchStatus = statusFilter === 'all' || g.status === statusFilter
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const wishes = GUESTS.filter(g => g.wish)

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4" style={{ background: '#FFFFFF', borderBottom: '1px solid #E0D9CF' }}>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 transition-colors text-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Dashboard
          </Link>
          <span className="text-stone-200">/</span>
          <span className="text-sm text-stone-600 font-medium">Dashboard RSVP</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            Export CSV
          </button>
          <Link to="/builder" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
            Edit Undangan
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Invitation badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1625038032128-54ed70feb167?w=40&h=40&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-70" />
            </div>
            <div>
              <div className="font-semibold text-stone-800 text-sm">Al Yafi &amp; Yova</div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Template Noura</span>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <span>10 Jan 2027</span>
                <span className="px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Live</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-stone-400">nikahku.id/i/yafi-yova</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Diundang', value: GUESTS.length, sub: 'orang', color: '#1B3A4B', icon: '👥' },
            { label: 'Total Tamu Hadir', value: stats.hadir, sub: 'orang', color: '#2D6A4F', icon: '✓' },
            { label: 'Tidak Hadir', value: stats.tidakHadir, sub: 'orang', color: '#9B2B2B', icon: '✕' },
            { label: 'Belum Konfirmasi', value: stats.pending, sub: 'orang', color: '#9B7B2A', icon: '?' },
          ].map(s => (
            <div key={s.label} className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-stone-400">{s.label}</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${s.color}12` }}>{s.icon}</div>
              </div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: s.color }}>{s.value}</div>
              <div className="text-xs text-stone-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Bar chart */}
          <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-stone-800 text-sm">Tren RSVP (7 hari)</h3>
              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#1B3A4B' }} />Hadir</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#E0D9CF' }} />Tidak Hadir</span>
              </div>
            </div>
            <div className="flex items-end gap-3 h-36">
              {CHART_DATA.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5" style={{ height: `${((d.hadir + d.tidak) / maxVal) * 120}px` }}>
                    <div className="w-full rounded-t-sm" style={{ height: `${(d.tidak / (d.hadir + d.tidak)) * 100}%`, background: '#E0D9CF', minHeight: d.tidak ? 4 : 0 }} />
                    <div className="w-full flex-1 rounded-b-sm" style={{ background: '#1B3A4B', minHeight: 4 }} />
                  </div>
                  <span className="text-[10px] text-stone-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut-style breakdown */}
          <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <h3 className="font-semibold text-stone-800 text-sm mb-6">Status Kehadiran</h3>
            <div className="relative flex items-center justify-center mb-6">
              <svg viewBox="0 0 100 100" className="w-32 h-32">
                {/* Background circle */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F5EFE6" strokeWidth="12" />
                {/* Hadir arc */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1B3A4B" strokeWidth="12"
                  strokeDasharray={`${(8 / 10) * 238.8} 238.8`} strokeDashoffset="59.7" strokeLinecap="round" />
                {/* Tidak hadir */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#C9A84C" strokeWidth="12"
                  strokeDasharray={`${(1.5 / 10) * 238.8} 238.8`} strokeDashoffset={`${-((8 / 10) * 238.8) + 59.7}`} strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1B3A4B' }}>80%</div>
                <div className="text-[10px] text-stone-400">Hadir</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Hadir', val: 8, pct: '80%', color: '#1B3A4B' },
                { label: 'Tidak Hadir', val: 2, pct: '15%', color: '#C9A84C' },
                { label: 'Pending', val: 2, pct: '5%', color: '#E0D9CF' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-stone-600 flex-1">{item.label}</span>
                  <span className="text-stone-400">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: '#F5EFE6' }}>
          {[['list', 'Daftar RSVP'], ['wishes', 'Ucapan Tamu']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as 'list' | 'wishes')} className="px-5 py-2 rounded-lg text-sm transition-all font-medium" style={tab === key ? { background: '#FFFFFF', color: '#1B3A4B', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : { color: '#9B7B2A' }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'list' ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <input
                type="text"
                placeholder="Cari nama tamu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm outline-none flex-1 min-w-48 max-w-64"
                style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#E0D9CF'}
              />
              <div className="flex gap-2">
                {[['all', 'Semua'], ['hadir', 'Hadir'], ['tidak-hadir', 'Tidak Hadir'], ['pending', 'Pending']].map(([key, label]) => (
                  <button key={key} onClick={() => setStatusFilter(key)} className="px-4 py-2 rounded-xl text-xs transition-all" style={statusFilter === key ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#FFFFFF', color: '#5C4A2A', border: '1px solid #E0D9CF' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E0D9CF', background: '#F5EFE6' }}>
                    {['Nama', 'No. HP', 'Status', 'Jml Tamu', 'Waktu', 'Ucapan'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g, i) => (
                    <tr key={g.id} className="hover:bg-stone-50/50 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F5F0EA' : 'none' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{g.name[0]}</div>
                          <span className="font-medium text-stone-800 text-sm">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-500 text-xs font-mono">{g.phone}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${g.status === 'hadir' ? 'bg-green-50 text-green-700' : g.status === 'tidak-hadir' ? 'bg-red-50 text-red-600' : 'bg-stone-100 text-stone-500'}`}>
                          {g.status === 'hadir' ? 'InsyaAllah Hadir' : g.status === 'tidak-hadir' ? 'Tidak Hadir' : 'Belum Konfirmasi'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-600 text-sm font-medium">{g.guests} orang</td>
                      <td className="px-5 py-4 text-stone-400 text-xs">{g.rsvpTime || '—'}</td>
                      <td className="px-5 py-4 text-stone-400 text-xs max-w-48">
                        <span className="line-clamp-1">{g.wish || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-stone-400 text-sm">Tidak ada tamu yang cocok.</div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {wishes.map(g => (
              <div key={g.id} className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                <p className="text-stone-600 leading-relaxed mb-4" style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 15 }}>
                  "{g.wish}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{g.name[0]}</div>
                  <div>
                    <div className="text-sm font-medium text-stone-700">{g.name}</div>
                    <div className="text-xs text-stone-400">{g.rsvpTime}</div>
                  </div>
                  <button className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors">Sembunyikan</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
