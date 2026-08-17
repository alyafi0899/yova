import React from 'react'
import type { InvitationTemplate, TemplateElement } from '../../../lib/invitation/types'
import SectionRenderer from './SectionRenderer'

interface UnifiedRendererProps {
  template: InvitationTemplate
  invitationId?: string
  mode?: 'edit' | 'preview' | 'public'
  activeSectionId?: string
  activeElementId?: string
  onElementClick?: (id: string) => void
  onElementUpdate?: (sectionId: string, elementId: string, updates: Partial<TemplateElement>) => void
}

const UnifiedRenderer: React.FC<UnifiedRendererProps> = ({
  template,
  invitationId,
  mode = 'public',
  activeSectionId,
  activeElementId,
  onElementClick,
  onElementUpdate
}) => {
  const { theme, sections } = template

  return (
    <div
      className="w-full min-h-full transition-colors duration-500"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body
      }}
    >
      {sections.filter(s => s.enabled || mode === 'edit').map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          invitationId={invitationId}
          theme={theme}
          mode={mode}
          isActive={activeSectionId === section.id}
          activeElementId={activeElementId}
          onElementClick={onElementClick}
          onElementUpdate={(elId, updates) => onElementUpdate?.(section.id, elId, updates)}
        />
      ))}
    </div>
  )
}

export default UnifiedRenderer
