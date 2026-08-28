import React, { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { normalizeImageUrl } from '../../lib/utils/image'

interface ImageSlotProps {
  index: number
  url: string
  onUrlChange: (newUrl: string) => void
  onRemove: () => void
}

export default function ImageSlot({ index, url, onUrlChange, onRemove }: ImageSlotProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true)

      // 1. Create a unique file name to avoid collision
      const fileExt = file.name.split('.').pop()
      const randomString = Math.random().toString(36).substring(2, 10)
      const fileName = `${Date.now()}-${randomString}.${fileExt}`
      const filePath = `dresses/${fileName}`

      // 2. Upload to Supabase Storage bucket 'dresses'
      const { error: uploadError } = await supabase.storage
        .from('dresses')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dresses')
        .getPublicUrl(filePath)

      onUrlChange(publicUrl)
    } catch (error: any) {
      alert('Gagal upload: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }, [])

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0])
    }
  }

  const previewUrl = normalizeImageUrl(url)

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-nude relative group transition-all hover:border-mocha/50">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Foto #{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 transition-colors text-xs"
          title="Hapus Kolom"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-4">
        {/* Preview / Drop Zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative w-24 h-32 shrink-0 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
            isDragging ? 'border-mocha bg-mocha/5' : 'border-nude bg-soft hover:bg-ivory'
          }`}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <span className="text-xl block mb-1">📸</span>
              <span className="text-[7px] font-bold uppercase tracking-tighter text-muted">Drop foto</span>
            </div>
          )}

          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-mocha/20 border-t-mocha rounded-full animate-spin" />
            </div>
          )}

          {/* Hidden File Input covering the area */}
          <input
            type="file"
            onChange={onFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*"
          />
        </div>

        {/* URL Input Area */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          <label className="text-[8px] font-bold text-muted uppercase tracking-widest">Direct URL</label>
          <textarea
            value={url}
            onChange={e => onUrlChange(e.target.value)}
            className="w-full flex-1 p-2 bg-soft border border-nude outline-none focus:border-mocha text-[10px] font-mono resize-none leading-relaxed"
            placeholder="Pilih file atau tempel link gambar di sini..."
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
