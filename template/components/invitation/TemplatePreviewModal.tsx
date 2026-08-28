import { useState } from 'react'
import UnifiedRenderer from './renderer/UnifiedRenderer'
import type { InvitationTemplate } from '../../lib/invitation/types'

export default function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: InvitationTemplate
  onClose: () => void
  onUse: () => void
}) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex flex-col bg-white shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-nude bg-ivory">
          <div>
            <h2 className="font-display text-2xl text-charcoal">{template.name}</h2>
            <p className="text-[9px] text-muted font-bold uppercase tracking-widest">{template.style} · v{template.version}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-1 p-1 bg-cream/50">
              <button onClick={() => setDevice('mobile')} className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${device === 'mobile' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'}`}>
                📱 Mobile
              </button>
              <button onClick={() => setDevice('desktop')} className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${device === 'desktop' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'}`}>
                🖥 Desktop
              </button>
            </div>
            <button onClick={onUse} className="px-8 py-2 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-mocha-dark transition-colors" style={{ borderRadius: '2px' }}>
              Pilih Template Ini
            </button>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-muted hover:text-charcoal transition-colors text-2xl">
              ✕
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-hidden flex justify-center bg-soft p-12">
          <div
            className={`transition-all duration-500 shadow-2xl bg-white relative overflow-y-auto custom-scrollbar ${
              device === 'mobile' ? 'w-[375px] h-full rounded-[2rem] border-[8px] border-charcoal' : 'w-full max-w-4xl'
            }`}
          >
            <UnifiedRenderer template={template} mode="preview" />
          </div>
        </div>
      </div>
    </div>
  )
}
