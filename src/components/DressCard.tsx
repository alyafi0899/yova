import type { Dress } from '../data/dresses'
import { formatPrice } from '../data/dresses'

export const STATUS_CONFIG = {
  available: { dot: 'bg-emerald-500', label: 'Tersedia', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  booked: { dot: 'bg-amber-400', label: 'Sudah Dipesan', text: 'text-amber-700', bg: 'bg-amber-50' },
  rented: { dot: 'bg-red-400', label: 'Sedang Disewa', text: 'text-red-700', bg: 'bg-red-50' },
  maintenance: { dot: 'bg-orange-400', label: 'Dalam Perawatan', text: 'text-orange-700', bg: 'bg-orange-50' },
}

interface Props {
  dress: Dress
  onClick: () => void
}

export default function DressCard({ dress, onClick }: Props) {
  const status = STATUS_CONFIG[dress.status]
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden bg-soft aspect-[3/4] mb-4">
        <img
          src={dress.images[0]}
          alt={dress.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-ivory/90 backdrop-blur-sm text-charcoal text-[10px] font-medium px-2 py-1 tracking-widest uppercase">
            {dress.collectionCode}
          </span>
        </div>
        {dress.status !== 'available' && (
          <div className="absolute inset-0 bg-charcoal/10" />
        )}
      </div>

      <div>
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-1">{dress.category}</p>
        <h3 className="font-display text-lg text-charcoal leading-snug mb-1">{dress.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-mocha">
            {formatPrice(dress.price)}{' '}
            <span className="text-muted font-normal text-xs">/ rental</span>
          </p>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span className={`text-[10px] font-medium ${status.text}`}>{status.label}</span>
          </div>
        </div>
        <button className="text-[11px] text-charcoal font-medium tracking-widest uppercase border-b border-charcoal pb-0.5 hover:text-mocha hover:border-mocha transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  )
}
