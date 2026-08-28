import { useState } from 'react'
import { Link } from 'react-router-dom'

type WishStatus = 'approved' | 'pending' | 'hidden'

type Wish = {
  id: string
  name: string
  message: string
  timestamp: string
  status: WishStatus
}

const SAMPLE_WISHES: Wish[] = [
  { id: '1', name: 'Budi Santoso', message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma.', timestamp: '2 jam lalu', status: 'approved' },
  { id: '2', name: 'Siti Rahma', message: 'Alhamdulillah, akhirnya hari yang ditunggu-tunggu tiba. Semoga kalian selalu berbahagia dan dilancarkan rezeki. Aamiin.', timestamp: '3 jam lalu', status: 'approved' },
  { id: '3', name: 'Ahmad Fauzi', message: 'Barakallahu fikuma wa baraka alaikuma wa jama a bainakuma fi khair. Selamat!', timestamp: '5 jam lalu', status: 'pending' },
  { id: '4', name: 'Dewi Kartika', message: 'Semoga pernikahan kalian menjadi awal dari kehidupan yang indah dan penuh berkah. Love you both!', timestamp: '6 jam lalu', status: 'approved' },
  { id: '5', name: 'Anonim', message: 'Konten tidak pantas — perlu moderasi.', timestamp: '7 jam lalu', status: 'hidden' },
  { id: '6', name: 'Rizal Hidayat', message: 'Wah akhirnya! Sudah lama menunggu momen ini. Semoga langgeng sampai kakek nenek ya!', timestamp: '8 jam lalu', status: 'pending' },
]

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>(SAMPLE_WISHES)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | WishStatus>('all')

  const updateStatus = (id: string, status: WishStatus) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, status } : w))
  }

  const deleteWish = (id: string) => {
    setWishes(prev => prev.filter(w => w.id !== id))
  }

  const filtered = wishes.filter(w => {
    const matchFilter = filter === 'all' || w.status === filter
    const matchSearch = !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.message.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    all: wishes.length,
    approved: wishes.filter(w => w.status === 'approved').length,
    pending: wishes.filter(w => w.status === 'pending').length,
    hidden: wishes.filter(w => w.status === 'hidden').length,
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Outfit, sans-serif', background: '#FAF8F4' }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}>
        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          Dashboard
        </Link>
        <div className="h-4 w-px" style={{ background: '#E8E3DC' }} />
        <div>
          <h1 className="text-sm font-semibold text-stone-800">Ucapan Tamu</h1>
          <p className="text-xs text-stone-400">Al Yafi &amp; Yova · {wishes.length} ucapan</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Filter row */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex gap-2">
            {([['all', 'Semua'], ['approved', 'Disetujui'], ['pending', 'Menunggu'], ['hidden', 'Disembunyikan']] as [string, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key as any)} className="px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all" style={filter === key ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#F5EFE6', color: '#5C4A2A', border: '1px solid #E0D9CF' }}>
                {label}
                <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{ background: filter === key ? 'rgba(201,168,76,0.3)' : '#E0D9CF' }}>
                  {counts[key as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari ucapan..." className="px-4 py-2 rounded-full text-xs outline-none w-48" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
        </div>

        {/* Wishes grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="text-5xl mb-4">💌</div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1B3A4B' }}>Belum ada ucapan</h3>
            <p className="mt-2 text-sm text-stone-400">Ucapan dari tamu akan muncul di sini setelah undangan dipublikasi.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 gap-4 space-y-4">
            {filtered.map(w => (
              <div key={w.id} className="break-inside-avoid rounded-2xl p-5 border transition-all hover:shadow-md" style={{ background: '#FFFFFF', borderColor: w.status === 'pending' ? '#F0D88A' : w.status === 'hidden' ? '#F0D0D0' : '#E0D9CF' }}>
                {/* Status indicator */}
                {w.status !== 'approved' && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={w.status === 'pending' ? { background: '#FFF8E1', color: '#F57F17' } : { background: '#FFEBEE', color: '#C62828' }}>
                      {w.status === 'pending' ? '● Menunggu' : '○ Disembunyikan'}
                    </span>
                  </div>
                )}

                <p className="text-sm leading-relaxed text-stone-700 mb-4" style={{ fontFamily: 'Lora, serif', fontStyle: 'italic' }}>"{w.message}"</p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-stone-700">{w.name}</div>
                    <div className="text-[10px] text-stone-400">{w.timestamp}</div>
                  </div>
                  <div className="flex gap-1">
                    {w.status !== 'approved' && (
                      <button onClick={() => updateStatus(w.id, 'approved')} className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors hover:opacity-80" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Setujui</button>
                    )}
                    {w.status !== 'hidden' && (
                      <button onClick={() => updateStatus(w.id, 'hidden')} className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors hover:opacity-80" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>Sembunyikan</button>
                    )}
                    <button onClick={() => deleteWish(w.id)} className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors hover:opacity-80" style={{ background: '#FFEBEE', color: '#C62828' }}>Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
