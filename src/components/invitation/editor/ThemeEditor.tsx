import React from 'react'
import type { ThemeConfig } from '../../../lib/invitation/types'

interface ThemeEditorProps {
  theme: ThemeConfig
  onUpdate: (updates: Partial<ThemeConfig>) => void
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onUpdate }) => {
  const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    onUpdate({
      colors: {
        ...theme.colors,
        [key]: value
      }
    })
  }

  const handleFontChange = (key: keyof ThemeConfig['fonts'], value: string) => {
    onUpdate({
      fonts: {
        ...theme.fonts,
        [key]: value
      }
    })
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted">Palet Warna</h3>
        <div className="space-y-3">
          {[
            { label: 'Utama', key: 'primary', val: theme.colors.primary },
            { label: 'Aksen', key: 'accent', val: theme.colors.accent },
            { label: 'Background', key: 'background', val: theme.colors.background },
            { label: 'Teks', key: 'text', val: theme.colors.text },
          ].map(c => (
            <div key={c.key} className="flex items-center justify-between p-3 bg-ivory border border-nude rounded-sm">
               <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal">{c.label}</span>
               <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-muted">{c.val}</span>
                  <div className="relative w-6 h-6 rounded-full border border-nude overflow-hidden">
                    <input
                      type="color"
                      value={c.val}
                      onChange={(e) => handleColorChange(c.key as any, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-full h-full" style={{ background: c.val }} />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-nude" />

      {/* Typography */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted">Tipografi</h3>
        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[8px] font-bold uppercase tracking-widest text-muted">Heading Font</label>
              <select
                value={theme.fonts.heading}
                onChange={(e) => handleFontChange('heading', e.target.value)}
                className="w-full bg-ivory border border-nude px-3 py-2 text-xs outline-none focus:border-mocha"
              >
                <option>Playfair Display</option>
                <option>Lora</option>
                <option>Cinzel</option>
                <option>Great Vibes</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[8px] font-bold uppercase tracking-widest text-muted">Body Font</label>
              <select
                value={theme.fonts.body}
                onChange={(e) => handleFontChange('body', e.target.value)}
                className="w-full bg-ivory border border-nude px-3 py-2 text-xs outline-none focus:border-mocha"
              >
                <option>DM Sans</option>
                <option>Outfit</option>
                <option>Inter</option>
                <option>Montserrat</option>
              </select>
           </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeEditor
