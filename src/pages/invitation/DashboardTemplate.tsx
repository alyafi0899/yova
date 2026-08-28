import { useState, useEffect } from 'react'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject, InvitationRevision } from '../../lib/invitation/types'

export default function DashboardTemplate({ project }: { project: InvitationProject }) {
  const [revisions, setRevisions] = useState<InvitationRevision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRevisions() {
      setLoading(true)
      const data = await invitationService.getRevisions(project.id)
      setRevisions(data)
      setLoading(false)
    }
    fetchRevisions()
  }, [project.id])

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
                <div className="w-48 h-64 bg-soft shrink-0 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden shadow-lg border border-nude">
                   <img
                     src="https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=400&h=520&fit=crop&auto=format"
                     alt="SAKINAH Template"
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-display text-3xl text-charcoal">SAKINAH</h3>
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold uppercase rounded-full">Aktif</span>
                   </div>
                   <p className="text-sm text-muted leading-relaxed mb-8">
                      Template undangan muslim elegan dengan ornamen islami, fitur countdown, dan galeri momen.
                      Desain premium yang dioptimalkan untuk perangkat seluler.
                   </p>

                   <div className="grid grid-cols-2 gap-6 text-[10px] uppercase tracking-widest font-bold">
                      <div className="space-y-1">
                         <div className="text-muted text-[8px]">Versi</div>
                         <div>1.2 (Latest)</div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-muted text-[8px]">Kategori</div>
                         <div>Muslim Elegant</div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-muted text-[8px]">Terakhir Update</div>
                         <div>27 Agt 2026</div>
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
                 <div className="text-3xl font-display text-mocha mb-2">Premium</div>
                 <p className="text-[9px] text-ivory/50 uppercase tracking-widest">Akses Penuh Selamanya</p>
              </div>

              <div className="mt-12 space-y-3">
                 <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-[9px] font-bold uppercase tracking-widest transition-colors">Ubah Template</button>
                 <button className="w-full py-3 border border-white/20 hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest transition-colors">Download Aset</button>
              </div>
           </div>
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
