import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// Mock Data for Invitations (will be replaced by real DB query later)
const MOCK_INVITATIONS = [
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
    url: 'yova.id/i/yafi-yova',
  }
]

const STATUS_MAP = {
  published: { label: 'Published', color: 'bg-green-50 text-green-700 border-green-200' },
  draft: { label: 'Draft', color: 'bg-stone-100 text-stone-500 border-stone-200' },
  'ready-to-publish': { label: 'Siap Publish', color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const SIDEBAR = [
  { icon: '🏠', label: 'Ringkasan', path: '/dashboard', id: 'overview' },
  { icon: '💌', label: 'Undangan Saya', path: '/dashboard', id: 'invitations' },
  { icon: '👗', label: 'Rental Saya', path: '/dashboard', id: 'rentals' },
  { icon: '⚙', label: 'Pengaturan Akun', path: '/dashboard', id: 'settings' },
  { icon: '?', label: 'Bantuan', path: '/dashboard', id: 'help' },
]

function InvitationCard({ inv, onDelete, onDuplicate }: { inv: any; onDelete: (id: string) => void; onDuplicate: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const st = STATUS_MAP[inv.status as keyof typeof STATUS_MAP] || STATUS_MAP.draft

  return (
    <div className="bg-white border border-nude shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col h-full">
      {/* Template thumbnail */}
      <div className="relative h-40 overflow-hidden bg-soft">
        {inv.thumbnail ? (
           <img src={inv.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center opacity-10">
              <span className="text-6xl">💌</span>
           </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
           <p className="font-display text-lg text-white leading-tight mb-1 truncate">{inv.title}</p>
           <p className="text-[8px] text-white/70 tracking-[0.15em] uppercase font-bold">{inv.template_id} v{inv.template_version}</p>
        </div>
        <div className={`absolute top-3 left-3 text-[9px] px-2 py-0.5 font-bold uppercase border bg-white shadow-sm ${st.color}`}>{st.label}</div>

        {/* Menu */}
        <div className="absolute top-2 right-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur shadow-sm text-charcoal hover:bg-white transition-colors" style={{ borderRadius: '2px' }}>
            •••
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 bg-white border border-nude shadow-xl py-2 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link to={`/invitation/builder?id=${inv.id}`} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:bg-ivory hover:text-charcoal flex items-center gap-2"><span>✎</span> Edit</Link>
              <Link to={`/i/${inv.slug}`} target="_blank" className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:bg-ivory hover:text-charcoal flex items-center gap-2"><span>👁</span> Preview Publik</Link>
              <button onClick={() => onDuplicate(inv.id)} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:bg-ivory hover:text-charcoal flex items-center gap-2"><span>❏</span> Duplikat</button>
              <div className="h-px bg-nude my-2" />
              <button onClick={() => onDelete(inv.id)} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-2"><span>✕</span> Hapus</button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-2 bg-ivory border border-nude">
            <div className="font-bold text-charcoal text-xs">{inv.views || 0}</div>
            <div className="text-muted text-[8px] uppercase tracking-tighter mt-0.5 font-bold">Views</div>
          </div>
          <div className="text-center p-2 bg-ivory border border-nude">
            <div className="font-bold text-charcoal text-xs">{inv.rsvp_count || 0}</div>
            <div className="text-muted text-[8px] uppercase tracking-tighter mt-0.5 font-bold">RSVP</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/invitation/builder?id=${inv.id}`} className="flex-1 py-2.5 bg-charcoal text-ivory text-[9px] font-bold uppercase tracking-widest text-center hover:bg-black transition-colors">Kelola Konten</Link>
          <button
            onClick={() => navigator.clipboard.writeText(`yova.id/i/${inv.slug}`)}
            className="px-4 py-2.5 border border-nude text-charcoal text-[9px] font-bold uppercase tracking-widest hover:bg-ivory transition-colors"
          >
             Salin Link
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [invitations, setInvitations] = useState<any[]>([])
  const [rentals, setRentals] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch real invitations
        const { data: invData } = await supabase
          .from('invitations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })

        if (invData) setInvitations(invData)

        // Fetch rentals
        const { data: rentalData } = await supabase
          .from('rentals')
          .select('*')
          .or(`whatsapp.eq.${user.email},customer_name.ilike.%${user.user_metadata?.full_name}%`)

        if (rentalData) setRentals(rentalData)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus undangan ini selamanya?')) {
      const { error } = await supabase.from('invitations').delete().eq('id', id)
      if (!error) setInvitations(prev => prev.filter(i => i.id !== id))
    }
  }

  const handleDuplicate = async (id: string) => {
    const source = invitations.find(i => i.id === id)
    if (!source) return

    const { data, error } = await supabase.from('invitations').insert([{
      ...source,
      id: undefined,
      slug: `${source.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      title: `${source.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]).select()

    if (!error && data) setInvitations(prev => [data[0], ...prev])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-10">
       <div className="w-10 h-10 border-2 border-mocha/20 border-t-mocha rounded-full animate-spin mb-4" />
       <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Memuat Dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-ivory font-sans flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-nude">
        <div className="h-16 flex items-center px-8 border-b border-nude">
          <div className="font-display text-xl tracking-wide text-charcoal">YOVA</div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {SIDEBAR.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                activeTab === item.id ? 'bg-mocha text-ivory shadow-lg' : 'text-muted hover:bg-ivory hover:text-charcoal'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-nude">
          <div className="flex items-center gap-3 p-4 bg-ivory">
            <div className="w-8 h-8 bg-mocha text-ivory flex items-center justify-center text-xs font-bold shadow-md">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-charcoal truncate uppercase tracking-wider">{user?.user_metadata?.full_name || 'User'}</div>
              <button onClick={handleLogout} className="text-[8px] font-bold text-muted hover:text-mocha uppercase tracking-widest mt-0.5">Keluar Akun</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f9f7f2]">
        <header className="h-16 bg-white border-b border-nude flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">Dashboard Saya</h1>
          <Link to="/invitation/templates" className="px-5 py-2 bg-mocha text-ivory text-[9px] font-bold uppercase tracking-widest hover:bg-mocha-dark transition-all shadow-md active:translate-y-px" style={{ borderRadius: '2px' }}>
            + Buat Undangan
          </Link>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-12">
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               {/* Welcome section */}
               <div className="mb-12">
                 <h2 className="font-display text-4xl text-charcoal mb-3">Halo, {user?.user_metadata?.full_name?.split(' ')[0] || 'Pengantin'}!</h2>
                 <p className="text-muted text-sm leading-relaxed max-w-xl">
                   Pantau statistik undangan dan status sewa baju akad Anda dalam satu dashboard terpadu.
                 </p>
               </div>

               {/* Stats Summary */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                 {[
                   { label: 'Rental Aktif', value: rentals.length, icon: '👗' },
                   { label: 'Undangan Digital', value: invitations.length, icon: '💌' },
                   { label: 'Total RSVP', value: invitations.reduce((acc, i) => acc + (i.rsvp_count || 0), 0), icon: '👥' },
                   { label: 'Total Views', value: invitations.reduce((acc, i) => acc + (i.views || 0), 0), icon: '👁' },
                 ].map(s => (
                   <div key={s.label} className="bg-white p-6 border border-nude shadow-sm hover:shadow-md transition-shadow">
                     <div className="text-2xl mb-4">{s.icon}</div>
                     <div className="font-display text-3xl text-charcoal mb-1">{s.value}</div>
                     <div className="text-muted text-[9px] uppercase tracking-widest font-bold">{s.label}</div>
                   </div>
                 ))}
               </div>

               {/* Main Sections Grid */}
               <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-12">
                 {/* Left: Invitations */}
                 <div className="space-y-8">
                   <div className="flex items-end justify-between border-b border-nude pb-4">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal">Undangan Digital Terbaru</h3>
                     <button onClick={() => setActiveTab('invitations')} className="text-[9px] font-bold text-mocha hover:underline uppercase tracking-widest">Semua Undangan →</button>
                   </div>

                   <div className="grid sm:grid-cols-2 gap-6">
                     {invitations.slice(0, 3).map(inv => (
                       <InvitationCard key={inv.id} inv={inv} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                     ))}

                     <Link to="/invitation/templates" className="bg-cream/20 border-2 border-dashed border-nude flex flex-col items-center justify-center p-8 gap-4 group hover:border-mocha transition-all min-h-[320px]">
                       <div className="w-12 h-12 bg-ivory border border-nude flex items-center justify-center text-xl group-hover:bg-mocha group-hover:text-ivory transition-colors shadow-sm">+</div>
                       <div className="text-center">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal">Buat Undangan Baru</p>
                         <p className="text-muted text-[8px] uppercase tracking-tighter mt-1 font-bold">Pilih template premium</p>
                       </div>
                     </Link>
                   </div>
                 </div>

                 {/* Right: Rentals */}
                 <div className="space-y-8">
                   <div className="flex items-end justify-between border-b border-nude pb-4">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal">Rental Baju Akad</h3>
                     <Link to="/check-rental" className="text-[9px] font-bold text-mocha hover:underline uppercase tracking-widest">Cek Manual →</Link>
                   </div>

                   <div className="space-y-6">
                     {rentals.length > 0 ? (
                       rentals.map(rental => (
                         <div key={rental.id} className="bg-white border border-nude p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <span className="font-mono text-xs font-bold text-charcoal">{rental.booking_id}</span>
                              <span className="text-[8px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold uppercase rounded">{rental.status}</span>
                            </div>
                            <p className="text-sm font-display text-charcoal mb-1">{rental.dress_code}</p>
                            <p className="text-[10px] text-muted uppercase tracking-widest mb-4">{rental.event_date}</p>
                            <Link to="/check-rental" className="text-[9px] font-bold text-mocha uppercase tracking-widest hover:underline">Detail Status →</Link>
                         </div>
                       ))
                     ) : (
                       <div className="bg-cream/20 border border-dashed border-nude p-10 text-center">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-6 leading-relaxed">Belum ada pesanan rental yang terhubung.</p>
                         <Link to="/collection" className="inline-block px-8 py-3 bg-mocha text-ivory text-[9px] font-bold uppercase tracking-widest hover:bg-mocha-dark transition-all shadow-md">Lihat Koleksi</Link>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'invitations' && (
            <div className="animate-in fade-in duration-500 space-y-10">
               <div className="flex items-center justify-between border-b border-nude pb-6">
                 <div>
                   <h2 className="font-display text-3xl text-charcoal mb-1">Daftar Undangan</h2>
                   <p className="text-xs text-muted">Kelola seluruh undangan digital Anda</p>
                 </div>
                 <div className="flex gap-3">
                   <select className="px-4 py-2 border border-nude bg-white text-[10px] font-bold uppercase tracking-widest outline-none focus:border-mocha">
                     <option>Semua Status</option>
                     <option>Draft</option>
                     <option>Published</option>
                   </select>
                 </div>
               </div>

               {invitations.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {invitations.map(inv => (
                       <InvitationCard key={inv.id} inv={inv} onDelete={handleDelete} onDuplicate={handleDuplicate} />
                    ))}
                    <Link to="/invitation/templates" className="bg-white border-2 border-dashed border-nude flex flex-col items-center justify-center p-8 gap-4 group hover:border-mocha transition-all h-[360px]">
                      <div className="w-12 h-12 bg-ivory border border-nude flex items-center justify-center text-xl group-hover:bg-mocha group-hover:text-ivory transition-colors shadow-sm">+</div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal">Undangan Baru</p>
                    </Link>
                 </div>
               ) : (
                 <div className="py-32 text-center bg-white border border-dashed border-nude rounded-sm">
                    <span className="text-5xl block mb-6 opacity-20">💌</span>
                    <h3 className="font-display text-2xl text-charcoal mb-2">Belum ada undangan</h3>
                    <p className="text-muted text-sm mb-10 max-w-xs mx-auto">Mulai hari bahagia Anda dengan membuat undangan digital pertama Anda di YOVA.</p>
                    <Link to="/invitation/templates" className="px-10 py-4 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-mocha-dark transition-all">Pilih Template</Link>
                 </div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
