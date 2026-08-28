import { useState, useEffect } from 'react'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject, Guest } from '../../lib/invitation/types'

export default function DashboardGuests({ project }: { project: InvitationProject }) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newGuest, setNewGuest] = useState({ name: '', whatsapp: '', category: 'Friend', guestCount: 2 })

  useEffect(() => {
    fetchGuests()
  }, [project.id])

  async function fetchGuests() {
    setLoading(true)
    const data = await invitationService.getGuests(project.id)
    setGuests(data)
    setLoading(false)
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    await invitationService.addGuest(project.id, newGuest)
    setNewGuest({ name: '', whatsapp: '', category: 'Friend', guestCount: 2 })
    setShowAddModal(false)
    fetchGuests()
  }

  const getShareLink = (guest: Guest) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/i/${project.slug}?to=${guest.slug}`
  }

  const handleCopyLink = (guest: Guest) => {
    navigator.clipboard.writeText(getShareLink(guest))
    alert('Link disalin ke clipboard!')
  }

  const handleShareWA = (guest: Guest) => {
    const message = `Halo ${guest.name}, kami mengundang Anda untuk hadir di pernikahan kami. Berikut adalah undangan digital resmi kami: ${getShareLink(guest)}`
    window.open(`https://wa.me/${guest.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-display text-4xl text-charcoal mb-2">Daftar Tamu</h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Kelola tamu undangan Anda</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-3 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
        >
          + Tambah Tamu
        </button>
      </div>

      <div className="bg-white border border-nude shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/20 border-b border-nude">
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Nama Tamu</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Kategori</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Jumlah</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Status</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nude">
            {guests.map(guest => (
              <tr key={guest.id} className="hover:bg-soft/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-charcoal">{guest.name}</div>
                  <div className="text-[10px] text-muted">{guest.whatsapp}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-mocha/5 text-mocha font-bold rounded">
                    {guest.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-charcoal">{guest.guestCount} Tamu</td>
                <td className="px-6 py-4">
                   <div className="flex flex-col gap-1">
                      <span className={`text-[9px] uppercase font-bold ${guest.status === 'invited' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {guest.status === 'invited' ? 'Belum Dikirim' : 'Terkirim'}
                      </span>
                      <span className="text-[8px] uppercase text-muted italic">{guest.rsvpStatus}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyLink(guest)}
                      className="p-2 border border-nude hover:bg-white text-[10px] uppercase transition-colors"
                      title="Salin Link"
                    >🔗</button>
                    <button
                      onClick={() => handleShareWA(guest)}
                      className="p-2 bg-[#25D366] text-white hover:opacity-80 transition-opacity rounded-sm"
                      title="Kirim WA"
                    >📱</button>
                  </div>
                </td>
              </tr>
            ))}
            {guests.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-muted italic text-sm">
                  Belum ada tamu yang ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-10 border border-nude shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-muted hover:text-charcoal">✕</button>
            <h3 className="font-display text-2xl text-charcoal mb-8">Tambah Tamu Baru</h3>
            <form onSubmit={handleAddGuest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Tamu</label>
                <input
                  type="text" required
                  value={newGuest.name}
                  onChange={e => setNewGuest({...newGuest, name: e.target.value})}
                  className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                  placeholder="Contoh: Bapak Ahmad & Keluarga"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nomor WhatsApp</label>
                <input
                  type="text" required
                  value={newGuest.whatsapp}
                  onChange={e => setNewGuest({...newGuest, whatsapp: e.target.value})}
                  className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                  placeholder="628..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Kategori</label>
                  <select
                    value={newGuest.category}
                    onChange={e => setNewGuest({...newGuest, category: e.target.value})}
                    className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha appearance-none"
                  >
                    <option>Friend</option>
                    <option>Family</option>
                    <option>VIP</option>
                    <option>Colleague</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Maks Tamu</label>
                  <input
                    type="number" min="1" max="10"
                    value={newGuest.guestCount}
                    onChange={e => setNewGuest({...newGuest, guestCount: parseInt(e.target.value)})}
                    className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-mocha text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-mocha-dark transition-all mt-4">
                Simpan Tamu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
