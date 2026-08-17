import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function RSVPDashboard() {
  const [searchParams] = useSearchParams()
  const invitationId = searchParams.get('id')

  const [tab, setTab] = useState<'list' | 'wishes'>('list')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [invitation, setInvitation] = useState<any>(null)
  const [guests, setGuests] = useState<any[]>([])
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (invitationId) {
      fetchData()
    }
  }, [invitationId])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: inv } = await supabase.from('invitations').select('*').eq('id', invitationId).single()
      setInvitation(inv)

      const { data: rsvpData } = await supabase
        .from('rsvp')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })

      if (rsvpData) setGuests(rsvpData)

      const { data: wishData } = await supabase
        .from('guest_wishes')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })

      if (wishData) setWishes(wishData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: guests.length,
    hadir: guests.filter(g => g.attendance === 'present').reduce((sum, g) => sum + (g.guest_count || 1), 0),
    tidakHadir: guests.filter(g => g.attendance === 'absent').length,
    totalGuests: guests.reduce((sum, g) => sum + (g.guest_count || 1), 0),
  }

  const filtered = guests.filter(g => {
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'hadir' && g.attendance === 'present') ||
      (statusFilter === 'tidak-hadir' && g.attendance === 'absent')
    const matchSearch = !search || (g.guest_name || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

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
        {loading ? (
          <div className="py-32 text-center">
             <div className="w-10 h-10 border-2 border-mocha/20 border-t-mocha rounded-full animate-spin mx-auto mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Memuat Data...</p>
          </div>
        ) : !invitation ? (
          <div className="py-32 text-center bg-white border border-dashed border-nude">
             <p className="text-muted italic">Undangan tidak ditemukan.</p>
          </div>
        ) : (
          <>
            {/* Invitation badge */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-white border-nude">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-soft">
                  <img src={invitation.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-stone-800 text-sm">{invitation.title}</div>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span>{invitation.template_id}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                    <span>{new Date(invitation.updated_at).toLocaleDateString()}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${invitation.status === 'published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-stone-50 text-stone-500 border border-stone-200'}`}>{invitation.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">yova.id/i/{invitation.slug}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Konfirmasi', value: stats.total, sub: 'orang', color: '#1B3A4B', icon: '👥' },
                { label: 'Total Tamu Hadir', value: stats.hadir, sub: 'orang', color: '#2D6A4F', icon: '✓' },
                { label: 'Tidak Hadir', value: stats.tidakHadir, sub: 'orang', color: '#9B2B2B', icon: '✕' },
                { label: 'Total Views', value: invitation.views || 0, sub: 'kali', color: '#9B7B2A', icon: '👁' },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">{s.label}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${s.color}12` }}>{s.icon}</div>
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: s.color }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{s.sub}</div>
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
                    {guests.map((g, i) => (
                    <tr key={g.id} className="hover:bg-stone-50/50 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F5F0EA' : 'none' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{(g.guest_name || 'U')[0]}</div>
                          <span className="font-medium text-stone-800 text-sm">{g.guest_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-500 text-xs font-mono">{g.phone || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${g.attendance === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {g.attendance === 'present' ? 'Hadir' : 'Tidak Hadir'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-600 text-sm font-medium">{g.guest_count} orang</td>
                      <td className="px-5 py-4 text-stone-400 text-xs">{new Date(g.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-stone-400 text-xs max-w-48">
                        <span className="line-clamp-1">{g.message || '—'}</span>
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
      </>
    )}
      </div>
    </div>
  )
}
