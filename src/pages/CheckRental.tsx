import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../data/dresses'

interface RentalData {
  booking_id: string
  customer_name: string
  event_date: string
  pickup_date: string
  return_date: string
  status: string
  completed_steps: string[]
  dresses: {
    name: string
    price: number
    images: string[]
  }
}

export default function CheckRental({ navigate }: { navigate?: (path: string) => void }) {
  const [bookingId, setBookingId] = useState('')
  const [rental, setRental] = useState<RentalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingId.trim()) return

    setLoading(true)
    setError(null)
    setRental(null)

    const { data, error: supaError } = await supabase
      .from('rentals')
      .select('*')
      .eq('booking_id', bookingId.toUpperCase())
      .single()

    if (supaError || !data) {
      setError('ID Booking tidak ditemukan. Pastikan kode yang Anda masukkan benar.')
    } else {
      // Manually fetch dress data to avoid join issues
      let dressData = null
      if (data.dress_id) {
        const { data: d } = await supabase
          .from('dresses')
          .select('name, price, images')
          .eq('id', data.dress_id)
          .single()
        dressData = d
      }
      setRental({ ...data, dresses: dressData } as any)
    }
    setLoading(false)
  }

  const steps = [
    { id: 'fitting', label: 'Fitting & Ukur' },
    { id: 'booking', label: 'Booking DP' },
    { id: 'payment', label: 'Pelunasan' },
    { id: 'prepared', label: 'Siap Diambil' },
  ]

  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Layanan</p>
        <h1 className="font-display text-4xl text-charcoal mb-4">Cek Status Rental</h1>
        <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
          Masukkan ID Booking Anda untuk melihat jadwal pengambilan, pengembalian, dan
          progres persiapan baju akad Anda.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={bookingId}
            onChange={e => setBookingId(e.target.value)}
            placeholder="Contoh: YV-0012"
            className="flex-1 px-5 py-4 bg-white border border-nude focus:border-mocha outline-none text-sm transition-colors uppercase"
            style={{ borderRadius: '2px' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-charcoal text-ivory text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
            style={{ borderRadius: '2px' }}
          >
            {loading ? 'Mencari...' : 'Periksa Status'}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
      </form>

      {rental && (
        <div className="bg-white border border-nude p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10 pb-8 border-b border-nude">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-2">Penyewa</p>
              <h3 className="font-display text-2xl text-charcoal">{rental.customer_name}</h3>
              <p className="text-sm text-mocha mt-1">{rental.dresses?.name || 'Koleksi tidak ditemukan'}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-2">ID Booking</p>
              <h3 className="font-mono text-xl font-bold text-charcoal">{rental.booking_id}</h3>
              <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase mt-1 rounded">
                {rental.status}
              </span>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-8 font-bold text-center">
              Progres Persiapan
            </p>
            <div className="relative flex justify-between">
              {/* Connector Line */}
              <div className="absolute top-4 left-0 w-full h-px bg-nude -z-0" />

              {steps.map((step, idx) => {
                const isCompleted = rental.completed_steps.includes(step.id)
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center w-1/4">
                    <div
                      className={`w-8 h-8 flex items-center justify-center border-2 transition-colors duration-500 ${
                        isCompleted ? 'bg-mocha border-mocha text-white' : 'bg-white border-nude text-muted'
                      }`}
                      style={{ borderRadius: '50%' }}
                    >
                      {isCompleted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span className={`text-[9px] uppercase tracking-tighter mt-3 font-medium text-center ${isCompleted ? 'text-charcoal' : 'text-muted'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-cream/50 p-6">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Tanggal Acara</p>
              <p className="text-sm font-medium text-charcoal">{rental.event_date}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Ambil Baju (Pickup)</p>
              <p className="text-sm font-medium text-charcoal">{rental.pickup_date || '-'}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Kembali (Return)</p>
              <p className="text-sm font-medium text-charcoal">{rental.return_date || '-'}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted mb-4">
              Ada perubahan jadwal atau butuh bantuan fitting ulang?
            </p>
            <button
              onClick={() => navigate?.('contact')}
              className="text-xs font-bold uppercase tracking-widest text-mocha hover:text-mocha-dark transition-colors"
            >
              Hubungi Admin Yova →
            </button>
          </div>
        </div>
      )}

      {!rental && !loading && (
        <div className="bg-cream/30 border border-dashed border-nude p-10 text-center">
          <p className="text-sm text-muted">Hasil pencarian akan muncul di sini.</p>
        </div>
      )}
    </div>
  )
}
