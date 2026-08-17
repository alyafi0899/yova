import React from 'react'
import type { TemplateWidget, ThemeConfig } from '../../../lib/invitation/types'
import CountdownWidget from './widgets/CountdownWidget'

interface WidgetRendererProps {
  widget: TemplateWidget
  theme: ThemeConfig
  mode: 'edit' | 'preview' | 'public'
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, theme, mode }) => {
  switch (widget.type) {
    case 'countdown':
      return <CountdownWidget config={widget.config} theme={theme} />
    case 'maps':
      return (
        <div className="p-4 bg-soft border border-nude text-center">
           <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Google Maps Widget</p>
           <p className="text-[8px] text-muted italic">Lat: {widget.config.lat}, Lng: {widget.config.lng}</p>
        </div>
      )
    default:
      return null
  }
}

export default WidgetRenderer
