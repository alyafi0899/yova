import { useState, useEffect } from 'react'
import { getWhatsAppLink } from './data/dresses'
import Home from './pages/Home'
import Collection from './pages/Collection'
import DressDetail from './pages/DressDetail'
import HowItWorks from './pages/HowItWorks'
import Fitting from './pages/Fitting'
import CheckRental from './pages/CheckRental'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'

export type Page =
  | 'home'
  | 'collection'
  | 'dress-detail'
  | 'how-it-works'
  | 'fitting'
  | 'check-rental'
  | 'faq'
  | 'contact'

export interface NavProps {
  navigate: (page: Page, dressId?: string) => void
}

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: 'Koleksi', page: 'collection' },
  { label: 'Cara Sewa', page: 'how-it-works' },
  { label: 'Cek Rental', page: 'check-rental' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Kontak', page: 'contact' },
]

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedDressId, setSelectedDressId] = useState<string | undefined>()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (p: Page, dressId?: string) => {
    setPage(p)
    if (dressId !== undefined) setSelectedDressId(dressId)
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = page === 'home' && !scrolled && !menuOpen

  return (
    <div className="min-h-screen bg-ivory">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? 'bg-transparent'
            : 'bg-ivory/96 backdrop-blur-md border-b border-nude'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="text-left shrink-0"
          >
            <div
              className={`font-display text-xl tracking-wide transition-colors ${
                transparent ? 'text-white' : 'text-charcoal'
              }`}
            >
              YOVA
            </div>
            <div
              className={`text-[9px] tracking-[0.22em] uppercase transition-colors ${
                transparent ? 'text-white/60' : 'text-muted'
              }`}
            >
              Sewa Baju Akad · Blangkejeren
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`text-sm transition-colors ${
                  transparent
                    ? page === item.page
                      ? 'text-white'
                      : 'text-white/75 hover:text-white'
                    : page === item.page
                    ? 'text-mocha font-medium'
                    : 'text-charcoal hover:text-mocha'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <button
            onClick={() => navigate('fitting')}
            className={`hidden md:block px-5 py-2 text-sm font-medium tracking-wide transition-colors ${
              transparent
                ? 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
                : 'bg-mocha text-ivory hover:bg-mocha-dark'
            }`}
            style={{ borderRadius: '2px' }}
          >
            Jadwalkan Fitting
          </button>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-charcoal'}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`block h-px w-full bg-current origin-center transition-all duration-200 ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition-all duration-200 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px w-full bg-current origin-center transition-all duration-200 ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="md:hidden bg-ivory border-b border-nude px-6 py-5 flex flex-col gap-4">
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className="text-left text-sm font-medium text-charcoal py-1 hover:text-mocha transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate('fitting')}
              className="mt-2 py-3 bg-mocha text-ivory text-sm font-medium tracking-wide hover:bg-mocha-dark transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Jadwalkan Fitting
            </button>
          </div>
        )}
      </nav>

      {/* Page */}
      <main>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'collection' && <Collection navigate={navigate} />}
        {page === 'dress-detail' && (
          <DressDetail navigate={navigate} dressId={selectedDressId} />
        )}
        {page === 'how-it-works' && <HowItWorks navigate={navigate} />}
        {page === 'fitting' && <Fitting navigate={navigate} />}
        {page === 'check-rental' && <CheckRental navigate={navigate} />}
        {page === 'faq' && <FAQ navigate={navigate} />}
        {page === 'contact' && <Contact navigate={navigate} />}
      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-ivory/50 mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="font-display text-xl text-ivory mb-1">YOVA</div>
            <div className="text-[9px] tracking-[0.22em] uppercase text-ivory/30 mb-4">
              Sewa Baju Akad · Blangkejeren
            </div>
            <p className="text-xs leading-relaxed">
              Studio sewa baju akad di Blangkejeren, Aceh. Koleksi elegan untuk hari
              istimewa Anda.
            </p>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-ivory/30 mb-4">Halaman</p>
            <div className="flex flex-col gap-2.5">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className="text-left text-sm hover:text-ivory transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-ivory/30 mb-4">Kontak</p>
            <p className="text-sm mb-3">Blangkejeren, Gayo Lues, Aceh</p>
            <a
              href={getWhatsAppLink(
                'Hallo Yova, saya ingin bertanya tentang koleksi baju akad.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-ivory transition-colors"
            >
              WhatsApp →
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 border-t border-ivory/8 text-[11px] text-ivory/25">
          © 2026 YOVA Sewa Baju Akad Blangkejeren. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  )
}
