import type { NavProps } from '../App'
import { DRESSES, getWhatsAppLink } from '../data/dresses'
import DressCard from '../components/DressCard'

const HERO =
  'https://images.unsplash.com/photo-1771808022279-cf15a2a9eaca?w=1920&h=1200&fit=crop&auto=format'
const ABOUT_IMG =
  'https://images.unsplash.com/photo-1676132068619-f015a54cee3d?w=1200&h=900&fit=crop&auto=format'

const WA_GENERAL = getWhatsAppLink(
  'Hallo Yova, saya ingin bertanya tentang koleksi baju akad dan proses sewa.',
)

export default function Home({ navigate }: NavProps) {
  const featured = DRESSES.slice(0, 3)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] bg-soft overflow-hidden">
        <img src={HERO} alt="Baju akad wanita elegan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-20 w-full">
            <p className="text-white/50 text-[10px] tracking-[0.25em] uppercase mb-5">
              YOVA · Blangkejeren, Aceh
            </p>
            <h1 className="font-display text-white text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] max-w-2xl mb-6">
              Baju Akad untuk Hari yang Berarti.
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-lg mb-10 leading-relaxed">
              Temukan koleksi baju akad, lihat detail ukuran dan kelengkapannya, cek
              ketersediaan, lalu jadwalkan fitting sebelum hari istimewa Anda.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('collection')}
                className="px-8 py-3 bg-ivory text-charcoal text-sm font-medium tracking-wide hover:bg-white transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Lihat Koleksi
              </button>
              <button
                onClick={() => navigate('fitting')}
                className="px-8 py-3 border border-white/50 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                Jadwalkan Fitting
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Collection ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Koleksi Pilihan</p>
            <h2 className="font-display text-4xl text-charcoal">Temukan Baju Akad Anda</h2>
          </div>
          <button
            onClick={() => navigate('collection')}
            className="hidden md:flex items-center gap-1.5 text-xs text-mocha font-medium tracking-widest uppercase hover:gap-3 transition-all"
          >
            Lihat Semua <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(dress => (
            <DressCard
              key={dress.id}
              dress={dress}
              onClick={() => navigate('dress-detail', dress.id)}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('collection')}
          className="md:hidden mt-10 text-xs text-mocha font-medium tracking-widest uppercase flex items-center gap-2"
        >
          Lihat Semua Koleksi <span>→</span>
        </button>
      </section>

      {/* ── How It Works Teaser ── */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Proses Sewa</p>
            <h2 className="font-display text-4xl text-charcoal">Mudah dalam 3 Langkah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                n: '01',
                title: 'Pilih & Cek Koleksi',
                desc:
                  'Browse koleksi yang tersedia, lihat detail ukuran dan kelengkapan, lalu cek ketersediaan untuk tanggal acara Anda.',
              },
              {
                n: '02',
                title: 'Jadwalkan Fitting',
                desc:
                  'Ajukan jadwal fitting melalui website. Kami akan konfirmasi jadwal dan memastikan koleksi pilihan Anda siap dicoba.',
              },
              {
                n: '03',
                title: 'Sewa & Tampil Percaya Diri',
                desc:
                  'Setelah fitting dan booking dikonfirmasi, ambil baju pada H-1 dan kembalikan paling lambat H+1 setelah acara.',
              },
            ].map(step => (
              <div key={step.n}>
                <div className="font-display text-8xl text-nude mb-4 leading-none">{step.n}</div>
                <h3 className="font-display text-xl text-charcoal mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate('how-it-works')}
              className="px-8 py-3 border border-mocha text-mocha text-sm font-medium hover:bg-mocha hover:text-ivory transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Lihat Proses Lengkap
            </button>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative overflow-hidden bg-soft">
            <img
              src={ABOUT_IMG}
              alt="Studio YOVA Blangkejeren"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-4">Tentang Yova</p>
            <h2 className="font-display text-4xl text-charcoal mb-6 leading-tight">
              Lebih dari Sekadar Sewa Baju
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              YOVA hadir untuk membantu pasangan Blangkejeren tampil terbaik di hari akad
              mereka. Kami percaya setiap pernikahan berhak mendapat baju akad yang indah
              — tanpa harus membelinya.
            </p>
            <p className="text-muted leading-relaxed mb-10">
              Dengan koleksi yang terus diperbarui, proses fitting yang nyaman, dan layanan
              yang personal, kami memastikan pengalaman sewa baju akad Anda menjadi awal
              yang sempurna untuk hari istimewa.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-nude pt-8">
              {[
                { label: 'Koleksi Tersedia', value: `${DRESSES.length}+` },
                { label: 'Deposit Jaminan', value: 'Rp150rb' },
                { label: 'Pickup H-1', value: 'Return H+1' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display text-2xl text-charcoal mb-1">{stat.value}</div>
                  <div className="text-[10px] text-muted uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA Strip ── */}
      <section className="bg-charcoal py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-ivory/40 text-[10px] tracking-[0.22em] uppercase mb-4">Hubungi Kami</p>
          <h2 className="font-display text-4xl text-ivory mb-4">Ada Pertanyaan?</h2>
          <p className="text-ivory/60 mb-10 leading-relaxed max-w-md mx-auto">
            Tim Yova siap membantu Anda memilih koleksi, mengecek ketersediaan, dan
            menjawab semua pertanyaan seputar proses sewa.
          </p>
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#25D366] text-white text-sm font-medium hover:bg-[#1ebe59] transition-colors"
            style={{ borderRadius: '2px' }}
          >
            <WhatsAppIcon />
            Chat di WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
