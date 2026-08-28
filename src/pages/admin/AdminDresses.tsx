import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Dress, DressCategory, DressStatus, Measurements } from '../../data/dresses'
import { normalizeImageUrl } from '../../lib/utils/image'
import ImageSlot from '../../components/admin/ImageSlot'

export default function AdminDresses() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [editingDress, setEditingDress] = useState<Partial<Dress> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveSelectTab] = useState<'info' | 'size' | 'media'>('info')

  useEffect(() => {
    fetchDresses()
  }, [])

  async function fetchDresses() {
    setLoading(true)
    const { data } = await supabase
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
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Koleksi Baju</h1>
          <p className="text-sm text-muted mt-1">Total {dresses.length} koleksi tersimpan di database</p>
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
            setActiveSelectTab('info')
          }}
          className="group px-6 py-3 bg-charcoal text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
          style={{ borderRadius: '2px' }}
        >
          <span className="group-hover:rotate-90 transition-transform text-lg">+</span>
          Tambah Koleksi Baru
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-mocha/20 border-t-mocha rounded-full animate-spin"></div>
          <p className="text-muted text-xs uppercase tracking-widest font-bold">Sinkronisasi Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dresses.map((dress) => (
            <div key={dress.id} className="group bg-white border border-nude overflow-hidden hover:border-mocha transition-all hover:shadow-xl relative flex flex-col">
              <div className="aspect-[3/4] bg-soft relative overflow-hidden">
                <img src={normalizeImageUrl(dress.images?.[0]) || 'https://via.placeholder.com/400x533'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={dress.name} />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-charcoal text-[9px] font-bold uppercase tracking-tighter shadow-sm">{dress.collectionCode}</span>
                  <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tighter shadow-sm ${
                    dress.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {dress.status === 'available' ? 'Tersedia' : 'Booked'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => { setEditingDress(dress); setIsModalOpen(true); }} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-mocha hover:text-white transition-colors">✎</button>
                  <button onClick={() => handleDelete(dress.id)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">✕</button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[10px] text-muted uppercase font-bold mb-1">{dress.category} • Size {dress.size}</p>
                <h3 className="text-sm font-medium text-charcoal line-clamp-1 mb-2">{dress.name}</h3>
                <p className="text-mocha font-bold text-sm mt-auto">Rp{dress.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Interactive Modal */}
      {isModalOpen && editingDress && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-charcoal/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-full overflow-hidden flex flex-col shadow-2xl scale-in-center">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-nude flex justify-between items-center bg-cream/30">
              <div>
                <h2 className="text-2xl font-display text-charcoal">{editingDress.id ? 'Edit Koleksi' : 'Koleksi Baru'}</h2>
                <p className="text-xs text-muted mt-1 uppercase tracking-widest font-bold">{editingDress.collectionCode || '—'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-2xl">&times;</button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-nude px-8 bg-cream/10">
              {[
                { id: 'info', label: 'Informasi Dasar', icon: '📝' },
                { id: 'size', label: 'Detail Ukuran', icon: '📏' },
                { id: 'media', label: 'Foto & Visual', icon: '🖼️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSelectTab(tab.id as any)}
                  className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === tab.id ? 'border-mocha text-mocha bg-white' : 'border-transparent text-muted hover:text-charcoal'
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 md:p-10">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Nama Koleksi</label>
                      <input type="text" value={editingDress.name || ''} onChange={e => setEditingDress({...editingDress, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-nude outline-none focus:border-mocha focus:bg-white transition-all text-sm" placeholder="Contoh: Baju Akad Mawar Putih" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Kode Unik</label>
                        <input type="text" value={editingDress.collectionCode || ''} onChange={e => setEditingDress({...editingDress, collectionCode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-nude outline-none focus:border-mocha focus:bg-white transition-all text-sm font-mono" placeholder="PR-01" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Kategori</label>
                        <select value={editingDress.category} onChange={e => setEditingDress({...editingDress, category: e.target.value as DressCategory})} className="w-full px-4 py-3 bg-slate-50 border border-nude outline-none focus:border-mocha focus:bg-white transition-all text-sm">
                          <option value="Wanita">Wanita</option>
                          <option value="Pria">Pria</option>
                          <option value="Couple">Couple</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Status Ketersediaan</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['available', 'booked', 'maintenance'].map(s => (
                          <button
                            key={s}
                            onClick={() => setEditingDress({...editingDress, status: s as DressStatus})}
                            className={`px-4 py-2 text-[10px] font-bold uppercase border transition-all ${
                              editingDress.status === s ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-muted border-nude hover:border-mocha'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Harga Sewa (Rp)</label>
                      <input type="number" value={editingDress.price || 0} onChange={e => setEditingDress({...editingDress, price: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-nude outline-none focus:border-mocha focus:bg-white transition-all text-sm font-bold text-mocha" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Deskripsi Koleksi</label>
                      <textarea value={editingDress.description || ''} onChange={e => setEditingDress({...editingDress, description: e.target.value})} rows={5} className="w-full px-4 py-3 bg-slate-50 border border-nude outline-none focus:border-mocha focus:bg-white transition-all text-sm resize-none" placeholder="Ceritakan detail baju ini..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'size' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-cream/20 p-8 border border-nude">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="w-8 h-px bg-mocha"></span> Ukuran Tag
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(s => (
                        <button
                          key={s}
                          onClick={() => setEditingDress({...editingDress, size: s})}
                          className={`py-4 border-2 transition-all font-bold ${
                            editingDress.size === s ? 'border-mocha bg-mocha text-white scale-105 shadow-lg' : 'border-nude bg-white text-muted hover:border-mocha/50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="mt-8">
                      <label className="block text-[10px] font-bold uppercase mb-2 tracking-widest">Pilihan Warna</label>
                      <textarea
                        value={editingDress.colors?.join('\n') || ''}
                        onChange={e => setEditingDress({...editingDress, colors: e.target.value.split('\n').filter(c => c.trim())})}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-nude outline-none focus:border-mocha text-sm"
                        placeholder="Contoh:&#10;Putih Tulang&#10;Mocca Muda"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="w-8 h-px bg-mocha"></span> Spesifikasi CM
                    </h3>
                    {[
                      ['panjangBaju', 'Panjang Baju', '145 cm'],
                      ['lebarBahu', 'Lebar Bahu', '38 cm'],
                      ['lingkarDada', 'Lingkar Dada', '90 cm'],
                      ['lingkarPinggang', 'Lingkar Pinggang', '74 cm'],
                      ['panjangLengan', 'Panjang Lengan', '60 cm'],
                    ].map(([key, label, placeholder]) => (
                      <div key={key} className="flex items-center group">
                        <label className="w-1/2 text-[10px] font-bold uppercase text-muted group-hover:text-charcoal transition-colors">{label}</label>
                        <input
                          type="text"
                          value={(editingDress.measurements as any)?.[key] || ''}
                          onChange={e => updateMeasurement(key as any, e.target.value)}
                          className="w-1/2 px-4 py-2 bg-slate-50 border-b-2 border-transparent focus:border-mocha outline-none text-sm transition-all"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                    {/* Management Section */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-slate-50 p-6 border border-nude">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal">
                            Kelola Foto Produk
                          </label>
                          <p className="text-[9px] text-muted mt-1 uppercase tracking-tight">Tarik foto langsung ke setiap kotak di bawah</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = [...(editingDress.images || []), '']
                            setEditingDress({...editingDress, images: newImgs})
                          }}
                          className="px-6 py-2.5 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
                          style={{ borderRadius: '2px' }}
                        >
                          + Tambah Kolom Foto
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(editingDress.images || []).map((url, idx) => (
                          <ImageSlot
                            key={idx}
                            index={idx}
                            url={url}
                            onUrlChange={(newUrl) => {
                              const newImgs = [...(editingDress.images || [])]
                              newImgs[idx] = newUrl
                              setEditingDress({...editingDress, images: newImgs})
                            }}
                            onRemove={() => {
                              const newImgs = [...(editingDress.images || [])]
                              newImgs.splice(idx, 1)
                              setEditingDress({...editingDress, images: newImgs})
                            }}
                          />
                        ))}
                      </div>

                      {(editingDress.images || []).length === 0 && (
                        <div className="text-center py-16 bg-white border border-dashed border-nude text-muted text-xs italic">
                          Belum ada kolom foto. Klik tombol di atas untuk menambah.
                        </div>
                      )}
                    </div>

                    {/* Final Preview Section */}
                    <div className="bg-cream/10 p-6 border border-nude h-fit sticky top-0">
                      <label className="block text-[10px] font-bold uppercase mb-6 tracking-widest text-charcoal flex items-center gap-2">
                        <span className="w-4 h-px bg-mocha"></span> Live Gallery Preview
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {editingDress.images?.filter(url => url.trim()).map((url, idx) => (
                          <div key={idx} className="aspect-[3/4] bg-soft border border-nude relative group overflow-hidden shadow-sm">
                            <img src={normalizeImageUrl(url)} className="w-full h-full object-cover" alt="" />
                            <div className="absolute top-1 right-1">
                              <span className="bg-charcoal/80 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">#{idx + 1}</span>
                            </div>
                          </div>
                        ))}
                        <div className="aspect-[3/4] border-2 border-dashed border-nude flex items-center justify-center text-muted text-center p-4">
                          <p className="text-[9px] uppercase font-bold leading-relaxed opacity-40">Preview<br/>Otomatis</p>
                        </div>
                      </div>

                      <div className="mt-8 p-4 bg-white/50 border border-nude text-[9px] text-muted italic leading-relaxed">
                        Tip: Tarik gambar ke kotak di sebelah kiri untuk mengganti foto secara spesifik.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-nude bg-slate-50 flex justify-between items-center">
              <p className="text-[10px] text-muted italic">* Pastikan semua data sudah benar sebelum menyimpan.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 border border-nude text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">Batal</button>
                <button onClick={handleSave} className="px-10 py-3 bg-mocha text-white text-[10px] font-bold uppercase tracking-widest hover:bg-mocha-dark shadow-lg shadow-mocha/20 transition-all transform hover:-translate-y-0.5">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
