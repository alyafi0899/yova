import { useState, useCallback } from 'react'
import type { InvitationTemplate, UserInvitation, TemplateSection, ElementStyle, SectionType, ElementType, ThemeConfig } from '../types'
import { mergeInvitationData } from '../engine'

export function useEditor(initialTemplate: InvitationTemplate, initialInvitation?: UserInvitation) {
  const [template, setTemplate] = useState<InvitationTemplate>(initialTemplate)
  const [invitation, setInvitation] = useState<UserInvitation | undefined>(initialInvitation)
  const [selection, setSelection] = useState<{ type: 'section' | 'element' | 'widget'; id: string } | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  const mergedTemplate = invitation ? mergeInvitationData(template, invitation) : template

  const updateSection = useCallback((sectionId: string, updates: Partial<TemplateSection>) => {
    // If we have an invitation, we update the invitation content
    if (invitation) {
      setInvitation((prev) => {
        if (!prev) return prev
        const sections = [...prev.content.sections]
        const idx = sections.findIndex(s => s.id === sectionId)
        if (idx > -1) {
          sections[idx] = { ...sections[idx], ...updates }
        } else {
          // Add new entry if not found
          sections.push({
            id: sectionId,
            enabled: updates.enabled ?? true,
            config: updates.config ?? {},
            ...updates
          } as any)
        }
        return {
          ...prev,
          content: { ...prev.content, sections },
          updatedAt: new Date().toISOString()
        }
      })
    } else {
      // Admin mode: update the template itself
      setTemplate((prev) => {
        const sections = [...prev.sections]
        const idx = sections.findIndex(s => s.id === sectionId)
        if (idx > -1) {
          sections[idx] = { ...sections[idx], ...updates }
        }
        return { ...prev, sections }
      })
    }
    setSaveStatus('unsaved')
  }, [invitation])

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    if (invitation) {
      setInvitation(prev => {
        if (!prev) return prev
        return {
          ...prev,
          content: {
            ...prev.content,
            theme: { ...prev.content.theme, ...updates }
          }
        }
      })
    } else {
      setTemplate(prev => ({
        ...prev,
        theme: { ...prev.theme, ...updates }
      }))
    }
    setSaveStatus('unsaved')
  }, [invitation])

  const addSection = useCallback((type: SectionType) => {
    const id = `${type}-${Date.now()}`
    const newSection: any = {
      id,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      enabled: true,
      config: {},
      elements: [],
      widgets: [],
      editableProperties: []
    }

    if (invitation) {
      setInvitation(prev => {
        if (!prev) return prev
        return {
          ...prev,
          content: {
            ...prev.content,
            sections: [...prev.content.sections, { id, enabled: true, config: {} }]
          }
        }
      })
    } else {
      setTemplate(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }))
    }
    setSelection({ type: 'section', id })
    setSaveStatus('unsaved')
  }, [invitation])

  const removeSection = useCallback((id: string) => {
    if (invitation) {
       setInvitation(prev => {
         if (!prev) return prev
         return {
           ...prev,
           content: {
             ...prev.content,
             sections: prev.content.sections.filter(s => s.id !== id)
           }
         }
       })
    } else {
      setTemplate(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== id)
      }))
    }
    if (selection?.id === id) setSelection(null)
    setSaveStatus('unsaved')
  }, [invitation, selection])

  const reorderSection = useCallback((id: string, direction: 'up' | 'down') => {
    const updateList = (list: any[]) => {
      const idx = list.findIndex(s => s.id === id)
      if (idx === -1) return list
      if (direction === 'up' && idx === 0) return list
      if (direction === 'down' && idx === list.length - 1) return list

      const newList = [...list]
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1
      const [moved] = newList.splice(idx, 1)
      newList.splice(targetIdx, 0, moved)
      return newList
    }

    if (invitation) {
      setInvitation(prev => {
        if (!prev) return prev
        return { ...prev, content: { ...prev.content, sections: updateList(prev.content.sections) } }
      })
    } else {
      setTemplate(prev => ({ ...prev, sections: updateList(prev.sections) }))
    }
    setSaveStatus('unsaved')
  }, [invitation])

  const addElement = useCallback((sectionId: string, type: ElementType, assetUrl?: string, content?: string) => {
    const id = `${type}-${Date.now()}`
    const newElement: any = {
      id,
      type,
      assetUrl,
      content,
      style: {
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        zIndex: 10,
      }
    }

    if (invitation) {
      setInvitation(prev => {
        if (!prev) return prev
        const sections = [...prev.content.sections]
        const sIdx = sections.findIndex(s => s.id === sectionId)
        if (sIdx > -1) {
           const section = sections[sIdx]
           const elements = [...(section.elements || []), newElement]
           sections[sIdx] = { ...section, elements }
        }
        return { ...prev, content: { ...prev.content, sections } }
      })
    } else {
      setTemplate(prev => {
        const sections = [...prev.sections]
        const sIdx = sections.findIndex(s => s.id === sectionId)
        if (sIdx > -1) {
           sections[sIdx] = { ...sections[sIdx], elements: [...sections[sIdx].elements, newElement] }
        }
        return { ...prev, sections }
      })
    }
    setSelection({ type: 'element', id })
    setSaveStatus('unsaved')
  }, [invitation])

  const updateElement = useCallback((sectionId: string, elementId: string, updates: Partial<{ style: Partial<ElementStyle>; content: string }>) => {
    if (invitation) {
       setInvitation((prev) => {
         if (!prev) return prev
         const sections = [...prev.content.sections]
         const sIdx = sections.findIndex(s => s.id === sectionId)
         if (sIdx > -1) {
           const section = sections[sIdx]
           const elements = [...(section.elements || [])]
           const eIdx = elements.findIndex(e => e.id === elementId)
           if (eIdx > -1) {
             elements[eIdx] = { ...elements[eIdx], ...updates }
           } else {
             elements.push({ id: elementId, ...updates })
           }
           sections[sIdx] = { ...section, elements }
         }
         return { ...prev, content: { ...prev.content, sections } }
       })
    }
    setSaveStatus('unsaved')
  }, [invitation])

  return {
    template: mergedTemplate,
    invitation,
    selection,
    setSelection,
    saveStatus,
    setSaveStatus,
    updateSection,
    addSection,
    removeSection,
    reorderSection,
    updateTheme,
    addElement,
    updateElement
  }
}
