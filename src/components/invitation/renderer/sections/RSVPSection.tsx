import React, { useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'

interface RSVPSectionProps {
  section: TemplateSection
  invitationId?: string
  theme: ThemeConfig
  mode: 'edit' | 'preview' | 'public'
}

const RSVPSection: React.FC<RSVPSectionProps> = ({ section, invitationId, theme, mode }) => {
  const [formData, setFormData] = useState({ name: '', attendance: 'present', count: 1, message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode !== 'public') {
       alert('RSVP hanya aktif pada halaman publik.')
       return
    }

    setSubmitting(true)
    try {
      if (!invitationId) throw new Error('Invitation ID missing')

      const { error } = await supabase
        .from('rsvp')
        .insert([{
          invitation_id: invitationId,
          guest_name: formData.name,
          attendance: formData.attendance,
          guest_count: formData.count,
          message: formData.message
        }])

      if (error) throw error

      // Increment RSVP count in invitations table
      await supabase.rpc('increment_rsvp_count', { inv_id: invitationId })
      // Fallback if RPC doesn't exist
      /*
      const { data: inv } = await supabase.from('invitations').select('rsvp_count').eq('id', invitationId).single()
      await supabase.from('invitations').update({ rsvp_count: (inv?.rsvp_count || 0) + 1 }).eq('id', invitationId)
      */

      setSubmitted(true)
    } catch (err: any) {
      console.error(err)
      alert('Gagal mengirim konfirmasi: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-24 px-6 bg-charcoal text-white text-center">
      <div className="max-w-md mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-mocha-light font-bold">Kehadiran</p>
          <h2 className="text-4xl text-ivory" style={{ fontFamily: theme.fonts.heading }}>
            Konfirmasi RSVP
          </h2>
          <p className="text-xs text-ivory/50">Mohon konfirmasi kehadiran Anda melalui form di bawah ini.</p>
        </header>

        {submitted ? (
          <div className="p-10 border border-mocha-light/30 bg-white/5 animate-in fade-in zoom-in duration-500">
             <span className="text-4xl block mb-6">✨</span>
             <h3 className="font-display text-xl mb-2">Terima Kasih!</h3>
             <p className="text-xs text-ivory/60">Konfirmasi Anda telah kami terima.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="text-[9px] uppercase font-bold tracking-widest text-mocha-light mb-2 block">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-mocha-light outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[9px] uppercase font-bold tracking-widest text-mocha-light mb-2 block">Kehadiran</label>
                 <select
                   className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-mocha-light outline-none transition-all appearance-none"
                   value={formData.attendance}
                   onChange={e => setFormData({...formData, attendance: e.target.value})}
                 >
                   <option value="present" className="text-charcoal">InsyaAllah Hadir</option>
                   <option value="absent" className="text-charcoal">Berhalangan Hadir</option>
                 </select>
               </div>
               <div>
                 <label className="text-[9px] uppercase font-bold tracking-widest text-mocha-light mb-2 block">Jumlah Tamu</label>
                 <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-mocha-light outline-none transition-all"
                    value={formData.count}
                    onChange={e => setFormData({...formData, count: parseInt(e.target.value)})}
                 />
               </div>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold tracking-widest text-mocha-light mb-2 block">Ucapan / Doa</label>
              <textarea
                rows={4}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-mocha-light outline-none transition-all resize-none"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-mocha-dark transition-all disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default RSVPSection
