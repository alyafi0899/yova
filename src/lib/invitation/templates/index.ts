import { InvitationTemplate } from '../types'
import { sakinah_v1 } from './sakinah_v1'
import { yasmin_v1 } from './yasmin_v1'
import { malam_v1 } from './malam_v1'

export const TEMPLATE_REGISTRY: Record<string, InvitationTemplate> = {
  'sakinah': sakinah_v1,
  'yasmin': yasmin_v1,
  'malam': malam_v1,
}

export const MOCK_TEMPLATES = Object.values(TEMPLATE_REGISTRY)

export const getTemplate = (id: string): InvitationTemplate | undefined => {
  return TEMPLATE_REGISTRY[id]
}

export const getAllTemplates = (): InvitationTemplate[] => {
  return MOCK_TEMPLATES
}
