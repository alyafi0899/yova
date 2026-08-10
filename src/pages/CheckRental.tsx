import { useState, type FormEvent } from 'react'
import type { NavProps } from '../App'
import { MOCK_RENTALS } from '../data/dresses'

const TIMELINE = [
  { key: 'fitting', label: 'Fitting' },
  { key: 'booking', label: 'Booking' },
  { key: 'payment', label: 'Pembayaran' },
  { key: 'prepared', label: 'Baju Disiapkan' },
  { key: 'pickup', label: 'Pengambilan (H-1)' },
  { key: 'event', label: 'Hari Acara (H)' },
  { key: 'return', label: 'Pengembalian (H+1)' },
  { key: 'inspection', label: 'Pemeriksaan Kondisi' },
  { key: 'deposit', label: 'Deposit Dikembalikan' },
]

type SearchResult = (typeof MOCK_RENTALS)[0] | 'not-found' | null

export default function CheckRental({ navigate: _ }: NavProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'booking' | 'whatsapp'>('booking')
  const [result, setResult] = useState<SearchResult>(null)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const found = MOCK_RENTALS.find(r =>
      searchType === 'booking'
        ? r.bookingId.toLowerCase() === query.trim().toLowerCase()
        : query.trim() === '081234567890',
    )
    setResult(found ?? 'not-found')
  }

  const btnBase = 'px-4 py-2 text-sm border transition-colors'
  const btnActive = 'bg-charcoal text-ivory border-charcoal'
  const btnIdle = 'border-nude text-charcoal hover:border-charcoal bg-transparent'

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Pelacakan</p>
        <h1 className="font-display text-5xl text-charcoal mb-4">Cek Status Rental</h1>
        <p className="text-muted mb-12">
          Masukkan Booking ID atau nomor WhatsApp Anda untuk melihat status rental.
        </p>

        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSearchType('booking')}
              className={`${btnBase} ${searchType === 'booking' ? btnActive : btnIdle}`}
              style={{ borderRadius: '2px' }}
            >
              Booking ID
            </button>
            <button
              type="button"
              onClick={() => setSearchType('whatsapp')}
              className={`${btnBase} ${searchType === 'whatsapp' ? btnActive : btnIdle}`}
              style={{ borderRadius: '2px' }}
            >
              Nomor WhatsApp
            </button>
          </div>
          <div className="flex gap-3">
            <input
              required
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-nude bg-ivory text-charcoal text-sm focus:outline-none focus:border-charcoal transition-colors"
              style={{ borderRadius: '2px' }}
              placeholder={searchType === 'booking' ? 'Contoh: YV-0012' : '08XXXXXXXXXX'}
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-mocha text-ivory text-sm font-medium hover:bg-mocha-dark transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Cari
            </button>
          </div>
          <p className="text-xs text-muted mt-2 italic">Demo: cari &quot;YV-0012&quot; untuk melihat contoh hasil.</p>
        </form>

        {result === 'not-found' && (
          <div className="p-8 border border-nude text-center">
            <p className="font-display text-2xl text-charcoal mb-2">Data tidak ditemukan</p>
            <p className="text-sm text-muted">
              Pastikan Booking ID atau nomor WhatsApp yang Anda masukkan benar.
            </p>
          </div>
        )}

        {result && result !== 'not-found' && (
          <div className="border border-nude">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-nude">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted mb-1">Booking</p>
                <h2 className="font-display text-2xl text-charcoal">{result.bookingId}</h2>
              </div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200"
                style={{ borderRadius: '2px' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">Dikonfirmasi</span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-nude">
              {[
                ['Koleksi', result.dress.collectionCode],
                ['Tanggal Acara', result.eventDate],
                ['Pengambilan', result.pickupDate],
                ['Pengembalian', result.returnDate],
              ].map(([label, value]) => (
                <div key={label} className="p-4 border-r border-nude last:border-r-0">
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-sm font-medium text-charcoal">{value}</p>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="p-6">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-6">
                Progress
              </p>
              <div>
                {TIMELINE.map((step, i) => {
                  const done = result.completedSteps.includes(step.key)
                  const current =
                    !done &&
                    (i === 0 || result.completedSteps.includes(TIMELINE[i - 1].key))
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            done
                              ? 'bg-mocha text-ivory'
                              : current
                              ? 'border-2 border-mocha bg-ivory text-mocha'
                              : 'border border-nude bg-ivory text-muted'
                          }`}
                        >
                          {done ? '✓' : (
                            <span className="text-[9px]">{String(i + 1).padStart(2, '0')}</span>
                          )}
                        </div>
                        {i < TIMELINE.length - 1 && (
                          <div
                            className={`w-px mt-1 ${done ? 'bg-mocha/30' : 'bg-nude'}`}
                            style={{ minHeight: '28px' }}
                          />
                        )}
                      </div>
                      <p
                        className={`text-sm pt-1 pb-7 ${
                          done
                            ? 'text-charcoal font-medium'
                            : current
                            ? 'text-mocha font-medium'
                            : 'text-muted'
                        }`}
                      >
                        {step.label}
                        {current && (
                          <span className="ml-2 text-[10px] text-mocha font-normal tracking-widest uppercase">
                            ← Saat ini
                          </span>
                        )}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
