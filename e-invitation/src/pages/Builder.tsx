import React, { useState, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS, type TemplateConfig } from '../components/TemplateRenderer'

// ─── Types ────────────────────────────────────────────────────────────────────
type SectionId = 'cover' | 'couple' | 'quote' | 'story' | 'event' | 'countdown' | 'gallery' | 'location' | 'rsvp' | 'gift' | 'wishes' | 'closing'
type LeftTab = 'sections' | 'add' | 'assets' | 'music'
type AddSubTab = 'text' | 'image' | 'elements' | 'stickers' | 'widgets'
type RightTab = 'content' | 'style' | 'animation'
type Device = 'mobile' | 'tablet' | 'desktop'
type SaveState = 'saved' | 'saving' | 'unsaved'

type Section = {
  id: SectionId
  label: string
  icon: string
  enabled: boolean
  required?: boolean
}

const ALL_SECTIONS: Section[] = [
  { id: 'cover',     label: 'Cover',     icon: '✦', enabled: true,  required: true },
  { id: 'couple',    label: 'Couple',    icon: '♡', enabled: true,  required: true },
  { id: 'quote',     label: 'Quote',     icon: '❝', enabled: true  },
  { id: 'story',     label: 'Story',     icon: '📖', enabled: false },
  { id: 'event',     label: 'Event',     icon: '📅', enabled: true,  required: true },
  { id: 'countdown', label: 'Countdown', icon: '⏱', enabled: true  },
  { id: 'gallery',   label: 'Gallery',   icon: '🖼', enabled: true  },
  { id: 'location',  label: 'Location',  icon: '📍', enabled: true  },
  { id: 'rsvp',      label: 'RSVP',      icon: '✉', enabled: true  },
  { id: 'gift',      label: 'Gift',      icon: '🎁', enabled: false },
  { id: 'wishes',    label: 'Wishes',    icon: '💌', enabled: true  },
  { id: 'closing',   label: 'Closing',   icon: '✿', enabled: true,  required: true },
]

// SVG decorative elements
const ELEMENTS = {
  Floral: [
    { id: 'f1', label: 'Rose Branch', svg: '<svg viewBox="0 0 60 60" fill="none"><ellipse cx="30" cy="20" rx="8" ry="14" fill="#D4829B" opacity=".7"/><path d="M30 34 Q20 50 10 58" stroke="#6B8C52" strokeWidth="2" fill="none"/><ellipse cx="18" cy="44" rx="5" ry="8" fill="#6B8C52" opacity=".5" transform="rotate(-30 18 44)"/></svg>' },
    { id: 'f2', label: 'Jasmine', svg: '<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="8" fill="#FFF8EE"/><path d="M30 10 Q30 20 30 22M50 30 Q40 30 38 30M30 50 Q30 40 30 38M10 30 Q20 30 22 30" stroke="#FAF0DC" strokeWidth="3"/></svg>' },
    { id: 'f3', label: 'Lotus', svg: '<svg viewBox="0 0 60 60" fill="none"><ellipse cx="30" cy="40" rx="25" ry="10" fill="#E8A4B8" opacity=".3"/><path d="M30 10 Q20 25 18 40Q24 35 30 38Q36 35 42 40Q40 25 30 10Z" fill="#E8A4B8" opacity=".7"/></svg>' },
    { id: 'f4', label: 'Peony', svg: '<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="12" fill="#D4829B" opacity=".6"/><circle cx="30" cy="30" r="8" fill="#E8A4B8" opacity=".8"/><circle cx="30" cy="30" r="4" fill="#FAF0DC"/></svg>' },
  ],
  Islamic: [
    { id: 'i1', label: 'Star Hex', svg: '<svg viewBox="0 0 60 60" fill="none"><polygon points="30,4 36,22 54,22 40,34 46,52 30,42 14,52 20,34 6,22 24,22" fill="#C9A84C" opacity=".6"/></svg>' },
    { id: 'i2', label: 'Arabesque', svg: '<svg viewBox="0 0 60 60" fill="none"><polygon points="30,2 58,17 58,43 30,58 2,43 2,17" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity=".7"/><circle cx="30" cy="30" r="8" fill="none" stroke="#C9A84C" strokeWidth="1" opacity=".5"/></svg>' },
    { id: 'i3', label: 'Crescent', svg: '<svg viewBox="0 0 60 60" fill="none"><path d="M38 15A18 18 0 1 0 38 45A12 12 0 1 1 38 15Z" fill="#C9A84C" opacity=".7"/></svg>' },
    { id: 'i4', label: 'Bismillah', svg: '<svg viewBox="0 0 80 30" fill="none"><text x="40" y="22" textAnchor="middle" fontFamily="Amiri" fontSize="18" fill="#1B3A4B" opacity=".8">بسم الله</text></svg>' },
  ],
  Frames: [
    { id: 'fr1', label: 'Thin Gold', svg: '<svg viewBox="0 0 60 80" fill="none"><rect x="3" y="3" width="54" height="74" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity=".6"/><rect x="8" y="8" width="44" height="64" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity=".4"/></svg>' },
    { id: 'fr2', label: 'Ornate', svg: '<svg viewBox="0 0 60 80" fill="none"><rect x="3" y="3" width="54" height="74" fill="none" stroke="#C9A84C" strokeWidth="1"/><circle cx="3" cy="3" r="3" fill="#C9A84C"/><circle cx="57" cy="3" r="3" fill="#C9A84C"/><circle cx="3" cy="77" r="3" fill="#C9A84C"/><circle cx="57" cy="77" r="3" fill="#C9A84C"/></svg>' },
  ],
  Shapes: [
    { id: 's1', label: 'Line', svg: '<svg viewBox="0 0 80 8" fill="none"><line x1="0" y1="4" x2="80" y2="4" stroke="#C9A84C" strokeWidth="1" opacity=".6"/></svg>' },
    { id: 's2', label: 'Diamond', svg: '<svg viewBox="0 0 30 30" fill="none"><polygon points="15,2 28,15 15,28 2,15" fill="#C9A84C" opacity=".5"/></svg>' },
    { id: 's3', label: 'Circle', svg: '<svg viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="12" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity=".6"/></svg>' },
  ],
}

