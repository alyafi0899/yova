import { useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateRenderer, { TEMPLATE_CONFIGS, type TemplateConfig } from '../../components/invitation/TemplateRenderer'

// Mock Data
const MOCK_USERS = [
  { name: 'Al Yafi', email: 'alyafi@email.com', plan: 'published', invitations: 1, joined: '2 Jan 2027' },
  { name: 'Siti Rahma', email: 'siti@email.com', plan: 'draft', invitations: 2, joined: '28 Des 2026' },
  { name: 'Ahmad Fauzan', email: 'ahmad@email.com', plan: 'published', invitations: 1, joined: '15 Des 2026' },
]

const MOCK_TX = [
  { id: 'TX-001', user: 'Al Yafi', amount: 49000, status: 'success', date: '10 Jan 2027', method: 'GoPay' },
  { id: 'TX-002', user: 'Ahmad Fauzan', amount: 49000, status: 'success', date: '8 Jan 2027', method: 'BCA' },
]

// Reusable components for the integrated view
export function InvitationOverview() {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-display text-charcoal">Overview Undangan</h2>
        <p className="text-sm text-muted mt-2">Performa platform undangan digital digital secara real-time</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pengguna', value: '2,418', icon: '👥', color: 'bg-blue-50 text-blue-600' },
          { label: 'Undangan Aktif', value: '1,847', icon: '💌', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pendapatan', value: 'Rp 90,5jt', icon: '💰', color: 'bg-amber-50 text-amber-600' },
          { label: 'Konversi', value: '76.4%', icon: '📈', color: 'bg-mocha/10 text-mocha' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 border border-nude flex justify-between items-center shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{stat.label}</p>
              <h3 className="text-2xl font-display text-charcoal">{stat.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color} text-xl`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-nude p-8">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Pendaftar Terbaru</h3>
          <div className="space-y-6">
            {MOCK_USERS.map(u => (
              <div key={u.email} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-display text-mocha">{u.name[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{u.name}</p>
                  <p className="text-[10px] text-muted">{u.email}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded">{u.plan}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-nude p-8">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Transaksi Terakhir</h3>
          <div className="space-y-6">
            {MOCK_TX.map(tx => (
              <div key={tx.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{tx.user}</p>
                  <p className="text-[10px] text-muted">{tx.method} • {tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-mocha">Rp {tx.amount.toLocaleString('id')}</p>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase">Success</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function InvitationTemplatesTab() {
  const [showEditor, setShowEditor] = useState(false)
  const [editTarget, setEditTarget] = useState<TemplateConfig | null>(null)
  const templates = Object.values(TEMPLATE_CONFIGS)

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display text-charcoal">Manajemen Template</h2>
          <p className="text-sm text-muted mt-2">Kustomisasi desain dan ornamen undangan digital</p>
        </div>
        <button className="px-6 py-3 bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
          + Tambah Template
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map(t => (
          <div key={t.id} className="bg-white border border-nude group hover:border-mocha transition-all flex flex-col shadow-sm hover:shadow-md">
            <div className="h-1.5 flex">
              <div className="flex-1" style={{ background: t.primaryColor }} />
              <div className="flex-1" style={{ background: t.accentColor }} />
              <div className="flex-1" style={{ background: t.bgColor }} />
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl text-charcoal mb-1">{t.name}</h3>
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-4">{t.style}</p>

              <div className="flex gap-2 mb-6">
                {[t.primaryColor, t.accentColor, t.bgColor, t.textColor].map(c => (
                  <div key={c} className="w-4 h-4 rounded-full border border-slate-100" style={{ background: c }} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setEditTarget(t); setShowEditor(true); }}
                  className="py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-tighter hover:bg-slate-100 transition-colors"
                >
                  ⚙ Edit Config
                </button>
                <button
                  onClick={() => window.open(`/invitation/templates?previewId=${t.id}`, '_blank')}
                  className="py-2 bg-cream text-[10px] text-center font-bold uppercase tracking-tighter hover:bg-nude/20 transition-colors"
                >
                  👁 Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditor && editTarget && (
        <AdminTemplateEditorModal
          template={editTarget}
          onChange={setEditTarget}
          onSave={() => setShowEditor(false)}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  )
}

function AdminTemplateEditorModal({ template, onChange, onSave, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-5xl h-[85vh] flex overflow-hidden shadow-2xl scale-in-center">
        <div className="w-80 border-r border-nude overflow-y-auto p-8">
           <h2 className="font-display text-xl mb-6">Editor {template.name}</h2>
           {/* Simplified editor for integration demo */}
           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted mb-2 block">Warna Utama</label>
                <div className="flex gap-3">
                  <input type="color" value={template.primaryColor} onChange={e => onChange({...template, primaryColor: e.target.value})} className="w-10 h-10 cursor-pointer" />
                  <input type="text" value={template.primaryColor} onChange={e => onChange({...template, primaryColor: e.target.value})} className="flex-1 px-3 border border-nude text-xs font-mono" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted mb-2 block">Tipografi Heading</label>
                <select value={template.fontHeading} onChange={e => onChange({...template, fontHeading: e.target.value})} className="w-full px-3 py-2 border border-nude text-xs">
                   {['DM Serif Display', 'Lora', 'Playfair Display'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
           </div>
           <div className="mt-10 pt-6 border-t border-slate-50 space-y-3">
              <button onClick={onSave} className="w-full py-3 bg-mocha text-white text-[10px] font-bold uppercase tracking-widest">Simpan Perubahan</button>
              <button onClick={onClose} className="w-full py-3 border border-nude text-[10px] font-bold uppercase tracking-widest">Tutup</button>
           </div>
        </div>
        <div className="flex-1 bg-slate-100 flex flex-col items-center justify-center p-10 overflow-hidden">
           <div className="relative w-[300px] h-[600px] bg-white shadow-2xl rounded-[2.5rem] border-[8px] border-charcoal overflow-hidden scale-90 origin-center">
              <div className="w-full h-full overflow-y-auto custom-scrollbar">
                <TemplateRenderer config={template} data={{ groomName: 'Al Yafi', brideName: 'Yova', weddingDate: '10 Jan 2027' }} showOpening={false} />
              </div>
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-6">Preview Perangkat Mobile</p>
        </div>
      </div>
    </div>
  )
}

export function InvitationUsersTab() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-display text-charcoal">Data Pengguna</h2>
        <p className="text-sm text-muted mt-2">Daftar pasangan yang menggunakan platform Marry-Invite</p>
      </header>
      <div className="bg-white border border-nude shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-nude text-[10px] font-bold uppercase tracking-widest text-muted">
            <tr>
              <th className="px-8 py-5">Nama Pasangan</th>
              <th className="px-8 py-5">Email</th>
              <th className="px-8 py-5">Status Akun</th>
              <th className="px-8 py-5">Total Undangan</th>
              <th className="px-8 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_USERS.map(u => (
               <tr key={u.email} className="hover:bg-cream/20">
                  <td className="px-8 py-6 font-medium text-charcoal">{u.name}</td>
                  <td className="px-8 py-6 text-muted text-xs font-mono">{u.email}</td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded">{u.plan}</span>
                  </td>
                  <td className="px-8 py-6 text-charcoal">{u.invitations}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-mocha font-bold text-[10px] uppercase hover:underline">Detail</button>
                  </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function InvitationTransactionsTab() {
  return (
    <div className="space-y-8">
       <header>
        <h2 className="text-3xl font-display text-charcoal">Transaksi</h2>
        <p className="text-sm text-muted mt-2">Riwayat pembayaran aktivasi undangan premium</p>
      </header>
      <div className="bg-white border border-nude shadow-sm overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-slate-50 border-b border-nude text-[10px] font-bold uppercase tracking-widest text-muted">
             <tr>
               <th className="px-8 py-5">ID Transaksi</th>
               <th className="px-8 py-5">Pembayar</th>
               <th className="px-8 py-5">Jumlah</th>
               <th className="px-8 py-5">Metode</th>
               <th className="px-8 py-5">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {MOCK_TX.map(tx => (
                 <tr key={tx.id}>
                    <td className="px-8 py-6 font-mono text-xs text-muted">{tx.id}</td>
                    <td className="px-8 py-6 font-medium">{tx.user}</td>
                    <td className="px-8 py-6 font-bold text-mocha">Rp {tx.amount.toLocaleString('id')}</td>
                    <td className="px-8 py-6 text-xs uppercase">{tx.method}</td>
                    <td className="px-8 py-6"><span className="px-2 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase">Success</span></td>
                 </tr>
              ))}
           </tbody>
         </table>
      </div>
    </div>
  )
}

// Keeping the default export for backward compatibility if needed,
// but we'll use individual components in App.tsx
export default function Admin() {
  return <InvitationOverview />
}
