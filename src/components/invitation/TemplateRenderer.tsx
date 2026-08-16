import { useState, useEffect } from 'react'

export type TemplateConfig = {
  id: string
  name: string
  style: string
  tags: string[]
  primaryColor: string
  accentColor: string
  bgColor: string
  textColor: string
  cardBg: string
  fontHeading: string
  fontBody: string
  ornamentStyle: 'geometric' | 'floral' | 'minimal' | 'batik' | 'none'
  dark?: boolean
  borderRadius?: string
  buttonStyle?: 'pill' | 'rect' | 'underline'
}

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  noura: {
    id: 'noura', name: 'Noura', style: 'Islamic Elegant', tags: ['Islam', 'Elegan', 'Gold'],
    primaryColor: '#1B3A4B', accentColor: '#C9A84C', bgColor: '#FAF8F4', textColor: '#2C2416',
    cardBg: '#FFFFFF', fontHeading: 'DM Serif Display', fontBody: 'Outfit',
    ornamentStyle: 'geometric', borderRadius: '1rem', buttonStyle: 'pill',
  },
  azzahra: {
    id: 'azzahra', name: 'Azzahra', style: 'Floral Romantic', tags: ['Floral', 'Romantis', 'Pastel'],
    primaryColor: '#6B4C5E', accentColor: '#D4829B', bgColor: '#FDF4F7', textColor: '#3D2535',
    cardBg: '#FFF0F5', fontHeading: 'Lora', fontBody: 'Outfit',
    ornamentStyle: 'floral', borderRadius: '1.5rem', buttonStyle: 'pill',
  },
  madinah: {
    id: 'madinah', name: 'Madinah', style: 'Minimal Islamic', tags: ['Minimal', 'Islam', 'Geometrik'],
    primaryColor: '#2C3E50', accentColor: '#95A5A6', bgColor: '#F4F6F8', textColor: '#1A2530',
    cardBg: '#FFFFFF', fontHeading: 'DM Serif Display', fontBody: 'Outfit',
    ornamentStyle: 'geometric', borderRadius: '0.25rem', buttonStyle: 'rect',
  },
  sakinah: {
    id: 'sakinah', name: 'Sakinah', style: 'Soft Romantic', tags: ['Romantis', 'Pastel', 'Serif'],
    primaryColor: '#7B5E2A', accentColor: '#C9A84C', bgColor: '#FFFBF4', textColor: '#4A3520',
    cardBg: '#FFF8EE', fontHeading: 'Lora', fontBody: 'Outfit',
    ornamentStyle: 'floral', borderRadius: '1.25rem', buttonStyle: 'pill',
  },
  zayyan: {
    id: 'zayyan', name: 'Zayyan', style: 'Dark Luxury', tags: ['Gelap', 'Mewah', 'Gold'],
    primaryColor: '#C9A84C', accentColor: '#E8D5A3', bgColor: '#0D0D0D', textColor: '#F5F5F5',
    cardBg: '#1A1A1A', fontHeading: 'DM Serif Display', fontBody: 'Outfit',
    ornamentStyle: 'geometric', dark: true, borderRadius: '0.5rem', buttonStyle: 'rect',
  },
  alya: {
    id: 'alya', name: 'Alya', style: 'Modern Minimal', tags: ['Modern', 'Minimal', 'Foto'],
    primaryColor: '#1A1A2E', accentColor: '#4A4A8A', bgColor: '#F8F8FA', textColor: '#1A1A2E',
    cardBg: '#FFFFFF', fontHeading: 'DM Serif Display', fontBody: 'Outfit',
    ornamentStyle: 'none', borderRadius: '0.75rem', buttonStyle: 'underline',
  },
  serambi: {
    id: 'serambi', name: 'Serambi', style: 'Acehnese Cultural', tags: ['Aceh', 'Tradisional', 'Budaya'],
    primaryColor: '#8B1A1A', accentColor: '#C8860A', bgColor: '#FBF4EC', textColor: '#3D1A0A',
    cardBg: '#FFF5E8', fontHeading: 'Lora', fontBody: 'Outfit',
    ornamentStyle: 'batik', borderRadius: '0.25rem', buttonStyle: 'rect',
  },
  kirana: {
    id: 'kirana', name: 'Kirana', style: 'Indonesian Traditional', tags: ['Indonesia', 'Tradisional', 'Alam'],
    primaryColor: '#4A3520', accentColor: '#8B6914', bgColor: '#F8F2E8', textColor: '#2C1F0E',
    cardBg: '#FFF8EE', fontHeading: 'Lora', fontBody: 'Outfit',
    ornamentStyle: 'batik', borderRadius: '0.5rem', buttonStyle: 'pill',
  },
}

