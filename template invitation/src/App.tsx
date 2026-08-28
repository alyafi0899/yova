import { useState } from 'react';
import Invitation from './Invitation';
import Dashboard from './Dashboard';

type View = 'invitation' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('invitation');

  return (
    <div className="h-full relative bg-[#F8F4EC]">
      <div
        className="fixed bottom-5 right-5 z-[200] flex items-center gap-1 bg-[#FFFDF8]/95 backdrop-blur-sm border border-[#C7A96B]/25 rounded-full px-1.5 py-1.5 shadow-xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <button
          onClick={() => setView('invitation')}
          className={`px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
            view === 'invitation'
              ? 'bg-[#17352F] text-[#F8F4EC]'
              : 'text-[#8D897E] hover:text-[#252522]'
          }`}
        >
          Invitation
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={`px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
            view === 'dashboard'
              ? 'bg-[#17352F] text-[#F8F4EC]'
              : 'text-[#8D897E] hover:text-[#252522]'
          }`}
        >
          Dashboard
        </button>
      </div>

      {view === 'invitation' ? (
        <Invitation guestName="Bapak Ahmad & Keluarga" />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
