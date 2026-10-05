import { useState, useCallback, useEffect } from 'react'
import type { InvitationProject, InvitationData } from '../../lib/invitation/types'
import { invitationService } from '../../lib/invitation/invitationService'
import SakinahInvitation from '../../components/invitation/sakina/SakinahInvitation'
import YasminInvitation from '../../components/invitation/yasmin/YasminInvitation'
import MalamInvitation from '../../components/invitation/malam/MalamInvitation'
import ImageUpload from '../../components/common/ImageUpload'
import { motion, AnimatePresence } from 'framer-motion'
import { getCallName } from '../../lib/utils/name'

interface DashboardCustomizeProps {
  project: InvitationProject
  onUpdate: (project: InvitationProject) => void
}

export default function DashboardCustomize({ project, onUpdate }: DashboardCustomizeProps) {
  const [activeSection, setActiveSection] = useState('cover')
  const [saving, setSaving] = useState(false)
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'laptop-p' | 'desktop'>('mobile')
  const [tempData, setTempData] = useState<InvitationData>(JSON.parse(JSON.stringify(project.data)))

  // Re-sync tempData if project changes
  useEffect(() => {
    setTempData(JSON.parse(JSON.stringify(project.data)))
  }, [project.id, project.templateId])

  // Dynamically generate sections from project data for multi-template support
  const dashboardSections = tempData.sections.map(s => ({
    id: s.id,
    label: s.id.charAt(0).toUpperCase() + s.id.slice(1).replace(/_/g, ' ')
  }))

  // Add closing section if not in sections list (some templates treat it as a footer)
  if (!dashboardSections.find(s => s.id === 'closing')) {
    dashboardSections.push({ id: 'closing', label: 'Penutup' })
  }

  const handleToggleSection = useCallback((sectionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setTempData(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const section = next.sections.find((s: any) => s.id === sectionId)
      if (section) {
        section.enabled = section.enabled === false ? true : false
      } else {
        // If section is not yet in sections array, add it with enabled: false
        next.sections.push({
          id: sectionId,
          type: sectionId,
          enabled: false,
          config: {}
        })
      }
      return next
    })
  }, [])

  const handleUpdate = useCallback((sectionId: string, property: string, value: any) => {
    setTempData(prev => {
      const next = JSON.parse(JSON.stringify(prev))

      // Update global couple data
      if (property.startsWith('bride.') || property.startsWith('groom.')) {
        const [p, c] = property.split('.')
        if (next.couple[p]) next.couple[p][c] = value

        // Sync couple section config if present
        const coupleSec = next.sections.find((s: any) => s.id === 'couple')
        if (coupleSec?.config?.[p]) {
          coupleSec.config[p][c] = value
        }
      }

      const section = next.sections.find((s: any) => s.id === sectionId)
      if (section) {
        if (property.includes('.')) {
          const parts = property.split('.')
          let current = section.config
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {}
            current = current[parts[i]]
          }
          current[parts[parts.length - 1]] = value
        } else {
          section.config[property] = value
        }
      }
      return next
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await invitationService.updateProject(project.id, { data: tempData })
      onUpdate({ ...project, data: tempData })
      await invitationService.createRevision(project.id, 'Simpan draft (Editor)', tempData)
      alert('Perubahan berhasil disimpan sebagai draft.')
    } catch (err) {
      console.error('Error saving draft:', err)
      alert('Gagal menyimpan draft.')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    alert('Perubahan draft telah disimpan. Anda akan diarahkan ke halaman Pengaturan untuk publikasi.')
    window.location.hash = '/settings'
  }

  const activeSecObj = tempData.sections.find(s => s.id === activeSection)
  const isActiveSecEnabled = activeSecObj ? activeSecObj.enabled !== false : true

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
            <p className="text-[8px] uppercase tracking-widest text-muted mt-1 font-bold">Klik toggle untuk ON / OFF section</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            {dashboardSections.map(s => {
              const secItem = tempData.sections.find(sec => sec.id === s.id)
              const isEnabled = secItem ? secItem.enabled !== false : true

              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full cursor-pointer px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] transition-all relative group flex items-center justify-between border-b border-nude/20 ${
                    activeSection === s.id
                      ? 'bg-mocha text-white font-bold shadow-inner'
                      : 'text-charcoal/70 hover:bg-mocha/5 hover:text-mocha'
                  }`}
                >
                  <span className={`truncate ${!isEnabled ? 'line-through opacity-50' : ''}`}>{s.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSection(s.id, e)}
                      title={isEnabled ? 'Klik untuk menonaktifkan section ini' : 'Klik untuk mengaktifkan section ini'}
                      className={`text-[8px] font-bold px-2 py-0.5 rounded tracking-wider uppercase transition-colors shrink-0 ${
                        isEnabled
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {isEnabled ? 'ON' : 'OFF'}
                    </button>
                    {activeSection === s.id && (
                      <motion.div layoutId="active-pill" className="w-1.5 h-5 bg-white rounded-full shrink-0" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* CENTER: Preview - No physical frame, flexible and centered */}
        <main className="flex-1 bg-[#FDFCFB] flex items-center justify-center p-0 md:p-6 overflow-auto relative bg-[radial-gradient(#C7A96B20_1.5px,transparent_1.5px)] [background-size:32px_32px]">
          <div
            className={`transition-all duration-700 bg-white shadow-2xl relative overflow-hidden flex flex-col mx-auto shrink-0 ${
              device === 'mobile' ? 'w-full max-w-[430px] h-[95%] max-h-[900px] rounded-xl border border-nude/30' :
              device === 'tablet' ? 'w-full max-w-[768px] h-[95%] max-h-[1024px] rounded-xl border border-nude/30' :
              device === 'laptop-p' ? 'w-full max-w-[450px] h-full rounded-none border-x border-nude/30' :
              'w-full max-w-[1200px] h-full rounded-none border-x border-nude/30'
            }`}
          >
            <div className="flex-1 w-full overflow-hidden relative bg-white">
              {project.templateId === 'yasmin' ? (
                <YasminInvitation
                   data={tempData}
                   externalIndex={dashboardSections.findIndex(s => s.id === activeSection)}
                />
              ) : project.templateId === 'malam' ? (
                <MalamInvitation
                   data={tempData}
                   externalIndex={dashboardSections.findIndex(s => s.id === activeSection)}
                />
              ) : (
                <SakinahInvitation
                  data={tempData}
                  previewMode={true}
                  externalIndex={dashboardSections.findIndex(s => s.id === activeSection)}
                />
              )}
            </div>
          </div>
        </main>

        {/* RIGHT: Editing Controls - Expanded and Full Height */}
        <aside className="w-[520px] bg-white border-l border-nude flex flex-col shrink-0 z-10 shadow-2xl shadow-black/5">
          <div className="p-8 border-b border-nude bg-ivory/50 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.25em] text-charcoal flex items-center gap-2">
                <span>🖋️</span>
                <span>Edit: {activeSection}</span>
              </h3>
            </div>

            {/* Toggle Switch in Header */}
            <button
              onClick={() => handleToggleSection(activeSection)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 ${
                isActiveSecEnabled
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActiveSecEnabled ? 'bg-white' : 'bg-gray-500'}`} />
              <span>{isActiveSecEnabled ? 'Seksi Tampil (ON)' : 'Seksi Sembunyi (OFF)'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            {!isActiveSecEnabled && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded text-xs text-amber-800 space-y-1 mb-6">
                <div className="font-bold flex items-center gap-2">
                  <span>⚠️</span> Section Ini Sedang Nonaktif (OFF)
                </div>
                <p className="text-[11px] leading-relaxed">
                  Bagian <strong>"{activeSection}"</strong> disembunyikan dari tampilan undangan. Pengunjung tidak akan melihat bagian ini. Anda dapat mengaktifkannya kembali dengan menekan tombol toggle di kanan atas.
                </p>
              </div>
            )}

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
                    <ImageUpload
                      label="Foto Utama (Watercolor Hero / Sampul)"
                      value={tempData.sections.find(s => s.id === 'cover')?.config.couplePhoto || tempData.sections.find(s => s.id === 'cover')?.config.coverImage}
                      onChange={(url) => {
                        handleUpdate('cover', 'couplePhoto', url)
                        handleUpdate('cover', 'coverImage', url)
                      }}
                    />
                    <div className="space-y-4 pt-4 border-t border-nude">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-mocha">Detail Informasi</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Panggilan Wanita</label>
                             <input
                               type="text"
                               value={tempData.couple.bride.nickname !== undefined ? tempData.couple.bride.nickname : getCallName(tempData.couple.bride, 'Zahra')}
                               onChange={(e) => handleUpdate('couple', 'bride.nickname', e.target.value)}
                               className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                               placeholder="Zahra"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Panggilan Pria</label>
                             <input
                               type="text"
                               value={tempData.couple.groom.nickname !== undefined ? tempData.couple.groom.nickname : getCallName(tempData.couple.groom, 'Rafi')}
                               onChange={(e) => handleUpdate('couple', 'groom.nickname', e.target.value)}
                               className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                               placeholder="Rafi"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Tanggal Pernikahan (Teks)</label>
                          <input
                            type="text"
                            value={tempData.sections.find(s => s.id === 'cover')?.config.dateText || ''}
                            onChange={(e) => handleUpdate('cover', 'dateText', e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            placeholder="Contoh: Saturday 12/12/26"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Lokasi Singkat</label>
                          <input
                            type="text"
                            value={tempData.sections.find(s => s.id === 'cover')?.config.locationText || ''}
                            onChange={(e) => handleUpdate('cover', 'locationText', e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            placeholder="Contoh: The Grand Ballroom • Santa Clara"
                          />
                       </div>
                    </div>
                  </>
                )}

                {activeSection === 'introduction' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Teks Undangan (Pendahuluan)</label>
                    <textarea
                      value={tempData.sections.find(s => s.id === 'introduction')?.config.invitationText || ''}
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
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Lengkap &amp; Gelar</label>
                          <input
                            type="text"
                            value={tempData.couple[p as 'bride'|'groom']?.name || ''}
                            onChange={(e) => handleUpdate('couple', `${p}.name`, e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            placeholder="Contoh: Dr. Hj. Zahra Aulia, S.Ked"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Panggilan (Di Cover &amp; Inisial)</label>
                          <input
                            type="text"
                            value={tempData.couple[p as 'bride'|'groom']?.nickname !== undefined ? tempData.couple[p as 'bride'|'groom']?.nickname : getCallName(tempData.couple[p as 'bride'|'groom'])}
                            onChange={(e) => handleUpdate('couple', `${p}.nickname`, e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                            placeholder="Contoh: Zahra"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Orang Tua</label>
                          <input
                            type="text"
                            value={tempData.couple[p as 'bride'|'groom']?.parents || ''}
                            onChange={(e) => handleUpdate('couple', `${p}.parents`, e.target.value)}
                            className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                          />
                        </div>
                        <ImageUpload
                          label="Foto Portrait"
                          value={tempData.couple[p as 'bride'|'groom']?.image}
                          onChange={(url) => handleUpdate('couple', `${p}.image`, url)}
                        />
                      </div>
                    ))}
                  </>
                )}

                {activeSection === 'countdown' && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Tanggal Pernikahan</label>
                    <input
                      type="datetime-local"
                      value={(tempData.sections.find(s => s.id === 'countdown')?.config.targetDate || '').slice(0, 16)}
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
                        value={tempData.sections.find(s => s.id === 'quran')?.config.verse || ''}
                        onChange={(e) => handleUpdate('quran', 'verse', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-32 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Referensi (Surah:Ayat)</label>
                      <input
                        type="text"
                        value={tempData.sections.find(s => s.id === 'quran')?.config.reference || ''}
                        onChange={(e) => handleUpdate('quran', 'reference', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                      />
                    </div>
                  </>
                )}

                {activeSection === 'event' && (
                  <div className="space-y-6">
                    {(tempData.sections.find(s => s.id === 'event')?.config.events || []).map((ev: any, i: number) => (
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
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Tanggal & Jam (Teks)</label>
                            <div className="grid grid-cols-2 gap-2">
                               <input
                                 type="text"
                                 value={ev.date}
                                 onChange={(e) => {
                                   const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                   nextEvents[i].date = e.target.value
                                   handleUpdate('event', 'events', nextEvents)
                                   if (i === 0) {
                                      handleUpdate('cover', 'dateText', e.target.value)
                                      handleUpdate('closing', 'date', e.target.value)
                                   }
                                 }}
                                 className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                                 placeholder="12/12/26"
                               />
                               <input
                                 type="text"
                                 value={ev.time}
                                 onChange={(e) => {
                                   const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                   nextEvents[i].time = e.target.value
                                   handleUpdate('event', 'events', nextEvents)
                                 }}
                                 className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                                 placeholder="17:00"
                               />
                            </div>
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
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Link Google Maps</label>
                            <input
                              type="text"
                              value={ev.mapsLink || ''}
                              onChange={(e) => {
                                const nextEvents = [...tempData.sections.find(s => s.id === 'event')?.config.events]
                                nextEvents[i].mapsLink = e.target.value
                                handleUpdate('event', 'events', nextEvents)
                              }}
                              className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                              placeholder="https://maps.google.com/..."
                            />
                         </div>
                         {i === 0 && (
                           <div className="space-y-2 bg-mocha/5 p-4 rounded-sm border border-mocha/10">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-mocha">Global Timer Sync</label>
                              <p className="text-[8px] text-muted mb-2 italic">Tanggal ini akan otomatis digunakan untuk Countdown.</p>
                              <input
                                type="datetime-local"
                                value={(tempData.sections.find(s => s.id === 'countdown')?.config.targetDate || '').slice(0, 16)}
                                onChange={(e) => {
                                   handleUpdate('countdown', 'targetDate', e.target.value)
                                }}
                                className="w-full bg-white border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                              />
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'closing' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Pesan Penutup</label>
                      <textarea
                        value={tempData.sections.find(s => s.id === 'closing')?.config.message || ''}
                        onChange={(e) => handleUpdate('closing', 'message', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-32 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nama Singkat Mempelai</label>
                      <input
                        type="text"
                        value={tempData.sections.find(s => s.id === 'closing')?.config.names || ''}
                        onChange={(e) => handleUpdate('closing', 'names', e.target.value)}
                        className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha"
                      />
                    </div>
                  </>
                )}

                {activeSection === 'story' && (
                  <div className="space-y-6">
                    {(tempData.sections.find(s => s.id === 'story')?.config.items || []).map((s: any, i: number) => (
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
                         <ImageUpload
                            label="Foto Polaroid"
                            value={s.image}
                            onChange={(url) => {
                               const nextItems = [...tempData.sections.find(s => s.id === 'story')?.config.items]
                               nextItems[i].image = url
                               handleUpdate('story', 'items', nextItems)
                            }}
                            aspectRatio="aspect-square"
                         />
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
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Koleksi Galeri</label>
                      <button
                        type="button"
                        onClick={() => {
                          const current = tempData.sections.find(s => s.id === 'gallery')?.config.images || []
                          handleUpdate('gallery', 'images', [...current, ''])
                        }}
                        className="px-3 py-1 bg-mocha text-white text-[9px] font-bold uppercase tracking-wider rounded hover:bg-mocha-dark transition-colors"
                      >
                        + Tambah Foto
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {(tempData.sections.find(s => s.id === 'gallery')?.config.images || []).map((img: string, i: number) => (
                          <div key={i} className="relative group">
                            <ImageUpload
                               value={img}
                               onChange={(url) => {
                                  const nextImages = [...(tempData.sections.find(s => s.id === 'gallery')?.config.images || [])]
                                  nextImages[i] = url
                                  handleUpdate('gallery', 'images', nextImages)
                               }}
                               aspectRatio="aspect-[3/4]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                 const nextImages = [...(tempData.sections.find(s => s.id === 'gallery')?.config.images || [])]
                                 nextImages.splice(i, 1)
                                 handleUpdate('gallery', 'images', nextImages)
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                              title="Hapus foto ini"
                            >
                              ✕
                            </button>
                          </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeSection === 'gift' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Deskripsi Kado</label>
                       <textarea
                         value={tempData.sections.find(s => s.id === 'gift')?.config.description || ''}
                         onChange={(e) => handleUpdate('gift', 'description', e.target.value)}
                         className="w-full bg-soft border border-nude p-3 text-xs focus:outline-none focus:border-mocha h-24 resize-none"
                       />
                    </div>
                    {(tempData.sections.find(s => s.id === 'gift')?.config.accounts || []).map((acc: any, i: number) => (
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
                         <ImageUpload
                            label="Foto QRIS / Rekening (Opsional)"
                            value={acc.qrCode || acc.image}
                            onChange={(url) => {
                               const nextAccs = [...(tempData.sections.find(s => s.id === 'gift')?.config.accounts || [])]
                               nextAccs[i].qrCode = url
                               handleUpdate('gift', 'accounts', nextAccs)
                            }}
                            aspectRatio="aspect-square"
                         />
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