function Ornament({ style, color, size = 32 }: { style: string; color: string; size?: number }) {
  if (style === 'geometric') return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <polygon points="20,10 30,15 30,25 20,30 10,25 10,15" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="20" cy="20" r="3" fill={color} opacity="0.7" />
    </svg>
  )
  if (style === 'floral') return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <ellipse key={deg} cx="20" cy="12" rx="4" ry="8" fill={color} fillOpacity="0.35"
          transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4" fill={color} fillOpacity="0.6" />
    </svg>
  )
  if (style === 'batik') return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="8" y="8" width="24" height="24" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <rect x="14" y="14" width="12" height="12" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="8" y1="20" x2="32" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="8" x2="20" y2="32" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <circle cx="20" cy="20" r="2.5" fill={color} opacity="0.6" />
    </svg>
  )
  return <div className="w-6 h-px" style={{ background: color, opacity: 0.5 }} />
}

function Divider({ config }: { config: TemplateConfig }) {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <div className="h-px w-8" style={{ background: config.accentColor, opacity: 0.4 }} />
      <Ornament style={config.ornamentStyle} color={config.accentColor} size={16} />
      <div className="h-px w-8" style={{ background: config.accentColor, opacity: 0.4 }} />
    </div>
  )
}

function Btn({ config, children, onClick }: { config: TemplateConfig; children: React.ReactNode; onClick?: () => void }) {
  const base = "text-xs tracking-widest uppercase transition-all cursor-pointer px-5 py-2"
  if (config.buttonStyle === 'pill') return (
    <button onClick={onClick} className={`${base} rounded-full`} style={{ border: `1px solid ${config.accentColor}66`, color: config.accentColor }}>
      {children}
    </button>
  )
  if (config.buttonStyle === 'rect') return (
    <button onClick={onClick} className={`${base}`} style={{ border: `1px solid ${config.accentColor}88`, color: config.accentColor }}>
      {children}
    </button>
  )
  return (
    <button onClick={onClick} className="text-xs tracking-widest uppercase cursor-pointer" style={{ color: config.accentColor, borderBottom: `1px solid ${config.accentColor}66`, paddingBottom: 2 }}>
      {children}
    </button>
  )
}

type InvitationData = {
  groomName: string
  brideName: string
  groomFull?: string
  brideFull?: string
  groomParents?: string
  brideParents?: string
  weddingDate: string
  akadVenue?: string
  akadTime?: string
  receptionVenue?: string
  receptionTime?: string
  quranRef?: string
  quranText?: string
  heroImage?: string
  opened?: boolean
  onOpen?: () => void
}

