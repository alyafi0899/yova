import { useState } from 'react'
import SakinahInvitation from './sakina/SakinahInvitation'
import YasminInvitation from './yasmin/YasminInvitation'
import MalamInvitation from './malam/MalamInvitation'
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

  // Convert Template to InvitationData for renderer
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
      address: 'Banda Aceh, Aceh',
      mapsLink: 'https://maps.google.com'
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

        {/* Preview area - Dynamic Template Selection */}
        <div className="flex-1 overflow-hidden flex justify-center bg-soft p-0 md:p-8">
          <div
            className={`transition-all duration-500 shadow-2xl bg-white relative overflow-hidden flex flex-col mx-auto shrink-0 ${
              device === 'mobile' ? 'w-full max-w-[430px] h-[95%] max-h-[850px] rounded-xl border border-nude/30' :
              device === 'tablet' ? 'w-full max-w-[768px] h-[95%] max-h-[1024px] rounded-xl border border-nude/30' :
              device === 'laptop-p' ? 'w-full max-w-[450px] h-full rounded-none border-x border-nude/30' :
              'w-full max-w-[1200px] h-full rounded-none border-x border-nude/30'
            }`}
          >
            <div className="flex-1 w-full overflow-hidden relative bg-white">
              {template.id === 'yasmin' ? (
                <YasminInvitation data={previewData} />
              ) : template.id === 'malam' ? (
                <MalamInvitation data={previewData} />
              ) : (
                <SakinahInvitation data={previewData} previewMode={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
