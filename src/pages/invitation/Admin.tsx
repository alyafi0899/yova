import { useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS, type TemplateConfig } from '../components/TemplateRenderer'

// Local mutable template store (in a real app this would be a backend)
const useAdminTemplates = () => {
  const [templates, setTemplates] = useState<TemplateConfig[]>(Object.values(TEMPLATE_CONFIGS))

  const addTemplate = (t: TemplateConfig) => setTemplates(prev => [...prev, t])
  const updateTemplate = (id: string, updates: Partial<TemplateConfig>) =>
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  const deleteTemplate = (id: string) =>
    setTemplates(prev => prev.filter(t => t.id !== id))

  return { templates, addTemplate, updateTemplate, deleteTemplate }
}

const ADMIN_NAV = [
  { icon: '⊞', label: 'Overview', id: 'overview' },
  { icon: '🎨', label: 'Template', id: 'templates' },
  { icon: '👥', label: 'Pengguna', id: 'users' },
  { icon: '💳', label: 'Transaksi', id: 'transactions' },
  { icon: '📊', label: 'Analitik', id: 'analytics' },
  { icon: '⚙', label: 'Pengaturan', id: 'settings' },
]

const MOCK_USERS = [
  { name: 'Al Yafi', email: 'alyafi@email.com', plan: 'published', invitations: 1, joined: '2 Jan 2027' },
  { name: 'Siti Rahma', email: 'siti@email.com', plan: 'draft', invitations: 2, joined: '28 Des 2026' },
  { name: 'Ahmad Fauzan', email: 'ahmad@email.com', plan: 'published', invitations: 1, joined: '15 Des 2026' },
  { name: 'Dewi Rahayu', email: 'dewi@email.com', plan: 'draft', invitations: 3, joined: '10 Des 2026' },
  { name: 'Rizky Pratama', email: 'rizky@email.com', plan: 'published', invitations: 1, joined: '5 Des 2026' },
]

const MOCK_TX = [
  { id: 'TX-001', user: 'Al Yafi', amount: 49000, status: 'success', date: '10 Jan 2027', method: 'GoPay' },
  { id: 'TX-002', user: 'Ahmad Fauzan', amount: 49000, status: 'success', date: '8 Jan 2027', method: 'BCA' },
  { id: 'TX-003', user: 'Rizky Pratama', amount: 49000, status: 'success', date: '6 Jan 2027', method: 'OVO' },
  { id: 'TX-004', user: 'Nurul Aini', amount: 49000, status: 'failed', date: '5 Jan 2027', method: 'DANA' },
  { id: 'TX-005', user: 'Budi Santoso', amount: 49000, status: 'pending', date: '4 Jan 2027', method: 'Mandiri' },
]

function StatCard({ label, value, sub, icon, trend }: { label: string; value: string; sub?: string; icon: string; trend?: string }) {
  return (
    <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-stone-400">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: '#F5EFE6' }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, color: '#1B3A4B' }}>{value}</div>
      {sub && <div className="text-xs text-stone-400 mt-1">{sub}</div>}
      {trend && <div className="text-xs mt-2 text-green-600">↑ {trend} bulan ini</div>}
    </div>
  )
}

