import React, { useState } from 'react'
import { supabase } from '../../../lib/supabase'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label }) => {
  const [uploading, setLoading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Pilih file untuk diupload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `invitations/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-ivory border border-nude overflow-hidden flex-shrink-0 relative group">
          <img src={value} className="w-full h-full object-cover" alt="" />
          {uploading && (
             <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="w-4 h-4 border border-mocha/20 border-t-mocha rounded-full animate-spin" />
             </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="relative">
            <button className="w-full py-2 bg-white border border-nude text-[9px] font-bold uppercase tracking-widest hover:border-mocha transition-all">
              {uploading ? 'Uploading...' : 'Ganti Foto'}
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-[7px] text-muted uppercase tracking-tighter">JPG, PNG · Maks 2MB</p>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader
