import { useState } from 'react'
import type { NavProps } from '../App'
import { DRESSES, type DressCategory, type DressStatus } from '../data/dresses'
import DressCard from '../components/DressCard'

type CategoryFilter = 'Semua' | DressCategory
type StatusFilter = 'Semua' | DressStatus

const CATEGORIES: CategoryFilter[] = ['Semua', 'Wanita', 'Pria', 'Couple']

const STATUSES: { value: StatusFilter; label: string }[] = [
  { value: 'Semua', label: 'Semua Status' },
  { value: 'available', label: 'Tersedia' },
  { value: 'booked', label: 'Sudah Dipesan' },
  { value: 'rented', label: 'Sedang Disewa' },
  { value: 'maintenance', label: 'Dalam Perawatan' },
]

export default function Collection({ navigate }: NavProps) {
  const [category, setCategory] = useState<CategoryFilter>('Semua')
  const [status, setStatus] = useState<StatusFilter>('Semua')

  const filtered = DRESSES.filter(d => {
    const catMatch = category === 'Semua' || d.category === category
    const statMatch = status === 'Semua' || d.status === status
    return catMatch && statMatch
  })

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Katalog</p>
          <h1 className="font-display text-5xl text-charcoal">Koleksi Baju Akad</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm transition-colors ${
                  category === cat
                    ? 'bg-charcoal text-ivory border border-charcoal'
                    : 'bg-transparent text-charcoal border border-nude hover:border-charcoal'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto">
            <select
              value={status}
              onChange={e => setStatus(e.target.value as StatusFilter)}
              className="px-4 py-2 pr-9 text-sm border border-nude bg-ivory text-charcoal appearance-none focus:outline-none focus:border-charcoal transition-colors"
              style={{ borderRadius: '2px' }}
            >
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-muted mb-8">
          {filtered.length} koleksi ditemukan
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(dress => (
              <DressCard
                key={dress.id}
                dress={dress}
                onClick={() => navigate('dress-detail', dress.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-28 text-muted border border-nude">
            <p className="font-display text-2xl mb-2 text-charcoal">Tidak ada koleksi</p>
            <p className="text-sm">Coba pilih filter yang berbeda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