function Overview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>Overview Platform</h2>
        <p className="text-stone-400 text-sm mt-1">Data real-time platform Nikahku</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pengguna" value="2,418" sub="terdaftar" icon="👥" trend="+142" />
        <StatCard label="Undangan Aktif" value="1,847" sub="published" icon="💌" trend="+89" />
        <StatCard label="Pendapatan" value="Rp 90,5jt" sub="bulan ini" icon="💰" trend="+12%" />
        <StatCard label="Konversi" value="76.4%" sub="draft → publish" icon="📈" trend="+3.2%" />
      </div>

      {/* Template usage */}
      <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
        <h3 className="font-semibold text-stone-800 mb-5 text-sm">Penggunaan Template</h3>
        <div className="space-y-3">
          {[
            { name: 'Noura', pct: 38, color: '#C9A84C' },
            { name: 'Azzahra', pct: 22, color: '#D4829B' },
            { name: 'Madinah', pct: 15, color: '#2C3E50' },
            { name: 'Zayyan', pct: 12, color: '#1A1A1A' },
            { name: 'Sakinah', pct: 8, color: '#B8860B' },
            { name: 'Kirana', pct: 5, color: '#8B6914' },
          ].map(t => (
            <div key={t.name}>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-stone-600 font-medium">{t.name}</span>
                <span className="text-stone-400">{t.pct}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#F5EFE6' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${t.pct}%`, background: t.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
          <h3 className="font-semibold text-stone-800 mb-4 text-sm">Pendaftar Terbaru</h3>
          <div className="space-y-3">
            {MOCK_USERS.slice(0, 4).map(u => (
              <div key={u.email} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{u.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-700 truncate">{u.name}</div>
                  <div className="text-xs text-stone-400 truncate">{u.email}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.plan === 'published' ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{u.plan}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
          <h3 className="font-semibold text-stone-800 mb-4 text-sm">Transaksi Terbaru</h3>
          <div className="space-y-3">
            {MOCK_TX.slice(0, 4).map(tx => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-700 truncate">{tx.user}</div>
                  <div className="text-xs text-stone-400">{tx.method} · {tx.date}</div>
                </div>
                <span className="text-sm font-semibold text-stone-800">Rp {tx.amount.toLocaleString('id')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === 'success' ? 'bg-green-50 text-green-700' : tx.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>{tx.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatesTab({ templates, addTemplate, updateTemplate, deleteTemplate }: {
  templates: TemplateConfig[]
  addTemplate: (t: TemplateConfig) => void
  updateTemplate: (id: string, updates: Partial<TemplateConfig>) => void
  deleteTemplate: (id: string) => void
}) {
  const [showEditor, setShowEditor] = useState(false)
  const [editTarget, setEditTarget] = useState<TemplateConfig | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleEdit = (t: TemplateConfig) => { setEditTarget({ ...t }); setShowEditor(true) }
  const handleNew = () => {
    setEditTarget({
      id: `custom-${Date.now()}`,
      name: 'Template Baru',
      style: 'Custom',
      tags: ['Kustom'],
      primaryColor: '#1B3A4B',
      accentColor: '#C9A84C',
      bgColor: '#FAF8F4',
      textColor: '#2C2416',
      cardBg: '#FFFFFF',
      fontHeading: 'DM Serif Display',
      fontBody: 'Outfit',
      ornamentStyle: 'geometric',
      borderRadius: '1rem',
      buttonStyle: 'pill',
    })
    setShowEditor(true)
  }

  const handleSave = () => {
    if (!editTarget) return
    const exists = templates.find(t => t.id === editTarget.id)
    if (exists) updateTemplate(editTarget.id, editTarget)
    else addTemplate(editTarget)
    setShowEditor(false)
    setEditTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>Manajemen Template</h2>
          <p className="text-stone-400 text-sm mt-1">{templates.length} template tersedia</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Tambah Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="rounded-2xl border overflow-hidden group transition-all hover:shadow-md" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
            {/* Color preview bar */}
            <div className="h-2 flex">
              <div className="flex-1" style={{ background: t.primaryColor }} />
              <div className="flex-1" style={{ background: t.accentColor }} />
              <div className="flex-1" style={{ background: t.bgColor }} />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>{t.name}</h3>
                  <p className="text-stone-400 text-xs">{t.style}</p>
                </div>
                <div className="flex gap-1">
                  {t.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Font info */}
              <div className="flex gap-3 mb-4">
                <div className="text-xs text-stone-400">
                  <span className="text-stone-600">Heading:</span> {t.fontHeading}
                </div>
                <div className="text-xs text-stone-400">
                  <span className="text-stone-600">Ornamen:</span> {t.ornamentStyle}
                </div>
              </div>

              {/* Mini color palette */}
              <div className="flex items-center gap-2 mb-4">
                {[t.primaryColor, t.accentColor, t.bgColor, t.textColor, t.cardBg].map(c => (
                  <div key={c} className="w-5 h-5 rounded-full border border-stone-200" style={{ background: c }} title={c} />
                ))}
              </div>

              <div className="flex gap-2">
                <Link to={`/templates`} className="flex-1 py-2 rounded-lg text-xs font-medium text-center border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
                  Preview
                </Link>
                <button onClick={() => handleEdit(t)} className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors border" style={{ borderColor: '#1B3A4B', color: '#1B3A4B' }}>
                  Edit
                </button>
                {!['noura', 'azzahra', 'madinah', 'sakinah', 'zayyan', 'alya', 'serambi', 'kirana'].includes(t.id) && (
                  <button onClick={() => setConfirmDelete(t.id)} className="px-3 py-2 rounded-lg text-xs font-medium transition-colors border" style={{ borderColor: '#E0D9CF', color: '#B84040' }}>
                    🗑
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="font-semibold text-stone-800 mb-2">Hapus Template?</h3>
            <p className="text-stone-500 text-sm mb-5">Tindakan ini tidak dapat diurungkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>Batal</button>
              <button onClick={() => { deleteTemplate(confirmDelete); setConfirmDelete(null) }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#B84040', color: '#FFFFFF' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showEditor && editTarget && (
        <AdminTemplateEditorModal
          template={editTarget}
          onChange={setEditTarget}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditTarget(null) }}
        />
      )}
    </div>
  )
}

function AdminTemplateEditorModal({ template, onChange, onSave, onClose }: {
  template: TemplateConfig
  onChange: (t: TemplateConfig) => void
  onSave: () => void
  onClose: () => void
}) {
  const iStyle = { border: '1px solid #E0D9CF', background: '#FAF8F4' }
  const iClass = "w-full px-3 py-2.5 rounded-lg text-sm outline-none"
  const lClass = "block text-xs text-stone-400 mb-1.5 font-medium uppercase tracking-wide"

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="absolute inset-4 bg-white rounded-2xl flex overflow-hidden shadow-2xl">
        {/* Left: form */}
        <div className="w-96 flex-shrink-0 overflow-y-auto p-6 border-r" style={{ borderColor: '#E0D9CF' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#1B3A4B' }}>
              {template.name || 'Template Baru'}
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400">✕</button>
          </div>

          <div className="space-y-5">
            {/* Identitas */}
            <section>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Identitas Template</p>
              <div className="space-y-3">
                <div>
                  <label className={lClass}>Nama Template</label>
                  <input className={iClass} style={iStyle} value={template.name} onChange={e => onChange({ ...template, name: e.target.value })} placeholder="Nama Template" onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
                <div>
                  <label className={lClass}>Deskripsi Gaya</label>
                  <input className={iClass} style={iStyle} value={template.style} onChange={e => onChange({ ...template, style: e.target.value })} placeholder="Islamic Elegant" onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
                <div>
                  <label className={lClass}>Tags (pisahkan koma)</label>
                  <input className={iClass} style={iStyle} value={template.tags.join(', ')} onChange={e => onChange({ ...template, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Islam, Elegan, Gold" onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                </div>
              </div>
            </section>

            {/* Warna */}
            <section>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Palet Warna</p>
              <div className="space-y-3">
                {([
                  ['Warna Utama (Primary)', 'primaryColor'],
                  ['Warna Aksen (Accent)', 'accentColor'],
                  ['Background Halaman', 'bgColor'],
                  ['Warna Teks', 'textColor'],
                  ['Background Card', 'cardBg'],
                ] as [string, keyof TemplateConfig][]).map(([label, key]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className={lClass}>{label}</label>
                      <input className={`${iClass} font-mono`} style={iStyle} value={template[key] as string} onChange={e => onChange({ ...template, [key]: e.target.value })} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
                    </div>
                    <div className="mt-5 relative">
                      <div className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer" style={{ background: template[key] as string }} />
                      <input type="color" value={template[key] as string} onChange={e => onChange({ ...template, [key]: e.target.value })} className="absolute inset-0 opacity-0 w-10 h-10 cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tipografi */}
            <section>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Tipografi</p>
              <div className="space-y-3">
                <div>
                  <label className={lClass}>Font Heading</label>
                  <select className={`${iClass} cursor-pointer`} style={iStyle} value={template.fontHeading} onChange={e => onChange({ ...template, fontHeading: e.target.value })}>
                    {['DM Serif Display', 'Lora', 'Playfair Display', 'Georgia'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lClass}>Font Body</label>
                  <select className={`${iClass} cursor-pointer`} style={iStyle} value={template.fontBody} onChange={e => onChange({ ...template, fontBody: e.target.value })}>
                    {['Outfit', 'Inter', 'Poppins', 'Open Sans'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Gaya Visual */}
            <section>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Gaya Visual</p>
              <div className="space-y-3">
                <div>
                  <label className={lClass}>Ornamen</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['geometric', 'floral', 'batik', 'minimal', 'none'] as const).map(o => (
                      <button key={o} onClick={() => onChange({ ...template, ornamentStyle: o })} className="py-2 rounded-lg text-xs border transition-all capitalize" style={template.ornamentStyle === o ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#5C4A2A' }}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={lClass}>Gaya Tombol</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pill', 'rect', 'underline'] as const).map(s => (
                      <button key={s} onClick={() => onChange({ ...template, buttonStyle: s })} className="py-2 rounded-lg text-xs border transition-all capitalize" style={template.buttonStyle === s ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#5C4A2A' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={lClass}>Border Radius</label>
                  <select className={`${iClass} cursor-pointer`} style={iStyle} value={template.borderRadius} onChange={e => onChange({ ...template, borderRadius: e.target.value })}>
                    <option value="0">Kotak (0)</option>
                    <option value="0.25rem">Sedikit (4px)</option>
                    <option value="0.75rem">Medium (12px)</option>
                    <option value="1rem">Rounded (16px)</option>
                    <option value="1.5rem">Bulat (24px)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-stone-600">Mode Gelap</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={!!template.dark} onChange={e => onChange({ ...template, dark: e.target.checked })} className="sr-only peer" />
                    <div className="w-8 h-4 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" style={{ background: template.dark ? '#C9A84C' : '#D0C8BA' }} />
                  </label>
                </div>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t flex gap-3" style={{ borderColor: '#E0D9CF' }}>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>Batal</button>
            <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>Simpan Template</button>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="flex-1 overflow-auto flex flex-col items-center justify-start pt-8 pb-8" style={{ background: '#E8E2D9' }}>
          <p className="text-xs text-stone-500 mb-4 tracking-widest uppercase">Preview Real-time</p>
          <div className="relative" style={{ width: 260 }}>
            <div className="rounded-[2.2rem] border-[6px] overflow-hidden shadow-2xl" style={{ height: 520, borderColor: '#374151', background: template.bgColor }}>
              <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {/* Lazy import TemplateRenderer */}
                <TemplateRendererPreview template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateRendererPreview({ template }: { template: TemplateConfig }) {
  return (
    <TemplateRenderer
      config={template}
      data={{ groomName: 'Al Yafi', brideName: 'Yova', weddingDate: '10 Januari 2027' }}
      showOpening={false}
    />
  )
}

function UsersTab() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_USERS.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>Pengguna</h2>
          <p className="text-stone-400 text-sm mt-1">{MOCK_USERS.length} pengguna terdaftar</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengguna..." className="px-4 py-2 rounded-xl text-sm outline-none" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF', width: 200 }} />
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F5EFE6', borderBottom: '1px solid #E0D9CF' }}>
              {['Pengguna', 'Email', 'Plan', 'Undangan', 'Bergabung', 'Aksi'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.email} className="hover:bg-stone-50/50" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F5F0EA' : 'none' }}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{u.name[0]}</div>
                    <span className="font-medium text-stone-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-stone-500 text-xs">{u.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.plan === 'published' ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{u.plan}</span>
                </td>
                <td className="px-5 py-4 text-stone-600 text-sm">{u.invitations}</td>
                <td className="px-5 py-4 text-stone-400 text-xs">{u.joined}</td>
                <td className="px-5 py-4">
                  <button className="text-xs text-amber-700 hover:text-amber-900">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TransactionsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#1B3A4B' }}>Transaksi</h2>
        <p className="text-stone-400 text-sm mt-1">Riwayat pembayaran platform</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[['Berhasil', '3', 'bg-green-50 text-green-700'], ['Gagal', '1', 'bg-red-50 text-red-600'], ['Pending', '1', 'bg-amber-50 text-amber-700']].map(([label, val, cls]) => (
          <div key={label} className={`p-4 rounded-2xl border ${cls}`} style={{ borderColor: '#E0D9CF' }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28 }}>{val}</div>
            <div className="text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F5EFE6', borderBottom: '1px solid #E0D9CF' }}>
              {['ID', 'Pengguna', 'Jumlah', 'Metode', 'Tanggal', 'Status'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_TX.map((tx, i) => (
              <tr key={tx.id} className="hover:bg-stone-50/50" style={{ borderBottom: i < MOCK_TX.length - 1 ? '1px solid #F5F0EA' : 'none' }}>
                <td className="px-5 py-4 font-mono text-xs text-stone-400">{tx.id}</td>
                <td className="px-5 py-4 font-medium text-stone-700">{tx.user}</td>
                <td className="px-5 py-4 font-semibold text-stone-800">Rp {tx.amount.toLocaleString('id')}</td>
                <td className="px-5 py-4 text-stone-500 text-xs">{tx.method}</td>
                <td className="px-5 py-4 text-stone-400 text-xs">{tx.date}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'success' ? 'bg-green-50 text-green-700' : tx.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useAdminTemplates()

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'templates': return <TemplatesTab templates={templates} addTemplate={addTemplate} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate} />
      case 'users': return <UsersTab />
      case 'transactions': return <TransactionsTab />
      default: return (
        <div className="text-center py-16 text-stone-400">
          <div className="text-4xl mb-3">🚧</div>
          <p>Halaman ini sedang dalam pengembangan.</p>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#1B3A4B' }}>
        <div className="p-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="rgba(255,255,255,0.1)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
            <circle cx="14" cy="14" r="2.5" fill="#C9A84C" />
          </svg>
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 14, color: '#FAF8F4' }}>Nikahku</div>
            <div className="text-[10px] text-amber-400/60 tracking-wider">ADMIN PANEL</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {ADMIN_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all" style={activeTab === item.id ? { background: 'rgba(201,168,76,0.15)', color: '#C9A84C' } : { color: 'rgba(255,255,255,0.55)' }}>
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>A</div>
            <div>
              <div className="text-xs text-white/70">Administrator</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 py-1.5 rounded-lg text-[10px] text-center transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              ← Ke Platform
            </Link>
            <Link to="/templates" className="flex-1 py-1.5 rounded-lg text-[10px] text-center transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              Template
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="flex items-center justify-between px-6 py-4" style={{ background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div>
            <h1 className="font-semibold text-stone-800 capitalize">{ADMIN_NAV.find(n => n.id === activeTab)?.label || 'Admin'}</h1>
            <p className="text-xs text-stone-400 mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-stone-400">Platform aktif</span>
          </div>
        </header>
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
