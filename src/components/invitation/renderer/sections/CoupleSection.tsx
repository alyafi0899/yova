import React from 'react'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'

interface CoupleSectionProps {
  section: TemplateSection
  theme: ThemeConfig
}

const CoupleSection: React.FC<CoupleSectionProps> = ({ section, theme }) => {
  const { config } = section

  return (
    <section className="py-24 px-6 text-center space-y-16">
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: theme.colors.accent }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed italic">
          "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Groom */}
        <div className="space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <div
              className="absolute inset-0 border-2 border-dashed rounded-full animate-[spin_20s_linear_infinite]"
              style={{ borderColor: `${theme.colors.accent}44` }}
            />
            <div className="absolute inset-2 rounded-full overflow-hidden border border-nude">
              <img src={config.groom.image} className="w-full h-full object-cover" alt="Groom" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
              {config.groom.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Pengantin Pria</p>
            <p className="text-xs text-muted leading-relaxed">{config.groom.parents}</p>
          </div>
        </div>

        {/* Bride */}
        <div className="space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <div
              className="absolute inset-0 border-2 border-dashed rounded-full animate-[spin_20s_linear_infinite_reverse]"
              style={{ borderColor: `${theme.colors.accent}44` }}
            />
            <div className="absolute inset-2 rounded-full overflow-hidden border border-nude">
              <img src={config.bride.image} className="w-full h-full object-cover" alt="Bride" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
              {config.bride.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Pengantin Wanita</p>
            <p className="text-xs text-muted leading-relaxed">{config.bride.parents}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoupleSection
