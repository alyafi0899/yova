import type { NavProps } from '../App'
import { getWhatsAppLink, formatPrice, DEPOSIT_AMOUNT } from '../data/dresses'

const STEPS = [
  {
    n: '01',
    title: 'Pilih Koleksi',
    desc: 'Browse koleksi yang tersedia di website. Lihat foto, ukuran, kelengkapan, dan detail setiap baju. Bandingkan pilihan sebelum memutuskan.',
  },
  {
    n: '02',
    title: 'Cek Jadwal',
    desc: 'Periksa ketersediaan baju pilihan Anda untuk tanggal acara melalui kalender di halaman detail. Pastikan baju tidak sedang disewa atau dipesan.',
  },
  {
    n: '03',
    title: 'Jadwalkan Fitting',
    desc: 'Ajukan jadwal fitting melalui form di website. Isi nama, nomor WhatsApp, tanggal acara, dan koleksi pilihan Anda.',
  },
  {
    n: '04',
    title: 'Sesi Fitting',
    desc: 'Datang ke studio Yova sesuai jadwal yang telah dikonfirmasi via WhatsApp. Coba koleksi pilihan dan pastikan ukuran sesuai dengan tubuh Anda.',
  },
  {
    n: '05',
    title: 'Konfirmasi Koleksi',
    desc: 'Setelah fitting, pilih koleksi final yang akan disewa. Minor resize dapat dilakukan jika diperlukan, berdasarkan hasil fitting.',
  },
  {
    n: '06',
    title: 'Pembayaran + Deposit',
    desc: `Selesaikan pembayaran biaya sewa dan deposit ${formatPrice(DEPOSIT_AMOUNT)}. Deposit adalah uang jaminan yang dikembalikan setelah pengembalian barang.`,
    note: true,
  },
  {
    n: '07',
    title: 'Booking Dikonfirmasi',
    desc: 'Setelah pembayaran selesai, booking Anda resmi dikonfirmasi. Tanggal acara Anda telah terlindungi dan baju tidak dapat disewa oleh orang lain.',
  },
  {
    n: '08',
    title: 'Pengambilan (H-1)',
    desc: 'Ambil baju akad paling cepat H-1 sebelum acara. Periksa semua kelengkapan dan pastikan kondisi baju sesuai sebelum meninggalkan studio.',
  },
  {
    n: '09',
    title: 'Pengembalian (H+1)',
    desc: 'Kembalikan baju beserta semua kelengkapan paling lambat H+1 setelah acara. Baju dikembalikan dalam kondisi bersih dan lengkap.',
  },
  {
    n: '10',
    title: 'Pemeriksaan & Pengembalian Deposit',
    desc: 'Baju dan kelengkapan diperiksa kondisinya. Deposit dikembalikan sesuai ketentuan sewa apabila semua item kembali dalam kondisi baik.',
  },
]

export default function HowItWorks({ navigate }: NavProps) {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-16">
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Panduan</p>
          <h1 className="font-display text-5xl text-charcoal mb-6">Cara Sewa Baju Akad</h1>
          <p className="text-muted text-lg max-w-xl leading-relaxed">
            Proses yang jelas dan transparan dari browse koleksi hingga pengembalian —
            untuk ketenangan pikiran Anda.
          </p>
        </div>

        {/* Flow summary */}
        <div className="flex flex-wrap items-center gap-2 mb-16 p-4 bg-cream border border-nude text-xs text-muted">
          {['Browse', 'Fitting', 'Booking', 'Rental', 'Return'].map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className="font-medium text-charcoal">{s}</span>
              {i < 4 && <span className="text-nude">→</span>}
            </span>
          ))}
        </div>

        {/* Steps */}
        <div>
          {STEPS.map((step, i) => (
            <div key={step.n} className="grid grid-cols-[52px_1fr] gap-6 md:gap-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-mocha text-ivory flex items-center justify-center text-xs font-medium shrink-0">
                  {step.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 w-px bg-nude mt-2" style={{ minHeight: '56px' }} />
                )}
              </div>
              <div className="pb-10">
                <h3 className="font-display text-xl text-charcoal mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                {step.note && (
                  <div className="mt-3 p-3 bg-cream border border-nude text-xs text-muted leading-relaxed">
                    <strong className="text-charcoal">Deposit {formatPrice(DEPOSIT_AMOUNT)}</strong>{' '}
                    adalah uang jaminan, bukan biaya sewa. Dikembalikan setelah pemeriksaan
                    kondisi barang selama tidak ada kerusakan atau kehilangan kelengkapan.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Policy summary */}
        <div className="mt-4 mb-12 p-6 bg-cream border border-nude">
          <h3 className="font-display text-xl text-charcoal mb-4">Ketentuan Penting</h3>
          <ul className="space-y-2 text-sm text-muted">
            {[
              `Deposit: ${formatPrice(DEPOSIT_AMOUNT)} (uang jaminan, bukan biaya sewa)`,
              'Pengambilan paling cepat H-1 sebelum acara',
              'Pengembalian paling lambat H+1 setelah acara',
              'Semua kelengkapan (veil, bros, dll.) harus dikembalikan',
              'Pelanggan tidak boleh mencuci baju tanpa izin pemilik',
              'Kerusakan ringan diperhitungkan dari deposit',
              'Kerusakan berat atau kehilangan dapat dikenakan biaya penggantian',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-mocha shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-nude">
          <button
            onClick={() => navigate('fitting')}
            className="px-8 py-3 bg-mocha text-ivory text-sm font-medium tracking-wide hover:bg-mocha-dark transition-colors"
            style={{ borderRadius: '2px' }}
          >
            Jadwalkan Fitting Sekarang
          </button>
          <a
            href={getWhatsAppLink('Hallo Yova, saya ingin bertanya tentang proses sewa baju akad.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-nude text-charcoal text-sm font-medium text-center hover:border-charcoal transition-colors"
            style={{ borderRadius: '2px' }}
          >
            Tanya via WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
