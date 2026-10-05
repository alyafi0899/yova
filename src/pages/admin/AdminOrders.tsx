import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import StatCard from '../../components/admin/StatCard'

interface Order {
  id: string
  booking_id: string
  customer_name: string
  whatsapp: string
  event_date: string
  fitting_date: string
  fitting_time: string
  dress_code: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  completed_steps: string[]
  dresses: { name: string; id: string } | null
}

const STEPS = [
  { id: 'fitting', label: 'Fitting', icon: '📏' },
  { id: 'booking', label: 'Booking', icon: '💰' },
  { id: 'payment', label: 'Pembayaran', icon: '✅' },
  { id: 'prepared', label: 'Siap Ambil', icon: '👗' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, completed: 0 })

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const ordersWithDresses = await Promise.all((data || []).map(async (order: any) => {
          let dressData = null
          if (order.dress_id) {
            const { data: d } = await supabase.from('dresses').select('id, name').eq('id', order.dress_id).maybeSingle()
            dressData = d
          }
          if (!dressData && order.dress_code) {
            const clean = order.dress_code.trim()
            const { data: dByCode } = await supabase.from('dresses').select('id, name').ilike('collection_code', clean).maybeSingle()
            if (dByCode) {
              dressData = dByCode
            } else {
              const { data: dByName } = await supabase.from('dresses').select('id, name').ilike('name', `%${clean}%`).limit(1).maybeSingle()
              dressData = dByName
            }
          }
          const finalDress = dressData || (order.dress_code ? { id: '', name: order.dress_code } : null)
          return { ...order, dresses: finalDress }
        }))
        setOrders(ordersWithDresses)

        // Calculate stats
        setStats({
          total: data.length,
          pending: data.filter(o => o.status === 'pending').length,
          active: data.filter(o => o.status === 'confirmed').length,
          completed: data.filter(o => o.status === 'completed').length,
        })
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string, dressId?: string) {
    const { error } = await supabase.from('rentals').update({ status }).eq('id', orderId)
    if (!error && dressId) {
      const dressStatus = status === 'confirmed' ? 'booked' : 'available'
      await supabase.from('dresses').update({ status: dressStatus }).eq('id', dressId)
    }
    if (!error) fetchOrders()
  }

  async function toggleStep(orderId: string, currentSteps: string[], stepId: string) {
    const newSteps = (currentSteps || []).includes(stepId)
      ? currentSteps.filter(s => s !== stepId)
      : [...(currentSteps || []), stepId]
    await supabase.from('rentals').update({ completed_steps: newSteps }).eq('id', orderId)
    fetchOrders()
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-display text-charcoal">Manajemen Order</h1>
        <p className="text-sm text-muted mt-1">Pantau dan kelola seluruh siklus penyewaan baju akad</p>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Permintaan" value={stats.total} icon="📊" color="mocha" />
        <StatCard label="Menunggu Konfirmasi" value={stats.pending} icon="⏳" color="amber" trend="+ Baru" />
        <StatCard label="Sewa Aktif" value={stats.active} icon="💍" color="emerald" />
        <StatCard label="Selesai" value={stats.completed} icon="✨" color="blue" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-mocha/20 border-t-mocha rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className={`group bg-white border-l-4 p-8 shadow-sm hover:shadow-md transition-all ${
              order.status === 'confirmed' ? 'border-emerald-500' :
              order.status === 'pending' ? 'border-amber-500' : 'border-slate-200'
            }`}>
              <div className="flex flex-col xl:flex-row justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded tracking-widest">{order.booking_id}</span>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                      order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      order.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      ● {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-widest">Informasi Penyewa</p>
                      <h3 className="text-xl font-display text-charcoal mb-1">{order.customer_name}</h3>
                      <p className="text-sm font-medium text-mocha mb-4">{order.whatsapp}</p>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-muted">Tanggal Fitting</span>
                          <span className="font-bold text-charcoal">{order.fitting_date} • {order.fitting_time}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-muted">Tanggal Acara</span>
                          <span className="font-bold text-charcoal">{order.event_date}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-widest">Detail Koleksi</p>
                      <div className="bg-cream/20 p-4 border border-nude rounded-sm">
                        <p className="text-xs font-bold text-charcoal mb-1">{order.dress_code}</p>
                        <p className="text-sm text-muted italic line-clamp-1">{order.dresses?.name || 'Koleksi tidak ditemukan'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Action Panel */}
                <div className="w-full xl:w-64 flex flex-col gap-3">
                  {order.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => updateStatus(order.id, 'confirmed', order.dresses?.id)} className="py-3 bg-emerald-600 text-white text-[10px] font-bold uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-600/10">Terima</button>
                      <button onClick={() => updateStatus(order.id, 'rejected')} className="py-3 bg-red-500 text-white text-[10px] font-bold uppercase hover:bg-red-600 shadow-lg shadow-red-500/10">Tolak</button>
                    </div>
                  )}

                  <a href={`https://wa.me/${(order.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#25D366] text-white text-[10px] font-bold uppercase text-center hover:bg-[#1ebe59] flex items-center justify-center gap-2">
                    <span>💬</span> Hubungi WhatsApp
                  </a>

                  {order.status === 'confirmed' && (
                    <button onClick={() => updateStatus(order.id, 'completed', order.dresses?.id)} className="w-full py-3 bg-charcoal text-white text-[10px] font-bold uppercase hover:bg-black">Tandai Selesai</button>
                  )}

                  <button onClick={async () => { if(confirm('Hapus permanen?')) { await supabase.from('rentals').delete().eq('id', order.id); fetchOrders(); } }} className="w-full py-3 border border-red-200 text-red-500 text-[10px] font-bold uppercase hover:bg-red-50 transition-colors">Hapus Data</button>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              {order.status === 'confirmed' && (
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Alur Pengerjaan
                    </p>
                    <span className="text-[10px] font-bold text-mocha px-2 py-1 bg-mocha/5 uppercase">{order.completed_steps?.length || 0} / 4 Tahap</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STEPS.map((step) => {
                      const isDone = (order.completed_steps || []).includes(step.id)
                      return (
                        <button
                          key={step.id}
                          onClick={() => toggleStep(order.id, order.completed_steps || [], step.id)}
                          className={`flex flex-col items-center gap-3 p-4 border-2 transition-all group ${
                            isDone ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' : 'bg-white border-slate-100 text-muted hover:border-mocha/30'
                          }`}
                          style={{ borderRadius: '4px' }}
                        >
                          <span className={`text-2xl ${isDone ? 'scale-110' : 'grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100'} transition-all`}>{step.icon}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                              {isDone && <span className="text-[8px] text-white">✓</span>}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tight">{step.label}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="py-32 text-center bg-white border border-dashed border-nude rounded-lg">
              <span className="text-4xl block mb-4">📥</span>
              <p className="text-muted font-medium italic">Belum ada pesanan yang masuk ke sistem.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
