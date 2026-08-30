import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject } from '../../lib/invitation/types'
import SakinahInvitation from '../../components/invitation/sakina/SakinahInvitation'
import YasminInvitation from '../../components/invitation/yasmin/YasminInvitation'
import MalamInvitation from '../../components/invitation/malam/MalamInvitation'

export default function PublicInvitation() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const guestSlug = searchParams.get('to')

  const [project, setProject] = useState<InvitationProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestName, setGuestName] = useState('Bapak Ahmad & Keluarga')

  useEffect(() => {
    async function fetchInvitation() {
      if (slug) {
        const p = await invitationService.getProjectBySlug(slug)
        if (p) {
          setProject(p)

          if (guestSlug) {
            const guests = await invitationService.getGuests(p.id)
            const guest = guests.find(g => g.slug === guestSlug)
            if (guest) {
              setGuestName(guest.name)
            }
          }
        }
      }
      setLoading(false)
    }
    fetchInvitation()
  }, [slug, guestSlug])

  const handleRSVP = async (rsvp: any) => {
    if (!project) return;
    await invitationService.submitRSVP({
      projectId: project.id,
      name: rsvp.name,
      attendance: rsvp.attendance,
      guests: rsvp.guests,
      message: rsvp.message
    })
  }

  if (loading) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center italic text-muted text-[10px] uppercase tracking-[0.25em]">
       Memuat Undangan...
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
       <h1 className="font-display text-3xl text-charcoal mb-4">Undangan Tidak Ditemukan</h1>
       <p className="text-muted text-sm italic">Mohon periksa kembali link yang Anda gunakan.</p>
    </div>
  )

  if (project.templateId === 'yasmin') {
    return (
      <YasminInvitation
        data={project.data}
        guestName={guestName}
        onRSVP={handleRSVP}
      />
    )
  }

  if (project.templateId === 'malam') {
    return (
      <MalamInvitation
        data={project.data}
        guestName={guestName}
        onRSVP={handleRSVP}
      />
    )
  }

  return (
    <SakinahInvitation
      data={project.data}
      guestName={guestName}
      onRSVP={handleRSVP}
    />
  )
}
