import React from 'react'

interface PropertyInspectorProps {
  selection: { type: 'section' | 'element' | 'widget'; id: string } | null
  onUpdate: (updates: any) => void
  children: React.ReactNode
}

const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  selection,
  children
}) => {
  if (!selection) {
    return (
      <aside className="w-80 flex flex-shrink-0 bg-white border-l border-nude p-10 text-center items-center justify-center">
        <div className="space-y-4">
          <p className="text-[32px] opacity-20">✎</p>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">
            Pilih elemen pada kanvas untuk melihat pengaturannya
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-80 flex flex-shrink-0 bg-white border-l border-nude overflow-y-auto custom-scrollbar z-20">
      <div className="p-6 space-y-8 w-full">
        <header className="border-b border-nude pb-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-1">{selection.type}</p>
          <h2 className="text-sm font-bold text-charcoal truncate">{selection.id}</h2>
        </header>

        {children}
      </div>
    </aside>
  )
}

export default PropertyInspector
