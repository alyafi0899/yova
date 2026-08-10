import React, { ReactNode } from 'react'
import type { Page } from '../../App'

interface AdminLayoutProps {
  children: ReactNode
  navigate: (page: Page) => void
  onLogout: () => void
}

export default function AdminLayout({ children, navigate, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-white/10">
          <div className="font-display text-xl">YOVA Admin</div>
          <div className="text-[10px] tracking-widest text-ivory/40 uppercase mt-1">Dashboard</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('admin-dresses')}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-sm"
          >
            Koleksi Baju
          </button>
          <button
            onClick={() => navigate('admin-orders')}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-sm"
          >
            Manajemen Order
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate('home')}
            className="w-full text-left px-4 py-2 text-sm text-ivory/60 hover:text-ivory"
          >
            Lihat Website →
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 mt-2"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
