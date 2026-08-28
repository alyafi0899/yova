import { useState, useEffect } from 'react'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject, RSVPResponse } from '../../lib/invitation/types'

export default function DashboardRSVP({ project }: { project: InvitationProject }) {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRSVPs() {
      setLoading(true)
      const data = await invitationService.getRSVPs(project.id)
      setRsvps(data)
      setLoading(false)
    }
    fetchRSVPs()
  }, [project.id])

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'attending' || r.attendance === 'yes').length,
    notAttending: rsvps.filter(r => r.attendance === 'not_attending' || r.attendance === 'no').length,
    maybe: rsvps.filter(r => r.attendance === 'maybe').length,
    totalGuests: rsvps.reduce((acc, r) => acc + (r.guests || 0), 0)
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-charcoal mb-2">Konfirmasi RSVP</h1>
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Pantau kehadiran tamu Anda</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {[
          { label: 'Total Respon', value: stats.total, color: 'text-charcoal' },
          { label: 'Akan Hadir', value: stats.attending, color: 'text-emerald-600' },
          { label: 'Tidak Hadir', value: stats.notAttending, color: 'text-red-500' },
          { label: 'Mungkin', value: stats.maybe, color: 'text-amber-500' },
          { label: 'Total Person', value: stats.totalGuests, color: 'text-mocha' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-nude p-6 text-center shadow-sm">
            <div className="text-[8px] uppercase tracking-widest text-muted font-bold mb-1">{s.label}</div>
            <div className={`text-3xl font-display ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* RSVP Table */}
      <div className="bg-white border border-nude shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/20 border-b border-nude">
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Nama Tamu</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Kehadiran</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Jumlah</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Pesan</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-muted font-bold">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nude">
            {rsvps.map(rsvp => (
              <tr key={rsvp.id} className="hover:bg-soft/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-charcoal">{rsvp.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold rounded ${
                    (rsvp.attendance === 'attending' || rsvp.attendance === 'yes') ? 'bg-emerald-50 text-emerald-600' :
                    (rsvp.attendance === 'not_attending' || rsvp.attendance === 'no') ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {rsvp.attendance}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-charcoal">{rsvp.guests} Person</td>
                <td className="px-6 py-4">
                  <p className="text-xs text-muted max-w-xs truncate italic">"{rsvp.message || '-'}"</p>
                </td>
                <td className="px-6 py-4 text-[10px] text-muted uppercase">
                  {new Date(rsvp.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-muted italic text-sm">
                  Belum ada konfirmasi RSVP masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
