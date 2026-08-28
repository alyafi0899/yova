import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getAllTemplates } from '../../lib/invitation/templates'
import { formatPrice } from '../../lib/invitation/format'
import { invitationService } from '../../lib/invitation/invitationService'
import TemplatePreviewModal from '../../components/invitation/TemplatePreviewModal'
import type { InvitationTemplate } from '../../lib/invitation/types'

const TEMPLATES = getAllTemplates()

function TemplateCard({ t, onPreview }: { t: InvitationTemplate; onPreview: () => void }) {
  const cornerBadge = t.badge

  return (
    <div
      className="group bg-white border border-nude transition-all hover:shadow-2xl overflow-hidden flex flex-col md:flex-row md:h-[400px]"
    >
      {/* Thumbnail */}
      <div className="relative md:w-1/2 h-80 md:h-full overflow-hidden bg-soft shrink-0">
        <img
          src={t.thumbnail}
          alt={t.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {cornerBadge && (
          <div className="absolute top-6 left-6 text-[10px] px-3 py-1 bg-charcoal text-ivory font-bold uppercase tracking-[0.2em] shadow-lg">
            {cornerBadge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-10 flex-1 flex flex-col justify-center">
        <div>
          <div className="flex items-center gap-4 mb-4">
             <span className="text-[10px] font-bold text-mocha uppercase tracking-[0.3em]">{t.style}</span>
             <div className="h-px w-8 bg-nude" />
             <span className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">v{t.version}</span>
          </div>
          <h3 className="font-display text-4xl text-charcoal mb-6">{t.name}</h3>
          <p className="text-muted text-sm leading-relaxed mb-10 max-w-sm">{t.description}</p>

          <div className="space-y-4 mb-10">
             {t.keyFeatures.slice(0, 3).map(f => (
               <div key={f} className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-charcoal font-medium">
                  <span className="text-mocha">✦</span>
                  {f}
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onPreview}
            className="w-full sm:w-auto px-8 py-3 border border-charcoal text-charcoal text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-charcoal hover:text-white transition-all"
          >
            Preview Design
          </button>
          <button
            onClick={() => onPreview()} // Use preview then "Pilih" in modal
            className="w-full sm:w-auto px-8 py-3 bg-mocha text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-mocha-dark transition-all text-center"
          >
            Pilih Desain Ini
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<InvitationTemplate | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUseTemplate = async (template: InvitationTemplate) => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate('/invitation/auth?mode=signup')
      return
    }

    try {
      await invitationService.createProject(template.id, `Wedding of ${user.email?.split('@')[0]}`)
      navigate(`/invitation/dashboard`)
    } catch (err) {
      console.error(err)
      alert('Gagal menyiapkan dashboard. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory font-sans selection:bg-mocha/20">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-nude h-16 flex items-center justify-between px-6 sm:px-10">
        <Link to="/" className="text-left group shrink-0">
          <div className="font-display text-xl tracking-wide text-charcoal group-hover:text-mocha transition-colors">YOVA</div>
          <div className="text-[9px] tracking-[0.22em] uppercase text-muted hidden sm:block">Sewa Baju Akad · Blangkejeren</div>
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/invitation/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-charcoal hover:text-mocha transition-colors">Dashboard Saya</Link>
          <Link to="/invitation/auth?mode=signup" className="px-6 py-2 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-md" style={{ borderRadius: '2px' }}>Daftar Gratis</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-32 md:py-48">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-[11px] tracking-[0.4em] uppercase text-mocha mb-6 font-bold">The Design Collection</p>
          <h1 className="font-display text-5xl md:text-7xl text-charcoal leading-tight mb-8">
             Undangan Digital<br /><em className="italic font-normal">Sakinah</em>
          </h1>
          <p className="mt-4 text-muted max-w-xl mx-auto text-sm md:text-base leading-relaxed">
             Desain eksklusif yang dirancang with penuh ketulusan untuk mengabadikan momen suci pernikahan Anda.
          </p>
        </div>

        {/* Focused Layout for SAKINAH only */}
        <div className="max-w-5xl mx-auto">
           {TEMPLATES.map(t => (
             <TemplateCard key={t.id} t={t} onPreview={() => setPreview(t)} />
           ))}
        </div>

        {/* Features teaser */}
        <div className="mt-32 grid md:grid-cols-3 gap-12 pt-20 border-t border-nude">
           {[
             { title: 'Editor Visual', desc: 'Kustomisasi mudah dengan antarmuka Canva-like yang intuitif.', icon: '🎨' },
             { title: 'Real-time Preview', desc: 'Lihat perubahan Anda secara instan dalam tampilan mobile dan desktop.', icon: '📱' },
             { title: 'Fitur Lengkap', desc: 'RSVP otomatis, peta lokasi, galeri foto, dan ucapan tamu.', icon: '⚡' },
           ].map(feat => (
             <div key={feat.title} className="text-center space-y-3">
                <span className="text-3xl block">{feat.icon}</span>
                <h4 className="font-display text-xl text-charcoal">{feat.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
             </div>
           ))}
        </div>
      </div>

      {preview && <TemplatePreviewModal template={preview} onClose={() => setPreview(null)} onUse={() => handleUseTemplate(preview)} />}

      {loading && (
        <div className="fixed inset-0 z-[200] bg-ivory/80 backdrop-blur-sm flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-4 border-mocha/20 border-t-mocha rounded-full animate-spin mb-6" />
           <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal animate-pulse">Menyiapkan Undangan Anda...</p>
        </div>
      )}
    </div>
  )
}
