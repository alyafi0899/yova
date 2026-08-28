import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getAllTemplates } from '../../lib/invitation/templates'
import { createInvitationFromTemplate } from '../../lib/invitation/engine'
import { formatPrice } from '../../lib/invitation/format'
import TemplatePreviewModal from '../../components/invitation/TemplatePreviewModal'
import type { InvitationTemplate } from '../../lib/invitation/types'

const TEMPLATES = getAllTemplates()
const FILTERS = ['Semua', 'Islamic', 'Floral', 'Modern', 'Traditional', 'Minimalist']

function TemplateCard({ t, onPreview }: { t: InvitationTemplate; onPreview: () => void }) {
  const cornerBadge = t.price === 0 ? 'Free' : t.badge

  return (
    <Link
      to={`/invitation/templates/${t.id}`}
      className="group bg-white border border-nude transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-64 overflow-hidden bg-soft">
        <img
          src={`https://images.unsplash.com/${t.thumbnail}?w=600&h=800&fit=crop&auto=format`}
          alt={t.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {cornerBadge && (
          <div className="absolute top-4 left-4 text-[9px] px-2 py-0.5 bg-charcoal text-ivory font-bold uppercase tracking-widest">
            {cornerBadge}
          </div>
        )}

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPreview() }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-charcoal/50 backdrop-blur-[1px] text-ivory text-[10px] font-bold uppercase tracking-widest"
        >
          Quick Preview
        </button>
      </div>

      {/* Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-xl text-charcoal">{t.name}</h3>
            <span className="text-sm font-bold text-mocha whitespace-nowrap">{formatPrice(t.price)}</span>
          </div>
          <p className="text-muted text-xs leading-relaxed">{t.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-6 border-t border-nude">
          <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{t.style}</span>
          <span className="text-[9px] font-bold text-mocha uppercase tracking-widest group-hover:underline">Details →</span>
        </div>
      </div>
    </Link>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Semua')
  const [preview, setPreview] = useState<InvitationTemplate | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = TEMPLATES.filter(t =>
    filter === 'Semua' || t.category.toLowerCase() === filter.toLowerCase()
  )

  const handleUseTemplate = async (template: InvitationTemplate) => {
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

  return (
    <div className="min-h-screen bg-ivory font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-nude h-16 flex items-center justify-between px-6 sm:px-10">
        <Link to="/" className="text-left group">
          <div className="font-display text-xl tracking-wide text-charcoal group-hover:text-mocha transition-colors">YOVA</div>
          <div className="text-[9px] tracking-[0.22em] uppercase text-muted">Sewa Baju Akad · Blangkejeren</div>
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-charcoal hover:text-mocha transition-colors">Dashboard Saya</Link>
          <Link to="/invitation/auth?mode=signup" className="px-6 py-2 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-md" style={{ borderRadius: '2px' }}>Daftar Gratis</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-4 font-bold">Koleksi Desain</p>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal leading-tight mb-6">
            Wujudkan Undangan<br /><em className="text-mocha italic">Impian</em> Anda
          </h1>
          <p className="mt-4 text-muted max-w-xl mx-auto text-sm leading-relaxed">Pilih dari berbagai template premium yang dirancang khusus untuk memikat tamu undangan Anda.</p>
        </div>

        {/* Filter */}
        <div className="flex justify-center flex-wrap gap-3 mb-16 animate-in fade-in delay-200">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                filter === f ? 'bg-mocha text-ivory shadow-lg' : 'bg-white text-muted border border-nude hover:border-mocha hover:text-charcoal'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map(t => (
            <TemplateCard key={t.id} t={t} onPreview={() => setPreview(t)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32 bg-cream/20 border border-dashed border-nude italic text-muted text-sm rounded-sm">
            Belum ada template yang tersedia untuk kategori ini.
          </div>
        )}

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
