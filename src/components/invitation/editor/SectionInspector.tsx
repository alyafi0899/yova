import React from 'react'
import type { TemplateSection } from '../../../lib/invitation/types'
import ImageUploader from './ImageUploader'

interface SectionInspectorProps {
  section: TemplateSection
  onUpdate: (updates: Partial<TemplateSection>) => void
}

const SectionInspector: React.FC<SectionInspectorProps> = ({ section, onUpdate }) => {
  const { config, editableProperties } = section

  const handleChange = (path: string, value: any) => {
    const newConfig = { ...config }

    // Handle nested paths like "groom.name"
    const keys = path.split('.')
    let current = newConfig
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    onUpdate({ config: newConfig })
  }

  const renderField = (prop: string) => {
    const label = prop.split('.').pop()?.replace(/([A-Z])/g, ' $1').toUpperCase() || prop

    // Get value from config by path
    const value = prop.split('.').reduce((obj, key) => obj?.[key], config)

    if (prop.includes('image') || prop.includes('Image')) {
      return (
        <ImageUploader
          key={prop}
          label={label}
          value={value}
          onChange={(url) => handleChange(prop, url)}
        />
      )
    }

    if (prop === 'events' || prop === 'stories' || prop === 'accounts') {
      const items = value || []
      const isEvent = prop === 'events'
      const isStory = prop === 'stories'
      const isAccount = prop === 'accounts'

      return (
        <div key={prop} className="space-y-4">
           <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
           {items.map((item: any, idx: number) => (
             <div key={idx} className="p-4 bg-ivory border border-nude space-y-3 relative group">
                <button
                   onClick={() => handleChange(prop, items.filter((_: any, i: number) => i !== idx))}
                   className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-mocha uppercase tracking-widest">
                     {isEvent ? 'ACARA' : isStory ? 'CERITA' : 'REKENING'} {idx + 1}
                   </span>
                </div>

                {isAccount ? (
                  <>
                    <input
                      type="text"
                      value={item.bank}
                      onChange={(e) => {
                        const newList = [...items]; newList[idx] = { ...newList[idx], bank: e.target.value };
                        handleChange(prop, newList);
                      }}
                      className="w-full px-3 py-2 bg-white border border-nude text-xs outline-none focus:border-mocha"
                      placeholder="Bank / E-Wallet"
                    />
                    <input
                      type="text"
                      value={item.number}
                      onChange={(e) => {
                        const newList = [...items]; newList[idx] = { ...newList[idx], number: e.target.value };
                        handleChange(prop, newList);
                      }}
                      className="w-full px-3 py-2 bg-white border border-nude text-xs outline-none focus:border-mocha"
                      placeholder="Nomor Rekening"
                    />
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newList = [...items]; newList[idx] = { ...newList[idx], name: e.target.value };
                        handleChange(prop, newList);
                      }}
                      className="w-full px-3 py-2 bg-white border border-nude text-xs outline-none focus:border-mocha"
                      placeholder="Atas Nama"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={isEvent ? item.name : item.title}
                      onChange={(e) => {
                        const newList = [...items]
                        newList[idx] = { ...newList[idx], [isEvent ? 'name' : 'title']: e.target.value }
                        handleChange(prop, newList)
                      }}
                      className="w-full px-3 py-2 bg-white border border-nude text-xs outline-none focus:border-mocha"
                      placeholder={isEvent ? "Nama Acara" : "Judul Cerita"}
                    />
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => {
                        const newList = [...items]
                        newList[idx] = { ...newList[idx], date: e.target.value }
                        handleChange(prop, newList)
                      }}
                      className="w-full px-3 py-2 bg-white border border-nude text-xs outline-none focus:border-mocha"
                      placeholder="Tanggal / Tahun"
                    />
                    {!isEvent && (
                      <textarea
                        value={item.content}
                        onChange={(e) => {
                          const newList = [...items]
                          newList[idx] = { ...newList[idx], content: e.target.value }
                          handleChange(prop, newList)
                        }}
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-nude text-xs outline-none focus:border-mocha resize-none"
                        placeholder="Konten cerita..."
                      />
                    )}
                  </>
                )}
             </div>
           ))}
           <button
             onClick={() => handleChange(prop, [...items,
               isEvent ? { name: 'Acara Baru', date: '', time: '', venue: '' } :
               isStory ? { title: 'Momen Baru', date: '', content: '' } :
               { bank: 'Bank', number: '', name: '' }
             ])}
             className="w-full py-2 border border-dashed border-nude text-[9px] font-bold uppercase tracking-widest text-muted hover:border-mocha hover:text-mocha transition-all"
           >+ Tambah {isEvent ? 'Acara' : isStory ? 'Momen' : 'Rekening'}</button>
        </div>
      )
    }

    if (prop === 'images') {
      const images = value || []
      return (
        <div key={prop} className="space-y-4">
           <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
           <div className="grid grid-cols-3 gap-2">
              {images.map((img: string, idx: number) => (
                <div key={idx} className="aspect-square relative group bg-ivory border border-nude overflow-hidden">
                   <img src={img} className="w-full h-full object-cover" alt="" />
                   <button
                     onClick={() => handleChange(prop, images.filter((_: any, i: number) => i !== idx))}
                     className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold"
                   >✕</button>
                </div>
              ))}
              <div className="aspect-square relative bg-white border-2 border-dashed border-nude flex items-center justify-center group hover:border-mocha transition-all">
                 <span className="text-xl opacity-20 group-hover:opacity-100 group-hover:text-mocha transition-all">+</span>
                 <div className="absolute inset-0 opacity-0 overflow-hidden">
                    <ImageUploader
                        label=""
                        value=""
                        onChange={(url) => handleChange(prop, [...images, url])}
                    />
                 </div>
              </div>
           </div>
        </div>
      )
    }

    return (
      <div key={prop} className="space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
        <textarea
          value={value}
          onChange={(e) => handleChange(prop, e.target.value)}
          rows={value?.length > 40 ? 3 : 1}
          className="w-full px-3 py-2 bg-ivory border border-nude text-xs outline-none focus:border-mocha resize-none"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {editableProperties.map(prop => renderField(prop))}
    </div>
  )
}

export default SectionInspector
