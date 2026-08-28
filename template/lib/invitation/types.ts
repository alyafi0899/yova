export type SectionType =
  | 'cover'
  | 'couple'
  | 'quote'
  | 'story'
  | 'event'
  | 'gallery'
  | 'location'
  | 'countdown'
  | 'rsvp'
  | 'gift'
  | 'wishes'
  | 'closing'

export type ElementType = 'image' | 'svg' | 'text' | 'decoration' | 'sticker'

export type WidgetType =
  | 'countdown'
  | 'rsvp'
  | 'event'
  | 'maps'
  | 'gallery'
  | 'gift'
  | 'music'
  | 'wishes'
  | 'calendar'

export type AnimationType =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'slide'
  | 'scale'
  | 'blur-reveal'
  | 'soft-parallax'
  | 'gentle-float'
  | 'sparkle'
  | 'petal-float'
  | 'ken-burns'
  | 'crossfade'

export interface AnimationConfig {
  type: AnimationType
  duration: number
  delay: number
  easing?: string
  intensity?: number
  repeat?: boolean | number
}

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  card: string
}

export interface FontConfig {
  heading: string
  body: string
  accent?: string
}

export interface ThemeConfig {
  colors: ColorPalette
  fonts: FontConfig
  borderRadius: string
}

export interface ElementStyle {
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  rotation: number
  opacity: number
  zIndex: number
  responsive?: {
    mobile?: Partial<ElementStyle>
    tablet?: Partial<ElementStyle>
  }
}

export interface TemplateElement {
  id: string
  type: ElementType
  assetUrl?: string
  content?: string // for text or inline SVG
  style: ElementStyle
  animation?: AnimationConfig
  locked?: boolean
}

export interface TemplateWidget {
  id: string
  type: WidgetType
  config: any
  style?: Partial<ElementStyle>
}

export interface TemplateSection {
  id: string
  type: SectionType
  title?: string
  enabled: boolean
  config: any // section-specific configuration (e.g., event list, story timeline)
  elements: TemplateElement[]
  widgets: TemplateWidget[]
  animation?: AnimationConfig
  locked?: boolean
  editableProperties: string[] // list of keys in config/elements/widgets that user can edit
}

export interface InvitationTemplate {
  id: string
  name: string
  slug: string
  category: string
  style: string
  thumbnail: string
  theme: ThemeConfig
  sections: TemplateSection[]
  animations?: AnimationConfig[] // global animations like petal float
  version: string
  status: 'draft' | 'published' | 'archived'
  /** Price in IDR. 0 = free. Shown on marketplace card + detail page. */
  price: number
  /** One-line marketplace description shown on the card and detail page. */
  description: string
  /** Optional corner badge on the marketplace thumbnail, e.g. "3D Parallax", "Custom". Free templates show "Free" automatically. */
  badge?: string
  /** Short bullet list shown under "Key Features" on the detail page. */
  keyFeatures: string[]
  /** Longer paragraph shown under "Experience" on the detail page. */
  experience: string
}

export interface UserInvitation {
  id: string
  userId: string
  templateId: string
  templateVersion: string
  slug: string
  title: string
  content: {
    theme?: Partial<ThemeConfig>
    sections: {
      id: string
      enabled: boolean
      config: any
      elements?: { id: string; style?: Partial<ElementStyle>; content?: string }[]
      widgets?: { id: string; config?: any }[]
    }[]
  }
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}
