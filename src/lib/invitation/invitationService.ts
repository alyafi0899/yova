import type { InvitationProject, InvitationData, RSVPResponse, GuestWish, InvitationTemplate } from './types'
import { MOCK_TEMPLATES } from './templates'

const PROJECTS_KEY = 'yova_projects'
const RSVPS_KEY = 'yova_rsvps'
const WISHES_KEY = 'yova_wishes'
const GUESTS_KEY = 'yova_guests'
const REVISIONS_KEY = 'yova_revisions'
const AUTH_KEY = 'yova_auth'

export const invitationService = {
  // Auth Mock
  async login(email: string): Promise<any> {
    const user = { id: 'user_' + Math.random().toString(36).substr(2, 9), email }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return user
  },

  getCurrentUser() {
    const data = localStorage.getItem(AUTH_KEY)
    return data ? JSON.parse(data) : null
  },

  logout() {
    localStorage.removeItem(AUTH_KEY)
  },

  // Templates
  async getTemplates(): Promise<InvitationTemplate[]> {
    return MOCK_TEMPLATES
  },

  async getTemplateBySlug(slug: string): Promise<InvitationTemplate | undefined> {
    return MOCK_TEMPLATES.find(t => t.slug === slug)
  },

  // Projects
  async getProjects(): Promise<InvitationProject[]> {
    const data = localStorage.getItem(PROJECTS_KEY)
    return data ? JSON.parse(data) : []
  },

  async getProjectById(id: string): Promise<InvitationProject | undefined> {
    const projects = await this.getProjects()
    return projects.find(p => p.id === id)
  },

  async getProjectBySlug(slug: string): Promise<InvitationProject | undefined> {
    const projects = await this.getProjects()
    return projects.find(p => p.slug === slug)
  },

  async createProject(templateId: string, title: string): Promise<InvitationProject> {
    const user = this.getCurrentUser()
    const template = MOCK_TEMPLATES.find(t => t.id === templateId)

    const newProject: InvitationProject = {
      id: 'proj_' + Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      templateId,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        title,
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
        sections: template?.sections.map(s => ({
          id: s.id,
          type: s.type,
          enabled: true,
          config: JSON.parse(JSON.stringify(s.config))
        })) || []
      }
    }

    const projects = await this.getProjects()
    projects.push(newProject)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    return newProject
  },

  async updateProject(id: string, data: Partial<InvitationProject>): Promise<void> {
    const projects = await this.getProjects()
    const index = projects.findIndex(p => p.id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...data, updatedAt: new Date().toISOString() }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    }
  },

  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects()
    const filtered = projects.filter(p => p.id !== id)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered))
  },

  // Guests
  async getGuests(projectId: string): Promise<Guest[]> {
    const data = localStorage.getItem(GUESTS_KEY)
    const guests = data ? JSON.parse(data) : []
    return guests.filter((g: Guest) => g.projectId === projectId)
  },

  async addGuest(projectId: string, guest: Omit<Guest, 'id' | 'projectId' | 'createdAt' | 'status' | 'rsvpStatus' | 'slug'>): Promise<Guest> {
    const newGuest: Guest = {
      ...guest,
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      projectId,
      status: 'invited',
      rsvpStatus: 'pending',
      slug: guest.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString()
    }
    const guests = JSON.parse(localStorage.getItem(GUESTS_KEY) || '[]')
    guests.push(newGuest)
    localStorage.setItem(GUESTS_KEY, JSON.stringify(guests))
    return newGuest
  },

  // Revisions
  async getRevisions(projectId: string): Promise<InvitationRevision[]> {
    const data = localStorage.getItem(REVISIONS_KEY)
    const revisions = data ? JSON.parse(data) : []
    return revisions.filter((r: InvitationRevision) => r.projectId === projectId)
  },

  async createRevision(projectId: string, note: string, data: InvitationData): Promise<InvitationRevision> {
    const revisions = await this.getRevisions(projectId)
    const newRevision: InvitationRevision = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      projectId,
      version: `1.${revisions.length}`,
      note,
      data: JSON.parse(JSON.stringify(data)),
      createdAt: new Date().toISOString()
    }
    const allRevisions = JSON.parse(localStorage.getItem(REVISIONS_KEY) || '[]')
    allRevisions.push(newRevision)
    localStorage.setItem(REVISIONS_KEY, JSON.stringify(allRevisions))
    return newRevision
  },

  // Vouchers
  async validateVoucher(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
    if (code.startsWith('DRS-') && code.length > 8) {
      return { valid: true, discount: 100, message: 'Voucher Rental Baju Berhasil Digunakan! Diskon 100%.' }
    }
    if (code === 'PROMO2026') {
      return { valid: true, discount: 50, message: 'Voucher Promo Berhasil! Diskon 50%.' }
    }
    return { valid: false, discount: 0, message: 'Kode Voucher Tidak Valid.' }
  },

  // RSVP
  async submitRSVP(response: Omit<RSVPResponse, 'id' | 'createdAt'>): Promise<RSVPResponse> {
    const newRSVP: RSVPResponse = {
      ...response,
      id: 'rsvp_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }
    const rsvps = JSON.parse(localStorage.getItem(RSVPS_KEY) || '[]')
    rsvps.push(newRSVP)
    localStorage.setItem(RSVPS_KEY, JSON.stringify(rsvps))
    return newRSVP
  },

  async getRSVPs(projectId: string): Promise<RSVPResponse[]> {
    const rsvps = JSON.parse(localStorage.getItem(RSVPS_KEY) || '[]')
    return rsvps.filter((r: RSVPResponse) => r.projectId === projectId)
  },

  // Guestbook
  async submitWish(wish: Omit<GuestWish, 'id' | 'createdAt'>): Promise<GuestWish> {
    const newWish: GuestWish = {
      ...wish,
      id: 'wish_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }
    const wishes = JSON.parse(localStorage.getItem(WISHES_KEY) || '[]')
    wishes.push(newWish)
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes))
    return newWish
  },

  async getWishes(projectId: string): Promise<GuestWish[]> {
    const wishes = JSON.parse(localStorage.getItem(WISHES_KEY) || '[]')
    return wishes.filter((w: GuestWish) => w.projectId === projectId)
  }
}
