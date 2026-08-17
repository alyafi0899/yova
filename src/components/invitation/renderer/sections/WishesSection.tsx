import React, { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'

interface WishesSectionProps {
  section: TemplateSection
  invitationId?: string
  theme: ThemeConfig
  mode: 'edit' | 'preview' | 'public'
}

const WishesSection: React.FC<WishesSectionProps> = ({ section, invitationId, theme, mode }) => {
  const [wishes, setWishes] = useState<any[]>([])
  const [newWish, setNewWish] = useState({ name: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (invitationId) {
      fetchWishes()
    }
  }, [invitationId])

  async function fetchWishes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('guest_wishes')
      .select('*')
      .eq('invitation_id', invitationId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (data) setWishes(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode !== 'public') {
      alert('Fitur ini hanya aktif pada halaman publik.')
      return
    }
    if (!invitationId) return

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('guest_wishes')
        .insert([{
          invitation_id: invitationId,
          guest_name: newWish.name,
          message: newWish.message,
          status: 'approved' // Default to approved for now, or use moderation setting
        }])
        .select()

      if (error) throw error
      if (data) setWishes([data[0], ...wishes])
      setNewWish({ name: '', message: '' })
    } catch (err: any) {
      alert('Gagal mengirim ucapan: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-24 px-6 bg-ivory">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Wishes</p>
          <h2 className="text-4xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
            Wedding Wishes
          </h2>
        </header>

        {/* Wish Form */}
        <form onSubmit={handleSubmit} className="p-8 bg-white border border-nude shadow-sm space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-muted mb-2 block">Nama</label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  className="w-full border border-nude px-4 py-2.5 text-sm focus:border-mocha outline-none"
                  value={newWish.name}
                  onChange={e => setNewWish({...newWish, name: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                 <button
                   type="submit"
                   disabled={submitting}
                   className="w-full py-2.5 bg-charcoal text-ivory text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                 >
                   {submitting ? 'Mengirim...' : 'Kirim Ucapan'}
                 </button>
              </div>
           </div>
           <div>
              <label className="text-[9px] uppercase font-bold tracking-widest text-muted mb-2 block">Pesan Doa</label>
              <textarea
                required
                rows={3}
                disabled={submitting}
                className="w-full border border-nude px-4 py-2.5 text-sm focus:border-mocha outline-none resize-none"
                value={newWish.message}
                onChange={e => setNewWish({...newWish, message: e.target.value})}
              />
           </div>
        </form>

        {/* Wishes List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
           {loading ? (
             <div className="text-center py-10 text-[10px] uppercase tracking-widest text-muted italic">Memuat ucapan...</div>
           ) : wishes.length === 0 ? (
             <div className="text-center py-10 text-[10px] uppercase tracking-widest text-muted italic">Belum ada ucapan. Jadilah yang pertama!</div>
           ) : wishes.map((wish, idx) => (
             <div key={idx} className="p-6 bg-white border-l-4 border-mocha shadow-sm animate-in slide-in-from-left duration-500">
                <p className="text-xs text-muted mb-2 leading-relaxed font-serif">"{wish.message}"</p>
                <div className="flex justify-between items-center border-t border-nude/50 pt-4">
                   <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">{wish.guest_name || wish.name}</span>
                   <span className="text-[8px] text-muted font-bold uppercase">{wish.created_at ? new Date(wish.created_at).toLocaleDateString() : 'Baru saja'}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}

export default WishesSection
