import React from 'react'
import type { TemplateElement } from '../../../lib/invitation/types'

interface ElementInspectorProps {
  element: TemplateElement
  onUpdate: (updates: Partial<TemplateElement>) => void
}

const ElementInspector: React.FC<ElementInspectorProps> = ({ element, onUpdate }) => {
  const { style } = element

  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      style: {
        ...style,
        [key]: value
      }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Position */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Posisi (%)</label>
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1">
              <span className="text-[8px] text-muted uppercase font-bold">X</span>
              <input
                type="number"
                value={Math.round(style.position.x)}
                onChange={(e) => onUpdate({ style: { ...style, position: { ...style.position, x: parseInt(e.target.value) } } })}
                className="w-full bg-ivory border border-nude px-2 py-1 text-xs outline-none focus:border-mocha"
              />
           </div>
           <div className="space-y-1">
              <span className="text-[8px] text-muted uppercase font-bold">Y</span>
              <input
                type="number"
                value={Math.round(style.position.y)}
                onChange={(e) => onUpdate({ style: { ...style, position: { ...style.position, y: parseInt(e.target.value) } } })}
                className="w-full bg-ivory border border-nude px-2 py-1 text-xs outline-none focus:border-mocha"
              />
           </div>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-4">
         <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Ukuran (px)</label>
         <div className="flex items-center gap-4">
            <input
              type="range"
              min="20"
              max="500"
              value={typeof style.size.width === 'number' ? style.size.width : 100}
              onChange={(e) => handleStyleChange('size', { width: parseInt(e.target.value), height: parseInt(e.target.value) })}
              className="flex-1 accent-mocha"
            />
            <span className="text-[10px] font-mono w-8">{style.size.width}</span>
         </div>
      </div>

      {/* Rotation */}
      <div className="space-y-4">
         <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Rotasi (deg)</label>
         <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="360"
              value={style.rotation}
              onChange={(e) => handleStyleChange('rotation', parseInt(e.target.value))}
              className="flex-1 accent-mocha"
            />
            <span className="text-[10px] font-mono w-8">{style.rotation}°</span>
         </div>
      </div>

      {/* Opacity */}
      <div className="space-y-4">
         <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Transparansi</label>
         <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={style.opacity}
              onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
              className="flex-1 accent-mocha"
            />
            <span className="text-[10px] font-mono w-8">{Math.round(style.opacity * 100)}%</span>
         </div>
      </div>

      <div className="h-px bg-nude" />

      <button
        onClick={() => onUpdate({ locked: !element.locked })}
        className="w-full py-2 bg-ivory border border-nude text-[9px] font-bold uppercase tracking-widest hover:border-mocha transition-all"
      >
        {element.locked ? '🔓 Buka Kunci' : '🔒 Kunci Elemen'}
      </button>
    </div>
  )
}

export default ElementInspector
