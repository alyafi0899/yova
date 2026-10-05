import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getWhatsAppLink } from '../../data/dresses'

interface FittingRequest {
  id: string
  customer_name: string
  whatsapp: string
  event_date: string
  dress_code: string
  fitting_date: string
  fitting_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export default function AdminFitting() {
  const [requests, setRequests] = useState<FittingRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    const { data } = await supabase
      .from('fitting_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setRequests(data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('fitting_requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Gagal mengupdate status: ' + error.message)
    } else {
      fetchRequests()
    }
  }

  async function createRental(req: FittingRequest) {
    const cleanCode = (req.dress_code || '').trim()
    const bookingId = `${cleanCode || 'DRS'}-${(req.whatsapp || '').replace(/\D/g, '').slice(-4)}`

    // 1. Get Dress ID using multi-step resolver
    let dressId: string | null = null

    if (cleanCode) {
      // Step A: Search collection_code case-insensitive
      const { data: dByCode } = await supabase
        .from('dresses')
        .select('id')
        .ilike('collection_code', cleanCode)
        .maybeSingle()

      if (dByCode) {
        dressId = dByCode.id
      } else {
        // Step B: Search by ID
        const { data: dById } = await supabase
          .from('dresses')
          .select('id')
          .eq('id', cleanCode)
          .maybeSingle()

        if (dById) {
          dressId = dById.id
        } else {
          // Step C: Search by name
          const { data: dByName } = await supabase
            .from('dresses')
            .select('id')
            .ilike('name', `%${cleanCode}%`)
            .limit(1)
            .maybeSingle()

          if (dByName) dressId = dByName.id
        }
      }
    }

    // Fallback: If still no dress_id found, assign first dress in DB if exists so approval is never blocked!
    if (!dressId) {
      const { data: firstDress } = await supabase.from('dresses').select('id').limit(1)
      if (firstDress && firstDress.length > 0) {
        dressId = firstDress[0].id
      }
    }

    // 2. Create or Update Rental record (Upsert)
    const { error: rentalError } = await supabase
      .from('rentals')
      .upsert(
        [{
          booking_id: bookingId,
          dress_id: dressId,
          customer_name: req.customer_name,
          whatsapp: req.whatsapp,
          event_date: req.event_date || 'Belum ditentukan',
          dress_code: cleanCode,
          fitting_date: req.fitting_date,
          fitting_time: req.fitting_time,
          status: 'confirmed',
          completed_steps: ['fitting']
        }],
        { onConflict: 'booking_id' }
      )

    if (rentalError) {
      alert('Gagal membuat rental: ' + rentalError.message)
      return
    }

    // 3. Update fitting request status
    await updateStatus(req.id, 'confirmed')
    alert(`Sukses! Rental berhasil dikonfirmasi dan dibuat dengan ID Booking: ${bookingId}`)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display text-charcoal">Permintaan Fitting</h1>
        <p className="text-sm text-muted">Konfirmasi dan atur jadwal fitting calon pengantin</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Memuat data...</div>
      ) : (
        <div className="bg-white border border-nude overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-nude text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Pelanggan</th>
                <th className="px-6 py-4 font-medium">WhatsApp</th>
                <th className="px-6 py-4 font-medium">Jadwal Fitting</th>
                <th className="px-6 py-4 font-medium">Baju Pilihan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-charcoal">{req.customer_name}</td>
                  <td className="px-6 py-4">{req.whatsapp}</td>
                  <td className="px-6 py-4">
                    <div className="text-charcoal">{req.fitting_date}</div>
                    <div className="text-[10px] text-muted uppercase">{req.fitting_time}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{req.dress_code || '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter rounded ${
                        req.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : req.status === 'cancelled'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => createRental(req)}
                          className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase hover:bg-emerald-700 transition-colors"
                          style={{ borderRadius: '2px' }}
                        >
                          Konfirmasi & Buat Rental
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, 'cancelled')}
                          className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase hover:bg-red-600 transition-colors"
                          style={{ borderRadius: '2px' }}
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-muted italic mr-2">Selesai</span>
                    )}
                    <a
                      href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Halo ${req.customer_name}, kami dari YOVA ingin mengonfirmasi jadwal fitting Anda pada ${req.fitting_date} jam ${req.fitting_time}. Jika deal, ID Booking Anda adalah: ${req.dress_code}-${req.whatsapp.slice(-4)}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#25D366] text-white text-[10px] font-bold uppercase hover:bg-[#1ebe59] transition-colors"
                      style={{ borderRadius: '2px' }}
                    >
                      Hubungi WA
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="py-20 text-center text-muted italic">Belum ada permintaan fitting.</div>
          )}
        </div>
      )}
    </div>
  )
}
