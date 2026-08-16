import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getWhatsAppLink, type Dress } from '../data/dresses'

interface FormState {
  name: string
  whatsapp: string
  eventDate: string
  eventType: string
  fittingDate: string
  fittingTime: string
  selectedDress: string
  secondDress: string
  notes: string
}

const INITIAL: FormState = {
  name: '',
  whatsapp: '',
  eventDate: '',
  eventType: '',
  fittingDate: '',
  fittingTime: '',
  selectedDress: '',
  secondDress: '',
  notes: '',
}

const TIME_SLOTS = [
  '09:00 – 10:00',
  '10:00 – 11:00',
  '11:00 – 12:00',
  '14:00 – 15:00',
  '15:00 – 16:00',
  '16:00 – 17:00',
]

export default function Fitting() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dressId = searchParams.get('dressId')
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dbDresses, setDbDresses] = useState<Dress[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSelect, setActiveSelect] = useState<'primary' | 'secondary'>('primary')

  useEffect(() => {
    async function fetchDresses() {
      const { data } = await supabase.from('dresses').select('*')
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
        setDbDresses(mapped)

        if (dressId) {
          const selected = mapped.find(d => d.id === dressId)
          if (selected) {
            setForm(prev => ({ ...prev, selectedDress: selected.collectionCode }))
          }
        }
      }
    }
    fetchDresses()
  }, [dressId])

  const set = (field: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Menambahkan 3 digit random di akhir agar tidak duplikat jika orang yang sama pesan baju yang sama
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const bookingId = `${form.selectedDress}-${form.whatsapp.slice(-4)}-${randomSuffix}`

    const { error } = await supabase.from('rentals').insert([
      {
        booking_id: bookingId,
        customer_name: form.name,
        whatsapp: form.whatsapp,
        event_date: form.eventDate,
        dress_code: form.selectedDress,
        fitting_date: form.fittingDate,
        fitting_time: form.fittingTime,
        status: 'pending',
        completed_steps: []
      }
    ])

    if (!error) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      alert('Gagal mengirim permintaan: ' + error.message)
    }
    setLoading(false)
  }

  const openDressPicker = (type: 'primary' | 'secondary') => {
    setActiveSelect(type)
    setIsModalOpen(true)
  }

  const selectDress = (code: string) => {
    if (activeSelect === 'primary') {
      set('selectedDress', code)
    } else {
      set('secondDress', code)
    }
    setIsModalOpen(false)
  }

  const getDressByCode = (code: string) => dbDresses.find(d => d.collectionCode === code)

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-8">
            <span className="text-xl text-emerald-500">✓</span>
          </div>
          <h1 className="font-display text-3xl text-charcoal mb-3">
            Permintaan Fitting Berhasil Dikirim
          </h1>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 mb-8"
            style={{ borderRadius: '2px' }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs text-amber-700 font-medium">Menunggu Konfirmasi</span>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-8 max-w-xs mx-auto">
            Kami akan menghubungi Anda melalui WhatsApp untuk mengkonfirmasi jadwal
            fitting. Jika booking dikonfirmasi, ID Booking Anda akan berupa: <br/>
            <span className="font-mono font-bold text-mocha">
              {form.selectedDress || 'KODE'}-{form.whatsapp.slice(-4) || 'XXXX'}
            </span>
          </p>

          <div className="p-5 bg-cream border border-nude text-left text-sm space-y-3 mb-8">
            {[
              ['Nama', form.name],
              ['WhatsApp', form.whatsapp],
              ['Tanggal Acara', form.eventDate],
              ['Koleksi Pilihan', form.selectedDress],
              ['Tanggal Fitting', form.fittingDate],
              ['Waktu Fitting', form.fittingTime],
              ['Status', 'Menunggu Konfirmasi'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-muted text-xs shrink-0">{label}</span>
                <span
                  className={`font-medium text-charcoal text-right ${
                    label === 'Status' ? 'text-amber-600' : ''
                  }`}
                >
                  {value || '—'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setForm(INITIAL)
              setSubmitted(false)
              navigate('/')
            }}
            className="px-8 py-3 bg-mocha text-ivory text-sm font-medium hover:bg-mocha-dark transition-colors"
            style={{ borderRadius: '2px' }}
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full px-3 py-2.5 border border-nude bg-ivory text-charcoal text-sm focus:outline-none focus:border-charcoal transition-colors'
  const selectClass = inputClass + ' appearance-none pr-8'
  const labelClass = 'block text-xs font-medium text-charcoal mb-1.5'
  const sectionLabel =
    'text-[10px] tracking-[0.18em] uppercase text-muted mb-4 pb-2 border-b border-nude'

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">
          {/* Form */}
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Booking</p>
            <h1 className="font-display text-5xl text-charcoal mb-12">Jadwalkan Fitting</h1>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Customer */}
              <div>
                <h2 className={sectionLabel}>Informasi Pelanggan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Lengkap *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className={inputClass}
                      style={{ borderRadius: '2px' }}
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nomor WhatsApp *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">+62</span>
                      <input
                        required
                        type="tel"
                        value={form.whatsapp.startsWith('62') ? form.whatsapp.slice(2) : form.whatsapp.startsWith('0') ? form.whatsapp.slice(1) : form.whatsapp}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '')
                          set('whatsapp', '62' + val)
                        }}
                        className={inputClass + ' pl-12'}
                        style={{ borderRadius: '2px' }}
                        placeholder="81234567890"
                      />
                    </div>
                    <p className="text-[9px] text-muted mt-1 italic">Masukkan nomor tanpa angka 0 di depan.</p>
                  </div>
                </div>
              </div>

              {/* Event */}
              <div>
                <h2 className={sectionLabel}>Informasi Acara</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tanggal Acara *</label>
                    <input
                      required
                      type="date"
                      value={form.eventDate}
                      onChange={e => set('eventDate', e.target.value)}
                      className={inputClass}
                      style={{ borderRadius: '2px' }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Jenis Acara *</label>
                    <select
                      required
                      value={form.eventType}
                      onChange={e => set('eventType', e.target.value)}
                      className={selectClass}
                      style={{ borderRadius: '2px' }}
                    >
                      <option value="">Pilih jenis acara</option>
                      <option>Akad Nikah</option>
                      <option>Resepsi</option>
                      <option>Akad + Resepsi</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fitting schedule */}
              <div>
                <h2 className={sectionLabel}>Jadwal Fitting</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className={labelClass}>Tanggal Fitting *</label>
                    <input
                      required
                      type="date"
                      value={form.fittingDate}
                      onChange={e => set('fittingDate', e.target.value)}
                      className={inputClass}
                      style={{ borderRadius: '2px' }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Waktu Fitting *</label>
                    <select
                      required
                      value={form.fittingTime}
                      onChange={e => set('fittingTime', e.target.value)}
                      className={selectClass}
                      style={{ borderRadius: '2px' }}
                    >
                      <option value="">Pilih waktu</option>
                      {TIME_SLOTS.map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Visual Picker for Primary Dress */}
                  <div>
                    <label className={labelClass}>Koleksi Pilihan *</label>
                    <button
                      type="button"
                      onClick={() => openDressPicker('primary')}
                      className="w-full flex items-center justify-between px-3 py-3 border border-nude bg-white text-sm text-left hover:border-charcoal transition-colors"
                      style={{ borderRadius: '2px' }}
                    >
                      {form.selectedDress ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={getDressByCode(form.selectedDress)?.images[0]}
                            className="w-8 h-8 object-cover rounded-sm"
                            alt=""
                          />
                          <span>{form.selectedDress} — {getDressByCode(form.selectedDress)?.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted">Pilih Koleksi...</span>
                      )}
                      <span className="text-[10px]">▼</span>
                    </button>
                    <input type="hidden" required value={form.selectedDress} />
                  </div>

                  {/* Visual Picker for Secondary Dress */}
                  <div>
                    <label className={labelClass}>Pilihan Kedua (opsional)</label>
                    <button
                      type="button"
                      onClick={() => openDressPicker('secondary')}
                      className="w-full flex items-center justify-between px-3 py-3 border border-nude bg-white text-sm text-left hover:border-charcoal transition-colors"
                      style={{ borderRadius: '2px' }}
                    >
                      {form.secondDress ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={getDressByCode(form.secondDress)?.images[0]}
                            className="w-8 h-8 object-cover rounded-sm"
                            alt=""
                          />
                          <span>{form.secondDress} — {getDressByCode(form.secondDress)?.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                      <span className="text-[10px]">▼</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass}>Catatan (opsional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={3}
                  className={inputClass + ' resize-none'}
                  style={{ borderRadius: '2px' }}
                  placeholder="Informasi tambahan yang perlu kami ketahui..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-mocha text-ivory text-sm font-medium tracking-wide hover:bg-mocha-dark transition-colors disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {loading ? 'Mengirim...' : 'Ajukan Jadwal Fitting'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="p-6 bg-cream border border-nude">
              <h3 className="font-display text-xl text-charcoal mb-5">Sebelum Fitting</h3>
              <ul className="space-y-3 text-sm text-muted">
                {[
                  'Siapkan informasi tanggal acara Anda.',
                  'Ketahui ukuran badan Anda jika memungkinkan.',
                  'Datang tepat waktu sesuai jadwal yang dikonfirmasi.',
                  'Bawa referensi tampilan yang diinginkan jika ada.',
                  'Konfirmasi jadwal dikirim melalui WhatsApp.',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-mocha shrink-0 mt-0.5">·</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Dress Picker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-nude flex justify-between items-center">
              <h2 className="font-display text-xl text-charcoal">Pilih Koleksi</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-charcoal text-2xl">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {dbDresses.map(dress => {
                const isAvailable = dress.status === 'available'
                return (
                  <button
                    key={dress.id}
                    disabled={!isAvailable}
                    onClick={() => selectDress(dress.collectionCode)}
                    className={`group relative text-left transition-all ${!isAvailable ? 'cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                  >
                    <div className={`aspect-[3/4] bg-soft overflow-hidden mb-3 relative ${!isAvailable ? 'opacity-40' : ''}`}>
                      <img src={dress.images[0]} className="w-full h-full object-cover" alt={dress.name} />
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-charcoal/80 text-white text-[9px] font-bold uppercase px-3 py-1 tracking-widest">
                            Sudah Dipesan
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={!isAvailable ? 'opacity-50' : ''}>
                      <div className="text-[9px] text-muted font-bold uppercase tracking-widest mb-1">{dress.collectionCode}</div>
                      <div className="text-xs text-charcoal font-medium line-clamp-1">{dress.name}</div>
                      <div className="text-[10px] text-mocha font-bold mt-1">Size {dress.size || 'M'}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-nude text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-xs font-medium uppercase tracking-widest border border-nude hover:bg-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
