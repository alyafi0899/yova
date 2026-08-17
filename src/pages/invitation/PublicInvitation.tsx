import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getTemplate } from '../../lib/invitation/templates'
import { mergeInvitationData } from '../../lib/invitation/engine'
import UnifiedRenderer from '../../components/invitation/renderer/UnifiedRenderer'

export default function InvitationPublic() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: inv, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !inv) {
        setLoading(false)
        return
      }

      const template = getTemplate(inv.template_id)
      if (template) {
        const merged = mergeInvitationData(template, inv)
        setData(merged)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-10">
       <div className="w-10 h-10 border-2 border-mocha/20 border-t-mocha rounded-full animate-spin mb-4" />
       <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Menyiapkan Undangan...</p>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-10 text-center">
       <span className="text-6xl mb-6 opacity-20">🥀</span>
       <h1 className="font-display text-3xl text-charcoal mb-4">Undangan tidak ditemukan</h1>
       <p className="text-muted text-sm max-w-xs mx-auto mb-10">Tautan yang Anda tuju mungkin sudah tidak aktif atau salah ketik.</p>
       <a href="/" className="px-8 py-3 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">Kembali ke Beranda</a>
    </div>
  )

  return (
    <div className="min-h-screen overflow-x-hidden">
      <UnifiedRenderer template={data} invitationId={data.instanceId} mode="public" />
    </div>
  )
}
