import { InvitationTemplate } from '../types'
import { noura_v1 } from './noura_v1'
import { minimal_white_v1 } from './minimal_white_v1'
import { islamic_luxury_v1 } from './islamic_luxury_v1'
import { moonlight_garden_v1 } from './moonlight_garden_v1'
import { custom_storybook_v1 } from './custom_storybook_v1'

export const TEMPLATE_REGISTRY: Record<string, InvitationTemplate> = {
  'minimal-white': minimal_white_v1,
  'islamic-luxury': islamic_luxury_v1,
  'moonlight-garden': moonlight_garden_v1,
  'custom-storybook': custom_storybook_v1,
  'noura': noura_v1,
}

export const getTemplate = (id: string): InvitationTemplate | undefined => {
  return TEMPLATE_REGISTRY[id]
}

export const getAllTemplates = (): InvitationTemplate[] => {
  return Object.values(TEMPLATE_REGISTRY)
}
