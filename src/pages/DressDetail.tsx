import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice, getWhatsAppLink, type Dress } from '../data/dresses'
import { normalizeImageUrl } from '../lib/utils/image'

export default function DressDetail({ navigate: _ }: { navigate?: any }) {
  const navigate = useNavigate()
  const { id: dressId } = useParams()
  const [dress, setDress] = useState<Dress | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    async function fetchDress() {
      if (!dressId) return
      setLoading(true)
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .eq('id', dressId)
        .single()

      if (data) {
        const mapped: Dress = {
          ...data,
          collectionCode: data.collection_code,
          includedItems: data.included_items,
          resizeAvailable: data.resize_available,
          fitNotes: data.fit_notes,
          recommendedHeight: data.recommended_height,
          estimatedAvailable: data.estimated_available,
        }
        setDress(mapped)
      }
      setLoading(false)
    }

    fetchDress()
  }, [dressId])

  if (loading) {
    return <div className="pt-40 pb-20 text-center text-muted italic">Memuat detail koleksi...</div>
  }

  if (!dress) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-muted mb-6">Koleksi tidak ditemukan.</p>
        <button onClick={() => navigate('collection')} className="text-mocha font-medium underline">
          Kembali ke Koleksi
        </button>
      </div>
    )
  }

  const waMessage = `Halo Yova, saya tertarik dengan ${dress.name} (${dress.collectionCode}). Apakah tersedia untuk tanggal...`

  return (
    <div className="pt-32 pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/collection')}
          className="text-[10px] tracking-[0.2em] uppercase text-muted mb-10 flex items-center gap-2 hover:text-mocha transition-colors"
        >
          ← Kembali ke Koleksi
        </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Images */}
        <div className="lg:col-span-7">
          <div className="aspect-[3/4] bg-soft overflow-hidden mb-4">
            <img
              src={normalizeImageUrl(dress.images[activeImage]) || 'https://via.placeholder.com/800x1000?text=No+Image'}
              alt={dress.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5">
          <div className="mb-8 border-b border-nude pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted font-bold">
                {dress.collectionCode}
              </span>
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-charcoal text-white">
                Size {dress.size || 'M'}
              </span>
              <span
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border-2 ${
                  dress.status === 'available'
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-amber-500 text-amber-600 bg-amber-50'
                }`}
              >
                {dress.status === 'available' ? 'Tersedia' : 'Sudah Dipesan'}
              </span>
            </div>
            <h1 className="font-display text-4xl text-charcoal mb-4">{dress.name}</h1>
            <p className="text-2xl text-mocha font-medium mb-6">{formatPrice(dress.price)}</p>

            {/* Thumbnail Gallery - Moved here */}
            {dress.images.length > 1 && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-3 font-bold">Galeri Foto</p>
                <div className="grid grid-cols-4 gap-3">
                  {dress.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square bg-soft overflow-hidden border-2 transition-colors ${
                        activeImage === idx ? 'border-mocha' : 'border-transparent'
                      }`}
                    >
                      <img src={normalizeImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Palet Warna */}
            {dress.colors && dress.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-2 font-bold">Pilihan Warna</p>
                <div className="flex flex-wrap gap-2">
                  {dress.colors.map(c => (
                    <span key={c} className="px-3 py-1 bg-cream text-charcoal text-[11px] border border-nude">{c}</span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-muted text-sm leading-relaxed mb-10">{dress.description}</p>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/fitting?dressId=${dress.id}`)}
                className="block w-full py-4 bg-mocha text-ivory text-center text-sm font-medium tracking-wide hover:bg-mocha-dark transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Jadwalkan Fitting Sekarang
              </button>

              <a
                href={getWhatsAppLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 border border-charcoal text-charcoal text-center text-sm font-medium tracking-wide hover:bg-charcoal hover:text-white transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Chat WhatsApp Admin
              </a>
            </div>
            <p className="text-[10px] text-center text-muted mt-4 uppercase tracking-widest">
              Jaminan Deposit: {formatPrice(dress.deposit)}
            </p>
          </div>

          <div className="space-y-8">
            {/* Measurements */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal mb-4">Detail Ukuran (Estimasi)</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {dress.measurements && Object.entries(dress.measurements).map(([key, val]) => (
                  val && (
                    <div key={key}>
                      <span className="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="ml-2 text-charcoal font-medium">{val}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Included */}
            {dress.includedItems && dress.includedItems.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal mb-4">Termasuk Dalam Sewa</h3>
                <div className="flex flex-wrap gap-2">
                  {dress.includedItems.map(item => (
                    <span key={item} className="px-3 py-1 bg-cream text-muted text-[11px] rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
