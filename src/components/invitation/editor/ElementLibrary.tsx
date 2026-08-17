import React from 'react'
import type { ElementType } from '../../../lib/invitation/types'

interface ElementLibraryProps {
  onAdd: (type: ElementType, assetUrl?: string, content?: string) => void
}

const CATEGORIES = [
  { id: 'floral', label: 'Bunga & Daun', icon: '🌸' },
  { id: 'islamic', label: 'Ornamen Islami', icon: '🌙' },
  { id: 'shapes', label: 'Bentuk & Bingkai', icon: '▢' },
  { id: 'stickers', label: 'Stiker Lucu', icon: '✨' },
]

const ASSETS = {
  floral: [
    { name: 'Rose Gold', url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=100&h=100&fit=crop' },
    { name: 'Green Leaf', url: 'https://images.unsplash.com/photo-1545167622-3a6ac756aff4?w=100&h=100&fit=crop' },
  ],
  islamic: [
    { name: 'Mandala', content: '<svg>...</svg>' },
    { name: 'Mosque', content: '<svg>...</svg>' },
  ]
}

const ElementLibrary: React.FC<ElementLibraryProps> = ({ onAdd }) => {
  return (
    <div className="space-y-10">
      {CATEGORIES.map(cat => (
        <div key={cat.id} className="space-y-4">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <span>{cat.icon}</span> {cat.label}
           </h3>
           <div className="grid grid-cols-3 gap-3">
              {(ASSETS[cat.id as keyof typeof ASSETS] || []).map((asset, idx) => (
                <button
                  key={idx}
                  onClick={() => onAdd('decoration', asset.url, asset.content)}
                  className="aspect-square bg-ivory border border-nude hover:border-mocha transition-all overflow-hidden p-2 flex items-center justify-center group"
                  style={{ borderRadius: '2px' }}
                >
                   {asset.url ? (
                     <img src={asset.url} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="" />
                   ) : (
                     <div className="w-full h-full bg-mocha/10" />
                   )}
                </button>
              ))}

              {/* Empty placeholders */}
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-ivory/50 border border-nude border-dashed flex items-center justify-center opacity-20">
                   <span className="text-[8px]">Coming Soon</span>
                </div>
              ))}
           </div>
        </div>
      ))}
    </div>
  )
}

export default ElementLibrary
