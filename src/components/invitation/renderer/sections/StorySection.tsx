import React from 'react'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'

interface StorySectionProps {
  section: TemplateSection
  theme: ThemeConfig
}

const StorySection: React.FC<StorySectionProps> = ({ section, theme }) => {
  const { config } = section

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-2xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Kisah Cinta</p>
          <h2 className="text-4xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
            Our Love Story
          </h2>
        </header>

        <div className="relative space-y-12 before:absolute before:left-0 md:before:left-1/2 before:top-0 before:h-full before:w-px before:bg-nude before:-translate-x-1/2">
           {(config.stories || []).map((story: any, idx: number) => (
             <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Dot */}
                <div
                  className="absolute left-0 md:left-1/2 w-3 h-3 bg-white border-2 border-mocha rounded-full -translate-x-1/2 z-10"
                  style={{ borderColor: theme.colors.accent }}
                />

                <div className="flex-1 w-full md:w-auto pl-8 md:pl-0">
                   <div className={`p-8 bg-ivory border border-nude rounded-sm ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="text-[10px] font-bold text-mocha uppercase tracking-widest block mb-2">{story.date}</span>
                      <h4 className="font-display text-xl text-charcoal mb-4">{story.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{story.content}</p>
                   </div>
                </div>
                <div className="hidden md:block flex-1" />
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}

export default StorySection
