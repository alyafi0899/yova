import { useState, useCallback } from 'react'
import type { InvitationProject, InvitationData } from '../../lib/invitation/types'
import { invitationService } from '../../lib/invitation/invitationService'
import SakinahInvitation from '../../components/invitation/sakina/SakinahInvitation'
import { motion, AnimatePresence } from 'framer-motion'

interface DashboardCustomizeProps {
  project: InvitationProject
  onUpdate: (project: InvitationProject) => void
}

export default function DashboardCustomize({ project, onUpdate }: DashboardCustomizeProps) {
  const [activeSection, setActiveSection] = useState('cover')
  const [saving, setSaving] = useState(false)
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'laptop-p' | 'desktop'>('mobile')
  const [tempData, setTempData] = useState<InvitationData>(JSON.parse(JSON.stringify(project.data)))

  // Re-map the section IDs to match the ones in SakinahInvitation
  const dashboardSections = [
    { id: 'cover', label: 'Cover' },
    { id: 'introduction', label: 'Pendahuluan' },
    { id: 'quran', label: 'Ayat Quran' },
    { id: 'couple', label: 'Mempelai' },
    { id: 'story', label: 'Kisah Cinta' },
    { id: 'event', label: 'Acara' },
    { id: 'countdown', label: 'Countdown' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'gift', label: 'Kado' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'closing', label: 'Penutup' }
  ]

  const handleUpdate = useCallback((sectionId: string, property: string, value: any) => {
    setTempData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const section = next.sections.find((s: any) => s.id === sectionId)
      if (section) {
        // Handle nested properties like bride.name
        if (property.includes('.')) {
          const [parent, child] = property.split('.')
          section.config[parent][child] = value
          // Also update global couple data if applicable
          if (sectionId === 'couple') {
            next.couple[parent][child] = value
          }
        } else {
          section.config[property] = value
        }
      }
      return next
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await invitationService.updateProject(project.id, { data: tempData })
    onUpdate({ ...project, data: tempData })
    setSaving(false)
    alert('Perubahan disimpan sebagai draft.')
  }

  const handlePublish = async () => {
    if (confirm('Publikasikan perubahan? Tamu Anda akan melihat versi terbaru setelah dipublikasikan.')) {
      setSaving(true)
      await invitationService.updateProject(project.id, { data: tempData, status: 'published' })
      onUpdate({ ...project, data: tempData, status: 'published' })
      await invitationService.createRevision(project.id, 'Update konten via editor', tempData)
      setSaving(false)
      alert('Undangan berhasil diperbarui dan dipublikasikan!')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-6 md:-m-12 lg:-m-16 overflow-hidden bg-white">
      {/* Top Toolbar */}
      <div className="h-16 bg-white border-b border-nude flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 bg-cream/30 p-1 rounded-full border border-nude">
          {[
            { id: 'mobile', icon: '📱', label: 'Mobile' },
            { id: 'tablet', icon: '📟', label: 'Tablet' },
            { id: 'laptop-p', icon: '📏', label: 'Portrait' },
            { id: 'desktop', icon: '💻', label: '1080P' },
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                device === d.id ? 'bg-mocha text-white shadow-lg' : 'text-muted hover:text-mocha'
              }`}
            >
              <span>{d.icon}</span>
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">{saving ? 'Menyimpan...' : 'Draft tersimpan'}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-8 py-2.5 border border-nude text-[10px] font-bold uppercase tracking-widest hover:bg-soft transition-colors bg-white"
            >
              Simpan Draft
            </button>
            <button
              onClick={handlePublish}
              className="px-8 py-2.5 bg-mocha text-white text-[10px] font-bold uppercase tracking-widest hover:bg-mocha-dark transition-colors shadow-xl shadow-mocha/20"
            >
              Publikasikan
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Sections Navigation - Full Height */}
        <aside className="w-72 bg-cream/5 border-r border-nude flex flex-col shrink-0 z-10">
          <div className="p-8 border-b border-nude bg-ivory/50">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-charcoal">Struktur Undangan</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            {dashboardSections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-8 py-4 text-[11px] uppercase tracking-[0.25em] transition-all relative group flex items-center justify-between ${
                  activeSection === s.id
                    ? 'bg-mocha text-white font-bold shadow-inner'
                    : 'text-charcoal/60 hover:bg-mocha/5 hover:text-mocha'
                }`}
              >
                <span>{s.label}</span>
                {activeSection === s.id && (
                  <motion.div layoutId="active-pill" className="w-1.5 h-6 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER: Preview - Perfectly Aligned and Large */}
        <main className="flex-1 bg-[#FDFCFB] flex items-center justify-center p-6 md:p-12 overflow-auto relative bg-[radial-gradient(#C7A96B20_1.5px,transparent_1.5px)] [background-size:32px_32px]">
          <div
            className={`transition-all duration-700 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col mx-auto shrink-0 ${
              device === 'mobile' ? 'aspect-[9/19.5] h-[95%] max-h-[920px] rounded-[3rem] border-[8px] border-[#1A1210]' :
              device === 'tablet' ? 'aspect-[3/4] h-[92%] max-h-[900px] rounded-[2rem] border-[8px] border-[#1A1210]' :
              device === 'laptop-p' ? 'aspect-[9/16] h-[95%] max-h-[950px] rounded-2xl border-[3px] border-[#1A1210]' :
              'aspect-[16/9] w-full max-w-[1200px] rounded-lg border-[3px] border-[#1A1210]'
            }`}
          >
            <div className="flex-1 w-full overflow-hidden relative bg-white">
              <SakinahInvitation
                data={tempData}
                previewMode={true}
                externalIndex={dashboardSections.findIndex(s => s.id === activeSection)}
              />
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
        </main>

        {/* RIGHT: Editing Controls - Expanded and Full Height */}
        <aside className="w-[520px] bg-white border-l border-nude flex flex-col shrink-0 z-10 shadow-2xl shadow-black/5">
          <div className="p-8 border-b border-nude bg-ivory/50 flex items-center justify-between">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-charcoal flex items-center gap-3">
               <span className="text-lg">🖋️</span>
               <span>Edit: {activeSection}</span>
            </h3>
            <span className="text-[9px] px-3 py-1 bg-mocha/10 text-mocha rounded-full font-bold uppercase tracking-widest">Active Section</span>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Dynamic Controls based on activeSection */}
                {activeSection === 'cover' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Foto Utama</label>
                      <input
                        type="text"
                        value={tempData.sections.find(s => s.id === 'cover')?.config.couplePhoto}
                        onChange={(e) => handleUpdate('cover', 'couplePhoto', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                        placeholder="URL Foto..."
                      />
                    </div>
                  </>
                )}

                {activeSection === 'introduction' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Teks Undangan (Pendahuluan)</label>
                    <textarea
                      value={tempData.sections.find(s => s.id === 'introduction')?.config.invitationText}
                      onChange={(e) => handleUpdate('introduction', 'invitationText', e.target.value)}
                      className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-32 resize-none"
                    />
                  </div>
                )}

                {activeSection === 'couple' && (
                  <>
                    {['bride', 'groom'].map(p => (
                      <div key={p} className="space-y-4 pt-4 border-t border-nude first:border-0 first:pt-0">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-mocha">{p === 'bride' ? 'Mempelai Wanita' : 'Mempelai Pria'}</h4>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Lengkap</label>
                          <input
                            type="text"
                            value={tempData.sections.find(s => s.id === 'couple')?.config[p].name}
                            onChange={(e) => handleUpdate('couple', `${p}.name`, e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Orang Tua</label>
                          <input
                            type="text"
                            value={tempData.sections.find(s => s.id === 'couple')?.config[p].parents}
                            onChange={(e) => handleUpdate('couple', `${p}.parents`, e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">URL Foto</label>
                          <input
                            type="text"
                            value={tempData.sections.find(s => s.id === 'couple')?.config[p].image}
                            onChange={(e) => handleUpdate('couple', `${p}.image`, e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activeSection === 'countdown' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Tanggal Pernikahan</label>
                    <input
                      type="datetime-local"
                      value={tempData.sections.find(s => s.id === 'countdown')?.config.targetDate.slice(0, 16)}
                      onChange={(e) => handleUpdate('countdown', 'targetDate', e.target.value)}
                      className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                    />
                  </div>
                )}

                {activeSection === 'quran' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Ayat Al-Quran</label>
                      <textarea
                        value={tempData.sections.find(s => s.id === 'quran')?.config.verse}
                        onChange={(e) => handleUpdate('quran', 'verse', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-32 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Referensi (Surah:Ayat)</label>
                      <input
                        type="text"
                        value={tempData.sections.find(s => s.id === 'quran')?.config.reference}
                        onChange={(e) => handleUpdate('quran', 'reference', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                      />
                    </div>
                  </>
                )}

                {activeSection === 'event' && (
                  <div className="space-y-6">
                    {tempData.sections.find(s => s.id === 'event')?.config.events.map((ev: any, i: number) => (
                      <div key={i} className="space-y-4 pt-4 border-t border-nude first:border-0 first:pt-0">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-mocha">{ev.name}</h4>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Acara</label>
                            <input
                              type="text"
                              value={ev.name}
                              onChange={(e) => {
                                const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                nextEvents[i].name = e.target.value
                                handleUpdate('event', 'events', nextEvents)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Tanggal (Teks)</label>
                            <input
                              type="text"
                              value={ev.date}
                              onChange={(e) => {
                                const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                nextEvents[i].date = e.target.value
                                handleUpdate('event', 'events', nextEvents)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Waktu (Teks)</label>
                            <input
                              type="text"
                              value={ev.time}
                              onChange={(e) => {
                                const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                nextEvents[i].time = e.target.value
                                handleUpdate('event', 'events', nextEvents)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Lokasi / Gedung</label>
                            <input
                              type="text"
                              value={ev.venue}
                              onChange={(e) => {
                                const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                nextEvents[i].venue = e.target.value
                                handleUpdate('event', 'events', nextEvents)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'closing' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Pesan Penutup</label>
                      <textarea
                        value={tempData.sections.find(s => s.id === 'closing')?.config.message}
                        onChange={(e) => handleUpdate('closing', 'message', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-32 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Singkat Mempelai</label>
                      <input
                        type="text"
                        value={tempData.sections.find(s => s.id === 'closing')?.config.names}
                        onChange={(e) => handleUpdate('closing', 'names', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                      />
                    </div>
                  </>
                )}

                {activeSection === 'story' && (
                  <div className="space-y-6">
                    {tempData.sections.find(s => s.id === 'story')?.config.items.map((s: any, i: number) => (
                      <div key={i} className="space-y-4 pt-4 border-t border-nude first:border-0 first:pt-0">
                         <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-mocha">Cerita #{i+1}</h4>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Tahun</label>
                            <input
                              type="text"
                              value={s.year}
                              onChange={(e) => {
                                const nextItems = [...tempData.sections.find(s => s.id === 'story')?.config.items]
                                nextItems[i].year = e.target.value
                                handleUpdate('story', 'items', nextItems)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Judul</label>
                            <input
                              type="text"
                              value={s.title}
                              onChange={(e) => {
                                const nextItems = [...tempData.sections.find(s => s.id === 'story')?.config.items]
                                nextItems[i].title = e.target.value
                                handleUpdate('story', 'items', nextItems)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Deskripsi</label>
                            <textarea
                              value={s.desc}
                              onChange={(e) => {
                                const nextItems = [...tempData.sections.find(s => s.id === 'story')?.config.items]
                                nextItems[i].desc = e.target.value
                                handleUpdate('story', 'items', nextItems)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-24 resize-none"
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'gallery' && (
                  <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">URL Foto Galeri (Satu per baris)</label>
                    <textarea
                      value={tempData.sections.find(s => s.id === 'gallery')?.config.images.join('\n')}
                      onChange={(e) => handleUpdate('gallery', 'images', e.target.value.split('\n'))}
                      className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-64 font-mono leading-tight"
                    />
                  </div>
                )}

                {activeSection === 'gift' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Deskripsi Kado</label>
                       <textarea
                         value={tempData.sections.find(s => s.id === 'gift')?.config.description}
                         onChange={(e) => handleUpdate('gift', 'description', e.target.value)}
                         className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-24 resize-none"
                       />
                    </div>
                    {tempData.sections.find(s => s.id === 'gift')?.config.accounts.map((acc: any, i: number) => (
                      <div key={i} className="space-y-4 pt-4 border-t border-nude">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-mocha">Rekening #{i+1}</h4>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Bank / Wallet</label>
                            <input
                              type="text"
                              value={acc.bank}
                              onChange={(e) => {
                                const nextAccs = [...tempData.sections.find(s => s.id === 'gift')?.config.accounts]
                                nextAccs[i].bank = e.target.value
                                handleUpdate('gift', 'accounts', nextAccs)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nomor Rekening</label>
                            <input
                              type="text"
                              value={acc.number}
                              onChange={(e) => {
                                const nextAccs = [...tempData.sections.find(s => s.id === 'gift')?.config.accounts]
                                nextAccs[i].number = e.target.value
                                handleUpdate('gift', 'accounts', nextAccs)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Atas Nama</label>
                            <input
                              type="text"
                              value={acc.holder}
                              onChange={(e) => {
                                const nextAccs = [...tempData.sections.find(s => s.id === 'gift')?.config.accounts]
                                nextAccs[i].holder = e.target.value
                                handleUpdate('gift', 'accounts', nextAccs)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Other sections would have similar inputs */}
                {!['cover', 'introduction', 'quran', 'couple', 'story', 'countdown', 'event', 'gallery', 'gift', 'closing'].includes(activeSection) && (
                   <div className="py-10 text-center text-muted italic text-[10px]">
                      Kontrol edit untuk bagian ini sedang dalam pengembangan.
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  )
}