const WIDGETS = [
  { id: 'countdown', icon: '⏱', name: 'Countdown', desc: 'Live countdown to wedding day' },
  { id: 'event-card', icon: '📅', name: 'Event Card', desc: 'Date, time, venue details' },
  { id: 'rsvp-form', icon: '✉', name: 'RSVP Form', desc: 'Guest attendance form' },
  { id: 'gallery', icon: '🖼', name: 'Gallery', desc: 'Photo grid or slider' },
  { id: 'maps', icon: '📍', name: 'Maps', desc: 'Embedded Google Maps' },
  { id: 'music', icon: '♪', name: 'Music Player', desc: 'Background music control' },
  { id: 'gift', icon: '🎁', name: 'Gift Registry', desc: 'Bank transfer & e-wallet' },
  { id: 'wishes', icon: '💌', name: 'Wishes Wall', desc: 'Guest messages display' },
]

const ANIMATIONS = {
  Entrance: ['Fade', 'Fade Up', 'Fade Down', 'Slide Left', 'Scale In', 'Blur In'],
  Decorative: ['Float', 'Sparkle', 'Petal Fall', 'Parallax', 'Pulse'],
  Section: ['Fade', 'Crossfade', 'Reveal', 'Curtain', 'Slide'],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopBar({ groomName, brideName, saveState, setSaveState, device, setDevice, onUndo, onRedo, canUndo, canRedo, onPreview, template }:
  { groomName: string; brideName: string; saveState: SaveState; setSaveState: (s: SaveState) => void; device: Device; setDevice: (d: Device) => void; onUndo: () => void; onRedo: () => void; canUndo: boolean; canRedo: boolean; onPreview: () => void; template: TemplateConfig }) {
  const save = () => { setSaveState('saving'); setTimeout(() => setSaveState('saved'), 700) }

  return (
    <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0 z-30" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E3DC', minHeight: 52 }}>
      {/* Left */}
      <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors mr-2 flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="hidden lg:block">Dashboard</span>
      </Link>
      <div className="h-4 w-px bg-stone-200 flex-shrink-0" />
      {/* Invitation name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: template.accentColor }} />
        <span className="text-sm font-medium text-stone-700 truncate max-w-36">{groomName} &amp; {brideName}</span>
        <span className="text-xs px-1.5 py-0.5 rounded hidden md:block flex-shrink-0" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{template.name}</span>
      </div>
      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button onClick={onUndo} disabled={!canUndo} className="w-7 h-7 rounded-md flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-stone-100" title="Undo">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 5H8a4 4 0 1 1 0 8H6" stroke="#5C4A2A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 5L5 2M2 5l3 3" stroke="#5C4A2A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="w-7 h-7 rounded-md flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-stone-100" title="Redo">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11 5H5a4 4 0 1 0 0 8h2" stroke="#5C4A2A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 5L8 2m3 3l-3 3" stroke="#5C4A2A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="h-4 w-px bg-stone-200 flex-shrink-0" />
      {/* Device */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg flex-shrink-0" style={{ background: '#F5EFE6' }}>
        {(['mobile', 'tablet', 'desktop'] as Device[]).map(d => (
          <button key={d} onClick={() => setDevice(d)} className="w-7 h-6 rounded-md flex items-center justify-center transition-all text-sm" style={device === d ? { background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { opacity: 0.5 }} title={d}>
            {d === 'mobile' ? '📱' : d === 'tablet' ? '📱' : '🖥'}
          </button>
        ))}
      </div>
      <div className="h-4 w-px bg-stone-200 flex-shrink-0" />
      {/* Save status */}
      <span className="text-[11px] hidden md:block flex-shrink-0" style={{ color: saveState === 'saving' ? '#9B7B2A' : saveState === 'saved' ? '#5C9B5E' : '#9B5C5C', minWidth: 80 }}>
        {saveState === 'saving' ? '⟳ Menyimpan…' : saveState === 'saved' ? '✓ Tersimpan' : '● Belum disimpan'}
      </span>
      <button onClick={save} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-stone-50 flex-shrink-0" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
        Simpan
      </button>
      <button onClick={onPreview} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex-shrink-0" style={{ borderColor: '#1B3A4B', color: '#1B3A4B' }}>
        Preview
      </button>
      <Link to="/publish" className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
        Publish →
      </Link>
    </div>
  )
}

// Left sidebar tabs
function LeftSections({ sections, setSections, activeSection, setActiveSection }: {
  sections: Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
  activeSection: SectionId | null
  setActiveSection: (id: SectionId | null) => void
}) {
  const [drag, setDrag] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)

  const drop = (targetId: string) => {
    if (!drag || drag === targetId) return
    setSections((prev: Section[]) => {
      const arr = [...prev]
      const fi = arr.findIndex(s => s.id === drag)
      const ti = arr.findIndex(s => s.id === targetId)
      const [item] = arr.splice(fi, 1)
      arr.splice(ti, 0, item)
      return arr
    })
    setDrag(null); setOver(null)
  }

  const toggle = (id: string) => setSections((prev: Section[]) => prev.map(s => s.id === id && !s.required ? { ...s, enabled: !s.enabled } : s))

  return (
    <div className="flex-1 overflow-y-auto py-2">
      <p className="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Sections</p>
      {sections.map(s => (
        <div
          key={s.id}
          draggable={!s.required}
          onDragStart={() => setDrag(s.id)}
          onDragOver={e => { e.preventDefault(); setOver(s.id) }}
          onDrop={() => drop(s.id)}
          onDragEnd={() => { setDrag(null); setOver(null) }}
          onClick={() => setActiveSection(activeSection === s.id ? null : s.id as SectionId)}
          className={`group flex items-center gap-2 mx-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all mb-0.5 ${over === s.id ? 'ring-1 ring-amber-300' : ''} ${drag === s.id ? 'opacity-30' : ''}`}
          style={activeSection === s.id ? { background: '#F5EFE6' } : {}}
        >
          {!s.required && <span className="text-stone-200 group-hover:text-stone-400 text-xs cursor-grab select-none" style={{ fontFamily: 'monospace', letterSpacing: '-2px' }}>⠿</span>}
          {s.required && <span className="w-3 flex-shrink-0" />}
          <span className="text-sm w-4 text-center flex-shrink-0">{s.icon}</span>
          <span className="text-xs flex-1 truncate font-medium" style={{ color: s.enabled ? '#2C2416' : '#C0B8B0' }}>{s.label}</span>
          {!s.required && (
            <button onClick={e => { e.stopPropagation(); toggle(s.id) }} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: s.enabled ? '#C9A84C' : '#D0C8BA' }} title={s.enabled ? 'Hide' : 'Show'} />
          )}
        </div>
      ))}
      <button className="flex items-center gap-2 mx-2 mt-3 px-2.5 py-2 rounded-lg border-2 border-dashed text-xs text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors w-[calc(100%-1rem)]" style={{ borderColor: '#E0D9CF' }}>
        <span>+</span> Tambah Section
      </button>
    </div>
  )
}

