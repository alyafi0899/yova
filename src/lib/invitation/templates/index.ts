import { InvitationTemplate } from '../types'
import { noura_v1 } from './noura_v1'

export const TEMPLATE_REGISTRY: Record<string, InvitationTemplate> = {
  'noura': noura_v1,
}

export const getTemplate = (id: string): InvitationTemplate | undefined => {
  return TEMPLATE_REGISTRY[id]
}

export const getAllTemplates = (): InvitationTemplate[] => {
  return Object.values(TEMPLATE_REGISTRY)
}
