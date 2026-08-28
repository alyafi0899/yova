import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { InvitationProject } from '../../lib/invitation/types'

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const diff = target - now
      if (diff < 0) {
        clearInterval(timer)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-4 sm:gap-8 justify-center">
      {[
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
      ].map(unit => (
        <div key={unit.label} className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-mocha text-white flex items-center justify-center font-display text-2xl sm:text-3xl shadow-lg rounded-sm">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-muted mt-3 font-bold">{unit.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardOverview({ project }: { project: InvitationProject }) {
  const stats = [
    { label: 'Total Tamu', value: '245', icon: '👥' },
    { label: 'Undangan Terkirim', value: '198', icon: '📤' },
    { label: 'Dibuka', value: '176', icon: '👀' },
    { label: 'RSVP', value: '142', icon: '✅' },
  ]

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-display text-4xl text-charcoal mb-2">
            {project.data.couple.bride.name.split(' ')[0]} & {project.data.couple.groom.name.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted">Undangan Pernikahan</span>
            <div className="h-1 w-1 rounded-full bg-nude" />
            <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold uppercase rounded-full">
              {project.status === 'published' ? '● Aktif' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/i/${project.slug}`}
            target="_blank"
            className="px-6 py-2.5 border border-nude text-charcoal text-[9px] font-bold uppercase tracking-widest hover:bg-soft transition-colors"
          >
            Lihat Undangan
          </Link>
          <Link
            to="/invitation/dashboard/customize"
            className="px-6 py-2.5 bg-mocha text-white text-[9px] font-bold uppercase tracking-widest hover:bg-mocha-dark transition-colors"
          >
            Sesuaikan
          </Link>
        </div>
      </div>

      {/* Countdown Card */}
      <div className="bg-ivory/50 border border-nude p-10 mb-12 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-mocha/5 -rotate-12 translate-x-12 -translate-y-12 rounded-full" />
        <h3 className="text-xs uppercase tracking-[0.3em] text-mocha font-bold mb-10">
          Menuju Hari Bahagia
        </h3>
        <Countdown targetDate={project.data.event.date} />
        <p className="text-sm italic text-muted mt-10">
          {new Date(project.data.event.date).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-nude p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-4">{stat.icon}</div>
            <div className="text-[9px] uppercase tracking-widest text-muted font-bold mb-1">{stat.label}</div>
            <div className="text-3xl font-display text-charcoal">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-charcoal text-ivory p-8">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6">Aksi Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/invitation/dashboard/guests" className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[9px] uppercase tracking-widest text-center transition-colors">Tambah Tamu</Link>
            <Link to="/invitation/dashboard/rsvp" className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[9px] uppercase tracking-widest text-center transition-colors">Cek RSVP</Link>
            <Link to="/invitation/dashboard/customize" className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[9px] uppercase tracking-widest text-center transition-colors">Edit Konten</Link>
            <Link to="/invitation/dashboard/template" className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[9px] uppercase tracking-widest text-center transition-colors">Lihat Template</Link>
          </div>
        </div>
        <div className="bg-white border border-nude p-8">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-charcoal mb-6">Informasi Undangan</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-nude">
              <span className="text-[10px] uppercase text-muted">Template</span>
              <span className="text-[10px] font-bold uppercase">{project.templateId}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-nude">
              <span className="text-[10px] uppercase text-muted">Versi</span>
              <span className="text-[10px] font-bold uppercase">1.2</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-nude">
              <span className="text-[10px] uppercase text-muted">Link Utama</span>
              <span className="text-[10px] font-bold lowercase text-mocha">yova.id/i/{project.slug}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
