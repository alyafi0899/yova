import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Rental {
  id: string
  booking_id: string
  customer_name: string
  event_date: string
  status: 'confirmed' | 'completed' | 'cancelled'
  completed_steps: string[]
  dresses: { name: string } | null
}

const STEPS = [
  { id: 'fitting', label: 'Fitting' },
  { id: 'booking', label: 'Booking' },
  { id: 'payment', label: 'Pembayaran' },
  { id: 'prepared', label: 'Siap Diambil' },
]

export default function AdminRentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRentals()
  }, [])

  async function fetchRentals() {
    setLoading(true)
    const { data } = await supabase
      .from('rentals')
      .select('*, dresses(name)')
      .order('created_at', { ascending: false })

    if (data) {
      const mapped = data.map((r: any) => ({
        ...r,
        dresses: r.dresses || (r.dress_code ? { name: r.dress_code } : null)
      }))
      setRentals(mapped)
    }
    setLoading(false)
  }

  async function toggleStep(rentalId: string, currentSteps: string[], stepId: string) {
    let newSteps
    if (currentSteps.includes(stepId)) {
      newSteps = currentSteps.filter(s => s !== stepId)
    } else {
      newSteps = [...currentSteps, stepId]
    }

    const { error } = await supabase
      .from('rentals')
      .update({ completed_steps: newSteps })
      .eq('id', rentalId)

    if (!error) fetchRentals()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display text-charcoal">Manajemen Rental</h1>
        <p className="text-sm text-muted">Pantau dan update status penyewaan pelanggan</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Memuat data...</div>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="bg-white border border-nude p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-bold text-mocha">{rental.booking_id}</span>
                    <span className="text-charcoal font-medium">{rental.customer_name}</span>
                  </div>
                  <p className="text-xs text-muted">
                    {rental.dresses?.name || 'Baju tidak ditemukan'} • Acara: {rental.event_date}
                  </p>
                </div>
                <div className="text-right">
                  <select
                    value={rental.status}
                    onChange={async (e) => {
                      await supabase
                        .from('rentals')
                        .update({ status: e.target.value })
                        .eq('id', rental.id)
                      fetchRentals()
                    }}
                    className="text-xs border border-nude px-2 py-1 outline-none"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted mb-3 font-bold">Progress Tahapan</p>
                <div className="flex flex-wrap gap-4">
                  {STEPS.map((step) => {
                    const isDone = rental.completed_steps.includes(step.id)
                    return (
                      <button
                        key={step.id}
                        onClick={() => toggleStep(rental.id, rental.completed_steps, step.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${
                          isDone
                            ? 'bg-mocha border-mocha text-white'
                            : 'bg-white border-nude text-muted hover:border-mocha'
                        }`}
                        style={{ borderRadius: '2px' }}
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
            </div>
          ))}

          {rentals.length === 0 && (
            <div className="bg-white border border-dashed border-nude py-12 text-center text-muted text-sm">
              Belum ada data penyewaan.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
