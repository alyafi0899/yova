import { useState, type FormEvent } from 'react'
import type { NavProps } from '../App'
import { DRESSES } from '../data/dresses'

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

export default function Fitting({ navigate }: NavProps) {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            fitting. Pastikan nomor WhatsApp Anda aktif.
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
              navigate('home')
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
                    <input
                      required
                      type="tel"
                      value={form.whatsapp}
                      onChange={e => set('whatsapp', e.target.value)}
                      className={inputClass}
                      style={{ borderRadius: '2px' }}
                      placeholder="08XXXXXXXXXX"
                    />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Koleksi Pilihan *</label>
                    <select
                      required
                      value={form.selectedDress}
                      onChange={e => set('selectedDress', e.target.value)}
                      className={selectClass}
                      style={{ borderRadius: '2px' }}
                    >
                      <option value="">Pilih koleksi</option>
                      {DRESSES.map(d => (
                        <option key={d.id} value={d.collectionCode}>
                          {d.collectionCode} — {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Pilihan Kedua (opsional)</label>
                    <select
                      value={form.secondDress}
                      onChange={e => set('secondDress', e.target.value)}
                      className={selectClass}
                      style={{ borderRadius: '2px' }}
                    >
                      <option value="">—</option>
                      {DRESSES.map(d => (
                        <option key={d.id} value={d.collectionCode}>
                          {d.collectionCode} — {d.name}
                        </option>
                      ))}
                    </select>
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
                className="w-full py-4 bg-mocha text-ivory text-sm font-medium tracking-wide hover:bg-mocha-dark transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Ajukan Jadwal Fitting
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
            <div className="p-6 bg-cream border border-nude">
              <h3 className="font-display text-xl text-charcoal mb-2">Lokasi Studio</h3>
              <p className="text-sm text-muted mb-1">Blangkejeren, Kabupaten Gayo Lues, Aceh</p>
              <p className="text-xs text-muted italic">
                Alamat lengkap diberikan saat konfirmasi jadwal fitting.
              </p>
            </div>
            <div className="p-4 border border-nude text-xs text-muted">
              Permintaan fitting belum otomatis dikonfirmasi. Kami akan menghubungi Anda
              via WhatsApp untuk memastikan jadwal tersedia.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
