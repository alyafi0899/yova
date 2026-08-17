import React from 'react'

export type EditorTab = 'sections' | 'theme' | 'elements' | 'widgets' | 'layers'

interface EditorSidebarProps {
  activeTab: EditorTab
  setActiveTab: (tab: EditorTab) => void
  children: React.ReactNode
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  const tabs: { id: EditorTab; icon: string; label: string }[] = [
    { id: 'sections', icon: '✦', label: 'Seksi' },
    { id: 'theme', icon: '🎨', label: 'Tema' },
    { id: 'elements', icon: '🌸', label: 'Elemen' },
    { id: 'widgets', icon: '⚙', label: 'Widget' },
    { id: 'layers', icon: '≣', label: 'Layer' },
  ]

  return (
    <aside className="w-80 flex flex-shrink-0 bg-white border-r border-nude overflow-hidden z-20">
      {/* Icon Rail */}
      <div className="w-16 flex flex-col items-center py-6 bg-ivory border-r border-nude space-y-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-12 h-12 flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === tab.id ? 'bg-white text-mocha shadow-sm' : 'text-muted hover:text-charcoal'
            }`}
            style={{ borderRadius: '4px' }}
            title={tab.label}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[7px] font-bold uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </aside>
  )
}

export default EditorSidebar
