import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getTemplate } from '../../lib/invitation/templates'
import { useEditor } from '../../lib/invitation/hooks/useEditor'
import UnifiedRenderer from '../../components/invitation/renderer/UnifiedRenderer'
import EditorHeader from '../../components/invitation/editor/EditorHeader'
import EditorSidebar, { EditorTab } from '../../components/invitation/editor/EditorSidebar'
import EditorCanvas from '../../components/invitation/editor/EditorCanvas'
import PropertyInspector from '../../components/invitation/editor/PropertyInspector'
import SectionInspector from '../../components/invitation/editor/SectionInspector'
import ElementInspector from '../../components/invitation/editor/ElementInspector'
import SectionManager from '../../components/invitation/editor/SectionManager'
import ElementLibrary from '../../components/invitation/editor/ElementLibrary'
import ThemeEditor from '../../components/invitation/editor/ThemeEditor'

export default function Builder() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const invitationId = searchParams.get('id')
  const isAdmin = searchParams.get('admin') === 'true'

  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInvitation() {
      if (!invitationId) {
         setLoading(false)
         return
      }

      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single()

      if (error || !data) {
        console.error(error)
        alert('Undangan tidak ditemukan.')
        navigate('/dashboard')
        return
      }

      const template = getTemplate(data.template_id)
      if (!template) {
        alert('Template tidak didukung.')
        navigate('/dashboard')
        return
      }

      setInitialData({ template, invitation: data })
      setLoading(false)
    }
    loadInvitation()
  }, [invitationId, navigate])

  const fallbackTemplate = getTemplate('noura')!
  const {
    template,
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
  } = useEditor(
    initialData?.template || fallbackTemplate,
    initialData?.invitation
  )

  const [activeTab, setActiveTab] = useState<EditorTab>('sections')

  // Autosave effect
  useEffect(() => {
    if (saveStatus === 'unsaved' && invitationId) {
       const timer = setTimeout(() => {
          handleSave()
       }, 3000)
       return () => clearTimeout(timer)
    }
  }, [saveStatus, invitationId, invitation])

  const handleSave = async () => {
    if (!invitationId) {
       setSaveStatus('saved')
       return
    }

    setSaveStatus('saving')
    try {
      const { error } = await supabase
        .from('invitations')
        .update({
          content: invitation?.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId)

      if (error) throw error
      setSaveStatus('saved')
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan perubahan.')
      setSaveStatus('unsaved')
    }
  }

  const handlePublish = () => {
    alert('Publikasi berhasil!')
  }

  if (loading) return (
    <div className="h-screen bg-ivory flex flex-col items-center justify-center">
       <div className="w-10 h-10 border-2 border-mocha/20 border-t-mocha rounded-full animate-spin mb-4" />
       <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Memuat Editor...</p>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-soft font-sans overflow-hidden">
      <EditorHeader
        title={invitation?.title || template.name}
        subtitle={isAdmin ? 'Admin Template Mode' : 'Editing Invitation'}
        saveStatus={saveStatus}
        onSave={handleSave}
        onPublish={handlePublish}
        isAdmin={isAdmin}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className="p-6">
            {activeTab === 'sections' && (
              <SectionManager
                 sections={template.sections}
                 activeId={selection?.id}
                 onSelect={(id) => setSelection({ type: 'section', id })}
                 onAdd={addSection}
                 onRemove={removeSection}
                 onReorder={reorderSection}
              />
            )}
            {activeTab === 'elements' && (
              <ElementLibrary
                onAdd={(type, url, content) => {
                  if (selection?.type === 'section') {
                    addElement(selection.id, type, url, content)
                  } else {
                    alert('Pilih seksi terlebih dahulu untuk menambahkan elemen.')
                  }
                }}
              />
            )}
            {activeTab === 'theme' && (
              <ThemeEditor
                theme={template.theme}
                onUpdate={updateTheme}
              />
            )}
            {/* Other tabs placeholder */}
            {activeTab !== 'sections' && (
              <div className="py-20 text-center space-y-4 opacity-30">
                <p className="text-3xl">🏗</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Tab {activeTab} segera hadir</p>
              </div>
            )}
          </div>
        </EditorSidebar>

        <EditorCanvas onSectionClick={(id) => setSelection({ type: 'section', id })}>
          <UnifiedRenderer
            template={template}
            invitationId={invitationId || undefined}
            mode="edit"
            activeSectionId={selection?.id}
            activeElementId={selection?.type === 'element' ? selection.id : undefined}
            onElementClick={(id) => setSelection({ type: 'element', id })}
            onElementUpdate={updateElement}
          />
        </EditorCanvas>

        <PropertyInspector selection={selection} onUpdate={() => {}}>
          {selection?.type === 'section' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="bg-ivory/50 p-4 border border-nude rounded-sm">
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Seksi Visibilitas</label>
                 <div className="flex gap-2">
                   <button
                     onClick={() => updateSection(selection.id, { enabled: true })}
                     className={`flex-1 py-2 text-[9px] font-bold uppercase border transition-all ${
                       template.sections.find(s => s.id === selection.id)?.enabled
                         ? 'bg-mocha text-white border-mocha shadow-sm'
                         : 'bg-white text-muted border-nude hover:border-mocha'
                     }`}
                     style={{ borderRadius: '2px' }}
                   >Aktif</button>
                   <button
                     onClick={() => updateSection(selection.id, { enabled: false })}
                     className={`flex-1 py-2 text-[9px] font-bold uppercase border transition-all ${
                       !template.sections.find(s => s.id === selection.id)?.enabled
                         ? 'bg-charcoal text-white border-charcoal shadow-sm'
                         : 'bg-white text-muted border-nude hover:border-mocha'
                     }`}
                     style={{ borderRadius: '2px' }}
                   >Sembunyi</button>
                 </div>
               </div>

               <div className="h-px bg-nude" />

               <SectionInspector
                  section={template.sections.find(s => s.id === selection.id)!}
                  onUpdate={(updates) => updateSection(selection.id, updates)}
               />
            </div>
          )}

          {selection?.type === 'element' && (
            <ElementInspector
               element={template.sections.flatMap(s => s.elements).find(el => el.id === selection.id)!}
               onUpdate={(updates) => updateElement(
                 template.sections.find(s => s.elements.some(el => el.id === selection.id))!.id,
                 selection.id,
                 updates as any
               )}
            />
          )}
        </PropertyInspector>
      </div>
    </div>
  )
}
