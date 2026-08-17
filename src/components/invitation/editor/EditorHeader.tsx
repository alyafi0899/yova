import React from 'react'
import { Link } from 'react-router-dom'

interface EditorHeaderProps {
  title: string
  subtitle?: string
  saveStatus: 'saved' | 'saving' | 'unsaved'
  onSave: () => void
  onPublish: () => void
  isAdmin?: boolean
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  subtitle,
  saveStatus,
  onSave,
  onPublish,
  isAdmin
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-nude flex-shrink-0 z-30">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-muted hover:text-charcoal transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-sm font-bold text-charcoal uppercase tracking-widest">{title}</h1>
          {subtitle && <p className="text-[10px] text-muted font-bold uppercase tracking-tight">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            saveStatus === 'saved' ? 'bg-emerald-500' :
            saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            {saveStatus === 'saved' ? 'Tersimpan' : saveStatus === 'saving' ? 'Menyimpan...' : 'Perubahan Belum Disimpan'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="px-5 py-2 border border-nude text-charcoal text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ivory transition-all"
            style={{ borderRadius: '2px' }}
          >
            Simpan
          </button>
          <button
            onClick={onPublish}
            className="px-6 py-2 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-mocha-dark transition-all"
            style={{ borderRadius: '2px' }}
          >
            {isAdmin ? 'Publikasikan Template' : 'Publikasikan Undangan'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default EditorHeader
