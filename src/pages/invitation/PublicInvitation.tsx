import { useState, useEffect, useRef } from 'react'

const STORY_ITEMS = [
  { year: '2019', title: 'Pertemuan Pertama', desc: 'Dua jiwa yang takdirnya telah digariskan oleh Allah SWT bertemu dalam sebuah momen yang penuh hikmah.' },
  { year: '2022', title: 'Perjalanan Bersama', desc: 'Langkah demi langkah, kami menapaki jalan yang sama dengan satu visi dan satu impian.' },
  { year: '2025', title: 'Khitbah', desc: 'Dengan izin Allah, Al Yafi melamar Yova sebagai tanda kesungguhan hati dan komitmen untuk masa depan.' },
  { year: '2027', title: 'Akad Nikah', desc: 'Insya Allah, pada hari yang penuh berkah ini, kami akan menyempurnakan separuh dien kami.' },
]

const WISHES = [
  { name: 'Ahmad Fauzan', wish: 'Baarakallahu laka wa baaraka alaika wa jama\'a bainakumaa fii khair.', time: '2 jam lalu' },
  { name: 'Siti Rahma', wish: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallah.', time: '5 jam lalu' },
  { name: 'Rizky Pratama', wish: 'MasyaAllah tabarakallah. Semoga langgeng dan penuh barokah.', time: '1 hari lalu' },
]

function Section({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={style} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  )
}

function RSVPForm() {
  const [submitted, setSubmitted] = useState(false)
  const [attendance, setAttendance] = useState<'hadir' | 'tidak' | null>(null)

  if (submitted) return (
    <div className="text-center py-8">
      <div className="text-3xl mb-3">✓</div>
      <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1B3A4B' }}>Terima Kasih!</p>
      <p className="text-stone-500 text-sm mt-2">Konfirmasi kehadiran Anda telah kami terima.</p>
    </div>
  )

  return (
    <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
      <div>
        <label className="block text-xs text-stone-400 mb-1.5 tracking-wide">Nama Lengkap</label>
        <input required placeholder="Nama Anda" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
      </div>
      <div>
        <label className="block text-xs text-stone-400 mb-1.5 tracking-wide">Kehadiran</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setAttendance('hadir')} className="py-3 rounded-xl text-sm font-medium transition-all" style={attendance === 'hadir' ? { background: '#1B3A4B', color: '#FAF8F4', border: '1px solid #1B3A4B' } : { border: '1px solid #E0D9CF', color: '#5C4A2A', background: '#FFFFFF' }}>
            InsyaAllah Hadir
          </button>
          <button type="button" onClick={() => setAttendance('tidak')} className="py-3 rounded-xl text-sm font-medium transition-all" style={attendance === 'tidak' ? { background: '#5C4A2A', color: '#FAF8F4', border: '1px solid #5C4A2A' } : { border: '1px solid #E0D9CF', color: '#5C4A2A', background: '#FFFFFF' }}>
            Tidak Dapat Hadir
          </button>
        </div>
      </div>
      {attendance === 'hadir' && (
        <div>
          <label className="block text-xs text-stone-400 mb-1.5 tracking-wide">Jumlah Tamu</label>
          <select className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }}>
            {[1,2,3,4,5].map(n => <option key={n}>{n} orang</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs text-stone-400 mb-1.5 tracking-wide">Doa &amp; Ucapan</label>
        <textarea rows={3} placeholder="Tuliskan doa dan ucapan untuk kedua mempelai..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: '1px solid #E0D9CF', background: '#FFFFFF' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#E0D9CF'} />
      </div>
      <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-medium transition-all" style={{ background: '#1B3A4B', color: '#FAF8F4' }}>
        Kirim Konfirmasi
      </button>
    </form>
  )
}

export default function PublicInvitation() {
  const [opened, setOpened] = useState(false)
  const [days, setDays] = useState(150)
  const [hours, setHours] = useState(14)
  const [minutes, setMinutes] = useState(32)
  const [seconds, setSeconds] = useState(47)
  const [copiedGift, setCopiedGift] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) {
          setMinutes(m => {
            if (m <= 0) { setHours(h => { if (h <= 0) { setDays(d => Math.max(0, d - 1)); return 23 } return h - 1 }); return 59
            }
            return m - 1
          })
          return 59
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  if (!opened) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center p-8" style={{ background: '#1B3A4B' }}>
      <div className="absolute inset-0 geometric-pattern opacity-10" />
      <div className="relative z-10">
        <p className="mb-6 text-amber-300/80" style={{ fontFamily: 'Amiri, serif', fontSize: 18 }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: 'rgba(201,168,76,0.5)' }} />
        <p className="text-white/50 text-xs tracking-widest uppercase mb-6">Undangan Pernikahan</p>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#FFFFFF', lineHeight: 1.2 }}>
          Al Yafi<br />
          <em style={{ color: '#C9A84C', fontSize: '0.7em' }}>&amp;</em><br />
          Yova
        </h1>
        <div className="w-12 h-0.5 mx-auto mt-8 mb-6" style={{ background: 'rgba(201,168,76,0.5)' }} />
        <p className="text-white/50 text-xs tracking-widest uppercase mb-12">10 Januari 2027 · Banda Aceh</p>
        <button onClick={() => setOpened(true)} className="flex items-center gap-3 mx-auto px-8 py-3.5 rounded-full text-sm tracking-widest uppercase transition-all hover:scale-105" style={{ border: '1px solid rgba(201,168,76,0.5)', color: '#C9A84C', backdropFilter: 'blur(8px)' }}>
          <span>Buka Undangan</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-sm mx-auto min-h-screen relative" style={{ fontFamily: 'Outfit, sans-serif', background: '#FAF8F4' }}>
      {/* Hero */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden" style={{ background: '#1B3A4B' }}>
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <img src="https://images.unsplash.com/photo-1779501678407-c212cd23af9f?w=400&h=700&fit=crop&auto=format" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 p-8">
          <p style={{ fontFamily: 'Amiri, serif', fontSize: 16, color: '#C9A84C' }} className="mb-4">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 48, color: '#FFFFFF', lineHeight: 1.1 }}>
            Al Yafi<br />
            <em style={{ color: '#C9A84C', fontSize: '0.6em' }}>&amp;</em><br />
            Yova
          </h1>
          <div className="w-8 h-px mx-auto my-6" style={{ background: 'rgba(201,168,76,0.6)' }} />
          <p className="text-white/50 text-xs tracking-widest uppercase">10 Januari 2027</p>
        </div>
      </div>

      {/* Quran */}
      <Section className="px-8 py-12 text-center" style={{ background: '#F5EFE6' }}>
        <p className="mb-4 leading-relaxed" style={{ fontFamily: 'Amiri, serif', fontSize: 22, color: '#9B7B2A', direction: 'rtl' }}>
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجاً لِّتَسْكُنُواْ إِلَيْهَا
        </p>
        <div className="w-8 h-px mx-auto my-4" style={{ background: 'rgba(201,168,76,0.4)' }} />
        <p className="text-stone-500 text-sm leading-relaxed italic" style={{ fontFamily: 'Lora, serif' }}>
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
        </p>
        <p className="text-stone-400 text-xs mt-3">— QS. Ar-Rum: 21</p>
      </Section>

      {/* Couple */}
      <Section className="px-8 py-12 text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-8">Bismillah, kami mengundang Anda</p>
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[{ role: 'Pengantin Pria', name: 'Al Yafi', full: 'Muhammad Al Yafi', parents: 'Putra dari Bapak Rizal & Ibu Mariana', img: 'photo-1779501678407-c212cd23af9f' },
            { role: 'Pengantin Wanita', name: 'Yova', full: 'Yova Rahmadani', parents: 'Putri dari Bapak Hendra & Ibu Sari', img: 'photo-1521129866021-4313ccf20e9e' }].map(p => (
              <div key={p.name} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-2" style={{ borderColor: 'rgba(201,168,76,0.4)' }}>
                  <img src={`https://images.unsplash.com/photo-${p.img}?w=96&h=96&fit=crop&auto=format`} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-stone-400 mb-1">{p.role}</p>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#1B3A4B' }}>{p.name}</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">{p.parents}</p>
              </div>
            ))}
        </div>
      </Section>

      {/* Countdown */}
      <Section className="px-8 py-10 text-center" style={{ background: '#1B3A4B' }}>
        <p className="text-xs tracking-widest uppercase text-amber-400/70 mb-6">Menuju Hari Bahagia</p>
        <div className="grid grid-cols-4 gap-3">
          {[['Hari', days], ['Jam', hours], ['Menit', minutes], ['Detik', seconds]].map(([label, val]) => (
            <div key={label as string} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#C9A84C' }}>{String(val).padStart(2, '0')}</div>
              <div className="text-white/40 text-[10px] tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Events */}
      <Section className="px-8 py-12">
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }} className="text-center mb-8">Rangkaian Acara</h2>
        <div className="space-y-5">
          {[
            { event: 'Akad Nikah', date: 'Ahad, 10 Januari 2027', time: '08.00 – 10.00 WIB', venue: 'Masjid Raya Baiturrahman', address: 'Jl. Masjid Raya, Banda Aceh', icon: '☽' },
            { event: 'Resepsi / Walimah', date: 'Ahad, 10 Januari 2027', time: '11.00 – 16.00 WIB', venue: 'Hotel Hermes Palace Banda Aceh', address: 'Jl. T. Nyak Arief, Banda Aceh', icon: '♡' },
          ].map(ev => (
            <div key={ev.event} className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5EFE6', color: '#C9A84C' }}>
                  {ev.icon}
                </div>
                <div className="flex-1">
                  <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: '#1B3A4B' }}>{ev.event}</h3>
                  <p className="text-stone-500 text-sm mt-1">{ev.date}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{ev.time}</p>
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: '#F5EFE6' }}>
                    <p className="text-stone-700 text-sm font-medium">{ev.venue}</p>
                    <p className="text-stone-400 text-xs mt-0.5">{ev.address}</p>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>
                      <span>📍</span> Buka Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Story */}
      <Section className="px-8 py-12" style={{ background: '#F5EFE6' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }} className="text-center mb-8">Kisah Cinta Kami</h2>
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: 'rgba(201,168,76,0.3)' }} />
          <div className="space-y-8">
            {STORY_ITEMS.map((item, i) => (
              <div key={item.year} className="relative">
                <div className="absolute -left-[27px] w-4 h-4 rounded-full border-2 border-white" style={{ background: '#C9A84C', top: 4 }} />
                <div className="text-xs font-semibold text-amber-700 mb-1">{item.year}</div>
                <h4 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1B3A4B' }} className="mb-1">{item.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section className="px-8 py-12">
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }} className="text-center mb-6">Galeri Foto</h2>
        <div className="grid grid-cols-3 gap-2">
          {['photo-1779501678407-c212cd23af9f', 'photo-1521129866021-4313ccf20e9e', 'photo-1485700281629-290c5a704409',
            'photo-1549576207-72dd5179984b', 'photo-1625038032128-54ed70feb167', 'photo-1525441273400-056e9c7517b3'].map((photo, i) => (
              <div key={photo} className={`rounded-xl overflow-hidden ${i === 0 || i === 3 ? 'aspect-square' : i === 1 || i === 4 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                <img src={`https://images.unsplash.com/photo-${photo}?w=200&h=200&fit=crop&auto=format`} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
        </div>
      </Section>

      {/* RSVP */}
      <Section className="px-8 py-12" style={{ background: '#F5EFE6' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }} className="text-center mb-2">Konfirmasi Kehadiran</h2>
        <p className="text-center text-stone-400 text-sm mb-8">Mohon konfirmasi kehadiran Anda sebelum 8 Januari 2027</p>
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#E0D9CF' }}>
          <RSVPForm />
        </div>
      </Section>

      {/* Wishes */}
      <Section className="px-8 py-12">
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }} className="text-center mb-8">Ucapan &amp; Doa</h2>
        <div className="space-y-4">
          {WISHES.map(w => (
            <div key={w.name} className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              <p className="text-stone-600 text-sm leading-relaxed italic mb-3" style={{ fontFamily: 'Lora, serif' }}>"{w.wish}"</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: '#F5EFE6', color: '#9B7B2A' }}>{w.name[0]}</div>
                <span className="text-sm font-medium text-stone-700">{w.name}</span>
                <span className="text-stone-300 text-xs ml-auto">{w.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Wedding Gift */}
      <Section className="px-8 py-12" style={{ background: '#F5EFE6' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1B3A4B' }} className="text-center mb-3">Wedding Gift</h2>
        <p className="text-center text-stone-400 text-sm mb-8">Doa restu Anda adalah hadiah terindah bagi kami.</p>
        <div className="space-y-4">
          {[{ bank: 'Bank BCA', account: '1234567890', name: 'Al Yafi' }, { bank: 'GoPay / OVO', account: '081234567890', name: 'Al Yafi' }].map(gift => (
            <div key={gift.bank} className="p-5 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E0D9CF' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-stone-800 text-sm">{gift.bank}</div>
                  <div className="text-stone-400 text-xs mt-0.5">a.n. {gift.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3 py-2 rounded-lg text-sm font-mono" style={{ background: '#F5EFE6', color: '#1B3A4B' }}>{gift.account}</div>
                <button onClick={() => { navigator.clipboard.writeText(gift.account); setCopiedGift(gift.account); setTimeout(() => setCopiedGift(null), 2000) }} className="px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: '#1B3A4B', color: copiedGift === gift.account ? '#C9A84C' : '#FAF8F4' }}>
                  {copiedGift === gift.account ? '✓ Disalin' : 'Salin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing */}
      <Section className="px-8 py-16 text-center relative overflow-hidden" style={{ background: '#1B3A4B' }}>
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <div className="relative z-10">
          <p className="mb-4" style={{ fontFamily: 'Amiri, serif', fontSize: 16, color: '#C9A84C' }}>وَاللَّهُ جَعَلَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجاً</p>
          <div className="w-8 h-px mx-auto my-6" style={{ background: 'rgba(201,168,76,0.4)' }} />
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#FFFFFF', lineHeight: 1.3 }}>
            Jazakumullah<br />Khairan Katsiran
          </h2>
          <p className="mt-4 text-white/50 text-sm leading-relaxed">
            Atas doa dan kehadiran Bapak/Ibu/Saudara/i,<br />kami ucapkan terima kasih yang sebesar-besarnya.
          </p>
          <div className="w-8 h-px mx-auto mt-8 mb-6" style={{ background: 'rgba(201,168,76,0.4)' }} />
          <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#C9A84C' }}>Al Yafi &amp; Yova</p>
          <p className="text-white/30 text-xs mt-2">10 Januari 2027</p>
        </div>
      </Section>

      {/* Floating RSVP btn */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <a href="#rsvp" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium shadow-lg transition-all hover:shadow-xl" style={{ background: '#1B3A4B', color: '#FAF8F4', backdropFilter: 'blur(12px)' }}>
          ✉ RSVP Sekarang
        </a>
      </div>

      {/* Footer */}
      <div className="py-6 text-center" style={{ background: '#1B3A4B' }}>
        <p className="text-white/20 text-xs">Dibuat dengan ♡ menggunakan</p>
        <p className="text-amber-400/50 text-xs">Nikahku.id</p>
      </div>
    </div>
  )
}
