import { useState } from 'react'
import type { NavProps } from '../App'
import { DRESSES, formatPrice, getWhatsAppLink, DEPOSIT_AMOUNT } from '../data/dresses'
import { STATUS_CONFIG } from '../components/DressCard'

function AvailabilityCalendar({ dressStatus }: { dressStatus: string }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [selected, setSelected] = useState<number | null>(null)

  const bookedDays =
    dressStatus === 'available'
      ? [3, 4, 15, 16, 25, 26]
      : Array.from({ length: 31 }, (_, i) => i + 1)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = new Date(year, month).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const isPast = (day: number) =>
    new Date(year, month, day) < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const isBooked = (day: number) => bookedDays.includes(day)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="text-muted hover:text-charcoal px-2 py-1 transition-colors">
          ←
        </button>
        <span className="text-sm font-medium text-charcoal capitalize">{monthLabel}</span>
        <button onClick={nextMonth} className="text-muted hover:text-charcoal px-2 py-1 transition-colors">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
          <div key={d} className="text-[10px] text-muted font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const past = isPast(day)
          const booked = isBooked(day)
          const sel = selected === day
          return (
            <button
              key={day}
              disabled={booked || past}
              onClick={() => setSelected(day)}
              className={[
                'text-xs py-1.5 transition-colors',
                past ? 'text-nude cursor-default' : '',
                booked && !past ? 'bg-red-50 text-red-300 cursor-not-allowed' : '',
                !past && !booked ? 'hover:bg-blush-light cursor-pointer text-charcoal' : '',
                sel ? 'bg-mocha text-ivory font-medium' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ borderRadius: '2px' }}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex gap-5 text-[10px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-ivory border border-nude inline-block" /> Tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-red-50 border border-red-200 inline-block" /> Tidak Tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-mocha inline-block" /> Dipilih
        </span>
      </div>

      {selected && !isBooked(selected) && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
          ✓ Tersedia untuk tanggal {selected} {monthLabel}. Jadwalkan fitting untuk mengkonfirmasi.
        </div>
      )}
    </div>
  )
}

interface Props extends NavProps {
  dressId?: string
}

