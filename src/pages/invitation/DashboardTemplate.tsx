import { useState, useEffect } from 'react'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject, InvitationRevision } from '../../lib/invitation/types'

export default function DashboardTemplate({ project }: { project: InvitationProject }) {
  const [revisions, setRevisions] = useState<InvitationRevision[]>([])
  const [loading, setLoading] = useState(true)
  const [isSwitching, setIsSwitching] = useState(false)
  const [allTemplates, setAllTemplates] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [revData, templates] = await Promise.all([
        invitationService.getRevisions(project.id),
        invitationService.getTemplates()
      ])
      setRevisions(revData)
      setAllTemplates(templates)
      setLoading(false)
    }
    fetchData()
  }, [project.id])

  const activeTemplate = allTemplates.find(t => t.id === project.templateId)

  const handleSwitchTemplate = async (templateId: string) => {
    if (templateId === project.templateId) return
    if (confirm(`Ganti desain ke template ${templateId.toUpperCase()}? Data Anda akan dipertahankan, namun tata letak akan berubah mengikuti desain baru.`)) {
       setIsSwitching(true)
       try {
         const newTemplate = allTemplates.find(t => t.id === templateId)
         if (!newTemplate) return

         // Preserve user data while adapting to new section structure
         const newData = { ...project.data }
         newData.sections = newTemplate.sections.map((s: any) => ({
            id: s.id,
            type: s.type,
            enabled: true,
            config: JSON.parse(JSON.stringify(s.config))
         }))

         await invitationService.updateProject(project.id, {
            template_id: templateId,
            data: newData
         })

         // Set this as last project to ensure focus on refresh
         sessionStorage.setItem('yova_last_proj_id', project.id)

         await invitationService.createRevision(project.id, `Ganti template ke ${templateId}`, newData)
         alert('Template berhasil diganti!')
         window.location.reload()
       } catch (err) {
         alert('Gagal mengganti template.')
       } finally {
         setIsSwitching(false)
       }
    }
  }

  if (loading) return <div className="py-20 text-center italic text-muted">Memuat data...</div>

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-charcoal mb-2">Manajemen Template</h1>
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Kelola desain dan riwayat revisi undangan Anda</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="md:col-span-2">
          <div className="bg-white border border-nude p-8 shadow-sm">
             <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-48 h-64 bg-soft shrink-0 transition-all duration-500 overflow-hidden shadow-lg border border-nude">
                   <img
                     src={activeTemplate?.thumbnail}
                     alt={`${activeTemplate?.name} Template`}
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-display text-3xl text-charcoal uppercase">{activeTemplate?.name}</h3>
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold uppercase rounded-full">Aktif</span>
                   </div>
                   <p className="text-sm text-muted leading-relaxed mb-8">
                      {activeTemplate?.description}
                   </p>

                   <div className="grid grid-cols-2 gap-6 text-[10px] uppercase tracking-widest font-bold">
                      <div className="space-y-1">
                         <div className="text-muted text-[8px]">Versi</div>
                         <div>{activeTemplate?.version || '1.0'}</div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-muted text-[8px]">Kategori</div>
                         <div>{activeTemplate?.category}</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div>
           <div className="bg-charcoal text-ivory p-8 h-full flex flex-col justify-between">
              <div>
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Status Aktivasi</h4>
                 <div className="text-3xl font-display text-mocha mb-2">{project.isActive ? 'Premium' : 'Standard'}</div>
                 <p className="text-[9px] text-ivory/50 uppercase tracking-widest">
                    {project.isActive ? 'Akses Penuh Selamanya' : 'Fitur Terbatas'}
                 </p>
              </div>

              <div className="mt-12 space-y-3">
                 <button className="w-full py-3 bg-white text-charcoal text-[9px] font-bold uppercase tracking-widest transition-colors opacity-30 cursor-not-allowed">Download Aset</button>
              </div>
           </div>
        </div>
      </div>

      <div className="mb-20">
         <h2 className="font-display text-3xl text-charcoal mb-8">Ganti Desain</h2>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {allTemplates.map(t => (
               <button
                  key={t.id}
                  onClick={() => handleSwitchTemplate(t.id)}
                  disabled={isSwitching}
                  className={`group relative text-left transition-all ${project.templateId === t.id ? 'cursor-default ring-2 ring-mocha ring-offset-4' : 'hover:scale-[1.02]'}`}
               >
                  <div className="aspect-[3/4] bg-soft overflow-hidden mb-3 border border-nude relative">
                     <img src={t.thumbnail} className="w-full h-full object-cover" alt={t.name} />
                     {project.templateId === t.id && (
                        <div className="absolute inset-0 bg-mocha/20 flex items-center justify-center backdrop-blur-[1px]">
                           <span className="bg-white text-mocha text-[9px] font-bold uppercase px-3 py-1.5 shadow-xl">Sedang Digunakan</span>
                        </div>
                     )}
                  </div>
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="text-[9px] text-muted font-bold uppercase tracking-widest mb-1">{t.style}</div>
                        <div className="text-xs text-charcoal font-medium">{t.name}</div>
                     </div>
                  </div>
               </button>
            ))}
         </div>
      </div>

      <div>
        <h2 className="font-display text-3xl text-charcoal mb-8">Riwayat Revisi</h2>
        <div className="space-y-4">
           {revisions.map((rev, i) => (
             <div key={rev.id} className="bg-white border border-nude p-6 flex items-center justify-between group hover:border-mocha transition-colors">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-ivory text-mocha flex items-center justify-center font-display text-xl">
                      {rev.version}
                   </div>
                   <div>
                      <div className="text-sm font-medium text-charcoal">{rev.note}</div>
                      <div className="text-[9px] uppercase tracking-widest text-muted mt-1">{new Date(rev.createdAt).toLocaleString()}</div>
                   </div>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="px-4 py-2 bg-soft text-[9px] font-bold uppercase tracking-widest hover:bg-nude">Lihat</button>
                   <button className="px-4 py-2 border border-nude text-[9px] font-bold uppercase tracking-widest hover:bg-soft">Pulihkan</button>
                </div>
             </div>
           ))}
           {revisions.length === 0 && (
              <div className="py-12 text-center border border-dashed border-nude text-muted italic text-sm">
                 Belum ada riwayat revisi.
              </div>
           )}
        </div>
      </div>
    </div>
  )
}
