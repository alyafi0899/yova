import React, { useState, useEffect } from 'react'
import type { ThemeConfig } from '../../../../lib/invitation/types'

interface CountdownWidgetProps {
  config: { date: string }
  theme: ThemeConfig
}

const CountdownWidget: React.FC<CountdownWidgetProps> = ({ config, theme }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(config.date || '2027-01-10T08:00:00').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [config.date])

  return (
    <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
      {[
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center p-3 border border-nude/30 bg-white/5 backdrop-blur-sm">
           <div className="text-2xl md:text-3xl font-display text-charcoal" style={{ color: theme.colors.primary }}>
              {String(item.value).padStart(2, '0')}
           </div>
           <div className="text-[8px] uppercase tracking-widest text-muted font-bold mt-1">
              {item.label}
           </div>
        </div>
      ))}
    </div>
  )
}

export default CountdownWidget
