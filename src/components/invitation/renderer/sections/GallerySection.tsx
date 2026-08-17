import React from 'react'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'

interface GallerySectionProps {
  section: TemplateSection
  theme: ThemeConfig
}

const GallerySection: React.FC<GallerySectionProps> = ({ section, theme }) => {
  const { config } = section

  return (
    <section className="py-24 px-6 bg-soft">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Galeri</p>
          <h2 className="text-4xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
            Pre-Wedding Moments
          </h2>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {(config.images || []).map((img: string, idx: number) => (
             <div
               key={idx}
               className={`overflow-hidden border border-white shadow-sm hover:shadow-xl transition-shadow ${
                 idx === 0 ? 'col-span-2 row-span-2' : ''
               }`}
             >
                <img src={img} className="w-full h-full object-cover aspect-square md:aspect-auto h-full" alt="" />
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
