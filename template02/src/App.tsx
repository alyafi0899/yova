import { useState } from 'react';
import Invitation1 from './Invitation';
import Invitation2 from './templates/template-02/index';
import Dashboard from './Dashboard';

type View = 'sakinah' | 'yasmin' | 'dashboard';

const tabs: { id: View; label: string; sub: string }[] = [
  { id: 'sakinah', label: 'SAKINAH', sub: 'Template 01' },
  { id: 'yasmin', label: 'YASMIN', sub: 'Template 02' },
  { id: 'dashboard', label: 'Dashboard', sub: 'Management' },
];

export default function App() {
  const [view, setView] = useState<View>('yasmin');

  return (
    <div className="h-full relative" style={{ backgroundColor: '#F8F4EC' }}>
      {/* Tab switcher */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-1 px-1.5 py-1.5"
        style={{
          backgroundColor: 'rgba(255,253,248,0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(199,169,107,0.22)',
          boxShadow: '0 8px 32px rgba(44,32,14,0.12)',
          fontFamily: "'Lato', system-ui, sans-serif",
          borderRadius: 0,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className="flex flex-col items-center px-4 py-1.5 transition-all duration-300"
            style={{
              backgroundColor: view === t.id ? '#2C1F0E' : 'transparent',
              minWidth: 72,
            }}
          >
            <span
              className="text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color: view === t.id ? '#B8966E' : '#9A8B7A' }}
            >
              {t.label}
            </span>
            <span
              className="text-[8px] tracking-wide"
              style={{ color: view === t.id ? 'rgba(255,253,248,0.5)' : 'rgba(154,139,122,0.5)' }}
            >
              {t.sub}
            </span>
          </button>
        ))}
      </div>

      {/* Views */}
      <div className="h-full" style={{ display: view === 'sakinah' ? 'block' : 'none' }}>
        <Invitation1 guestName="Bapak Ahmad & Keluarga" />
      </div>
      <div className="h-full" style={{ display: view === 'yasmin' ? 'block' : 'none' }}>
        <Invitation2
          guestName="Bapak Ahmad & Keluarga"
          brideName="Zahra"
          groomName="Rafi"
        />
      </div>
      <div className="h-full" style={{ display: view === 'dashboard' ? 'block' : 'none' }}>
        <Dashboard />
      </div>
    </div>
  );
}
