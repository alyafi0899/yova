import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { getWhatsAppLink } from './data/dresses'
import { supabase } from './lib/supabase'

// YOVA Pages
import Home from './pages/Home'
import Collection from './pages/Collection'
import DressDetail from './pages/DressDetail'
import HowItWorks from './pages/HowItWorks'
import Fitting from './pages/Fitting'
import CheckRental from './pages/CheckRental'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'

// Admin Components
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDresses from './pages/admin/AdminDresses'
import AdminOrders from './pages/admin/AdminOrders'

// Invitation Pages
import InvitationLanding from './pages/invitation/Landing'
import InvitationTemplates from './pages/invitation/Templates'
import InvitationAuth from './pages/invitation/Auth'
import InvitationDashboard from './pages/invitation/Dashboard'
import InvitationBuilder from './pages/invitation/Builder'
import InvitationPublic from './pages/invitation/PublicInvitation'
import InvitationPublish from './pages/invitation/Publish'
import InvitationRSVP from './pages/invitation/RSVPDashboard'
import {
  InvitationOverview,
  InvitationTemplatesTab,
  InvitationUsersTab,
  InvitationTransactionsTab
} from './pages/invitation/Admin'

const NAV_ITEMS = [
  { label: 'Koleksi', path: '/collection' },
  { label: 'Cara Sewa', path: '/how-it-works' },
  { label: 'Cek Rental', path: '/check-rental' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Kontak', path: '/contact' },
]

function Navbar({ transparent }: { transparent: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleNav = (path: string) => {
    navigate(path)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent && !menuOpen
          ? 'bg-transparent'
          : 'bg-ivory/96 backdrop-blur-md border-b border-nude'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => handleNav('/')} className="text-left shrink-0">
          <div className={`font-display text-xl tracking-wide transition-colors ${transparent && !menuOpen ? 'text-white' : 'text-charcoal'}`}>YOVA</div>
          <div className={`text-[9px] tracking-[0.22em] uppercase transition-colors ${transparent && !menuOpen ? 'text-white/60' : 'text-muted'}`}>Sewa Baju Akad · Blangkejeren</div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`text-sm transition-colors ${
                transparent && !menuOpen
                  ? isActive(item.path) ? 'text-white font-medium' : 'text-white/75 hover:text-white'
                  : isActive(item.path) ? 'text-mocha font-medium' : 'text-charcoal hover:text-mocha'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('/invitation')}
            className={`text-sm font-medium transition-colors ${transparent && !menuOpen ? 'text-amber-300' : 'text-amber-700'}`}
          >
            Undangan Digital ✨
          </button>
        </div>

        {/* Desktop CTA */}
        <button
          onClick={() => handleNav('/fitting')}
          className={`hidden md:block px-5 py-2 text-sm font-medium tracking-wide transition-colors ${
            transparent && !menuOpen
              ? 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
              : 'bg-mocha text-ivory hover:bg-mocha-dark'
          }`}
          style={{ borderRadius: '2px' }}
        >
          Jadwalkan Fitting
        </button>

        {/* Mobile Toggle */}
        <button className={`md:hidden p-2 ${transparent && !menuOpen ? 'text-white' : 'text-charcoal'}`} onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex flex-col gap-1.5 w-6">
            <span className={`block h-px w-full bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-full bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-full bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-ivory border-b border-nude px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {NAV_ITEMS.map(item => (
            <button key={item.path} onClick={() => handleNav(item.path)} className="text-left text-sm font-medium text-charcoal py-1">
              {item.label}
            </button>
          ))}
          <button onClick={() => handleNav('/invitation')} className="text-left text-sm font-bold text-amber-700 py-1">Undangan Digital ✨</button>
          <button onClick={() => handleNav('/fitting')} className="mt-2 py-3 bg-mocha text-ivory text-sm font-medium tracking-wide">Jadwalkan Fitting</button>
        </div>
      )}
    </nav>
  )
}

function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="bg-charcoal text-ivory/50 mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="font-display text-xl text-ivory mb-1">YOVA</div>
          <div className="text-[9px] tracking-[0.22em] uppercase text-ivory/30 mb-4">Sewa Baju Akad · Blangkejeren</div>
          <p className="text-xs leading-relaxed">Studio sewa baju akad di Blangkejeren, Aceh. Koleksi elegan untuk hari istimewa Anda.</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-ivory/30 mb-4">Halaman</p>
          <div className="flex flex-col gap-2.5">
            {NAV_ITEMS.map(item => <button key={item.path} onClick={() => { navigate(item.path); window.scrollTo(0,0); }} className="text-left text-sm hover:text-ivory transition-colors">{item.label}</button>)}
            <button onClick={() => { navigate('/invitation'); window.scrollTo(0,0); }} className="text-left text-sm text-amber-400 hover:text-ivory">Undangan Digital</button>
          </div>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-ivory/30 mb-4">Kontak</p>
          <p className="text-sm mb-3">Blangkejeren, Gayo Lues, Aceh</p>
          <a href={getWhatsAppLink('Halo Yova, saya ingin bertanya tentang koleksi baju akad.')} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-ivory transition-colors">WhatsApp →</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 border-t border-ivory/8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[11px] text-ivory/25">© 2026 YOVA Sewa Baju Akad Blangkejeren. Semua hak dilindungi.</div>
        <button onClick={() => navigate('/admin-login')} className="text-[10px] text-ivory/10 hover:text-ivory/40 transition-colors uppercase tracking-widest">Admin Login</button>
      </div>
    </footer>
  )
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar transparent={transparent} />
      <div className={isHome ? 'pt-0' : 'pt-16'}>{children}</div>
      <Footer />
    </div>
  )
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="min-h-screen flex items-center justify-center bg-ivory text-muted italic">Mengecek Sesi...</div>
  if (!session) return <Navigate to="/admin-login" replace />

  return <>{children}</>
}

function AdminLoginWrapper() {
  const navigate = useNavigate()
  return <AdminLogin onLogin={() => navigate('/admin/orders')} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* YOVA Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/collection" element={<MainLayout><Collection /></MainLayout>} />
        <Route path="/dress/:id" element={<MainLayout><DressDetail /></MainLayout>} />
        <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
        <Route path="/fitting" element={<MainLayout><Fitting /></MainLayout>} />
        <Route path="/check-rental" element={<MainLayout><CheckRental /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

        {/* Invitation Public Routes */}
        <Route path="/invitation" element={<InvitationLanding />} />
        <Route path="/invitation/templates" element={<InvitationTemplates />} />
        <Route path="/invitation/auth" element={<InvitationAuth />} />
        <Route path="/invitation/dashboard" element={<InvitationDashboard />} />
        <Route path="/invitation/builder" element={<InvitationBuilder />} />
        <Route path="/invitation/publish" element={<InvitationPublish />} />
        <Route path="/invitation/rsvp-dashboard" element={<InvitationRSVP />} />
        <Route path="/i/:slug" element={<InvitationPublic />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginWrapper />} />
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <AdminLayout navigate={(p) => {}} onLogout={() => supabase.auth.signOut()} page="">
              <Routes>
                <Route path="dresses" element={<AdminDresses />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="invitation-overview" element={<InvitationOverview />} />
                <Route path="invitation-templates" element={<InvitationTemplatesTab />} />
                <Route path="invitation-users" element={<InvitationUsersTab />} />
                <Route path="invitation-transactions" element={<InvitationTransactionsTab />} />
                <Route path="invitation-rsvp" element={<InvitationRSVP />} />
                <Route path="*" element={<Navigate to="orders" replace />} />
              </Routes>
            </AdminLayout>
          </AdminProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
