import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Dress, DressCategory } from '../data/dresses'
import DressCard from '../components/DressCard'

const CATEGORIES: DressCategory[] = ['Wanita', 'Pria', 'Couple']

export default function Collection({ navigate: _ }: { navigate?: any }) {
  const navigate = useNavigate()
  const [dresses, setDresses] = useState<Dress[]>([])
  const [activeCategory, setActiveCategory] = useState<DressCategory | 'Semua'>('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDresses() {
      setLoading(true)
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        const mapped = data.map((d: any) => ({
          ...d,
          collectionCode: d.collection_code,
          includedItems: d.included_items,
          resizeAvailable: d.resize_available,
          fitNotes: d.fit_notes,
          recommendedHeight: d.recommended_height,
          estimatedAvailable: d.estimated_available,
        }))
        setDresses(mapped)
      }
      setLoading(false)
    }

    fetchDresses()
  }, [])

  const filtered =
    activeCategory === 'Semua'
      ? dresses
      : dresses.filter(d => d.category === activeCategory)

  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Katalog</p>
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-8">Koleksi Kami</h1>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory('Semua')}
            className={`px-6 py-2 text-xs font-medium tracking-widest uppercase transition-colors ${
              activeCategory === 'Semua'
                ? 'bg-mocha text-ivory'
                : 'bg-cream text-muted hover:text-mocha'
            }`}
            style={{ borderRadius: '2px' }}
          >
            Semua
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-xs font-medium tracking-widest uppercase transition-colors ${
                activeCategory === cat
                  ? 'bg-mocha text-ivory'
                  : 'bg-cream text-muted hover:text-mocha'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted italic">Mencari koleksi terbaik untuk Anda...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filtered.map(dress => (
              <DressCard
                key={dress.id}
                dress={dress}
                onClick={() => navigate(`/dress/${dress.id}`)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted">
              Belum ada koleksi untuk kategori ini.
            </div>
          )}
        </>
      )}
    </div>
  )
}
