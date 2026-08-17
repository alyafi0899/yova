import React from 'react'
import type { TemplateSection, SectionType } from '../../../lib/invitation/types'

interface SectionManagerProps {
  sections: TemplateSection[]
  onAdd: (type: SectionType) => void
  onRemove: (id: string) => void
  onReorder: (id: string, direction: 'up' | 'down') => void
  onSelect: (id: string) => void
  activeId?: string
}

const SECTION_TEMPLATES: { type: SectionType; label: string; icon: string }[] = [
  { type: 'cover', label: 'Cover', icon: '✦' },
  { type: 'couple', label: 'Mempelai', icon: '♡' },
  { type: 'story', label: 'Cerita', icon: '📖' },
  { type: 'event', label: 'Acara', icon: '📅' },
  { type: 'gallery', label: 'Galeri', icon: '🖼' },
  { type: 'rsvp', label: 'RSVP', icon: '✉' },
  { type: 'wishes', label: 'Ucapan', icon: '💌' },
  { type: 'closing', label: 'Penutup', icon: '🏁' },
]

const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  onAdd,
  onRemove,
  onReorder,
  onSelect,
  activeId
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted">Urutan Seksi</h3>
        <div className="space-y-2">
          {sections.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group flex items-center justify-between p-3 border transition-all cursor-pointer ${
                activeId === s.id ? 'bg-mocha text-ivory border-mocha' : 'bg-white text-charcoal border-nude hover:border-mocha'
              }`}
              style={{ borderRadius: '2px' }}
            >
               <div className="flex items-center gap-3">
                  <span className="text-[10px] opacity-40 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{s.title || s.type}</span>
               </div>
               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onReorder(s.id, 'up') }} className="p-1 hover:bg-black/10 rounded">↑</button>
                  <button onClick={(e) => { e.stopPropagation(); onReorder(s.id, 'down') }} className="p-1 hover:bg-black/10 rounded">↓</button>
                  <button onClick={(e) => { e.stopPropagation(); onRemove(s.id) }} className="p-1 hover:text-red-500 rounded text-xs">✕</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-nude" />

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted">Tambah Seksi</h3>
        <div className="grid grid-cols-2 gap-2">
          {SECTION_TEMPLATES.map(t => (
            <button
              key={t.type}
              onClick={() => onAdd(t.type)}
              className="p-3 bg-ivory border border-nude hover:border-mocha hover:text-mocha transition-all flex flex-col items-center gap-2"
              style={{ borderRadius: '2px' }}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SectionManager
