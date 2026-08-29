import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { invitationService } from '../../lib/invitation/invitationService'
import type { InvitationProject } from '../../lib/invitation/types'
import DashboardLayout from '../../components/invitation/DashboardLayout'

// Sub-pages
import DashboardOverview from './DashboardOverview'
import DashboardCustomize from './DashboardCustomize'
import DashboardGuests from './DashboardGuests'
import DashboardRSVP from './DashboardRSVP'
import DashboardTemplate from './DashboardTemplate'
import DashboardSettings from './DashboardSettings'

export default function Dashboard() {
  const [project, setProject] = useState<InvitationProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const projects = await invitationService.getProjects()
        if (projects && projects.length > 0) {
          setProject(projects[0])
        }
      } catch (err) {
        console.error("Dashboard: Error fetching projects", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [])

  if (loading) return <div className="min-h-screen bg-ivory flex items-center justify-center italic text-muted">Memuat Dashboard...</div>

  // If no project, we might need a "Create" screen, but for this task we assume one exists or show a placeholder
  if (!project) {
    return (
      <DashboardLayout>
        <div className="py-40 text-center border border-dashed border-nude">
          <h2 className="font-display text-3xl text-charcoal mb-4">Belum Ada Undangan</h2>
          <p className="text-muted mb-8">Anda belum memiliki proyek undangan aktif.</p>
          <Link to="/invitation" className="px-8 py-3 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-widest">Pilih Template</Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview project={project} />} />
        <Route path="/customize" element={<DashboardCustomize project={project} onUpdate={setProject} />} />
        <Route path="/guests" element={<DashboardGuests project={project} />} />
        <Route path="/rsvp" element={<DashboardRSVP project={project} />} />
        <Route path="/template" element={<DashboardTemplate project={project} />} />
        <Route path="/settings" element={<DashboardSettings project={project} />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
