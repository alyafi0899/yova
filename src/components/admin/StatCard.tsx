import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  trend?: string
  color: 'mocha' | 'emerald' | 'amber' | 'blue'
}

export default function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  const colors = {
    mocha: 'bg-mocha/10 text-mocha',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600'
  }

  return (
    <div className="bg-white p-6 border border-nude shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{label}</p>
          <h3 className="text-3xl font-display text-charcoal">{value}</h3>
          {trend && <p className="text-[10px] mt-2 text-emerald-600 font-bold">{trend}</p>}
        </div>
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${colors[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}
