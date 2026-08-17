import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/invitation/dashboard')
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        if (signUpError) throw signUpError
        setError('Pendaftaran berhasil. Silakan cek email Anda untuk konfirmasi.')
      } else if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        navigate('/invitation/dashboard')
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
        if (resetError) throw resetError
        setError('Tautan atur ulang kata sandi telah dikirim ke email Anda.')
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/invitation/dashboard',
      },
    })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ivory font-sans">
      {/* Left – decorative */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden p-16 bg-charcoal">
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <Link to="/" className="relative z-10 flex flex-col">
          <div className="font-display text-2xl tracking-wide text-ivory">YOVA</div>
          <div className="text-[9px] tracking-[0.22em] uppercase text-ivory/40">Undangan Digital · Blangkejeren</div>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-mocha-light text-[10px] tracking-[0.3em] uppercase mb-8 font-bold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <blockquote className="font-display text-3xl text-ivory leading-relaxed italic mb-8">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
          </blockquote>
          <p className="text-mocha-light text-sm font-medium">— QS. Ar-Rum: 21</p>
        </div>

        <div className="relative z-10 flex items-center gap-12 border-t border-white/10 pt-10">
          {[
            { val: '2.400+', label: 'Pasangan' },
            { val: '98%', label: 'Kepuasan' },
            { val: '20+', label: 'Template' }
          ].map(stat => (
            <div key={stat.label}>
              <div className="font-display text-2xl text-mocha-light mb-1">{stat.val}</div>
              <div className="text-ivory/30 text-[9px] tracking-[0.2em] uppercase font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right – form */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex flex-col mb-12 items-center">
            <div className="font-display text-2xl tracking-wide text-charcoal">YOVA</div>
            <div className="text-[9px] tracking-[0.22em] uppercase text-muted">Undangan Digital</div>
          </Link>

          {mode === 'forgot' ? (
            <div className="animate-in fade-in duration-500">
              <h1 className="font-display text-4xl text-charcoal mb-4">Lupa Password?</h1>
              <p className="text-muted text-sm mb-10 leading-relaxed">Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-5 py-4 bg-white border border-nude outline-none text-sm focus:border-mocha transition-colors"
                    style={{ borderRadius: '2px' }}
                  />
                </div>
                {error && <p className={`text-xs ${error.includes('berhasil') || error.includes('dikirim') ? 'text-emerald-600' : 'text-red-500'}`}>{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
                  style={{ borderRadius: '2px' }}
                >
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>
              <button
                onClick={() => setMode('signin')}
                className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-mocha hover:text-mocha-dark transition-colors"
              >
                ← Kembali ke Masuk
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h1 className="font-display text-4xl text-charcoal mb-4">
                {mode === 'signin' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
              </h1>
              <p className="text-muted text-sm mb-10 leading-relaxed">
                {mode === 'signin'
                  ? 'Masuk untuk melanjutkan pengelolaan undangan digital Anda.'
                  : 'Bergabunglah dengan ribuan pasangan lainnya. Gratis untuk mencoba semua fitur.'}
              </p>

              {/* Social */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-nude text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ivory transition-all mb-8" style={{ borderRadius: '2px' }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" /><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
                Lanjutkan dengan Google
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-nude" />
                <span className="text-[9px] uppercase tracking-widest text-muted font-bold">atau</span>
                <div className="flex-1 h-px bg-nude" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Contoh: Al Yafi"
                      className="w-full px-5 py-4 bg-white border border-nude outline-none text-sm focus:border-mocha transition-colors"
                      style={{ borderRadius: '2px' }}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-5 py-4 bg-white border border-nude outline-none text-sm focus:border-mocha transition-colors"
                    style={{ borderRadius: '2px' }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold">Password</label>
                    {mode === 'signin' && (
                      <button type="button" onClick={() => setMode('forgot')} className="text-[9px] uppercase tracking-widest text-mocha font-bold hover:underline">Lupa password?</button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-white border border-nude outline-none text-sm focus:border-mocha transition-colors"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                {error && <p className={`text-xs ${error.includes('berhasil') ? 'text-emerald-600' : 'text-red-500'}`}>{error}</p>}

                {mode === 'signup' && (
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required className="mt-1 accent-mocha" />
                    <span className="text-[10px] text-muted leading-relaxed uppercase tracking-tight">Saya setuju dengan <a href="#" className="text-mocha font-bold underline">Syarat & Ketentuan</a> dan <a href="#" className="text-mocha font-bold underline">Kebijakan Privasi</a>.</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
                  style={{ borderRadius: '2px' }}
                >
                  {loading
                    ? (mode === 'signin' ? 'Masuk...' : 'Memproses...')
                    : (mode === 'signin' ? 'Masuk ke Platform' : 'Daftar Sekarang')}
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-nude text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted">
                  {mode === 'signin' ? (
                    <>Belum punya akun? <button onClick={() => setMode('signup')} className="text-mocha font-bold hover:underline ml-1">Daftar Gratis</button></>
                  ) : (
                    <>Sudah punya akun? <button onClick={() => setMode('signin')} className="text-mocha font-bold hover:underline ml-1">Masuk</button></>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
