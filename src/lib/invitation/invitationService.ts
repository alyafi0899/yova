import { supabase } from '../supabase'
import type { InvitationProject, InvitationData, RSVPResponse, Guest, InvitationRevision, InvitationTemplate } from './types'
import { MOCK_TEMPLATES } from './templates'

export const invitationService = {
  // Auth
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
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
    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('invitation_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(p => this.mapProject(p))
  },

  async getProjectById(id: string): Promise<InvitationProject | undefined> {
    const user = await this.getCurrentUser()
    const { data, error } = await supabase
      .from('invitation_projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user?.id)
      .single()

    if (error) return undefined
    return this.mapProject(data)
  },

  async getProjectBySlug(slug: string): Promise<InvitationProject | undefined> {
    const { data, error } = await supabase
      .from('invitation_projects')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) return undefined
    return this.mapProject(data)
  },

  async createProject(templateId: string, title: string): Promise<InvitationProject> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('Unauthorized')

    const template = MOCK_TEMPLATES.find(t => t.id === templateId)

    const initialData: InvitationData = {
      title,
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
      sections: template?.sections.map(s => ({
        id: s.id,
        type: s.type,
        enabled: true,
        config: JSON.parse(JSON.stringify(s.config))
      })) || []
    }

    const { data, error } = await supabase
      .from('invitation_projects')
      .insert({
        user_id: user.id,
        template_id: templateId,
        slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 4),
        title,
        status: 'draft',
        data: initialData
      })
      .select()
      .single()

    if (error) throw error
    return this.mapProject(data)
  },

  async updateProject(id: string, update: Partial<InvitationProject>): Promise<void> {
    const user = await this.getCurrentUser()
    const dbUpdate: any = {}
    if (update.title) dbUpdate.title = update.title
    if (update.slug) dbUpdate.slug = update.slug
    if (update.status) dbUpdate.status = update.status
    if (update.isActive !== undefined) dbUpdate.is_active = update.isActive
    if (update.voucherCode) dbUpdate.voucher_code = update.voucherCode
    if (update.data) dbUpdate.data = update.data

    dbUpdate.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from('invitation_projects')
      .update(dbUpdate)
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) throw error
  },

  async deleteProject(id: string): Promise<void> {
    const user = await this.getCurrentUser()
    const { error } = await supabase
      .from('invitation_projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id)

    if (error) throw error
  },

  mapProject(db: any): InvitationProject {
    return {
      id: db.id,
      userId: db.user_id,
      templateId: db.template_id,
      slug: db.slug,
      title: db.title,
      status: db.status,
      data: db.data,
      isActive: db.is_active,
      voucherCode: db.voucher_code,
      createdAt: db.created_at,
      updatedAt: db.updated_at
    }
  },

  // Guests
  async getGuests(projectId: string): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('invitation_guests')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(g => ({
      ...g,
      projectId: g.project_id,
      guestCount: g.guest_count,
      rsvpStatus: g.rsvp_status
    }))
  },

  async addGuest(projectId: string, guest: any): Promise<void> {
    const { error } = await supabase
      .from('invitation_guests')
      .insert({
        project_id: projectId,
        name: guest.name,
        whatsapp: guest.whatsapp,
        category: guest.category,
        guest_count: guest.guestCount,
        status: 'invited',
        rsvp_status: 'pending',
        slug: guest.name.toLowerCase().replace(/\s+/g, '-')
      })

    if (error) throw error
  },

  async updateGuest(id: string, update: any): Promise<void> {
    const dbUpdate: any = {}
    if (update.name) dbUpdate.name = update.name
    if (update.whatsapp) dbUpdate.whatsapp = update.whatsapp
    if (update.category) dbUpdate.category = update.category
    if (update.guestCount) dbUpdate.guest_count = update.guestCount
    if (update.status) dbUpdate.status = update.status
    if (update.rsvpStatus) dbUpdate.rsvp_status = update.rsvpStatus

    const { error } = await supabase
      .from('invitation_guests')
      .update(dbUpdate)
      .eq('id', id)

    if (error) throw error
  },

  async deleteGuest(id: string): Promise<void> {
    const { error } = await supabase
      .from('invitation_guests')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Revisions
  async getRevisions(projectId: string): Promise<InvitationRevision[]> {
    const { data, error } = await supabase
      .from('invitation_revisions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(r => ({
      ...r,
      projectId: r.project_id
    }))
  },

  async createRevision(projectId: string, note: string, data: InvitationData): Promise<void> {
    const revisions = await this.getRevisions(projectId)
    const { error } = await supabase
      .from('invitation_revisions')
      .insert({
        project_id: projectId,
        version: `1.${revisions.length + 1}`,
        note,
        data
      })

    if (error) throw error
  },

  // RSVP
  async submitRSVP(response: any): Promise<void> {
    const { error } = await supabase
      .from('invitation_rsvps')
      .insert({
        project_id: response.projectId,
        guest_id: response.guestId,
        name: response.name,
        attendance: response.attendance,
        guests: response.guests,
        message: response.message
      })

    if (error) throw error
  },

  async getRSVPs(projectId: string): Promise<RSVPResponse[]> {
    const { data, error } = await supabase
      .from('invitation_rsvps')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(r => ({
      ...r,
      projectId: r.project_id,
      guestId: r.guest_id
    }))
  },

  // Vouchers & Activation
  async validateVoucher(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
    // 1. Check for hardcoded legacy vouchers (for backward compatibility)
    if (code === 'PROMO2026') {
      return { valid: true, discount: 50, message: 'Voucher Promo Berhasil! Diskon 50%.' }
    }

    // 2. Check for Rental ID as a voucher (e.g., SKN-1234-567)
    // In production, we check the 'rentals' table for this booking_id
    const { data, error } = await supabase
      .from('rentals')
      .select('status')
      .eq('booking_id', code.toUpperCase())
      .single()

    if (data && !error) {
      return {
        valid: true,
        discount: 100,
        message: `ID Fitting Berhasil Digunakan! Status Baju: ${data.status.toUpperCase()}.`
      }
    }

    // 3. Fallback for dress codes
    if (code.startsWith('DRS-') && code.length > 8) {
      return { valid: true, discount: 100, message: 'Voucher Rental Baju Berhasil Digunakan! Diskon 100%.' }
    }

    return { valid: false, discount: 0, message: 'Kode Voucher atau ID Fitting Tidak Valid.' }
  }
}
