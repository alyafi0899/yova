import React from 'react'
import type { TemplateSection, ThemeConfig, TemplateElement } from '../../../../lib/invitation/types'
import MotionWrapper from '../MotionWrapper'
import DraggableElement from '../DraggableElement'

interface CoverSectionProps {
  section: TemplateSection
  theme: ThemeConfig
  mode: 'edit' | 'preview' | 'public'
  activeElementId?: string
  onElementClick?: (id: string) => void
  onElementUpdate?: (id: string, updates: Partial<TemplateElement>) => void
}

const CoverSection: React.FC<CoverSectionProps> = ({
  section,
  theme,
  mode,
  activeElementId,
  onElementClick,
  onElementUpdate
}) => {
  const { config } = section

  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden"
      style={{ background: theme.colors.primary }}
    >
      {config.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={config.backgroundImage}
            className="w-full h-full object-cover opacity-30"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        <MotionWrapper config={{ type: 'fade-down', duration: 1000, delay: 200 }}>
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-ivory/60 font-bold"
            style={{ color: theme.colors.accent }}
          >
            The Wedding of
          </p>
        </MotionWrapper>

        <MotionWrapper config={{ type: 'blur-reveal', duration: 1200, delay: 500 }}>
          <h1
            className="text-4xl md:text-6xl text-white leading-tight"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {config.groomName}<br />
            <span className="text-2xl md:text-3xl italic opacity-60">&amp;</span><br />
            {config.brideName}
          </h1>
        </MotionWrapper>

        <MotionWrapper config={{ type: 'scale', duration: 800, delay: 1000 }}>
           <div className="w-12 h-px bg-ivory/20 mx-auto my-6" />
        </MotionWrapper>

        <MotionWrapper config={{ type: 'fade-up', duration: 1000, delay: 1200 }}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/80 font-bold">
            {config.date}
          </p>
        </MotionWrapper>

        {mode === 'public' && (
          <button
            className="mt-12 px-8 py-3 bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white/20 transition-all"
          >
            Buka Undangan
          </button>
        )}
      </div>

      {/* Render Section Elements */}
      {section.elements.map(el => (
        <DraggableElement
          key={el.id}
          element={el}
          mode={mode}
          isActive={activeElementId === el.id}
          onClick={() => onElementClick?.(el.id)}
          onUpdate={(updates) => onElementUpdate?.(el.id, updates)}
        />
      ))}
    </section>
  )
}

export default CoverSection
