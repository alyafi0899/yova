import { useState } from 'react'
import { Link } from 'react-router-dom'

type PublishState = 'review' | 'payment' | 'processing' | 'success' | 'failed'

export default function Publish() {
  const [state, setState] = useState<PublishState>('review')
  const [payMethod, setPayMethod] = useState('gopay')
  const [copied, setCopied] = useState(false)

  const invUrl = 'nikahku.id/i/yafi-yova'

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (state === 'success') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl" style={{ background: 'rgba(201,168,76,0.12)', border: '2px solid rgba(201,168,76,0.3)' }}>
          ✓
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#1B3A4B' }}>Undangan Anda Live!</h1>
        <p className="mt-3 text-stone-400 text-sm">Selamat! Undangan pernikahan Anda sudah dapat diakses oleh tamu.</p>

        <div className="mt-8 p-4 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
          <div className="text-xs text-stone-400 mb-2">Tautan undangan Anda</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg text-sm font-mono truncate" style={{ background: '#F5EFE6', color: '#1B3A4B' }}>
              {invUrl}
            </div>
            <button onClick={handleCopy} className="px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: '#1B3A4B', color: copied ? '#C9A84C' : '#FAF8F4' }}>
              {copied ? '✓' : 'Salin'}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a href={`https://${invUrl}`} target="_blank" rel="noreferrer" className="py-3 rounded-xl text-sm border text-center transition-colors hover:bg-stone-50 font-medium" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            Buka Undangan
          </a>
          <button className="py-3 rounded-xl text-sm font-medium transition-colors" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
            Bagikan
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link to="/rsvp-dashboard" className="py-3 rounded-xl text-sm border text-center transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            Dashboard RSVP
          </Link>
          <Link to="/dashboard" className="py-3 rounded-xl text-sm border text-center transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )

  if (state === 'failed') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl" style={{ background: 'rgba(184,64,64,0.1)', border: '2px solid rgba(184,64,64,0.2)' }}>
          ✕
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#1B3A4B' }}>Pembayaran Gagal</h1>
        <p className="mt-3 text-stone-400 text-sm">Maaf, pembayaran Anda tidak berhasil diproses. Silakan coba lagi.</p>
        <div className="mt-6 space-y-3">
          <button onClick={() => setState('payment')} className="w-full py-3 rounded-xl text-sm font-medium transition-colors" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>Coba Lagi</button>
          <Link to="/builder" className="block w-full py-3 rounded-xl text-sm border text-center transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>Kembali Edit</Link>
        </div>
      </div>
    </div>
  )

  if (state === 'processing') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#F5EFE6', border: '2px solid rgba(201,168,76,0.3)' }}>
          <div className="w-8 h-8 rounded-full border-2 border-t-amber-500 border-amber-200 animate-spin" />
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#1B3A4B' }}>Memproses Pembayaran</h1>
        <p className="mt-3 text-stone-400 text-sm">Mohon tunggu, kami sedang memverifikasi pembayaran Anda...</p>
        {/* Simulate processing */}
        {setTimeout(() => setState('success'), 2500) as unknown as null}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      <header className="flex items-center justify-between px-6 py-4" style={{ background: '#FFFFFF', borderBottom: '1px solid #E0D9CF' }}>
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }}>Nikahku</span>
        </Link>
        {/* Steps */}
        <div className="flex items-center gap-2 text-xs">
          {[['review', 'Review'], ['payment', 'Pembayaran']].map(([key, label], i) => (
            <div key={key} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px" style={{ background: '#E0D9CF' }} />}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium" style={state === key ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#F5EFE6', color: '#9B7B2A' }}>
                  {i + 1}
                </div>
                <span style={{ color: state === key ? '#1B3A4B' : '#9B8E7A' }}>{label}</span>
              </div>
            </div>
          ))}
        </div>
        <Link to="/builder" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">Kembali Edit</Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        {/* Preview panel */}
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }} className="mb-6">Preview Undangan</h2>
          {/* Phone preview */}
          <div className="relative mx-auto" style={{ width: 200 }}>
            <div className="rounded-[2.2rem] border-[6px] border-stone-800 overflow-hidden shadow-xl" style={{ height: 380 }}>
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-5" style={{ background: '#1B3A4B' }}>
                <div className="absolute inset-0 geometric-pattern opacity-10" />
                <p className="relative text-[10px] mb-3" style={{ fontFamily: 'Amiri, serif', color: '#C9A84C' }}>بِسْمِ اللَّهِ</p>
                <div className="relative w-6 h-px mb-4" style={{ background: '#C9A84C' }} />
                <p className="relative text-[8px] tracking-widest uppercase mb-2 text-white/50">The Wedding of</p>
                <div className="relative" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#FFFFFF', lineHeight: 1.3 }}>
                  Al Yafi<br /><em style={{ color: '#C9A84C' }}>&amp;</em><br />Yova
                </div>
                <div className="relative w-6 h-px mt-4 mb-3" style={{ background: '#C9A84C' }} />
                <p className="relative text-[8px] text-white/40 tracking-widest uppercase">10 Januari 2027</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            <div className="text-xs text-stone-400 mb-2">URL Undangan</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg text-xs font-mono truncate" style={{ background: '#F5EFE6', color: '#1B3A4B' }}>
                https://{invUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Payment panel */}
        <div>
          {state === 'review' ? (
            <div>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }} className="mb-6">Ringkasan</h2>
              <div className="p-5 rounded-2xl border mb-6" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                <div className="space-y-3">
                  {[
                    { label: 'Template Noura', value: 'Rp 70.000' },
                    { label: 'Domain unik (2 tahun)', value: 'Gratis' },
                    { label: 'RSVP & Ucapan', value: 'Gratis' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">{item.label}</span>
                      <span className="font-medium text-stone-800">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#E0D9CF' }}>
                  <span className="font-semibold text-stone-800">Total</span>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>Rp 70.000</div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#F5EFE6' }}>
                  <span className="text-amber-600 mt-0.5">✓</span>
                  <div className="text-sm text-stone-600">Akses undangan aktif selama <strong>2 tahun</strong></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#F5EFE6' }}>
                  <span className="text-amber-600 mt-0.5">✓</span>
                  <div className="text-sm text-stone-600">URL unik: <strong>nikahku.id/i/yafi-yova</strong></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#F5EFE6' }}>
                  <span className="text-amber-600 mt-0.5">✓</span>
                  <div className="text-sm text-stone-600">Manajemen RSVP tidak terbatas</div>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={() => setState('payment')} className="w-full py-3.5 rounded-xl text-sm font-medium transition-colors" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
                  Lanjut ke Pembayaran
                </button>
                <Link to="/builder" className="block w-full py-3 rounded-xl text-sm text-center border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
                  Kembali Edit Undangan
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }} className="mb-6">Pilih Pembayaran</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'gopay', label: 'GoPay', icon: '🟢' },
                  { id: 'ovo', label: 'OVO', icon: '🟣' },
                  { id: 'dana', label: 'DANA', icon: '🔵' },
                  { id: 'bca', label: 'Transfer BCA', icon: '🏦' },
                  { id: 'mandiri', label: 'Transfer Mandiri', icon: '🏦' },
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPayMethod(pm.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all"
                    style={payMethod === pm.id ? { borderColor: '#C9A84C', background: 'rgba(201,168,76,0.06)' } : { borderColor: '#E0D9CF', background: '#FFFFFF' }}
                  >
                    <span className="text-xl">{pm.icon}</span>
                    <span className="text-sm font-medium text-stone-700">{pm.label}</span>
                    {payMethod === pm.id && <span className="ml-auto text-amber-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl border mb-6 flex items-center justify-between" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
                <span className="text-sm text-stone-600">Total</span>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1B3A4B' }}>Rp 70.000</div>
              </div>
              <button onClick={() => setState('processing')} className="w-full py-3.5 rounded-xl text-sm font-medium transition-colors mb-3" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
                Bayar &amp; Publikasikan
              </button>
              <button onClick={() => setState('review')} className="w-full py-3 rounded-xl text-sm border text-center transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
                Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
