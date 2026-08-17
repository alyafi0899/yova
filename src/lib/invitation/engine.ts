import type { InvitationTemplate, UserInvitation, TemplateSection, TemplateElement, TemplateWidget } from './types'

/**
 * Template Engine
 * Responsibilities:
 * 1. Merge Template + User Customizations
 * 2. Validate Invitation Data
 * 3. Handle Versioning (conceptual for now)
 */

export function mergeInvitationData(
  template: InvitationTemplate,
  invitation: UserInvitation
): InvitationTemplate & { instanceId: string } {
  // Deep clone template to avoid mutations
  const merged: any = JSON.parse(JSON.stringify(template))
  merged.instanceId = invitation.id

  // Merge Theme
  if (invitation.content.theme) {
    merged.theme = {
      ...merged.theme,
      ...invitation.content.theme,
      colors: {
        ...merged.theme.colors,
        ...invitation.content.theme.colors,
      },
      fonts: {
        ...merged.theme.fonts,
        ...invitation.content.theme.fonts,
      },
    }
  }

  // Merge Sections
  invitation.content.sections.forEach((userSection) => {
    const templateSectionIdx = merged.sections.findIndex((s) => s.id === userSection.id)
    if (templateSectionIdx > -1) {
      const section = merged.sections[templateSectionIdx]

      // Update basic props
      section.enabled = userSection.enabled
      section.config = { ...section.config, ...userSection.config }

      // Update Elements if any
      if (userSection.elements) {
        userSection.elements.forEach((userEl) => {
          const elIdx = section.elements.findIndex((el) => el.id === userEl.id)
          if (elIdx > -1) {
            const el = section.elements[elIdx]
            if (userEl.style) el.style = { ...el.style, ...userEl.style }
            if (userEl.content !== undefined) el.content = userEl.content
          }
        })
      }

      // Update Widgets if any
      if (userSection.widgets) {
        userSection.widgets.forEach((userW) => {
          const wIdx = section.widgets.findIndex((w) => w.id === userW.id)
          if (wIdx > -1) {
            const w = section.widgets[wIdx]
            w.config = { ...w.config, ...userW.config }
          }
        })
      }
    }
  })

  return merged
}

/**
 * Creates a new blank invitation from a template
 */
export function createInvitationFromTemplate(
  template: InvitationTemplate,
  userId: string,
  slug: string
): UserInvitation {
  return {
    id: crypto.randomUUID(),
    userId,
    templateId: template.id,
    templateVersion: template.version,
    slug,
    title: `Undangan ${template.name}`,
    content: {
      sections: template.sections.map((s) => ({
        id: s.id,
        enabled: s.enabled,
        config: JSON.parse(JSON.stringify(s.config)),
      })),
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
