import { ReactNode, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { invitationService } from '../../lib/invitation/invitationService'

interface DashboardLayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Ringkasan', icon: '📊', path: '/invitation/dashboard' },
  { id: 'customize', label: 'Sesuaikan', icon: '🎨', path: '/invitation/dashboard/customize' },
  { id: 'guests', label: 'Tamu', icon: '👥', path: '/invitation/dashboard/guests' },
  { id: 'rsvp', label: 'RSVP', icon: '📩', path: '/invitation/dashboard/rsvp' },
  { id: 'template', label: 'Template', icon: '✨', path: '/invitation/dashboard/template' },
  { id: 'settings', label: 'Pengaturan', icon: '⚙️', path: '/invitation/dashboard/settings' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await invitationService.logout()
    navigate('/invitation/auth')
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-charcoal text-ivory flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="font-display text-2xl tracking-wide">YOVA</Link>
          <div className="text-[9px] tracking-[0.3em] text-mocha font-bold uppercase mt-2">Wedding Workspace</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4">
          <div className="space-y-1">
            {NAV_ITEMS.map(item => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-200 flex items-center gap-3 ${
                    isActive
                      ? 'bg-mocha text-white shadow-lg shadow-mocha/20 font-medium'
                      : 'text-ivory/50 hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 flex items-center gap-2 transition-colors"
          >
            <span>⏻</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-charcoal text-ivory p-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="font-display text-xl tracking-wide">YOVA</Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <div className="flex flex-col gap-1.5 w-6">
            <span className={`block h-px w-full bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-full bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-full bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-charcoal pt-20 px-6 space-y-4">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 p-4 text-ivory/70 hover:text-white border-b border-white/5"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left p-4 text-red-400/60 flex items-center gap-4">
            <span>⏻</span> Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen relative p-6 md:p-12 lg:p-16">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
