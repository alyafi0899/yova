import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getTemplate, getAllTemplates } from '../../lib/invitation/templates'
import { createInvitationFromTemplate } from '../../lib/invitation/engine'
import { formatPrice } from '../../lib/invitation/format'
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
          <Link to="/invitation/templates" className="text-[10px] font-bold uppercase tracking-widest text-mocha hover:underline">
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
      const slug = `undangan-${template.id}-${Math.floor(Math.random() * 10000)}`
      const newInv = createInvitationFromTemplate(template, user.id, slug)

      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          id: newInv.id,
          user_id: user.id,
          template_id: newInv.templateId,
          template_version: newInv.templateVersion,
          slug: newInv.slug,
          title: newInv.title,
          content: newInv.content,
          status: newInv.status,
          thumbnail: `https://images.unsplash.com/${template.thumbnail}?w=400&h=300&fit=crop`
        }])
        .select()

      if (error) throw error
      if (data) navigate(`/invitation/builder?id=${data[0].id}`)
    } catch (err) {
      console.error(err)
      alert('Gagal membuat undangan. Silakan coba lagi.')
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
        <Link to="/invitation/templates" className="inline-block text-[10px] font-bold uppercase tracking-widest text-muted hover:text-mocha transition-colors mb-10">
          ← Back to Marketplace
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-soft">
            <img
              src={`https://images.unsplash.com/${template.thumbnail}?w=900&h=1200&fit=crop&auto=format`}
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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal mb-5">Key Features</p>
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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal mb-4">Experience</p>
              <p className="text-sm text-muted leading-relaxed italic">{template.experience}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleUseTemplate}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? 'Menyiapkan…' : 'Use This Template'}
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="flex-1 px-8 py-4 bg-white border border-nude text-charcoal text-[10px] font-bold uppercase tracking-[0.2em] hover:border-mocha hover:text-mocha transition-all"
              >
                Preview Invitation
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
                      src={`https://images.unsplash.com/${t.thumbnail}?w=400&h=500&fit=crop&auto=format`}
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
