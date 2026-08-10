import { useState } from 'react'
import type { NavProps } from '../App'
import { getWhatsAppLink, formatPrice, DEPOSIT_AMOUNT } from '../data/dresses'

const FAQS = [
  {
    q: 'Berapa lama masa sewa?',
    a: 'Pengambilan paling cepat H-1 sebelum acara dan pengembalian paling lambat H+1 setelah acara.',
  },
  {
    q: 'Berapa deposit?',
    a: `Deposit sebesar ${formatPrice(DEPOSIT_AMOUNT)}. Ini adalah uang jaminan, bukan biaya sewa. Deposit dikembalikan setelah barang diperiksa dan kondisinya memenuhi ketentuan.`,
  },
  {
    q: 'Kapan deposit dikembalikan?',
    a: 'Deposit dikembalikan maksimal 1x24 jam setelah pemeriksaan kondisi barang, selama tidak terdapat kerusakan, noda permanen, atau kehilangan kelengkapan.',
  },
  {
    q: 'Apakah bisa resize?',
    a: 'Minor resize dapat dilakukan berdasarkan hasil fitting. Jenis penyesuaian yang tersedia akan dikonfirmasi saat sesi fitting. Tidak semua koleksi mendukung resize.',
  },
  {
    q: 'Apakah boleh mencuci sendiri?',
    a: 'Tidak. Pelanggan tidak diperbolehkan mencuci baju sewa tanpa izin tertulis dari pemilik.',
  },
  {
    q: 'Bagaimana jika barang rusak?',
    a: 'Kerusakan ringan dapat diperhitungkan dari deposit sesuai biaya perbaikan. Kerusakan berat atau kehilangan dapat dikenakan biaya penggantian sesuai ketentuan sewa.',
  },
  {
    q: 'Apakah wajib fitting sebelum sewa?',
    a: 'Ya, fitting sangat disarankan dan merupakan bagian dari proses standar kami. Fitting memastikan baju sesuai dengan ukuran dan kebutuhan Anda sebelum hari akad.',
  },
  {
    q: 'Bagaimana cara mengecek ketersediaan?',
    a: 'Anda dapat mengecek ketersediaan melalui kalender di halaman detail koleksi, atau bertanya langsung via WhatsApp dengan menyebutkan kode koleksi dan tanggal acara.',
  },
  {
    q: 'Apa saja yang termasuk dalam paket sewa?',
    a: 'Kelengkapan berbeda untuk setiap koleksi. Detail lengkap tertera di halaman detail masing-masing baju. Semua kelengkapan yang tercantum harus dikembalikan bersama baju.',
  },
  {
    q: 'Apakah bisa menyewa untuk resepsi juga?',
    a: 'Koleksi kami dirancang untuk hari akad. Penggunaan untuk acara lain (resepsi, pre-wedding, dll.) dapat dikonsultasikan langsung via WhatsApp.',
  },
]

const POLICIES = [
  { title: 'Masa Sewa', body: 'Pengambilan paling cepat H-1. Pengembalian paling lambat H+1.' },
  {
    title: 'Deposit',
    body: `${formatPrice(DEPOSIT_AMOUNT)} — uang jaminan, bukan biaya sewa. Dikembalikan setelah pemeriksaan kondisi barang.`,
  },
  {
    title: 'Kerusakan',
    body: 'Kerusakan ringan diperhitungkan dari deposit. Kerusakan berat atau kehilangan dapat dikenakan biaya penggantian.',
  },
  {
    title: 'Kelengkapan',
    body: 'Semua aksesoris yang termasuk dalam paket (veil, bros, songket, dll.) harus dikembalikan bersama baju.',
  },
  {
    title: 'Kebersihan',
    body: 'Pelanggan tidak boleh mencuci atau membersihkan baju secara mandiri tanpa izin pemilik.',
  },
  {
    title: 'Perubahan Permanen',
    body: 'Pelanggan tidak boleh melakukan perubahan permanen pada baju tanpa izin tertulis.',
  },
]

export default function FAQ({ navigate: _ }: NavProps) {
  const [open, setOpen] = useState<number | null>(null)
  const [tab, setTab] = useState<'faq' | 'policy'>('faq')

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Informasi</p>
        <h1 className="font-display text-5xl text-charcoal mb-10">FAQ & Ketentuan</h1>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-10 border border-nude">
          <button
            onClick={() => setTab('faq')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'faq' ? 'bg-charcoal text-ivory' : 'bg-ivory text-muted hover:text-charcoal'
            }`}
          >
            Pertanyaan Umum
          </button>
          <button
            onClick={() => setTab('policy')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'policy'
                ? 'bg-charcoal text-ivory'
                : 'bg-ivory text-muted hover:text-charcoal'
            }`}
          >
            Ketentuan Sewa
          </button>
        </div>

        {tab === 'faq' && (
          <div className="divide-y divide-nude">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-start justify-between py-5 text-left gap-4 hover:text-mocha transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-medium text-charcoal text-sm leading-relaxed">
                    {faq.q}
                  </span>
                  <span
                    className={`text-muted shrink-0 text-lg leading-none transition-transform duration-200 mt-0.5 ${
                      open === i ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <div className="pb-5 text-sm text-muted leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'policy' && (
          <div className="space-y-0 divide-y divide-nude">
            {POLICIES.map(p => (
              <div key={p.title} className="py-6">
                <h3 className="font-display text-lg text-charcoal mb-2">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
            <div className="py-6">
              <p className="text-xs text-muted italic">
                Ketentuan di atas merupakan kebijakan standar. Hal-hal yang belum tercantum
                dapat dikonsultasikan langsung dengan pemilik studio.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 bg-cream border border-nude text-center">
          <h3 className="font-display text-2xl text-charcoal mb-3">Masih ada pertanyaan?</h3>
          <p className="text-muted text-sm mb-6">Tim kami siap membantu Anda via WhatsApp.</p>
          <a
            href={getWhatsAppLink(
              'Hallo Yova, saya ingin bertanya tentang sewa baju akad.',
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-mocha text-ivory text-sm font-medium hover:bg-mocha-dark transition-colors"
            style={{ borderRadius: '2px' }}
          >
            Chat di WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
