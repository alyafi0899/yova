import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Templates from './pages/Templates'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import PublicInvitation from './pages/PublicInvitation'
import Publish from './pages/Publish'
import RSVPDashboard from './pages/RSVPDashboard'
import Admin from './pages/Admin'
import Wishes from './pages/Wishes'
import InvitationDetail from './pages/InvitationDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/rsvp-dashboard" element={<RSVPDashboard />} />
        <Route path="/i/:slug" element={<PublicInvitation />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/wishes" element={<Wishes />} />
        <Route path="/invitation/:id" element={<InvitationDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
