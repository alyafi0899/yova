import React, { useState } from 'react'

interface EditorCanvasProps {
  children: React.ReactNode
  onSectionClick: (id: string) => void
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  children,
  onSectionClick
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile')

  return (
    <main className="flex-1 bg-soft overflow-hidden flex flex-col relative">
      {/* Canvas Toolbar */}
      <div className="h-14 flex items-center justify-center gap-4 bg-white/50 backdrop-blur-md border-b border-nude/50 flex-shrink-0">
        <div className="flex p-1 bg-ivory border border-nude" style={{ borderRadius: '4px' }}>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
              device === 'mobile' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-mocha'
            }`}
            style={{ borderRadius: '2px' }}
          >
            📱 Mobile
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
              device === 'desktop' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-mocha'
            }`}
            style={{ borderRadius: '2px' }}
          >
            🖥 Desktop
          </button>
        </div>

        <div className="h-4 w-px bg-nude" />

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Zoom</span>
          <select className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-charcoal outline-none cursor-pointer">
            <option>Fit</option>
            <option>50%</option>
            <option>75%</option>
            <option>100%</option>
          </select>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-12 flex justify-center custom-scrollbar scroll-smooth">
        <div
          className={`transition-all duration-500 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white relative ${
            device === 'mobile' ? 'w-[375px] min-h-[667px]' : 'w-full max-w-5xl'
          }`}
          style={{
            // In a real Canva-like editor, this would be an actual canvas
            // but for this wedding invitation system, a scrolling frame is often better
          }}
        >
          {children}
        </div>
      </div>

      {/* Canvas Footer (optional info) */}
      <div className="h-8 bg-white border-t border-nude flex items-center px-4 justify-between">
        <p className="text-[8px] text-muted font-bold uppercase tracking-widest">Live Editor · YOVA v1.0</p>
        <div className="flex items-center gap-4 text-[8px] text-muted font-bold uppercase tracking-widest">
          <span>Sections: 8</span>
          <span>Elements: 24</span>
        </div>
      </div>
    </main>
  )
}

export default EditorCanvas
