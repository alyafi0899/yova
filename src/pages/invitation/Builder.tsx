import { useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS, type TemplateConfig } from '../../components/invitation/TemplateRenderer'

// ─── Sections definition ──────────────────────────────────────────────────────
type SectionDef = {
  id: string
  label: string
  icon: string
  required?: boolean
  enabled: boolean
}

const DEFAULT_SECTIONS: SectionDef[] = [
  { id: 'opening', label: 'Opening', icon: '✦', required: true, enabled: true },
  { id: 'couple', label: 'Pasangan', icon: '♡', required: true, enabled: true },
  { id: 'events', label: 'Acara', icon: '📅', required: true, enabled: true },
  { id: 'quran', label: 'Ayat Al-Quran', icon: '☽', enabled: true },
  { id: 'countdown', label: 'Countdown', icon: '⏱', enabled: true },
  { id: 'gallery', label: 'Galeri Foto', icon: '🖼', enabled: true },
  { id: 'location', label: 'Lokasi', icon: '📍', enabled: true },
  { id: 'story', label: 'Kisah Cinta', icon: '📖', enabled: false },
  { id: 'rsvp', label: 'RSVP', icon: '✉', enabled: true },
  { id: 'wishes', label: 'Ucapan Tamu', icon: '💌', enabled: true },
  { id: 'gift', label: 'Wedding Gift', icon: '🎁', enabled: false },
  { id: 'music', label: 'Musik', icon: '♪', enabled: false },
  { id: 'theme', label: 'Tema & Warna', icon: '🎨', required: true, enabled: true },
  { id: 'settings', label: 'Pengaturan', icon: '⚙', required: true, enabled: true },
]

const QURAN_PRESETS = [
  { ref: 'QS. Ar-Rum: 21', text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.', arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجاً لِّتَسْكُنُواْ إِلَيْهَا' },
  { ref: 'QS. Adz-Dzariyat: 49', text: 'Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah.', arabic: 'وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ' },
  { ref: 'QS. An-Nahl: 72', text: 'Allah menjadikan bagi kamu isteri-isteri dari jenis kamu sendiri dan menjadikan bagimu dari isteri-isteri kamu itu, anak-anak dan cucu-cucu.', arabic: 'وَاللَّهُ جَعَلَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجاً' },
]

// ─── Input components ─────────────────────────────────────────────────────────
const iStyle = { border: '1px solid #E0D9CF', background: '#FAF8F4', color: '#2C2416' }
const iClass = "w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
const lClass = "block text-xs text-stone-400 mb-1.5 font-medium uppercase tracking-wide"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={lClass}>{label}</label>{children}</div>
}

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <Field label={label}>
      <input type={type} className={iClass} style={iStyle} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
    </Field>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <Field label={label}>
      <textarea className={iClass} style={{ ...iStyle, resize: 'none' }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
    </Field>
  )
}

// ─── Panel editors ────────────────────────────────────────────────────────────
function PanelOpening({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-stone-800 text-sm">Opening</h3>
      <Input label="Nama Pengantin Pria" value={data.groomName} onChange={v => onChange('groomName', v)} placeholder="Al Yafi" />
      <Input label="Nama Pengantin Wanita" value={data.brideName} onChange={v => onChange('brideName', v)} placeholder="Yova" />
      <Input label="Tanggal Pernikahan" value={data.weddingDate} onChange={v => onChange('weddingDate', v)} placeholder="10 Januari 2027" />
      <Textarea label="Teks Pembuka" value={data.openingText} onChange={v => onChange('openingText', v)} placeholder="Bismillahirrahmanirrahim..." />
    </div>
  )
}