export default function DressDetail({ navigate, dressId }: Props) {
  const dress = DRESSES.find(d => d.id === dressId) ?? DRESSES[0]
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const status = STATUS_CONFIG[dress.status]

  const waMsg = `Hallo Yova, saya tertarik dengan ${dress.collectionCode} - ${dress.name}. Saya ingin mengecek ketersediaan dan jadwal fitting.`

  const measureRows = [
    ['Lingkar Dada', dress.measurements.lingkarDada],
    ['Lebar Dada', dress.measurements.lebarDada],
    ['Lebar Bahu', dress.measurements.lebarBahu],
    ['Lingkar Pinggang', dress.measurements.lingkarPinggang],
    ['Lingkar Pinggul', dress.measurements.lingkarPinggul],
    ['Panjang Baju', dress.measurements.panjangBaju],
    ['Panjang Lengan', dress.measurements.panjangLengan],
    ['Lingkar Lengan', dress.measurements.lingkarLengan],
    ['Tinggi Badan', dress.measurements.tinggiBadan],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <div className="pt-20 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-6 pb-2">
        <nav className="flex gap-2 text-xs text-muted items-center">
          <button onClick={() => navigate('home')} className="hover:text-charcoal transition-colors">
            Home
          </button>
          <span className="text-nude">›</span>
          <button onClick={() => navigate('collection')} className="hover:text-charcoal transition-colors">
            Koleksi
          </button>
          <span className="text-nude">›</span>
          <span className="text-charcoal">{dress.collectionCode}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14">
          {/* Gallery */}
          <div>
            <div
              className="relative bg-soft overflow-hidden cursor-zoom-in mb-3"
              style={{ aspectRatio: '3 / 4' }}
              onClick={() => setLightbox(true)}
            >
              <img
                src={dress.images[activeImg]}
                alt={dress.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-ivory/90 backdrop-blur-sm text-charcoal text-[10px] font-medium px-2.5 py-1 tracking-widest uppercase">
                  {dress.collectionCode}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-charcoal/50 backdrop-blur-sm px-2 py-1">
                <span className="text-white text-[10px]">Klik untuk perbesar</span>
              </div>
            </div>
            {dress.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {dress.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`overflow-hidden bg-soft border-2 transition-colors ${
                      i === activeImg ? 'border-mocha' : 'border-transparent hover:border-nude'
                    }`}
                    style={{ aspectRatio: '3 / 4', borderRadius: '2px' }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-1.5">
                {dress.category}
              </p>
              <h1 className="font-display text-3xl text-charcoal leading-tight mb-4">
                {dress.name}
              </h1>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 ${status.bg}`}
                style={{ borderRadius: '2px' }}
              >
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
                {dress.estimatedAvailable && (
                  <span className="text-xs text-muted">
                    · Tersedia ~{dress.estimatedAvailable}
                  </span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="border border-nude p-5">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm text-muted">Biaya Sewa</span>
                <span className="font-display text-2xl text-charcoal">{formatPrice(dress.price)}</span>
              </div>
              <div className="flex justify-between items-baseline mb-3 pb-3 border-b border-nude">
                <span className="text-sm text-muted">
                  Deposit{' '}
                  <span className="text-[10px] text-muted italic">(refundable)</span>
                </span>
                <span className="text-sm font-medium text-charcoal">
                  {formatPrice(DEPOSIT_AMOUNT)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-charcoal">Total Bayar</span>
                <span className="text-base font-semibold text-charcoal">
                  {formatPrice(dress.price + DEPOSIT_AMOUNT)}
                </span>
              </div>
              <p className="text-[11px] text-muted mt-3 leading-relaxed border-t border-nude pt-3">
                Deposit adalah uang jaminan, bukan biaya sewa. Dikembalikan setelah barang
                diperiksa dan kondisinya sesuai ketentuan.
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed">{dress.description}</p>

            {/* Included items */}
            <div>
              <h3 className="text-[10px] tracking-[0.18em] uppercase text-muted mb-3">
                Kelengkapan
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                {dress.includedItems.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
                    <span className="text-emerald-500 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resize */}
            <div className="p-3 bg-cream border border-nude">
              <p className="text-[11px] font-medium text-charcoal mb-1">Penyesuaian Ukuran</p>
              <p className="text-xs text-muted">
                {dress.resizeAvailable
                  ? 'Minor resize tersedia berdasarkan hasil fitting.'
                  : 'Penyesuaian ukuran tidak tersedia untuk koleksi ini.'}
              </p>
            </div>

            {/* Rental timeline */}
            <div className="p-4 bg-cream border border-nude">
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-4">
                Masa Sewa
              </p>
              <div className="flex items-center">
                {[
                  { label: 'H-1', sub: 'Pengambilan' },
                  { label: 'Hari H', sub: 'Acara' },
                  { label: 'H+1', sub: 'Pengembalian' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-mocha text-ivory flex items-center justify-center text-[9px] font-medium leading-tight text-center">
                        {t.label}
                      </div>
                      <div className="text-[9px] text-muted mt-1 text-center leading-tight">
                        {t.sub}
                      </div>
                    </div>
                    {i < 2 && <div className="flex-1 h-px bg-nude mx-1" />}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => navigate('fitting')}
                className="w-full py-3.5 bg-mocha text-ivory text-sm font-medium tracking-wide hover:bg-mocha-dark transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Jadwalkan Fitting
              </button>
              <a
                href={getWhatsAppLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 border border-charcoal text-charcoal text-sm font-medium text-center hover:bg-charcoal hover:text-ivory transition-colors block"
                style={{ borderRadius: '2px' }}
              >
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Below-fold sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20 pt-16 border-t border-nude">
          {/* Measurements */}
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-6">
              Ukuran & Fit
            </p>
            <h2 className="font-display text-2xl text-charcoal mb-3">Detail Ukuran</h2>
            <p className="text-sm text-muted leading-relaxed mb-2">{dress.fitNotes}</p>
            <p className="text-xs text-muted mb-6">
              Tinggi badan disarankan:{' '}
              <span className="font-medium text-charcoal">{dress.recommendedHeight}</span>
            </p>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {measureRows.map(([key, val]) => (
                  <tr key={key} className="border-b border-nude">
                    <td className="py-3 text-muted text-xs">{key}</td>
                    <td className="py-3 text-charcoal font-medium text-right">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-muted mt-4 italic">
              * Ukuran di atas adalah ukuran baju, bukan ukuran badan. Fitting tetap
              diperlukan untuk memastikan kesesuaian.
            </p>
          </div>

          {/* Availability */}
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-6">
              Ketersediaan
            </p>
            <h2 className="font-display text-2xl text-charcoal mb-6">Cek Tanggal Acara</h2>
            <AvailabilityCalendar dressStatus={dress.status} />
            {dress.status !== 'available' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-700">
                Koleksi ini saat ini <strong>{status.label.toLowerCase()}</strong>.
                {dress.estimatedAvailable &&
                  ` Diperkirakan tersedia kembali: ${dress.estimatedAvailable}.`}
              </div>
            )}
            <div className="mt-6">
              <a
                href={getWhatsAppLink(
                  `Hallo Yova, saya ingin mengecek ketersediaan ${dress.collectionCode} - ${dress.name} untuk tanggal acara saya.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-mocha font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Tanya ketersediaan via WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-charcoal/96 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-6 right-6 text-ivory/70 hover:text-ivory text-2xl leading-none"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <img
            src={dress.images[activeImg]}
            alt={dress.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />
          {dress.images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {dress.images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => {
                    e.stopPropagation()
                    setActiveImg(i)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeImg ? 'bg-ivory' : 'bg-ivory/30 hover:bg-ivory/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
