import { useNavigate } from 'react-router-dom'
import { getWhatsAppLink, formatPrice, DEPOSIT_AMOUNT } from '../data/dresses'

const STEPS = [
  {
    n: '01',
    title: 'Konsultasi Awal',
    desc: 'Diskusikan kebutuhan dan preferensi gaya Anda melalui WhatsApp atau langsung di studio untuk menemukan koleksi yang paling sesuai.',
  },
  {
    n: '02',
    title: 'Pengecekan Jadwal',
    desc: 'Tim kami akan memverifikasi ketersediaan koleksi pilihan Anda untuk tanggal acara yang telah ditentukan.',
  },
  {
    n: '03',
    title: 'Kunjungan & Fitting',
    desc: 'Lakukan fitting langsung di studio untuk memastikan ukuran dan kenyamanan baju akad Anda sebelum melakukan reservasi.',
  },
  {
    n: '04',
    title: 'Pengisian Formulir',
    desc: 'Lengkapi formulir reservasi resmi dengan data diri, detail acara, dan ID reservasi untuk pencatatan di database kami.',
  },
  {
    n: '05',
    title: 'Pembayaran Penuh & Uang Jaminan',
    desc: `Selesaikan pembayaran biaya sewa secara penuh beserta uang jaminan (deposit) sebesar ${formatPrice(DEPOSIT_AMOUNT)} untuk mengunci jadwal.`,
    note: true,
  },
  {
    n: '06',
    title: 'Pengambilan & Penyesuaian (H-1)',
    desc: 'Ambil baju akad Anda H-1 sebelum acara. Dilakukan penyesuaian akhir (minor resize) jika diperlukan agar tampil sempurna.',
  },
  {
    n: '07',
    title: 'Pengembalian Gaun/Jas',
    desc: 'Kembalikan koleksi beserta seluruh kelengkapannya ke studio paling lambat H+1 setelah acara selesai.',
  },
  {
    n: '08',
    title: 'Pengecekan Kondisi',
    desc: 'Tim YOVA akan memeriksa kondisi fisik koleksi yang dikembalikan untuk memastikan tidak ada kerusakan berat atau kehilangan.',
  },
  {
    n: '09',
    title: 'Pencairan Uang Jaminan',
    desc: 'Setelah pengecekan selesai dan kondisi dinyatakan baik, uang jaminan (deposit) akan dikembalikan sepenuhnya ke rekening Anda.',
  },
  {
    n: '10',
    title: 'Ulasan Pelanggan',
    desc: 'Berikan ulasan dan testimoni mengenai pengalaman Anda menggunakan layanan YOVA untuk membantu kami terus berkembang.',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()
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
            onClick={() => navigate('/fitting')}
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
