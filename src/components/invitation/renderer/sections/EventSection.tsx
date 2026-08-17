import React from 'react'
import type { TemplateSection, ThemeConfig } from '../../../../lib/invitation/types'
import WidgetRenderer from '../WidgetRenderer'

interface EventSectionProps {
  section: TemplateSection
  theme: ThemeConfig
  mode: 'edit' | 'preview' | 'public'
}

const EventSection: React.FC<EventSectionProps> = ({ section, theme, mode }) => {
  const { config, widgets } = section

  return (
    <section className="py-24 px-6 bg-cream/30 text-center">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Rangkaian Acara</p>
          <h2 className="text-4xl text-charcoal" style={{ fontFamily: theme.fonts.heading }}>
            Hari Bahagia
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {config.events.map((event: any, i: number) => (
            <div
              key={i}
              className="bg-white p-10 shadow-sm border border-nude relative group hover:border-mocha transition-all"
              style={{ borderRadius: theme.borderRadius }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-20 transition-all group-hover:w-full"
                style={{ background: theme.colors.accent }}
              />

              <h3 className="text-xl text-charcoal mb-6" style={{ fontFamily: theme.fonts.heading }}>
                {event.name}
              </h3>

              <div className="space-y-4 text-sm text-muted">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-mocha-light">Tanggal</span>
                  <p>{event.date}</p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-mocha-light">Waktu</span>
                  <p>{event.time}</p>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-mocha-light">Lokasi</span>
                  <p className="font-bold text-charcoal">{event.venue}</p>
                  <p className="text-xs">{event.address}</p>
                </div>
              </div>

              <button
                className="mt-10 px-6 py-2 border border-nude text-[10px] font-bold uppercase tracking-widest text-muted hover:bg-ivory hover:text-charcoal transition-all"
                style={{ borderRadius: '2px' }}
              >
                Lihat Peta →
              </button>
            </div>
          ))}
        </div>

        {widgets && widgets.length > 0 && (
          <div className="pt-12 space-y-8">
            {widgets.map(w => (
              <WidgetRenderer key={w.id} widget={w} theme={theme} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default EventSection
