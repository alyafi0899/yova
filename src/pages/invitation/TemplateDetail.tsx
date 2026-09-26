import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getTemplate, getAllTemplates } from '../../lib/invitation/templates'
import { formatPrice } from '../../lib/invitation/format'
import { invitationService } from '../../lib/invitation/invitationService'
import TemplatePreviewModal from '../../components/invitation/TemplatePreviewModal'

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const template = id ? getTemplate(id) : undefined
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!template) {
    return (
      <div className="min-h-screen bg-ivory font-sans flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="font-display text-2xl text-charcoal">Template tidak ditemukan</p>
          <Link to="/invitation" className="text-[10px] font-bold uppercase tracking-widest text-mocha hover:underline">
            ← Kembali ke Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const handleUseTemplate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate('/invitation/auth?mode=signup')
      return
    }

    try {
      const existingProjects = await invitationService.getProjects()
      let targetProjectId = ''

      if (existingProjects && existingProjects.length > 0) {
        const proj = existingProjects[0]
        targetProjectId = proj.id

        if (proj.templateId !== template.id) {
          const newData = { ...proj.data }
          newData.sections = template.sections.map((s: any) => {
             const existing = proj.data.sections?.find(es => es.id === s.id)
             return {
                id: s.id,
                type: s.type,
                enabled: existing ? existing.enabled !== false : true,
                config: existing ? { ...s.config, ...existing.config } : JSON.parse(JSON.stringify(s.config))
             }
          })

          await invitationService.updateProject(proj.id, {
             templateId: template.id,
             data: newData
          })
        }
      } else {
        const newProj = await invitationService.createProject(template.id, `Wedding of ${user.email?.split('@')[0]}`)
        targetProjectId = newProj.id
      }

      if (targetProjectId) {
        sessionStorage.setItem('yova_last_proj_id', targetProjectId)
      }

      navigate('/invitation/dashboard/customize')
    } catch (err) {
      console.error(err)
      alert('Gagal menyiapkan editor undangan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const related = getAllTemplates().filter(t => t.id !== template.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-ivory font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-nude h-16 flex items-center justify-between px-6 sm:px-10">
        <Link to="/" className="text-left group">
          <div className="font-display text-xl tracking-wide text-charcoal group-hover:text-mocha transition-colors">YOVA</div>
          <div className="text-[9px] tracking-[0.22em] uppercase text-muted">Sewa Baju Akad · Blangkejeren</div>
        </Link>
        <Link to="/invitation/auth?mode=signup" className="px-6 py-2 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-md" style={{ borderRadius: '2px' }}>Daftar Gratis</Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <Link to="/invitation" className="inline-block text-[10px] font-bold uppercase tracking-widest text-muted hover:text-mocha transition-colors mb-10">
          ← Kembali ke Marketplace
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-soft">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mocha mb-3">{template.style}</p>
            <h1 className="font-display text-5xl text-charcoal mb-4">{template.name}</h1>
            <p className="text-lg font-bold text-mocha mb-8">{formatPrice(template.price)}</p>
            <p className="text-sm text-muted leading-relaxed mb-10">{template.description}</p>

            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal mb-5">Fitur Utama</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {template.keyFeatures.map(feat => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-charcoal">
                    <span className="text-mocha mt-0.5">✦</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal mb-4">Pengalaman Desain</p>
              <p className="text-sm text-muted leading-relaxed italic">{template.experience}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleUseTemplate}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? 'Menyiapkan…' : 'Pilih Template Ini & Edit'}
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="flex-1 px-8 py-4 bg-white border border-nude text-charcoal text-[10px] font-bold uppercase tracking-[0.2em] hover:border-mocha hover:text-mocha transition-all"
              >
                Preview Desain
              </button>
            </div>
          </div>
        </div>

        {/* Related templates */}
        {related.length > 0 && (
          <div className="mt-32 pt-16 border-t border-nude">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-8">Template Lainnya</p>
            <div className="grid sm:grid-cols-3 gap-8">
              {related.map(t => (
                <Link key={t.id} to={`/invitation/templates/${t.id}`} className="group block">
                  <div className="relative h-48 overflow-hidden bg-soft mb-3">
                    <img
                      src={t.thumbnail}
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base text-charcoal">{t.name}</span>
                    <span className="text-xs font-bold text-mocha">{formatPrice(t.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <TemplatePreviewModal
          template={template}
          onClose={() => setShowPreview(false)}
          onUse={handleUseTemplate}
        />
      )}
    </div>
  )
}
