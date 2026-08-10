import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Dress, DressCategory, DressStatus, Measurements } from '../../data/dresses'

export default function AdminDresses() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDress, setEditingDress] = useState<Partial<Dress> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchDresses()
  }, [])

  async function fetchDresses() {
    setLoading(true)
    const { data, error } = await supabase
      .from('dresses')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      const mapped = data.map((d: any) => ({
        ...d,
        collectionCode: d.collection_code,
        includedItems: d.included_items,
        resizeAvailable: d.resize_available,
        fitNotes: d.fit_notes,
        recommendedHeight: d.recommended_height,
        estimatedAvailable: d.estimated_available,
      }))
      setDresses(mapped)
    }
    setLoading(false)
  }

  const updateMeasurement = (key: keyof Measurements, value: string) => {
    if (!editingDress) return
    const newMeasurements = { ...(editingDress.measurements || {}), [key]: value }
    setEditingDress({ ...editingDress, measurements: newMeasurements })
  }

  async function handleSave() {
    if (!editingDress) return

    const payload = {
      collection_code: editingDress.collectionCode,
      name: editingDress.name,
      category: editingDress.category,
      description: editingDress.description,
      price: editingDress.price,
      deposit: editingDress.deposit || 150000,
      status: editingDress.status || 'available',
      images: editingDress.images || [],
      measurements: editingDress.measurements || {},
      included_items: editingDress.includedItems || [],
      resize_available: editingDress.resizeAvailable || false,
      fit_notes: editingDress.fitNotes || '',
      recommended_height: editingDress.recommendedHeight || '',
      size: editingDress.size,
      colors: editingDress.colors || [],
    }

    let error
    if (editingDress.id) {
      const { error: e } = await supabase
        .from('dresses')
        .update(payload)
        .eq('id', editingDress.id)
      error = e
    } else {
      const { error: e } = await supabase.from('dresses').insert([payload])
      error = e
    }

    if (!error) {
      setIsModalOpen(false)
      setEditingDress(null)
      fetchDresses()
    } else {
      alert(error.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus koleksi ini?')) return
    const { error } = await supabase.from('dresses').delete().eq('id', id)
    if (!error) fetchDresses()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-display text-charcoal">Koleksi Baju</h1>
          <p className="text-sm text-muted">Kelola katalog baju akad Anda secara detail</p>
        </div>
        <button
          onClick={() => {
            setEditingDress({
              category: 'Wanita',
              status: 'available',
              price: 500000,
              images: [],
              includedItems: [],
              measurements: {},
              colors: [],
              size: 'M'
            })
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-mocha text-white text-sm font-medium hover:bg-mocha-dark transition-colors"
        >
          + Tambah Koleksi
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Memuat data...</div>
      ) : (
        <div className="bg-white border border-nude overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-nude text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Kode</th>
                <th className="px-6 py-4 font-medium">Nama Baju</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Harga</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nude">
              {dresses.map((dress) => (
                <tr key={dress.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-xs">{dress.collectionCode}</td>
                  <td className="px-6 py-4 font-medium text-charcoal">{dress.name}</td>
                  <td className="px-6 py-4">{dress.size || '-'}</td>
                  <td className="px-6 py-4">Rp{dress.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100">{dress.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => { setEditingDress(dress); setIsModalOpen(true); }} className="text-mocha hover:underline">Edit</button>
                    <button onClick={() => handleDelete(dress.id)} className="text-red-400 hover:text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && editingDress && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-xl">
            <h2 className="text-xl font-display mb-6">{editingDress.id ? 'Edit Koleksi' : 'Tambah Koleksi Baru'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Kode Koleksi</label>
                  <input type="text" value={editingDress.collectionCode || ''} onChange={e => setEditingDress({...editingDress, collectionCode: e.target.value})} className="w-full px-3 py-2 border border-nude outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Nama Baju</label>
                  <input type="text" value={editingDress.name || ''} onChange={e => setEditingDress({...editingDress, name: e.target.value})} className="w-full px-3 py-2 border border-nude outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Kategori</label>
                  <select value={editingDress.category} onChange={e => setEditingDress({...editingDress, category: e.target.value as DressCategory})} className="w-full px-3 py-2 border border-nude outline-none text-sm">
                    <option value="Wanita">Wanita</option>
                    <option value="Pria">Pria</option>
                    <option value="Couple">Couple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Status</label>
                  <select value={editingDress.status} onChange={e => setEditingDress({...editingDress, status: e.target.value as DressStatus})} className="w-full px-3 py-2 border border-nude outline-none text-sm">
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Pricing and Size */}
              <div className="col-span-1 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Harga Sewa</label>
                  <input type="number" value={editingDress.price || 0} onChange={e => setEditingDress({...editingDress, price: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-nude outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Ukuran (Tag)</label>
                  <select value={editingDress.size || 'M'} onChange={e => setEditingDress({...editingDress, size: e.target.value})} className="w-full px-3 py-2 border border-nude outline-none text-sm">
                    {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Palet Warna (Baris Baru)</label>
                  <textarea value={editingDress.colors?.join('\n') || ''} onChange={e => setEditingDress({...editingDress, colors: e.target.value.split('\n').filter(c => c.trim())})} rows={3} className="w-full px-3 py-2 border border-nude outline-none text-sm" />
                </div>
              </div>

              {/* Measurements */}
              <div className="col-span-1 bg-cream/30 p-4 space-y-3">
                <h3 className="text-[10px] font-bold uppercase border-b border-nude pb-1 mb-2">Detail Ukuran (cm)</h3>
                {[
                  ['panjangBaju', 'Panjang Baju'],
                  ['lebarBahu', 'Lebar Bahu'],
                  ['lingkarDada', 'Lingkar Dada'],
                  ['lingkarPinggang', 'Lingkar Pinggang'],
                  ['panjangLengan', 'Panjang Lengan'],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <label className="text-[10px] text-muted uppercase">{label}</label>
                    <input type="text" value={(editingDress.measurements as any)?.[key] || ''} onChange={e => updateMeasurement(key as any, e.target.value)} className="w-20 px-2 py-1 border border-nude text-xs outline-none" placeholder="0 cm" />
                  </div>
                ))}
              </div>

              {/* Media & Desc */}
              <div className="col-span-1 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Deskripsi</label>
                  <textarea value={editingDress.description || ''} onChange={e => setEditingDress({...editingDress, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-nude outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">URL Gambar (Baris Baru)</label>
                  <textarea value={editingDress.images?.join('\n') || ''} onChange={e => setEditingDress({...editingDress, images: e.target.value.split('\n').filter(url => url.trim())})} rows={3} className="w-full px-3 py-2 border border-nude outline-none text-sm text-[10px]" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-nude pt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-nude text-sm hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} className="px-6 py-2 bg-mocha text-white text-sm font-medium hover:bg-mocha-dark">Simpan Koleksi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
