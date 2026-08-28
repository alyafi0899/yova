import { useState } from 'react'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject } from '../../lib/invitation/types'

export default function DashboardSettings({ project }: { project: InvitationProject }) {
  const [voucher, setVoucher] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await invitationService.validateVoucher(voucher)
    if (result.valid) {
      setMessage({ type: 'success', text: result.message })
      // Update project status if needed
      await invitationService.updateProject(project.id, { isActive: true, voucherCode: voucher })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setLoading(false)
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-2xl">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-charcoal mb-2">Pengaturan</h1>
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Kelola akun dan aktivasi undangan Anda</p>
      </div>

      <div className="space-y-12">
        {/* Activation Section */}
        <section>
           <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-charcoal mb-6 flex items-center gap-3">
              <span>💎</span> Aktivasi Undangan
           </h3>
           <div className="bg-white border border-nude p-8 shadow-sm">
              <p className="text-sm text-muted mb-6">
                 Undangan Anda saat ini berada dalam status <strong>Draft/Trial</strong>.
                 Aktivasi menggunakan voucher atau pembayaran untuk mendapatkan fitur penuh dan menghapus watermark.
              </p>

              <form onSubmit={handleVoucherSubmit} className="space-y-4">
                 <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={voucher}
                      onChange={e => setVoucher(e.target.value)}
                      placeholder="Masukkan Kode Voucher / Rental..."
                      className="flex-1 px-5 py-4 bg-soft border border-nude focus:border-mocha outline-none text-sm transition-colors uppercase"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-10 py-4 bg-charcoal text-white text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Memproses...' : 'Aktivasi'}
                    </button>
                 </div>
                 {message && (
                    <div className={`p-4 text-[10px] uppercase font-bold tracking-widest border ${
                      message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                       {message.text}
                    </div>
                 )}
              </form>

              <div className="mt-8 pt-8 border-t border-nude">
                 <p className="text-[9px] uppercase tracking-widest text-muted font-bold mb-4">Punya Kode Rental Baju?</p>
                 <div className="bg-ivory/50 p-4 border border-mocha/10">
                    <p className="text-xs italic text-charcoal/70">
                       Gunakan kode booking rental baju Anda (contoh: DRS-XXXX-XXXX) untuk mendapatkan aktivasi undangan 100% GRATIS.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Account Info */}
        <section>
           <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-charcoal mb-6 flex items-center gap-3">
              <span>👤</span> Informasi Akun
           </h3>
           <div className="bg-white border border-nude p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Wedding</label>
                    <input
                      type="text"
                      defaultValue={project.title}
                      className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Slug URL</label>
                    <input
                      type="text"
                      defaultValue={project.slug}
                      className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                    />
                 </div>
              </div>
              <button className="px-8 py-3 bg-mocha text-white text-[9px] font-bold uppercase tracking-widest hover:bg-mocha-dark transition-colors">
                 Simpan Perubahan
              </button>
           </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-12 border-t border-red-100">
           <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-red-600 mb-6">Danger Zone</h3>
           <div className="bg-red-50/30 border border-red-100 p-8">
              <p className="text-xs text-red-600/70 mb-6">
                 Menghapus undangan akan menghapus semua data tamu, RSVP, dan riwayat revisi secara permanen.
              </p>
              <button className="px-8 py-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors">
                 Hapus Undangan
              </button>
           </div>
        </section>
      </div>
    </div>
  )
}
