import React from 'react'
import type { TemplateSection, ThemeConfig, TemplateElement } from '../../../lib/invitation/types'
import CoverSection from './sections/CoverSection'
import CoupleSection from './sections/CoupleSection'
import EventSection from './sections/EventSection'
import StorySection from './sections/StorySection'
import GallerySection from './sections/GallerySection'
import RSVPSection from './sections/RSVPSection'
import WishesSection from './sections/WishesSection'
import GiftSection from './sections/GiftSection'

interface SectionRendererProps {
  section: TemplateSection
  invitationId?: string
  theme: ThemeConfig
  mode: 'edit' | 'preview' | 'public'
  isActive?: boolean
  activeElementId?: string
  onElementClick?: (id: string) => void
  onElementUpdate?: (elId: string, updates: Partial<TemplateElement>) => void
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  invitationId,
  theme,
  mode,
  isActive,
  activeElementId,
  onElementClick,
  onElementUpdate
}) => {
  if (!section.enabled && mode !== 'edit') return null

  const commonProps = {
    section,
    invitationId,
    theme,
    mode,
    isActive,
    activeElementId,
    onElementClick,
    onElementUpdate
  }

  switch (section.type) {
    case 'cover':
      return <CoverSection {...commonProps} />
    case 'couple':
      return <CoupleSection {...commonProps} />
    case 'event':
      return <EventSection {...commonProps} />
    case 'story':
      return <StorySection {...commonProps} />
    case 'gallery':
      return <GallerySection {...commonProps} />
    case 'rsvp':
      return <RSVPSection {...commonProps} />
    case 'wishes':
      return <WishesSection {...commonProps} />
    case 'gift':
      return <GiftSection {...commonProps} />
    // Add more cases as sections are implemented
    default:
      return (
        <div className="p-10 text-center border border-dashed border-nude/30 opacity-50">
          <p className="text-[10px] uppercase tracking-widest">Unsupported Section: {section.type}</p>
        </div>
      )
  }
}

export default SectionRenderer
