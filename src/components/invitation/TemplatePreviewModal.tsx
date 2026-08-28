import { useState } from 'react'
import SakinahInvitation from './sakina/SakinahInvitation'
import type { InvitationTemplate, InvitationData } from '../../lib/invitation/types'

export default function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: InvitationTemplate
  onClose: () => void
  onUse: () => void
}) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'laptop-p' | 'desktop'>('mobile')

  // Convert Template to InvitationData for Sakinah renderer
  const previewData: InvitationData = {
    title: `Wedding of ${template.name}`,
    couple: {
      bride: { name: 'Zahra Aulia Putri', parents: 'Bapak Ahmad Fauzi & Ibu Siti Rahmah' },
      groom: { name: 'Rafi Maulana', parents: 'Bapak Hendra Maulana & Ibu Nur Aisyah' }
    },
    event: {
      date: '2026-12-12T08:00:00',
      time: '08:00 - 15:00',
      location: 'Banda Aceh',
      address: 'Banda Aceh, Aceh'
    },
    rsvp: { enabled: true },
    sections: template.sections.map(s => ({
      id: s.id,
      type: s.type,
      enabled: true,
      config: s.config
    }))
  }

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
            <div className="hidden sm:flex gap-1 p-1 bg-cream/50 rounded-full">
              {[
                { id: 'mobile', icon: '📱' },
                { id: 'tablet', icon: '📟' },
                { id: 'laptop-p', icon: '📏' },
                { id: 'desktop', icon: '💻' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id as any)}
                  className={`w-10 h-8 flex items-center justify-center text-sm rounded-full transition-all ${device === d.id ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'}`}
                >
                  {d.icon}
                </button>
              ))}
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
            className={`transition-all duration-500 shadow-2xl bg-white relative overflow-hidden ${
              device === 'mobile' ? 'aspect-[9/19.5] h-[95%] max-h-[850px] rounded-[3rem] border-[8px] border-[#1A1210]' :
              device === 'tablet' ? 'aspect-[3/4] h-[92%] max-h-[800px] rounded-[1.5rem] border-[8px] border-[#1A1210]' :
              device === 'laptop-p' ? 'aspect-[9/16] h-[95%] rounded-lg border-2 border-nude' :
              'aspect-[16/9] w-full max-w-5xl rounded-sm border border-nude'
            }`}
          >
            <div className="w-full h-full overflow-y-auto no-scrollbar relative">
              <SakinahInvitation data={previewData} previewMode={true} />
            </div>

            {/* Device Specific Elements */}
            {device === 'mobile' && (
              <>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1210] rounded-b-2xl z-50 flex items-center justify-center pt-1">
                   <div className="w-10 h-1 bg-white/10 rounded-full" />
                </div>
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#1A1210]/20 rounded-full z-50" />
              </>
            )}

            {device === 'tablet' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1A1210] rounded-full mt-2 z-50" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
