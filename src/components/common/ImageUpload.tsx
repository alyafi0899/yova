import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: string;
}

export default function ImageUpload({ value, onChange, label, aspectRatio = 'aspect-video' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Math.random()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invitations')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]);
  };

  return (
    <div className="space-y-1">
      {label && <label className="text-[8px] font-bold uppercase tracking-widest text-muted/60">{label}</label>}
      <div
        className={`relative ${aspectRatio} w-full max-w-[220px] border border-dashed rounded transition-all flex flex-col items-center justify-center overflow-hidden bg-soft/20 group
          ${dragActive ? 'border-mocha bg-mocha/5' : 'border-nude hover:border-mocha/30'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        style={{ minHeight: '60px' }}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[7px] font-bold uppercase tracking-widest text-white bg-black/50 px-2 py-0.5 rounded-full">Ganti</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-lg mb-0.5 opacity-20">📸</span>
            <span className="text-[7px] font-bold uppercase tracking-widest text-muted/50">{uploading ? 'Wait...' : 'Upload'}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
             <div className="w-4 h-4 border border-mocha/20 border-t-mocha rounded-full animate-spin"></div>
          </div>
        )}
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleChange} />
      </div>
    </div>
  );
}
