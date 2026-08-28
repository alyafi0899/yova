import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin'
  )
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Left – decorative */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12" style={{ background: '#1B3A4B' }}>
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="rgba(255,255,255,0.15)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#FAF8F4' }}>Nikahku</span>
        </Link>
        <div className="relative z-10">
          <p className="text-amber-400/80 text-xs tracking-widest uppercase mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <blockquote style={{ fontFamily: 'Lora, serif', fontSize: 20, color: '#FAF8F4', lineHeight: 1.6, fontStyle: 'italic' }}>
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
          </blockquote>
          <p className="mt-4 text-amber-400/60 text-sm">— QS. Ar-Rum: 21</p>
        </div>
        <div className="relative z-10 flex items-center gap-6">
          {[['2.400+', 'Pasangan'], ['98%', 'Kepuasan'], ['20+', 'Template']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#C9A84C' }}>{val}</div>
              <div className="text-white/40 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right – form */}
      <div className="flex flex-col items-center justify-center p-8" style={{ background: '#FAF8F4' }}>
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="#1B3A4B" />
              <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
            </svg>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>Nikahku</span>
          </Link>

          {mode === 'forgot' ? (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#1B3A4B' }}>Lupa Password?</h1>
              <p className="text-stone-400 text-sm mt-2 mb-8">Masukkan email Anda dan kami akan mengirimkan link reset.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5 font-medium tracking-wide">Email</label>
                  <input type="email" required placeholder="nama@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-medium transition-all" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>
              <button onClick={() => setMode('signin')} className="mt-6 text-sm text-stone-400 hover:text-stone-600 transition-colors">← Kembali ke masuk</button>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#1B3A4B' }}>
                {mode === 'signin' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
              </h1>
              <p className="text-stone-400 text-sm mt-2 mb-8">
                {mode === 'signin' ? 'Masuk untuk melanjutkan undangan Anda.' : 'Gratis untuk membuat dan preview undangan.'}
              </p>

              {/* Social */}
              <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border transition-all hover:bg-stone-50 mb-4" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" /><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
                Lanjutkan dengan Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: '#E0D9CF' }} />
                <span className="text-stone-300 text-xs">atau</span>
                <div className="flex-1 h-px" style={{ background: '#E0D9CF' }} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5 font-medium tracking-wide">Nama Lengkap</label>
                    <input type="text" required placeholder="Al Yafi" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5 font-medium tracking-wide">Email</label>
                  <input type="email" required placeholder="nama@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-stone-500 font-medium tracking-wide">Password</label>
                    {mode === 'signin' && (
                      <button type="button" onClick={() => setMode('forgot')} className="text-xs text-amber-700 hover:text-amber-900">Lupa password?</button>
                    )}
                  </div>
                  <input type="password" required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
                {mode === 'signup' && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="mt-0.5 accent-amber-600" />
                    <span className="text-xs text-stone-500 leading-relaxed">Saya setuju dengan <a href="#" className="text-amber-700 underline">Syarat & Ketentuan</a> dan <a href="#" className="text-amber-700 underline">Kebijakan Privasi</a> Nikahku.</span>
                  </label>
                )}
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
                  {loading ? (mode === 'signin' ? 'Masuk...' : 'Membuat akun...') : (mode === 'signin' ? 'Masuk' : 'Buat Akun Gratis')}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-stone-400">
                {mode === 'signin' ? (
                  <>Belum punya akun? <button onClick={() => setMode('signup')} className="text-amber-700 hover:text-amber-900 font-medium">Daftar gratis</button></>
                ) : (
                  <>Sudah punya akun? <button onClick={() => setMode('signin')} className="text-amber-700 hover:text-amber-900 font-medium">Masuk</button></>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
