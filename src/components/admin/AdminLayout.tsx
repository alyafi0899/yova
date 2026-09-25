import React, { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export type Page = string

interface AdminLayoutProps {
  children: ReactNode
  navigate: (page: Page | string) => void
  onLogout: () => void
  page?: Page | string
}

const NAV_GROUPS = [
  {
    title: 'Sewa Baju Akad',
    items: [
      { id: 'admin-dresses', label: 'Koleksi Baju', icon: '👗' },
      { id: 'admin-orders', label: 'Manajemen Order', icon: '📋' },
    ]
  }
]

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (id: string) => {
    const path = `/admin/${id.replace('admin-', '')}`
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/5">
          <div className="font-display text-2xl tracking-wide">YOVA Admin</div>
          <div className="text-[9px] tracking-[0.3em] text-mocha font-bold uppercase mt-2">Control Center</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={group.title} className={gIdx > 0 ? 'mt-10' : ''}>
              <p className="px-4 text-[10px] font-bold text-ivory/20 uppercase tracking-[0.2em] mb-4">{group.title}</p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const itemPath = `/admin/${item.id.replace('admin-', '')}`
                  const isActive = location.pathname === itemPath
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-200 flex items-center gap-3 ${
                        isActive
                          ? 'bg-mocha text-white shadow-lg shadow-mocha/20 font-medium'
                          : 'text-ivory/50 hover:bg-white/5 hover:text-ivory'
                      }`}
                    >
                      <span className={`text-lg transition-transform ${isActive ? 'scale-110' : 'opacity-50 group-hover:opacity-100'}`}>{item.icon}</span>
                      <span className="text-xs uppercase tracking-widest">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-ivory/30 hover:text-mocha transition-colors flex items-center gap-2"
          >
            <span>←</span> Lihat Website
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 mt-2 flex items-center gap-2 transition-colors"
          >
            <span>⏻</span> Logout Sesi
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen relative">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-cream/30 to-transparent -z-0 pointer-events-none" />

        <div className="relative z-10 p-10 lg:p-16 max-w-7xl">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