export default function TemplateRenderer({
  config,
  data,
  compact = false,
  showOpening = true,
}: {
  config: TemplateConfig
  data: InvitationData
  compact?: boolean
  showOpening?: boolean
}) {
  const [opened, setOpened] = useState(!showOpening || (data.opened ?? false))
  const [days, setDays] = useState(150)
  const [hours, setHours] = useState(14)
  const [minutes, setMinutes] = useState(32)
  const [seconds, setSeconds] = useState(47)

  useEffect(() => {
    if (!opened) return
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) { setMinutes(m => { if (m <= 0) { setHours(h => { if (h <= 0) { setDays(d => Math.max(0, d - 1)); return 23 } return h - 1 }); return 59 } return m - 1 }); return 59 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [opened])

  const h1 = { fontFamily: `'${config.fontHeading}', Georgia, serif` }
  const body = { fontFamily: `'${config.fontBody}', sans-serif` }

  // Opening screen
  if (!opened) return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 relative overflow-hidden" style={{ background: config.primaryColor, minHeight: compact ? 340 : '100%', ...body }}>
      {config.ornamentStyle === 'geometric' && <div className="absolute inset-0 geometric-pattern opacity-10" />}
      {config.ornamentStyle === 'floral' && (
        <>
          <div className="absolute top-0 left-0 opacity-20">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              {[0,60,120,180,240,300].map(d => <ellipse key={d} cx="40" cy="20" rx="6" ry="15" fill={config.accentColor} transform={`rotate(${d} 40 40)`} />)}
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 opacity-20 rotate-180">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              {[0,60,120,180,240,300].map(d => <ellipse key={d} cx="40" cy="20" rx="6" ry="15" fill={config.accentColor} transform={`rotate(${d} 40 40)`} />)}
            </svg>
          </div>
        </>
      )}
      {config.ornamentStyle === 'batik' && (
        <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${config.accentColor}08 0, ${config.accentColor}08 1px, transparent 0, transparent 50%)`, backgroundSize: '20px 20px' }} />
      )}
      <div className="relative z-10">
        {config.ornamentStyle !== 'none' && (
          <p className="mb-3 text-sm" style={{ fontFamily: 'Amiri, serif', color: config.accentColor }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        )}
        <Divider config={config} />
        <p className="text-[9px] tracking-widest uppercase mt-3 mb-2" style={{ color: config.dark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)' }}>The Wedding of</p>
        <h1 style={{ ...h1, fontSize: compact ? 22 : 30, color: '#FFFFFF', lineHeight: 1.2 }}>
          {data.groomName}<br />
          <em style={{ color: config.accentColor, fontSize: '0.65em' }}>&amp;</em><br />
          {data.brideName}
        </h1>
        <Divider config={config} />
        <p style={{ color: config.dark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.6)', fontSize: 9 }} className="tracking-widest uppercase mt-1 mb-4">
          {data.weddingDate}
        </p>
        {!compact && <Btn config={config} onClick={() => { setOpened(true); data.onOpen?.() }}>Buka Undangan</Btn>}
      </div>
    </div>
  )

  const quranRef = data.quranRef || 'QS. Ar-Rum: 21'
  const quranText = data.quranText || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.'

  return (
    <div className="w-full overflow-y-auto" style={{ background: config.bgColor, color: config.textColor, fontFamily: `'${config.fontBody}', sans-serif` }}>

      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center text-center overflow-hidden" style={{ background: config.primaryColor, minHeight: compact ? 260 : 380, padding: '3rem 2rem' }}>
        {config.ornamentStyle === 'geometric' && <div className="absolute inset-0 geometric-pattern opacity-10" />}
        {config.ornamentStyle === 'floral' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
              {[0,60,120,180,240,300].map(d => <ellipse key={d} cx="120" cy="40" rx="18" ry="50" fill={config.accentColor} transform={`rotate(${d} 120 120)`} />)}
            </svg>
          </div>
        )}
        {config.ornamentStyle === 'batik' && (
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${config.accentColor}12 0, ${config.accentColor}12 1px, transparent 0, transparent 50%)`, backgroundSize: '16px 16px' }} />
        )}
        <div className="relative z-10">
          {config.ornamentStyle !== 'none' && (
            <p className="mb-2" style={{ fontFamily: 'Amiri, serif', fontSize: compact ? 12 : 16, color: config.accentColor }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
          )}
          <Divider config={config} />
          <h1 style={{ ...h1, fontSize: compact ? 24 : 36, color: '#FFFFFF', lineHeight: 1.2, marginTop: 8 }}>
            {data.groomName}<br />
            <em style={{ color: config.accentColor, fontSize: '0.6em' }}>&amp;</em><br />
            {data.brideName}
          </h1>
          <Divider config={config} />
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: compact ? 8 : 10 }} className="tracking-widest uppercase mt-1">
            {data.weddingDate} · Banda Aceh
          </p>
        </div>
      </div>

      {/* Quran */}
      <div className="text-center px-6 py-8" style={{ background: config.cardBg }}>
        <p className="mb-3" style={{ fontFamily: 'Amiri, serif', fontSize: compact ? 14 : 18, color: config.accentColor, direction: 'rtl' }}>
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجاً
        </p>
        <Divider config={config} />
        <p className="text-xs leading-relaxed italic mt-2" style={{ fontFamily: 'Lora, serif', color: config.textColor, opacity: 0.7 }}>"{quranText}"</p>
        <p className="text-xs mt-2" style={{ color: config.accentColor }}>— {quranRef}</p>
      </div>

      {/* Couple */}
      <div className="px-5 py-6 text-center">
        <p className="text-[9px] tracking-widest uppercase mb-4" style={{ color: config.accentColor }}>Mempelai</p>
        <div className="grid grid-cols-2 gap-4">
          {[{ name: data.groomName, role: 'Pengantin Pria', parents: data.groomParents || 'Putra dari Bapak Rizal & Ibu Mariana' },
            { name: data.brideName, role: 'Pengantin Wanita', parents: data.brideParents || 'Putri dari Bapak Hendra & Ibu Sari' }].map(p => (
              <div key={p.name}>
                <div className="w-14 h-14 rounded-full mx-auto mb-2 border-2 overflow-hidden" style={{ borderColor: `${config.accentColor}44`, background: config.cardBg }}>
                  <img src="https://images.unsplash.com/photo-1779501678407-c212cd23af9f?w=56&h=56&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-70" />
                </div>
                <p style={{ ...h1, fontSize: compact ? 14 : 17, color: config.primaryColor }}>{p.name}</p>
                <p style={{ fontSize: 9, color: config.accentColor, opacity: 0.8 }} className="uppercase tracking-wide mt-0.5">{p.role}</p>
                {!compact && <p style={{ fontSize: 9, color: config.textColor, opacity: 0.55, marginTop: 4 }} className="leading-relaxed">{p.parents}</p>}
              </div>
            ))}
        </div>
      </div>

      {/* Countdown */}
      <div className="px-5 py-6 text-center" style={{ background: config.primaryColor }}>
        <p className="text-[9px] tracking-widest uppercase mb-3" style={{ color: `${config.accentColor}99` }}>Menuju Hari Bahagia</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[['Hari', days], ['Jam', hours], ['Menit', minutes], ['Dtk', seconds]].map(([label, val]) => (
            <div key={label as string} className="py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ ...h1, fontSize: compact ? 16 : 22, color: config.accentColor }}>{String(val).padStart(2, '0')}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }} className="tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="px-5 py-6">
        <p className="text-[9px] tracking-widest uppercase text-center mb-4" style={{ color: config.accentColor }}>Rangkaian Acara</p>
        <div className="space-y-3">
          {[
            { event: 'Akad Nikah', time: data.akadTime || '08.00 – 10.00 WIB', venue: data.akadVenue || 'Masjid Raya Baiturrahman' },
            { event: 'Resepsi', time: data.receptionTime || '11.00 – 16.00 WIB', venue: data.receptionVenue || 'Hotel Hermes Palace' },
          ].map(ev => (
            <div key={ev.event} className="p-3 rounded-lg" style={{ background: config.cardBg, border: `1px solid ${config.accentColor}22` }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full" style={{ background: config.accentColor }} />
                <div>
                  <p style={{ ...h1, fontSize: compact ? 12 : 14, color: config.primaryColor }}>{ev.event}</p>
                  <p style={{ fontSize: 9, color: config.textColor, opacity: 0.6 }}>{ev.time}</p>
                  <p style={{ fontSize: 9, color: config.accentColor }}>{ev.venue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP teaser */}
      {!compact && (
        <div className="px-5 py-6 text-center" style={{ background: config.cardBg }}>
          <p style={{ ...h1, fontSize: 16, color: config.primaryColor }} className="mb-3">Konfirmasi Kehadiran</p>
          <Divider config={config} />
          <p style={{ fontSize: 10, color: config.textColor, opacity: 0.6 }} className="mt-2 mb-4">Mohon konfirmasi sebelum 8 Januari 2027</p>
          <Btn config={config}>Konfirmasi RSVP</Btn>
        </div>
      )}

      {/* Closing */}
      <div className="px-5 py-8 text-center" style={{ background: config.primaryColor }}>
        <Divider config={config} />
        <p style={{ ...h1, fontSize: compact ? 16 : 22, color: '#FFFFFF', lineHeight: 1.3, marginTop: 8 }}>
          Jazakumullah<br />Khairan Katsiran
        </p>
        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 12 }} className="tracking-widest uppercase">
          {data.groomName} &amp; {data.brideName}
        </p>
      </div>
    </div>
  )
}
