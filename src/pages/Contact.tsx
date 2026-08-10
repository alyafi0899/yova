import type { NavProps } from '../App'
import { getWhatsAppLink } from '../data/dresses'

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Contact({ navigate: _ }: NavProps) {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Hubungi Kami</p>
        <h1 className="font-display text-5xl text-charcoal mb-14">Kontak</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
          {/* Info */}
          <div className="space-y-12">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-4">Studio</p>
              <p className="font-display text-3xl text-charcoal mb-1">YOVA</p>
              <p className="text-sm text-muted mb-3">Sewa Baju Akad Blangkejeren</p>
              <p className="text-sm text-charcoal">Blangkejeren, Kabupaten Gayo Lues, Aceh</p>
              <p className="text-xs text-muted italic mt-1">
                Alamat lengkap diberikan saat konfirmasi jadwal fitting.
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-4">WhatsApp</p>
              <a
                href={getWhatsAppLink('Hallo Yova, saya ingin bertanya tentang baju akad.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] text-white text-sm font-medium hover:bg-[#1ebe59] transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <WhatsAppIcon />
                Chat di WhatsApp
              </a>
              <p className="text-xs text-muted mt-2 italic">
                Nomor WhatsApp akan dikonfigurasi oleh pemilik studio.
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-4">
                Jam Operasional
              </p>
              <div className="space-y-0 divide-y divide-nude">
                {[
                  ['Senin – Jumat', '09:00 – 17:00'],
                  ['Sabtu', '09:00 – 15:00'],
                  ['Minggu', 'Berdasarkan perjanjian'],
                ].map(([day, time]) => (
                  <div key={day} className="flex justify-between py-3 text-sm">
                    <span className="text-charcoal">{day}</span>
                    <span className="text-muted">{time}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted mt-3 italic">
                * Jam operasional dapat berubah. Konfirmasi via WhatsApp disarankan sebelum
                datang.
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-4">
                Media Sosial
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 border border-nude text-sm text-muted italic"
                style={{ borderRadius: '2px' }}
              >
                Instagram — akan dikonfigurasi
              </div>
            </div>
          </div>

          {/* Map + location info */}
          <div>
            <div
              className="bg-soft border border-nude flex flex-col items-center justify-center mb-4"
              style={{ aspectRatio: '1 / 1' }}
            >
              <span className="text-4xl mb-4">📍</span>
              <p className="text-sm text-charcoal font-medium mb-1">Blangkejeren, Aceh</p>
              <p className="text-xs text-muted text-center px-6 italic">
                Google Maps link akan dikonfigurasi oleh pemilik studio
              </p>
            </div>

            <div className="p-5 bg-cream border border-nude">
              <p className="text-xs font-medium text-charcoal mb-2">Cara ke Studio</p>
              <p className="text-xs text-muted leading-relaxed">
                Studio berlokasi di Blangkejeren, Kabupaten Gayo Lues, Aceh. Petunjuk
                arah lengkap akan diberikan setelah jadwal fitting dikonfirmasi via
                WhatsApp.
              </p>
            </div>

            <div className="mt-4 p-5 border border-nude">
              <p className="text-xs font-medium text-charcoal mb-3">Hubungi untuk</p>
              <ul className="space-y-2 text-xs text-muted">
                {[
                  'Pertanyaan seputar koleksi',
                  'Cek ketersediaan tanggal',
                  'Informasi ukuran baju',
                  'Jadwal fitting',
                  'Konsultasi pilihan koleksi',
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-mocha">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