function LeftAdd({ sub, setSub }: { sub: AddSubTab; setSub: (t: AddSubTab) => void }) {
  const [elemCategory, setElemCategory] = useState<keyof typeof ELEMENTS>('Floral')
  const [addedWidget, setAddedWidget] = useState<string | null>(null)

  if (sub === 'elements') return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex gap-1 p-2 pb-1 flex-wrap">
        {(Object.keys(ELEMENTS) as Array<keyof typeof ELEMENTS>).map(cat => (
          <button key={cat} onClick={() => setElemCategory(cat)} className="px-2.5 py-1 rounded-full text-[10px] transition-all" style={elemCategory === cat ? { background: '#1B3A4B', color: '#FAF8F4' } : { background: '#F5EFE6', color: '#5C4A2A' }}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        {ELEMENTS[elemCategory].map(el => (
          <button key={el.id} className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 p-2 text-center border hover:border-amber-300 hover:bg-amber-50/30 transition-all group" style={{ background: '#FAFAF8', borderColor: '#E0D9CF' }}>
            <div className="w-10 h-10 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: el.svg }} />
            <span className="text-[9px] text-stone-400 group-hover:text-stone-600 transition-colors">{el.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  if (sub === 'stickers') return (
    <div className="flex-1 overflow-y-auto p-3">
      <p className="text-xs text-stone-400 mb-3">Wedding stickers & icons</p>
      <div className="grid grid-cols-4 gap-2">
        {['💒', '💐', '🌹', '🕊️', '💍', '🎊', '✨', '🌸', '🌺', '💖', '🕌', '☽', '⭐', '🌙', '🌿', '🍃', '🌾', '🏵️', '🌼', '🌻'].map(s => (
          <button key={s} className="aspect-square rounded-xl flex items-center justify-center text-xl hover:bg-amber-50 hover:scale-110 transition-all border" style={{ borderColor: '#F0EBE3' }}>{s}</button>
        ))}
      </div>
    </div>
  )

  if (sub === 'widgets') return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {WIDGETS.map(w => (
        <button key={w.id} onClick={() => { setAddedWidget(w.id); setTimeout(() => setAddedWidget(null), 1500) }} className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-amber-300 hover:shadow-sm group" style={{ background: '#FAFAF8', borderColor: '#E0D9CF' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#F5EFE6' }}>{w.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-stone-700">{w.name}</div>
            <div className="text-[10px] text-stone-400 mt-0.5 leading-snug">{w.desc}</div>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100" style={{ background: addedWidget === w.id ? '#5C9B5E' : '#1B3A4B', color: '#FAF8F4' }}>
            {addedWidget === w.id ? '✓' : '+ Add'}
          </span>
        </button>
      ))}
    </div>
  )

  if (sub === 'text') return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {[
        { label: 'Display Heading', style: { fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1B3A4B' }, desc: 'DM Serif Display · 22' },
        { label: 'Section Title', style: { fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }, desc: 'DM Serif Display · 16' },
        { label: 'Body Text', style: { fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#5C4A2A' }, desc: 'Outfit · 13' },
        { label: 'Caption', style: { fontFamily: 'Outfit, sans-serif', fontSize: 10, color: '#9B8E7A', letterSpacing: '0.1em', textTransform: 'uppercase' as const }, desc: 'Outfit · 10 · Uppercase' },
        { label: 'Arabic', style: { fontFamily: 'Amiri, serif', fontSize: 18, color: '#9B7B2A', direction: 'rtl' as const }, desc: 'Amiri · 18' },
      ].map(t => (
        <button key={t.label} className="w-full p-3 rounded-xl border text-left hover:border-amber-300 hover:shadow-sm transition-all" style={{ background: '#FAFAF8', borderColor: '#E0D9CF' }}>
          <div style={t.style}>{t.label}</div>
          <div className="text-[9px] text-stone-300 mt-1">{t.desc}</div>
        </button>
      ))}
    </div>
  )

  // image
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#C9A84C44' }}>
        <div className="text-3xl mb-2">📷</div>
        <div className="text-sm font-medium text-stone-600 mb-1">Upload Photo</div>
        <div className="text-xs text-stone-400">JPG, PNG, WEBP · Max 5MB</div>
      </div>
      <div>
        <p className="text-xs text-stone-400 mb-2">Recently Uploaded</p>
        <div className="grid grid-cols-2 gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" style={{ background: '#F5EFE6' }}>
              <img src="https://images.unsplash.com/photo-1779501678407-c212cd23af9f?w=120&h=120&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LeftAssets() {
  const [tab, setTab] = useState<'photos' | 'decorations' | 'frames' | 'upload'>('decorations')
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex border-b p-2 gap-1 flex-wrap" style={{ borderColor: '#E0D9CF' }}>
        {(['upload', 'photos', 'decorations', 'frames'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-2 py-1 rounded-lg text-[10px] capitalize transition-all" style={tab === t ? { background: '#1B3A4B', color: '#FAF8F4' } : { color: '#5C4A2A' }}>{t}</button>
        ))}
      </div>
      {tab === 'upload' && (
        <div className="p-3">
          <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#C9A84C44' }}>
            <div className="text-3xl mb-2">⬆</div>
            <div className="text-sm text-stone-500">Upload Asset</div>
            <div className="text-xs text-stone-300 mt-1">SVG, PNG, JPG</div>
          </div>
        </div>
      )}
      {tab !== 'upload' && (
        <div className="grid grid-cols-2 gap-2 p-3">
          {(tab === 'decorations' ? ELEMENTS.Floral : tab === 'frames' ? ELEMENTS.Frames : ELEMENTS.Islamic).map(el => (
            <div key={el.id} className="aspect-square rounded-xl flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-colors border" style={{ background: '#FAFAF8', borderColor: '#E0D9CF' }}>
              <div className="w-10 h-10" dangerouslySetInnerHTML={{ __html: el.svg }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LeftMusic() {
  const [playing, setPlaying] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const [vol, setVol] = useState(70)
  const [selected, setSelected] = useState(0)

  const tracks = [
    { title: 'Shalawat Badar', artist: 'Tradisional', dur: '3:42' },
    { title: 'Ya Nabi Salam', artist: 'Maher Zain', dur: '4:15' },
    { title: 'Maulaya', artist: 'Mestica', dur: '3:58' },
    { title: 'Tasyakuran', artist: 'Instrumental', dur: '5:20' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Background Music</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="sr-only peer" />
          <div className="w-8 h-4 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" style={{ background: enabled ? '#C9A84C' : '#D0C8BA' }} />
        </label>
      </div>
      {enabled && (
        <>
          <div className="p-4 rounded-xl" style={{ background: '#F5EFE6' }}>
            <div className="text-xs font-medium text-stone-700 mb-1">{tracks[selected].title}</div>
            <div className="text-[10px] text-stone-400 mb-3">{tracks[selected].artist} · {tracks[selected].dur}</div>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setPlaying(!playing)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
                {playing ? '⏸' : '▶'}
              </button>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#D0C8BA' }}>
                <div className="h-1 rounded-full w-1/3" style={{ background: '#C9A84C' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400">🔈</span>
              <input type="range" min={0} max={100} value={vol} onChange={e => setVol(+e.target.value)} className="flex-1 h-1 accent-amber-500" />
              <span className="text-[10px] text-stone-400">{vol}%</span>
            </div>
          </div>
          <div className="space-y-1">
            {tracks.map((t, i) => (
              <button key={t.title} onClick={() => setSelected(i)} className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all" style={selected === i ? { background: '#F5EFE6' } : {}}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: selected === i ? '#1B3A4B' : '#E8E3DC', color: selected === i ? '#C9A84C' : '#9B8E7A' }}>
                  {selected === i && playing ? '♪' : (i + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-stone-700 truncate">{t.title}</div>
                  <div className="text-[10px] text-stone-400">{t.artist}</div>
                </div>
                <span className="text-[10px] text-stone-400">{t.dur}</span>
              </button>
            ))}
          </div>
          <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#C9A84C44' }}>
            <div className="text-xs text-stone-400">Upload track (MP3, AAC)</div>
          </div>
        </>
      )}
    </div>
  )
}

// Right panel
type SelectedEl = 'text' | 'image' | 'element' | 'widget' | 'section' | null

function RightPanel({ selected, activeSection, data, onChange, config, onConfigChange, rightTab, setRightTab }: {
  selected: SelectedEl
  activeSection: SectionId | null
  data: any
  onChange: (k: string, v: string) => void
  config: TemplateConfig
  onConfigChange: (u: Partial<TemplateConfig>) => void
  rightTab: RightTab
  setRightTab: (t: RightTab) => void
}) {
  const iS = { border: '1px solid #E0D9CF', background: '#FAF8F4' }
  const iC = "w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
  const lC = "block text-[10px] text-stone-400 mb-1 font-medium uppercase tracking-wide"

  const inp = (label: string, key: string, placeholder?: string) => (
    <div>
      <label className={lC}>{label}</label>
      <input className={iC} style={iS} value={data[key] || ''} onChange={e => onChange(key, e.target.value)} placeholder={placeholder} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#E0D9CF' }}>
        {(['content', 'style', 'animation'] as RightTab[]).map(t => (
          <button key={t} onClick={() => setRightTab(t)} className="flex-1 py-2.5 text-xs font-medium capitalize transition-colors" style={rightTab === t ? { borderBottom: `2px solid #C9A84C`, color: '#1B3A4B', marginBottom: -1 } : { color: '#9B8E7A' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {rightTab === 'content' && (
          <>
            {/* Cover / Opening */}
            {(!activeSection || activeSection === 'cover') && (
              <>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Cover</p>
                {inp('Nama Pengantin Pria', 'groomName', 'Al Yafi')}
                {inp('Nama Pengantin Wanita', 'brideName', 'Yova')}
                {inp('Tanggal Pernikahan', 'weddingDate', '10 Januari 2027')}
                <div>
                  <label className={lC}>Teks Pembuka</label>
                  <textarea className={iC} style={{ ...iS, resize: 'none' }} rows={3} value={data.openingText || ''} onChange={e => onChange('openingText', e.target.value)} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
              </>
            )}
            {activeSection === 'couple' && (
              <>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Couple</p>
                {inp('Nama Pria', 'groomName', 'Al Yafi')}
                {inp('Nama Lengkap Pria', 'groomFull', 'Muhammad Al Yafi')}
                {inp('Ayah Pria', 'groomFather', 'Bapak Rizal')}
                {inp('Ibu Pria', 'groomMother', 'Ibu Mariana')}
                {inp('Nama Wanita', 'brideName', 'Yova')}
                {inp('Nama Lengkap Wanita', 'brideFull', 'Yova Rahmadani')}
                {inp('Ayah Wanita', 'brideFather', 'Bapak Hendra')}
                {inp('Ibu Wanita', 'brideMother', 'Ibu Sari')}
              </>
            )}
            {activeSection === 'event' && (
              <>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Akad Nikah</p>
                {inp('Tanggal', 'akadDate', '10 Januari 2027')}
                {inp('Waktu', 'akadTime', '08.00 – 10.00 WIB')}
                {inp('Venue', 'akadVenue', 'Masjid Raya Baiturrahman')}
                {inp('Alamat', 'akadAddress', 'Banda Aceh')}
                {inp('Google Maps URL', 'akadMaps', 'https://maps.google.com/...')}
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider pt-2 border-t" style={{ borderColor: '#E0D9CF' }}>Resepsi</p>
                {inp('Waktu', 'receptionTime', '11.00 – 16.00 WIB')}
                {inp('Venue', 'receptionVenue', 'Hotel Hermes Palace')}
                {inp('Alamat', 'receptionAddress', 'Banda Aceh')}
              </>
            )}
            {activeSection === 'quote' && (
              <>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Quote / Ayat</p>
                {['QS. Ar-Rum: 21', 'QS. Adz-Dzariyat: 49', 'QS. An-Nahl: 72'].map((q, i) => (
                  <button key={q} className="w-full p-3 rounded-xl border text-left text-xs transition-all" style={{ background: i === 0 ? '#F5EFE6' : '#FAFAF8', borderColor: i === 0 ? '#C9A84C' : '#E0D9CF', color: '#5C4A2A' }}>{q}</button>
                ))}
              </>
            )}
            {activeSection === 'gallery' && (
              <>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Gallery</p>
                <div>
                  <label className={lC}>Layout</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Grid', 'Masonry', 'Slider', 'Full-Width'].map(l => (
                      <button key={l} className="py-2 rounded-lg text-xs border transition-colors" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-amber-50/30 transition-colors text-xs text-stone-400" style={{ borderColor: '#C9A84C44' }}>📷 Upload Foto</div>
              </>
            )}
            {activeSection === 'rsvp' && (
              <>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">RSVP</p>
                <div>
                  <label className={lC}>Batas RSVP</label>
                  <input type="date" className={iC} style={iS} defaultValue="2027-01-08" onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
                {['Nama Tamu', 'Status Kehadiran', 'Jumlah Tamu', 'Ucapan'].map(f => (
                  <div key={f} className="flex items-center justify-between">
                    <span className="text-xs text-stone-600">{f}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-7 h-3.5 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:after:translate-x-3.5" style={{ background: '#C9A84C' }} />
                    </label>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {rightTab === 'style' && (
          <>
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Template</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TEMPLATE_CONFIGS).map(t => (
                <button key={t.id} onClick={() => onConfigChange(t)} className="p-2.5 rounded-xl text-left transition-all" style={{ background: t.bgColor, border: config.id === t.id ? `2px solid ${t.accentColor}` : '1px solid #E0D9CF' }}>
                  <div className="flex gap-1 mb-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: t.primaryColor }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: t.accentColor }} />
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: t.primaryColor }}>{t.name}</div>
                </button>
              ))}
            </div>
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#E0D9CF' }}>
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Warna Kustom</p>
              {([['Utama', 'primaryColor'], ['Aksen', 'accentColor'], ['Background', 'bgColor']] as [string, keyof TemplateConfig][]).map(([lbl, key]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className={lC}>{lbl}</label>
                    <input className={`${iC} font-mono`} style={iS} value={config[key] as string} onChange={e => onConfigChange({ [key]: e.target.value })} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                  </div>
                  <div className="mt-4 relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-lg border cursor-pointer" style={{ background: config[key] as string, borderColor: '#E0D9CF' }} />
                    <input type="color" value={config[key] as string} onChange={e => onConfigChange({ [key]: e.target.value })} className="absolute inset-0 opacity-0 w-9 h-9 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#E0D9CF' }}>
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Typography</p>
              <div>
                <label className={lC}>Heading Font</label>
                <select className={`${iC} cursor-pointer`} style={iS} value={config.fontHeading} onChange={e => onConfigChange({ fontHeading: e.target.value })}>
                  {['DM Serif Display', 'Lora', 'Playfair Display'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={lC}>Ornament Style</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['geometric', 'floral', 'batik', 'minimal', 'none'] as const).map(o => (
                    <button key={o} onClick={() => onConfigChange({ ornamentStyle: o })} className="py-1.5 rounded-lg text-[10px] border capitalize transition-all" style={config.ornamentStyle === o ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#5C4A2A' }}>{o}</button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {rightTab === 'animation' && (
          <div className="space-y-4">
            {(Object.entries(ANIMATIONS) as [string, string[]][]).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-2">{cat}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {items.map(anim => (
                    <button key={anim} className="py-2 rounded-lg text-[10px] border transition-all hover:border-amber-300 hover:bg-amber-50/30" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>{anim}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t space-y-3" style={{ borderColor: '#E0D9CF' }}>
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Controls</p>
              {[['Duration', '0.6s'], ['Delay', '0s'], ['Intensity', 'Medium']].map(([lbl, val]) => (
                <div key={lbl}>
                  <label className={lC}>{lbl}</label>
                  <select className={`${iC} cursor-pointer`} style={iS} defaultValue={val}>
                    {lbl === 'Duration' && ['0.3s', '0.6s', '0.9s', '1.2s', '2s'].map(v => <option key={v}>{v}</option>)}
                    {lbl === 'Delay' && ['0s', '0.1s', '0.2s', '0.3s', '0.5s'].map(v => <option key={v}>{v}</option>)}
                    {lbl === 'Intensity' && ['Subtle', 'Medium', 'Strong'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Bottom section navigator
function BottomNav({ sections, activeSection, setActiveSection }: {
  sections: Section[]
  activeSection: SectionId | null
  setActiveSection: (id: SectionId) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = sections.filter(s => s.enabled)

  return (
    <div ref={ref} className="flex items-center gap-2 px-4 py-2 overflow-x-auto flex-shrink-0" style={{ background: '#FFFFFF', borderTop: '1px solid #E8E3DC', scrollbarWidth: 'none', minHeight: 64 }}>
      <span className="text-[10px] text-stone-300 uppercase tracking-widest flex-shrink-0">Sections</span>
      {enabled.map(s => (
        <button
          key={s.id}
          onClick={() => setActiveSection(s.id as SectionId)}
          className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all border"
          style={activeSection === s.id
            ? { background: '#F5EFE6', borderColor: '#C9A84C', color: '#1B3A4B' }
            : { background: '#FAFAF8', borderColor: '#E0D9CF', color: '#9B8E7A' }}
        >
          <span className="text-sm">{s.icon}</span>
          <span className="text-[9px] font-medium">{s.label}</span>
        </button>
      ))}
      <button className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-dashed transition-all text-stone-300 hover:text-stone-500 hover:border-stone-300" style={{ borderColor: '#E0D9CF' }}>
        <span className="text-sm">+</span>
        <span className="text-[9px]">Add</span>
      </button>
    </div>
  )
}

// Canvas / Preview area
function Canvas({ config, data, device, activeSection }: { config: TemplateConfig; data: any; device: Device; activeSection: SectionId | null }) {
  const frames = {
    mobile:  { w: 280, h: 560, r: '2.2rem', border: 7 },
    tablet:  { w: 420, h: 580, r: '1.5rem', border: 5 },
    desktop: { w: 640, h: 520, r: '0.75rem', border: 3 },
  }
  const f = frames[device]

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-4 overflow-auto" style={{ background: '#EDE8E0' }}>
      {/* Shadow glow */}
      <div className="relative" style={{ width: f.w + f.border * 2, flexShrink: 0 }}>
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ borderRadius: f.r, border: `${f.border}px solid #374151`, width: f.w + f.border * 2, height: f.h + f.border * 2, background: config.bgColor }}>
          {device === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl z-20" style={{ background: '#374151' }} />}
          {device === 'desktop' && (
            <div className="flex items-center gap-1.5 px-3 py-2 z-10 relative" style={{ background: '#374151' }}>
              <div className="w-2 h-2 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-2 px-2 py-0.5 rounded text-[9px]" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>nikahku.id/i/yafi-yova</div>
            </div>
          )}
          <div className="w-full overflow-y-auto" style={{ height: device === 'desktop' ? f.h - 28 : f.h, scrollbarWidth: 'none' }}>
            <TemplateRenderer
              key={`${config.id}-${JSON.stringify(data).slice(0, 100)}`}
              config={config}
              data={{ ...data, groomParents: `Putra dari ${data.groomFather || '...'} & ${data.groomMother || '...'}`, brideParents: `Putri dari ${data.brideFather || '...'} & ${data.brideMother || '...'}` }}
              showOpening={false}
            />
          </div>
        </div>
        {/* Bottom bar for mobile */}
        {device === 'mobile' && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-stone-600" />}
      </div>
      <p className="mt-5 text-[10px] text-stone-400 flex items-center gap-1.5">
        <span style={{ background: '#C9A84C', width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }} />
        Preview diperbarui secara real-time
      </p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Builder() {
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template') || 'noura'

  const [config, setConfig] = useState<TemplateConfig>(TEMPLATE_CONFIGS[templateId] || TEMPLATE_CONFIGS.noura)
  const [sections, setSections] = useState<Section[]>(ALL_SECTIONS)
  const [activeSection, setActiveSection] = useState<SectionId | null>('couple')
  const [leftTab, setLeftTab] = useState<LeftTab>('sections')
  const [addSubTab, setAddSubTab] = useState<AddSubTab>('elements')
  const [rightTab, setRightTab] = useState<RightTab>('content')
  const [device, setDevice] = useState<Device>('mobile')
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [previewOpen, setPreviewOpen] = useState(false)

  const [history, setHistory] = useState<any[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const [data, setData] = useState({
    groomName: 'Al Yafi', brideName: 'Yova',
    weddingDate: '10 Januari 2027',
    openingText: 'Bismillahirrahmanirrahim. Dengan memohon ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
    groomFull: 'Muhammad Al Yafi', brideFull: 'Yova Rahmadani',
    groomFather: 'Bapak Rizal', groomMother: 'Ibu Mariana',
    brideFather: 'Bapak Hendra', brideMother: 'Ibu Sari',
    akadVenue: 'Masjid Raya Baiturrahman', akadTime: '08.00 – 10.00 WIB',
    receptionVenue: 'Hotel Hermes Palace', receptionTime: '11.00 – 16.00 WIB',
  })

  const handleDataChange = useCallback((key: string, value: string) => {
    setData(prev => {
      const next = { ...prev, [key]: value }
      setHistory(h => [...h.slice(0, historyIdx + 1), next])
      setHistoryIdx(i => i + 1)
      return next
    })
    setSaveState('unsaved')
  }, [historyIdx])

  const handleConfigChange = useCallback((updates: Partial<TemplateConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
    setSaveState('unsaved')
  }, [])

  const undo = () => { if (historyIdx > 0) { setHistoryIdx(i => i - 1); setData(history[historyIdx - 1]) } }
  const redo = () => { if (historyIdx < history.length - 1) { setHistoryIdx(i => i + 1); setData(history[historyIdx + 1]) } }

  const LEFT_TABS: { id: LeftTab; icon: string; label: string }[] = [
    { id: 'sections', icon: '⊞', label: 'Sections' },
    { id: 'add', icon: '+', label: 'Add' },
    { id: 'assets', icon: '🗂', label: 'Assets' },
    { id: 'music', icon: '♪', label: 'Music' },
  ]

  const ADD_TABS: { id: AddSubTab; icon: string }[] = [
    { id: 'text', icon: 'T' },
    { id: 'image', icon: '🖼' },
    { id: 'elements', icon: '✦' },
    { id: 'stickers', icon: '😊' },
    { id: 'widgets', icon: '⚙' },
  ]

  return (
    <div className="h-screen flex flex-col" style={{ fontFamily: 'Outfit, sans-serif', background: '#FAF8F4' }}>
      {/* Top bar */}
      <TopBar
        groomName={data.groomName} brideName={data.brideName}
        saveState={saveState} setSaveState={setSaveState}
        device={device} setDevice={setDevice}
        onUndo={undo} onRedo={redo}
        canUndo={historyIdx > 0} canRedo={historyIdx < history.length - 1}
        onPreview={() => setPreviewOpen(true)}
        template={config}
      />

      {/* Main 3-column */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-52 flex-shrink-0 flex flex-col" style={{ background: '#FFFFFF', borderRight: '1px solid #E8E3DC' }}>
          {/* Tab icons */}
          <div className="flex border-b flex-shrink-0" style={{ borderColor: '#E8E3DC' }}>
            {LEFT_TABS.map(t => (
              <button key={t.id} onClick={() => setLeftTab(t.id)} className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors" style={leftTab === t.id ? { color: '#1B3A4B', borderBottom: '2px solid #C9A84C' } : { color: '#B0A898' }} title={t.label}>
                <span className="text-base leading-none">{t.icon}</span>
                <span className="text-[8px] tracking-wide">{t.label}</span>
              </button>
            ))}
          </div>

          {leftTab === 'sections' && (
            <LeftSections sections={sections} setSections={setSections} activeSection={activeSection} setActiveSection={setActiveSection} />
          )}
          {leftTab === 'add' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex gap-1 p-2 border-b flex-shrink-0" style={{ borderColor: '#E8E3DC' }}>
                {ADD_TABS.map(t => (
                  <button key={t.id} onClick={() => setAddSubTab(t.id)} className="flex-1 py-1.5 rounded-lg text-sm transition-all" style={addSubTab === t.id ? { background: '#F5EFE6', color: '#1B3A4B' } : { color: '#B0A898' }} title={t.id}>
                    {t.icon}
                  </button>
                ))}
              </div>
              <LeftAdd sub={addSubTab} setSub={setAddSubTab} />
            </div>
          )}
          {leftTab === 'assets' && <LeftAssets />}
          {leftTab === 'music' && <LeftMusic />}
        </aside>

        {/* Canvas */}
        <Canvas config={config} data={data} device={device} activeSection={activeSection} />

        {/* Right panel */}
        <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: '#FFFFFF', borderLeft: '1px solid #E8E3DC' }}>
          <RightPanel
            selected={null}
            activeSection={activeSection}
            data={data}
            onChange={handleDataChange}
            config={config}
            onConfigChange={handleConfigChange}
            rightTab={rightTab}
            setRightTab={setRightTab}
          />
        </aside>
      </div>

      {/* Bottom section nav */}
      <BottomNav sections={sections} activeSection={activeSection} setActiveSection={s => { setActiveSection(s); setRightTab('content') }} />

      {/* Full-screen preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#1A1A1A' }}>
          <div className="flex items-center justify-center gap-3 py-3 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.6)' }}>
            {(['mobile', 'tablet', 'desktop'] as Device[]).map(d => (
              <button key={d} onClick={() => setDevice(d)} className="px-4 py-1.5 rounded-full text-xs capitalize transition-all" style={device === d ? { background: '#C9A84C', color: '#1B3A4B', fontWeight: 600 } : { border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>{d}</button>
            ))}
            <div className="w-px h-4 mx-2" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <Link to="/publish" className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#C9A84C', color: '#1B3A4B' }}>Publish</Link>
            <button onClick={() => setPreviewOpen(false)} className="px-4 py-1.5 rounded-full text-xs border transition-colors" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}>✕ Close Preview</button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            <Canvas config={config} data={data} device={device} activeSection={null} />
          </div>
        </div>
      )}
    </div>
  )
}
