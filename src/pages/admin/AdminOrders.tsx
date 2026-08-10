import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

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
  { id: 'fitting', label: 'Fitting' },
  { id: 'booking', label: 'Booking' },
  { id: 'payment', label: 'Pembayaran' },
  { id: 'prepared', label: 'Siap Diambil' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    console.log('Fetching orders...')
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
      } else {
        console.log('Orders data:', data)
        // Manually fetch dresses for each order to avoid join issues if schema is still refreshing
        const ordersWithDresses = await Promise.all((data || []).map(async (order: any) => {
          if (order.dress_id) {
            const { data: dressData } = await supabase
              .from('dresses')
              .select('id, name')
              .eq('id', order.dress_id)
              .single()
            return { ...order, dresses: dressData }
          }
          return { ...order, dresses: null }
        }))
        setOrders(ordersWithDresses)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string, dressId?: string) {
    const { error } = await supabase
      .from('rentals')
      .update({ status })
      .eq('id', orderId)

    if (!error && dressId) {
      // If confirmed, set dress status to booked
      // If rejected/cancelled, set dress status back to available
      const dressStatus = status === 'confirmed' ? 'booked' : 'available'
      await supabase.from('dresses').update({ status: dressStatus }).eq('id', dressId)
    }

    if (!error) fetchOrders()
  }

  async function toggleStep(orderId: string, currentSteps: string[], stepId: string) {
    let newSteps = currentSteps.includes(stepId)
      ? currentSteps.filter(s => s !== stepId)
      : [...currentSteps, stepId]

    const { error } = await supabase
      .from('rentals')
      .update({ completed_steps: newSteps })
      .eq('id', orderId)

    if (!error) fetchOrders()
  }

  async function deleteOrder(id: string) {
    if (!confirm('Hapus data permintaan ini?')) return
    const { error } = await supabase.from('rentals').delete().eq('id', id)
    if (!error) fetchOrders()
  }

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-charcoal">Manajemen Order & Rental</h1>
        <p className="text-sm text-muted">Kelola semua permintaan dari mulai fitting hingga pengembalian baju</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Memuat data...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-nude p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-mocha bg-mocha/5 px-2 py-0.5">{order.booking_id}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                      order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      order.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100'
                    }`}>
                      {order.status === 'pending' ? 'Menunggu Konfirmasi' :
                       order.status === 'confirmed' ? 'Diterima / Aktif' :
                       order.status === 'rejected' ? 'Ditolak' : order.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-charcoal">{order.customer_name}</h3>
                  <p className="text-xs text-muted mt-1">
                    Baju: <span className="text-charcoal font-medium">{order.dress_code} — {order.dresses?.name}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-4 text-[11px]">
                    <div><span className="text-muted uppercase">Tanggal Acara:</span> {order.event_date}</div>
                    <div><span className="text-muted uppercase">Jadwal Fitting:</span> {order.fitting_date} ({order.fitting_time})</div>
                    <div><span className="text-muted uppercase">WhatsApp:</span> {order.whatsapp}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                    {order.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateStatus(order.id, 'confirmed', order.dresses?.id)}
                          className="px-3 py-2 bg-emerald-600 text-white text-[10px] font-bold uppercase hover:bg-emerald-700"
                        >
                          Terima
                        </button>
                        <button
                          onClick={() => updateStatus(order.id, 'rejected')}
                          className="px-3 py-2 bg-red-500 text-white text-[10px] font-bold uppercase hover:bg-red-600"
                        >
                          Tolak
                        </button>
                      </div>
                    )}

                    <a
                      href={`https://wa.me/${(order.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Halo ${order.customer_name}, kami dari YOVA ingin menginfokan bahwa permintaan rental Anda dengan ID ${order.booking_id} statusnya adalah: ${order.status.toUpperCase()}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-2 bg-[#25D366] text-white text-[10px] font-bold uppercase text-center hover:bg-[#1ebe59]"
                    >
                      Hubungi WA
                    </a>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="w-full px-3 py-2 border border-red-200 text-red-500 text-[10px] font-bold uppercase hover:bg-red-50"
                    >
                      Hapus Permintaan
                    </button>
                  </div>
                </div>

                {order.status === 'confirmed' && (
                  <div className="border-t border-slate-50 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Progress Tahapan Sewa</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value, order.dresses?.id)}
                        className="text-[10px] border border-nude px-2 py-1 outline-none font-bold uppercase"
                      >
                        <option value="confirmed">Sedang Berjalan</option>
                        <option value="completed">Selesai / Kembali</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </div>
                  <div className="flex flex-wrap gap-3">
                    {STEPS.map((step) => {
                      const isDone = (order.completed_steps || []).includes(step.id)
                      return (
                        <button
                          key={step.id}
                          onClick={() => toggleStep(order.id, order.completed_steps || [], step.id)}
                          className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-bold uppercase transition-all ${
                            isDone ? 'bg-mocha border-mocha text-white' : 'bg-white border-nude text-muted hover:border-mocha'
                          }`}
                        >
                          <span className={`w-3 h-3 flex items-center justify-center border ${isDone ? 'border-white' : 'border-current'} rounded-full text-[8px]`}>
                            {isDone ? '✓' : ''}
                          </span>
                          {step.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white border border-dashed border-nude py-20 text-center text-muted">
              Belum ada permintaan sewa yang masuk.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