function PanelCouple({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-stone-800 text-sm">Data Pasangan</h3>
      <div className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">✦ Pengantin Pria</p>
        <Input label="Nama Panggilan" value={data.groomName} onChange={v => onChange('groomName', v)} placeholder="Al Yafi" />
        <Input label="Nama Lengkap" value={data.groomFull || ''} onChange={v => onChange('groomFull', v)} placeholder="Muhammad Al Yafi" />
        <Input label="Nama Ayah" value={data.groomFather || ''} onChange={v => onChange('groomFather', v)} placeholder="Bapak Rizal" />
        <Input label="Nama Ibu" value={data.groomMother || ''} onChange={v => onChange('groomMother', v)} placeholder="Ibu Mariana" />
        <div>
          <label className={lClass}>Foto</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: '#C9A84C44' }}>
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs text-stone-400">Upload foto JPG/PNG</div>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">♡ Pengantin Wanita</p>
        <Input label="Nama Panggilan" value={data.brideName} onChange={v => onChange('brideName', v)} placeholder="Yova" />
        <Input label="Nama Lengkap" value={data.brideFull || ''} onChange={v => onChange('brideFull', v)} placeholder="Yova Rahmadani" />
        <Input label="Nama Ayah" value={data.brideFather || ''} onChange={v => onChange('brideFather', v)} placeholder="Bapak Hendra" />
        <Input label="Nama Ibu" value={data.brideMother || ''} onChange={v => onChange('brideMother', v)} placeholder="Ibu Sari" />
        <div>
          <label className={lClass}>Foto</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-amber-50 transition-colors" style={{ borderColor: '#C9A84C44' }}>
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs text-stone-400">Upload foto JPG/PNG</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelEvents({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) {
  const [extraEvents, setExtraEvents] = useState<Array<{ title: string; date: string; time: string; venue: string; address: string }>>([])

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-stone-800 text-sm">Acara Pernikahan</h3>
      {/* Akad */}
      <div className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">☽ Akad Nikah</p>
        <Input label="Tanggal" value={data.akadDate || '10 Januari 2027'} onChange={v => onChange('akadDate', v)} placeholder="10 Januari 2027" />
        <Input label="Waktu" value={data.akadTime || '08.00 – 10.00 WIB'} onChange={v => onChange('akadTime', v)} placeholder="08.00 – 10.00 WIB" />
        <Input label="Nama Venue" value={data.akadVenue || ''} onChange={v => onChange('akadVenue', v)} placeholder="Masjid Raya Baiturrahman" />
        <Textarea label="Alamat" value={data.akadAddress || ''} onChange={v => onChange('akadAddress', v)} placeholder="Jl. Masjid Raya, Banda Aceh" rows={2} />
        <Input label="Google Maps URL" value={data.akadMaps || ''} onChange={v => onChange('akadMaps', v)} placeholder="https://maps.google.com/..." />
      </div>
      {/* Resepsi */}
      <div className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">♡ Resepsi / Walimah</p>
        <Input label="Tanggal" value={data.receptionDate || '10 Januari 2027'} onChange={v => onChange('receptionDate', v)} placeholder="10 Januari 2027" />
        <Input label="Waktu" value={data.receptionTime || '11.00 – 16.00 WIB'} onChange={v => onChange('receptionTime', v)} placeholder="11.00 – 16.00 WIB" />
        <Input label="Nama Venue" value={data.receptionVenue || ''} onChange={v => onChange('receptionVenue', v)} placeholder="Hotel Hermes Palace" />
        <Textarea label="Alamat" value={data.receptionAddress || ''} onChange={v => onChange('receptionAddress', v)} placeholder="Jl. T. Nyak Arief, Banda Aceh" rows={2} />
        <Input label="Google Maps URL" value={data.receptionMaps || ''} onChange={v => onChange('receptionMaps', v)} placeholder="https://maps.google.com/..." />
      </div>
      {/* Extra events */}
      {extraEvents.map((ev, i) => (
        <div key={i} className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Acara Tambahan {i + 1}</p>
            <button onClick={() => setExtraEvents(prev => prev.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">Hapus</button>
          </div>
          <input className={iClass} style={iStyle} placeholder="Nama Acara" value={ev.title} onChange={e => setExtraEvents(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
        </div>
      ))}
      <button onClick={() => setExtraEvents(prev => [...prev, { title: '', date: '', time: '', venue: '', address: '' }])} className="w-full py-2.5 rounded-xl text-sm border-2 border-dashed text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors" style={{ borderColor: '#E0D9CF' }}>
        + Tambah Acara
      </button>
    </div>
  )
}

function PanelQuran({ quranIdx, setQuranIdx }: { quranIdx: number; setQuranIdx: (n: number) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-stone-800 text-sm">Ayat Al-Quran</h3>
      <p className="text-xs text-stone-400">Pilih salah satu ayat yang telah terverifikasi:</p>
      <div className="space-y-3">
        {QURAN_PRESETS.map((q, i) => (
          <button key={q.ref} onClick={() => setQuranIdx(i)} className="w-full p-4 rounded-xl text-left transition-all" style={{ background: '#F5EFE6', border: quranIdx === i ? `2px solid #C9A84C` : '1px solid #E8E0D0' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-stone-700 text-sm">{q.ref}</div>
              {quranIdx === i && <span className="text-amber-500 text-xs">✓ Dipilih</span>}
            </div>
            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{q.text}</p>
            <p className="mt-2 text-right text-sm leading-relaxed" style={{ fontFamily: 'Amiri, serif', color: '#9B7B2A' }}>{q.arabic.slice(0, 50)}…</p>
          </button>
        ))}
      </div>
      <div className="p-4 rounded-xl" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">Kutipan Kustom</p>
        <Textarea label="Teks Kutipan" value="" onChange={() => {}} placeholder="Masukkan kutipan islami kustom..." rows={3} />
      </div>
    </div>
  )
}

function PanelTheme({ config, onConfigChange }: { config: TemplateConfig; onConfigChange: (updates: Partial<TemplateConfig>) => void }) {
  const TEMPLATES_LIST = Object.values(TEMPLATE_CONFIGS)

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-stone-800 text-sm">Tema & Warna</h3>
      <div>
        <label className={lClass}>Ganti Template</label>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {TEMPLATES_LIST.map(t => (
            <button key={t.id} onClick={() => onConfigChange(t)} className="p-3 rounded-xl text-left transition-all" style={{ background: t.bgColor, border: config.id === t.id ? `2px solid ${t.accentColor}` : '1px solid #E0D9CF' }}>
              <div className="flex gap-1 mb-2">
                <span className="w-4 h-4 rounded-full border border-white/40" style={{ background: t.primaryColor }} />
                <span className="w-4 h-4 rounded-full border border-white/40" style={{ background: t.accentColor }} />
              </div>
              <div className="text-xs font-semibold" style={{ color: t.primaryColor }}>{t.name}</div>
              <div className="text-[10px]" style={{ color: t.textColor, opacity: 0.6 }}>{t.style}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <label className={lClass}>Warna Kustom</label>
        {[
          { label: 'Warna Utama', key: 'primaryColor' as keyof TemplateConfig, val: config.primaryColor },
          { label: 'Warna Aksen', key: 'accentColor' as keyof TemplateConfig, val: config.accentColor },
          { label: 'Background', key: 'bgColor' as keyof TemplateConfig, val: config.bgColor },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F5EFE6' }}>
            <div>
              <div className="text-xs font-medium text-stone-700">{item.label}</div>
              <div className="text-xs text-stone-400 font-mono">{item.val}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md border border-stone-200" style={{ background: item.val }} />
              <input type="color" value={item.val} onChange={e => onConfigChange({ [item.key]: e.target.value })} className="w-8 h-8 rounded cursor-pointer opacity-0 absolute" />
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className={lClass}>Font Heading</label>
        <select className={`${iClass} cursor-pointer`} style={iStyle} value={config.fontHeading} onChange={e => onConfigChange({ fontHeading: e.target.value })}>
          <option>DM Serif Display</option>
          <option>Lora</option>
          <option>Playfair Display</option>
        </select>
      </div>
      <div>
        <label className={lClass}>Gaya Ornamen</label>
        <div className="grid grid-cols-2 gap-2">
          {(['geometric', 'floral', 'batik', 'minimal', 'none'] as const).map(o => (
            <button key={o} onClick={() => onConfigChange({ ornamentStyle: o })} className="py-2 rounded-lg text-xs border transition-all" style={config.ornamentStyle === o ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#5C4A2A' }}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={lClass}>Gaya Tombol</label>
        <div className="grid grid-cols-3 gap-2">
          {(['pill', 'rect', 'underline'] as const).map(s => (
            <button key={s} onClick={() => onConfigChange({ buttonStyle: s })} className="py-2 rounded-lg text-xs border transition-all" style={config.buttonStyle === s ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#5C4A2A' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PanelGift() {
  const [accounts, setAccounts] = useState([
    { bank: 'Bank BCA', account: '1234567890', name: 'Al Yafi' },
    { bank: 'GoPay / OVO', account: '081234567890', name: 'Al Yafi' },
  ])

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-stone-800 text-sm">Wedding Gift</h3>
      {accounts.map((acc, i) => (
        <div key={i} className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Rekening {i + 1}</p>
            {accounts.length > 1 && <button onClick={() => setAccounts(p => p.filter((_, j) => j !== i))} className="text-xs text-red-400">Hapus</button>}
          </div>
          <input className={iClass} style={iStyle} placeholder="Bank / E-Wallet" value={acc.bank} onChange={e => setAccounts(p => p.map((x, j) => j === i ? { ...x, bank: e.target.value } : x))} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
          <input className={iClass} style={iStyle} placeholder="Nomor Rekening" value={acc.account} onChange={e => setAccounts(p => p.map((x, j) => j === i ? { ...x, account: e.target.value } : x))} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
          <input className={iClass} style={iStyle} placeholder="Atas Nama" value={acc.name} onChange={e => setAccounts(p => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
        </div>
      ))}
      <button onClick={() => setAccounts(p => [...p, { bank: '', account: '', name: '' }])} className="w-full py-2.5 rounded-xl text-sm border-2 border-dashed text-stone-400 hover:text-stone-600 transition-colors" style={{ borderColor: '#E0D9CF' }}>
        + Tambah Rekening
      </button>
    </div>
  )
}

function PanelRSVP() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-stone-800 text-sm">Pengaturan RSVP</h3>
      <div className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Field Form</p>
        {['Nama Tamu', 'Status Kehadiran', 'Jumlah Tamu', 'Ucapan/Doa'].map(field => (
          <div key={field} className="flex items-center justify-between">
            <span className="text-sm text-stone-600">{field}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-8 h-4 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" style={{ background: '#C9A84C' }} />
            </label>
          </div>
        ))}
      </div>
      <div>
        <label className={lClass}>Batas RSVP</label>
        <input type="date" className={iClass} style={iStyle} defaultValue="2027-01-08" onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
      </div>
      <div className="p-4 rounded-xl" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Tampilan RSVP</p>
        <p className="text-xs text-stone-500">Tamu akan melihat dua pilihan: "InsyaAllah Hadir" dan "Tidak Dapat Hadir".</p>
      </div>
    </div>
  )
}

function PanelGallery() {
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'slider' | 'fullwidth'>('grid')
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-stone-800 text-sm">Galeri Foto</h3>
      <div>
        <label className={lClass}>Layout Galeri</label>
        <div className="grid grid-cols-2 gap-2">
          {([['grid', 'Grid 3 Kolom'], ['masonry', 'Masonry'], ['slider', 'Horizontal Slider'], ['fullwidth', 'Full Width']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setLayout(key)} className="py-2 rounded-lg text-xs border transition-all" style={layout === key ? { background: '#1B3A4B', color: '#FAF8F4', border: 'none' } : { borderColor: '#E0D9CF', color: '#5C4A2A' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#C9A84C44' }}>
        <div className="text-3xl mb-2">🖼</div>
        <div className="text-sm text-stone-500 mb-1">Upload foto prewedding</div>
        <div className="text-xs text-stone-300">JPG, PNG · Maks 5MB per foto</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer" style={{ background: '#F5EFE6' }}>
            <img src={`https://images.unsplash.com/photo-1779501678407-c212cd23af9f?w=120&h=120&fit=crop&auto=format`} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <span className="text-white text-xs">✕</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PanelSettings({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-stone-800 text-sm">Pengaturan Undangan</h3>
      <div>
        <label className={lClass}>URL Undangan</label>
        <div className="flex items-center gap-0 rounded-lg overflow-hidden border" style={{ borderColor: '#E0D9CF' }}>
          <span className="px-3 py-2.5 text-sm text-stone-400 bg-stone-50 border-r" style={{ borderColor: '#E0D9CF', whiteSpace: 'nowrap' }}>nikahku.id/i/</span>
          <input className="flex-1 px-3 py-2.5 text-sm outline-none" style={{ background: '#FAF8F4' }} defaultValue="yafi-yova" placeholder="slug-undangan" onFocus={e => e.target.style.outline = '2px solid #C9A84C44'} onBlur={e => e.target.style.outline = 'none'} />
        </div>
      </div>
      <div className="p-4 rounded-xl space-y-3" style={{ background: '#F5EFE6', border: '1px solid #E8E0D0' }}>
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Fitur</p>
        {[['Musik Latar', true], ['Countdown Timer', true], ['RSVP Form', true], ['Ucapan Tamu', true], ['Galeri Foto', true]].map(([feat, on]) => (
          <div key={feat as string} className="flex items-center justify-between">
            <span className="text-sm text-stone-600">{feat as string}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={on as boolean} className="sr-only peer" />
              <div className="w-8 h-4 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" style={{ background: (on as boolean) ? '#C9A84C' : '#D0C8BA' }} />
            </label>
          </div>
        ))}
      </div>
      <div>
        <label className={lClass}>Password Undangan (Opsional)</label>
        <input type="password" className={iClass} style={iStyle} placeholder="Kosongkan jika tidak ingin" onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
      </div>
    </div>
  )
}

// ─── Main Builder ─────────────────────────────────────────────────────────────
export default function Builder() {
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template') || 'noura'

  const [config, setConfig] = useState<TemplateConfig>(TEMPLATE_CONFIGS[templateId] || TEMPLATE_CONFIGS.noura)
  const [activeSection, setActiveSection] = useState('opening')
  const [sections, setSections] = useState<SectionDef[]>(DEFAULT_SECTIONS)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [previewMode, setPreviewMode] = useState<'phone' | 'tablet'>('phone')
  const [showOpening, setShowOpening] = useState(false)
  const [quranIdx, setQuranIdx] = useState(0)
  const [invData, setInvData] = useState({
    groomName: 'Al Yafi',
    brideName: 'Yova',
    weddingDate: '10 Januari 2027',
    openingText: 'Bismillahirrahmanirrahim. Dengan memohon ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
    groomFull: 'Muhammad Al Yafi',
    brideFull: 'Yova Rahmadani',
    groomFather: 'Bapak Rizal',
    groomMother: 'Ibu Mariana',
    brideFather: 'Bapak Hendra',
    brideMother: 'Ibu Sari',
    akadVenue: 'Masjid Raya Baiturrahman',
    akadTime: '08.00 – 10.00 WIB',
    receptionVenue: 'Hotel Hermes Palace',
    receptionTime: '11.00 – 16.00 WIB',
  })

  const handleDataChange = useCallback((key: string, value: string) => {
    setInvData(prev => ({ ...prev, [key]: value }))
    setSaveStatus('unsaved')
  }, [])

  const handleConfigChange = useCallback((updates: Partial<TemplateConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
    setSaveStatus('unsaved')
  }, [])

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 800)
  }

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id && !s.required ? { ...s, enabled: !s.enabled } : s))
  }

  // Drag-to-reorder (simple swap)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) return
    setSections(prev => {
      const arr = [...prev]
      const fromIdx = arr.findIndex(s => s.id === dragging)
      const toIdx = arr.findIndex(s => s.id === targetId)
      const [item] = arr.splice(fromIdx, 1)
      arr.splice(toIdx, 0, item)
      return arr
    })
    setDragging(null)
    setDragOver(null)
  }

  // Render right panel based on active section
  const renderPanel = () => {
    switch (activeSection) {
      case 'opening': return <PanelOpening data={invData} onChange={handleDataChange} />
      case 'couple': return <PanelCouple data={invData} onChange={handleDataChange} />
      case 'events': return <PanelEvents data={invData} onChange={handleDataChange} />
      case 'quran': return <PanelQuran quranIdx={quranIdx} setQuranIdx={setQuranIdx} />
      case 'theme': return <PanelTheme config={config} onConfigChange={handleConfigChange} />
      case 'rsvp': return <PanelRSVP />
      case 'gift': return <PanelGift />
      case 'gallery': return <PanelGallery />
      case 'settings': return <PanelSettings data={invData} onChange={handleDataChange} />
      default: return (
        <div className="space-y-3">
          <h3 className="font-semibold text-stone-800 text-sm">{sections.find(s => s.id === activeSection)?.label}</h3>
          <p className="text-stone-400 text-sm">Editor untuk seksi ini akan segera tersedia.</p>
        </div>
      )
    }
  }

  const rendererData = {
    ...invData,
    groomParents: `Putra dari ${invData.groomFather || 'Bapak ...'} & ${invData.groomMother || 'Ibu ...'}`,
    brideParents: `Putri dari ${invData.brideFather || 'Bapak ...'} & ${invData.brideMother || 'Ibu ...'}`,
    quranRef: QURAN_PRESETS[quranIdx].ref,
    quranText: QURAN_PRESETS[quranIdx].text,
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: '#FAF8F4', fontFamily: 'Outfit, sans-serif' }}>
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 py-3 flex-shrink-0 z-20" style={{ background: '#FFFFFF', borderBottom: '1px solid #E0D9CF' }}>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 transition-colors text-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Dashboard
          </Link>
          <span className="text-stone-200 hidden md:block">/</span>
          <span className="text-sm text-stone-600 font-medium hidden md:block">{invData.groomName} &amp; {invData.brideName}</span>
          <span className="text-xs px-2 py-0.5 rounded-full hidden md:inline-block" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>
            Template {config.name}
          </span>
        </div>
        {/* Step progress */}
        <div className="hidden lg:flex items-center gap-1 text-xs">
          {[['Template', '✓'], ['Info', '✓'], ['Kustomisasi', '●'], ['Preview', '○'], ['Publikasi', '○']].map(([label, status], i) => (
            <div key={label} className="flex items-center gap-1">
              {i > 0 && <div className="w-4 h-px" style={{ background: '#E0D9CF' }} />}
              <span style={{ color: status === '●' ? '#C9A84C' : status === '✓' ? '#5C9B5E' : '#D0C8BA', fontWeight: status === '●' ? 600 : 400 }}>
                {status} {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs hidden md:block" style={{ color: saveStatus === 'saving' ? '#9B7B2A' : saveStatus === 'saved' ? '#5C9B5E' : '#9B5C5C' }}>
            {saveStatus === 'saving' ? '⟳ Menyimpan...' : saveStatus === 'saved' ? '✓ Tersimpan' : '● Belum tersimpan'}
          </span>
          <button onClick={handleSave} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-stone-50" style={{ borderColor: '#E0D9CF', color: '#5C4A2A' }}>
            Simpan
          </button>
          <Link to="/publish" className="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: '#C9A84C', color: '#1B3A4B' }}>
            Publikasikan →
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-48 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: '#FFFFFF', borderRight: '1px solid #E0D9CF' }}>
          <div className="p-2 flex-1">
            {sections.map(s => (
              <div
                key={s.id}
                draggable={!s.required}
                onDragStart={() => setDragging(s.id)}
                onDragOver={e => { e.preventDefault(); setDragOver(s.id) }}
                onDrop={() => handleDrop(s.id)}
                onDragEnd={() => { setDragging(null); setDragOver(null) }}
                className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg mb-0.5 cursor-pointer transition-all ${dragOver === s.id ? 'ring-1 ring-amber-300' : ''} ${dragging === s.id ? 'opacity-40' : ''}`}
                style={activeSection === s.id ? { background: '#F5EFE6', color: '#1B3A4B' } : { color: '#5C4A2A' }}
                onClick={() => setActiveSection(s.id)}
              >
                {!s.required && (
                  <span className="cursor-grab text-stone-300 opacity-0 group-hover:opacity-100 text-xs" title="Drag to reorder">⋮⋮</span>
                )}
                <span className="text-xs w-4 text-center">{s.icon}</span>
                <span className="text-xs flex-1 truncate font-medium">{s.label}</span>
                {!s.required && (
                  <button
                    onClick={e => { e.stopPropagation(); toggleSection(s.id) }}
                    className={`w-3 h-3 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}
                    title={s.enabled ? 'Sembunyikan' : 'Tampilkan'}
                    style={{ background: s.enabled ? '#C9A84C' : '#D0C8BA' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t" style={{ borderColor: '#E0D9CF' }}>
            <Link to="/templates" className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-700 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
              Ganti Template
            </Link>
          </div>
        </aside>

        {/* Center preview */}
        <main className="flex-1 overflow-auto flex flex-col items-center py-8 px-4" style={{ background: '#E8E2D9' }}>
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
              <button onClick={() => setPreviewMode('phone')} className="px-3 py-1.5 rounded-md text-xs transition-all" style={previewMode === 'phone' ? { background: '#FFFFFF', color: '#1B3A4B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#5C4A2A' }}>
                📱 Mobile
              </button>
              <button onClick={() => setPreviewMode('tablet')} className="px-3 py-1.5 rounded-md text-xs transition-all" style={previewMode === 'tablet' ? { background: '#FFFFFF', color: '#1B3A4B', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#5C4A2A' }}>
                💻 Desktop
              </button>
            </div>
            <button onClick={() => setShowOpening(!showOpening)} className="px-3 py-1.5 rounded-lg text-xs transition-colors" style={{ background: 'rgba(255,255,255,0.7)', color: '#5C4A2A' }}>
              {showOpening ? 'Lihat Isi' : 'Lihat Opening'}
            </button>
          </div>

          {previewMode === 'phone' ? (
            <div className="relative flex-shrink-0" style={{ width: 300 }}>
              <div className="rounded-[2.5rem] border-[7px] overflow-hidden shadow-2xl" style={{ height: 600, borderColor: '#374151', background: config.bgColor }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl z-10" style={{ background: '#374151' }} />
                <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  <TemplateRenderer
                    key={JSON.stringify(config) + JSON.stringify(invData)}
                    config={config}
                    data={rendererData}
                    showOpening={showOpening}
                  />
                </div>
              </div>
              {/* Bottom bar */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full" style={{ background: '#374151' }} />
            </div>
          ) : (
            <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl" style={{ maxHeight: 560 }}>
              <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: '#374151' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <div className="flex-1 mx-3 px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>
                  nikahku.id/i/yafi-yova
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 510 }}>
                <div className="max-w-sm mx-auto">
                  <TemplateRenderer key={JSON.stringify(config) + JSON.stringify(invData)} config={config} data={rendererData} showOpening={showOpening} />
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-stone-400">Preview diperbarui secara real-time</p>
        </main>

        {/* Right panel */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto p-5" style={{ background: '#FFFFFF', borderLeft: '1px solid #E0D9CF' }}>
          {renderPanel()}
        </aside>
      </div>
    </div>
  )
}
