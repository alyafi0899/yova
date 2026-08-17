import React from 'react'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'

interface GiftSectionProps {
  section: TemplateSection
  theme: ThemeConfig
}

const GiftSection: React.FC<GiftSectionProps> = ({ section, theme }) => {
  const { config } = section

  return (
    <section className="py-24 px-6 bg-white text-center">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Kado Nikah</p>
          <h2 className="text-4xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
            Wedding Gift
          </h2>
          <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
             Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {(config.accounts || []).map((acc: any, idx: number) => (
             <div key={idx} className="p-8 bg-ivory border border-nude rounded-sm space-y-4 relative group hover:border-mocha transition-all">
                <div className="text-[10px] font-bold text-mocha uppercase tracking-widest">{acc.bank}</div>
                <div className="font-mono text-lg font-bold text-charcoal">{acc.number}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted">a.n {acc.name}</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(acc.number); alert('Nomor rekening disalin!'); }}
                  className="px-6 py-2 bg-charcoal text-ivory text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                >Salin Rekening</button>
             </div>
           ))}
        </div>

        {config.address && (
          <div className="p-8 border border-nude bg-soft space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Kirim Kado Fisik</p>
             <p className="text-sm text-charcoal">{config.address}</p>
             <button
                onClick={() => { navigator.clipboard.writeText(config.address); alert('Alamat disalin!'); }}
                className="text-[10px] font-bold text-mocha uppercase tracking-widest hover:underline"
             >Salin Alamat →</button>
          </div>
        )}
      </div>
    </section>
  )
}

export default GiftSection
