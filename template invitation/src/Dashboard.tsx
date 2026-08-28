import { useState } from 'react';

const C = {
  forest: '#17352F',
  gold: '#C7A96B',
  ivory: '#F8F4EC',
  surface: '#FFFDF8',
  ink: '#252522',
  muted: '#8D897E',
  border: '#E8E3D8',
};

const serif = "'Playfair Display', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";

// ── Types ──────────────────────────────────────────────────────────────────────

type Page = 'overview' | 'guests' | 'rsvp' | 'editor' | 'template' | 'payment';

interface Guest {
  id: number;
  name: string;
  whatsapp: string;
  category: 'Family' | 'Friend' | 'Colleague';
  count: number;
  status: 'Sent' | 'Not Opened' | 'Opened';
  rsvp: 'Attending' | 'Not Attending' | 'Maybe' | 'Pending';
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const guestsMock: Guest[] = [
  { id: 1, name: 'Bapak Ahmad & Keluarga', whatsapp: '+62 812-3456-7890', category: 'Family', count: 4, status: 'Sent', rsvp: 'Attending' },
  { id: 2, name: 'Budi Santoso', whatsapp: '+62 813-2345-6789', category: 'Friend', count: 1, status: 'Sent', rsvp: 'Not Attending' },
  { id: 3, name: 'Sarah Kusuma', whatsapp: '+62 814-3456-7890', category: 'Friend', count: 2, status: 'Not Opened', rsvp: 'Pending' },
  { id: 4, name: 'Ibu Rahmawati', whatsapp: '+62 815-4567-8901', category: 'Family', count: 3, status: 'Opened', rsvp: 'Attending' },
  { id: 5, name: 'Danu Pratama', whatsapp: '+62 816-5678-9012', category: 'Colleague', count: 1, status: 'Sent', rsvp: 'Maybe' },
  { id: 6, name: 'Keluarga Pak Hendra', whatsapp: '+62 817-6789-0123', category: 'Family', count: 5, status: 'Opened', rsvp: 'Attending' },
  { id: 7, name: 'Rina Maharani', whatsapp: '+62 818-7890-1234', category: 'Friend', count: 1, status: 'Sent', rsvp: 'Attending' },
  { id: 8, name: 'Tim Kantor Zahra', whatsapp: '+62 819-8901-2345', category: 'Colleague', count: 8, status: 'Sent', rsvp: 'Pending' },
];

// ── Shared Components ──────────────────────────────────────────────────────────

function Badge({ text, color }: { text: string; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    green: { bg: '#17352F15', text: '#17352F' },
    red: { bg: '#8B000015', text: '#8B0000' },
    gold: { bg: '#C7A96B20', text: '#9A7A3A' },
    gray: { bg: '#8D897E18', text: '#8D897E' },
    blue: { bg: '#1A3A6015', text: '#1A3A60' },
  };
  const s = colorMap[color] || colorMap.gray;
  return (
    <span
      className="inline-block px-2.5 py-0.5 text-[10px] tracking-wide uppercase"
      style={{ fontFamily: sans, backgroundColor: s.bg, color: s.text }}
    >
      {text}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="px-6 py-5"
      style={{
        backgroundColor: accent ? C.forest : C.surface,
        border: `1px solid ${accent ? C.forest : C.border}`,
      }}
    >
      <p
        className="text-[10px] tracking-[0.2em] uppercase mb-2"
        style={{ fontFamily: sans, color: accent ? `${C.ivory}70` : C.muted }}
      >
        {label}
      </p>
      <p
        className="text-3xl"
        style={{ fontFamily: serif, color: accent ? C.ivory : C.forest }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-xs mt-1"
          style={{ fontFamily: sans, color: accent ? `${C.ivory}50` : C.muted }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'guests',
    label: 'Guests',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'rsvp',
    label: 'RSVP',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="2" width="13" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 5 L7.5 9 L14 5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'editor',
    label: 'Invitation',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 12 L3 3 L12 3 L12 9 L9 12 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 9 L9 9 L9 12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'template',
    label: 'Template',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 5 L14 5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 5 L6 14" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
];

function Sidebar({ active, onNav }: { active: Page; onNav: (p: Page) => void }) {
  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col h-full"
      style={{
        backgroundColor: C.forest,
        borderRight: `1px solid ${C.gold}25`,
      }}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b" style={{ borderColor: `${C.gold}20` }}>
        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-1"
          style={{ fontFamily: sans, color: `${C.gold}80` }}
        >
          SAKINAH
        </p>
        <h1 className="text-xl leading-tight" style={{ fontFamily: serif, color: C.ivory }}>
          Zahra &amp; Rafi
        </h1>
        <p className="text-xs mt-1" style={{ fontFamily: sans, color: `${C.ivory}45` }}>
          12 December 2026
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className="flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 rounded-sm"
            style={{
              fontFamily: sans,
              color: active === item.id ? C.ivory : `${C.ivory}55`,
              backgroundColor: active === item.id ? `${C.gold}20` : 'transparent',
              borderLeft: active === item.id ? `2px solid ${C.gold}` : '2px solid transparent',
            }}
          >
            <span style={{ color: active === item.id ? C.gold : `${C.ivory}40` }}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Payment CTA */}
      <div className="p-4 border-t" style={{ borderColor: `${C.gold}20` }}>
        <button
          onClick={() => onNav('payment')}
          className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
          style={{
            fontFamily: sans,
            color: C.forest,
            backgroundColor: C.gold,
          }}
        >
          Activate
        </button>
      </div>
    </aside>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────────

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div
      className="px-8 py-5 border-b flex items-center justify-between"
      style={{
        backgroundColor: C.surface,
        borderColor: C.border,
      }}
    >
      <div>
        <h2 className="text-xl" style={{ fontFamily: serif, color: C.forest }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ fontFamily: sans, color: C.muted }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 flex items-center justify-center text-xs"
          style={{
            backgroundColor: C.forest,
            color: C.ivory,
            fontFamily: serif,
          }}
        >
          Z
        </div>
      </div>
    </div>
  );
}

// ── Overview Page ──────────────────────────────────────────────────────────────

function OverviewPage() {
  return (
    <div className="flex-1 overflow-y-auto inv-scroll">
      <Header title="Dashboard Overview" subtitle="Wedding of Zahra & Rafi · 12 December 2026" />
      <div className="p-8 flex flex-col gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Guests" value={245} sub="+12 this week" accent />
          <StatCard label="Invitations Sent" value={198} sub="80.8% of total" />
          <StatCard label="Invitation Opened" value={176} sub="88.9% open rate" />
          <StatCard label="RSVP Received" value={142} sub="57.9% response rate" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RSVP Overview */}
          <div
            className="p-6"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <h3 className="text-base mb-5" style={{ fontFamily: serif, color: C.forest }}>
              RSVP Overview
            </h3>
            {/* Donut */}
            <div className="flex items-center justify-center mb-5">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: `conic-gradient(
                    ${C.forest} 0 49deg,
                    ${C.gold} 49deg 59deg,
                    #C4B49B 59deg 64deg,
                    ${C.border} 64deg 360deg
                  )`,
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                  style={{ backgroundColor: C.surface }}
                >
                  <p className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>
                    118
                  </p>
                  <p className="text-[9px] tracking-wide uppercase" style={{ fontFamily: sans, color: C.muted }}>
                    Attending
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Attending', value: 118, color: C.forest },
                { label: 'Not Attending', value: 24, color: C.gold },
                { label: 'Maybe', value: 12, color: '#C4B49B' },
                { label: 'Pending', value: 91, color: C.border },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color, border: `1px solid ${C.border}` }} />
                    <span style={{ fontFamily: sans, color: C.muted }}>{r.label}</span>
                  </div>
                  <span style={{ fontFamily: sans, color: C.ink, fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invitation Performance */}
          <div
            className="p-6"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <h3 className="text-base mb-5" style={{ fontFamily: serif, color: C.forest }}>
              Invitation Performance
            </h3>
            {[
              { label: 'Total Guests', value: 245, max: 245 },
              { label: 'Sent', value: 198, max: 245 },
              { label: 'Opened', value: 176, max: 245 },
              { label: 'RSVP', value: 142, max: 245 },
            ].map((item) => (
              <div key={item.label} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs" style={{ fontFamily: sans, color: C.muted }}>{item.label}</span>
                  <span className="text-xs font-medium" style={{ fontFamily: sans, color: C.ink }}>{item.value}</span>
                </div>
                <div className="h-1.5 w-full" style={{ backgroundColor: C.border }}>
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${(item.value / item.max) * 100}%`,
                      backgroundColor: C.forest,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Guest Categories */}
          <div
            className="p-6"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <h3 className="text-base mb-5" style={{ fontFamily: serif, color: C.forest }}>
              Guest Categories
            </h3>
            {[
              { label: 'Family', count: 98, pct: 40 },
              { label: 'Friends', count: 112, pct: 46 },
              { label: 'Colleagues', count: 35, pct: 14 },
            ].map((c) => (
              <div key={c.label} className="mb-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ fontFamily: sans, color: C.ink }}>{c.label}</span>
                  <span className="text-xs" style={{ fontFamily: sans, color: C.muted }}>{c.count} guests</span>
                </div>
                <div className="h-2 w-full" style={{ backgroundColor: C.border }}>
                  <div
                    className="h-full"
                    style={{ width: `${c.pct}%`, backgroundColor: C.gold }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-6 pt-5 border-t" style={{ borderColor: C.border }}>
              <p className="text-xs mb-1" style={{ fontFamily: sans, color: C.muted }}>Total Guests</p>
              <p className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>245</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Guests Page ────────────────────────────────────────────────────────────────

function GuestsPage() {
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [shareGuest, setShareGuest] = useState<Guest | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', whatsapp: '', category: 'Friend', count: 1 });

  const filtered = guestsMock.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  const rsvpColor = (r: string) => {
    if (r === 'Attending') return 'green';
    if (r === 'Not Attending') return 'red';
    if (r === 'Maybe') return 'gold';
    return 'gray';
  };

  const statusColor = (s: string) => {
    if (s === 'Sent') return 'blue';
    if (s === 'Opened') return 'green';
    return 'gray';
  };

  function copyLink() {
    navigator.clipboard.writeText(`https://sakinah.wedding/zahrarafi/${(shareGuest?.name ?? '').split(' ')[0].toLowerCase()}`).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="flex-1 overflow-y-auto inv-scroll">
      <Header title="Guest Management" subtitle={`${guestsMock.length} guests · ${guestsMock.reduce((a, g) => a + g.count, 0)} total attendees`} />
      <div className="p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke={C.muted} strokeWidth="1.2" />
              <path d="M9.5 9.5 L13 13" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests..."
              className="w-full pl-9 pr-4 py-2.5 text-sm"
              style={{
                fontFamily: sans,
                color: C.ink,
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                outline: 'none',
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-colors"
              style={{
                fontFamily: sans,
                color: C.muted,
                border: `1px solid ${C.border}`,
                backgroundColor: C.surface,
              }}
            >
              Import Guests
            </button>
            <button
              onClick={() => setAddModal(true)}
              className="px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase flex items-center gap-2 transition-colors hover:opacity-80"
              style={{
                fontFamily: sans,
                backgroundColor: C.forest,
                color: C.ivory,
              }}
            >
              <span>+</span> Add Guest
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto"
          style={{ border: `1px solid ${C.border}` }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: C.ivory, borderBottom: `1px solid ${C.border}` }}>
                {['Guest Name', 'WhatsApp', 'Category', 'Guests', 'Status', 'RSVP', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: sans, color: C.muted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr
                  key={g.id}
                  className="transition-colors hover:bg-[#F8F4EC]"
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    backgroundColor: i % 2 === 0 ? C.surface : C.ivory + '40',
                  }}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium" style={{ fontFamily: sans, color: C.ink }}>{g.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs" style={{ fontFamily: sans, color: C.muted }}>{g.whatsapp}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge text={g.category} color={g.category === 'Family' ? 'green' : g.category === 'Friend' ? 'gold' : 'gray'} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm" style={{ fontFamily: sans, color: C.ink }}>{g.count}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge text={g.status} color={statusColor(g.status)} />
                  </td>
                  <td className="px-5 py-4">
                    <Badge text={g.rsvp} color={rsvpColor(g.rsvp)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShareGuest(g)}
                        className="text-[10px] tracking-wide uppercase transition-colors hover:text-[#17352F]"
                        style={{ fontFamily: sans, color: C.muted }}
                      >
                        Share
                      </button>
                      <span style={{ color: C.border }}>·</span>
                      <button
                        className="text-[10px] tracking-wide uppercase transition-colors hover:text-[#17352F]"
                        style={{ fontFamily: sans, color: C.muted }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {addModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: `${C.ink}80` }}
          onClick={() => setAddModal(false)}
        >
          <div
            className="w-full max-w-md mx-4 anim-scale-in"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-7 py-5 border-b flex items-center justify-between"
              style={{ borderColor: C.border }}
            >
              <h3 className="text-lg" style={{ fontFamily: serif, color: C.forest }}>Add Guest</h3>
              <button onClick={() => setAddModal(false)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-7 flex flex-col gap-4">
              {[
                { label: 'Guest Name', key: 'name', type: 'text', placeholder: 'Nama tamu' },
                { label: 'WhatsApp', key: 'whatsapp', type: 'tel', placeholder: '+62 812...' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: sans, color: C.muted }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={(newGuest as Record<string, unknown>)[f.key] as string}
                    onChange={(e) => setNewGuest({ ...newGuest, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 text-sm"
                    style={{ fontFamily: sans, color: C.ink, backgroundColor: C.ivory, border: `1px solid ${C.border}`, outline: 'none' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: sans, color: C.muted }}>
                  Category
                </label>
                <select
                  value={newGuest.category}
                  onChange={(e) => setNewGuest({ ...newGuest, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm"
                  style={{ fontFamily: sans, color: C.ink, backgroundColor: C.ivory, border: `1px solid ${C.border}`, outline: 'none' }}
                >
                  {['Family', 'Friend', 'Colleague'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAddModal(false)}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, color: C.muted, border: `1px solid ${C.border}` }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setAddModal(false)}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
                >
                  Add Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareGuest && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: `${C.ink}80` }}
          onClick={() => setShareGuest(null)}
        >
          <div
            className="w-full max-w-md mx-4 anim-scale-in"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-7 py-5 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
              <h3 className="text-lg" style={{ fontFamily: serif, color: C.forest }}>Share Invitation</h3>
              <button onClick={() => setShareGuest(null)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-7 flex flex-col gap-5">
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase mb-1" style={{ fontFamily: sans, color: C.muted }}>
                  Invitation for
                </p>
                <p className="text-xl" style={{ fontFamily: serif, color: C.forest }}>
                  {shareGuest.name}
                </p>
              </div>

              {/* Preview snippet */}
              <div className="px-5 py-4" style={{ backgroundColor: C.ivory, border: `1px solid ${C.gold}30` }}>
                <p className="text-xs leading-relaxed" style={{ fontFamily: sans, color: C.muted, fontStyle: 'italic' }}>
                  Assalamu'alaikum Wr. Wb.<br />
                  Kepada Yth. <strong style={{ color: C.forest }}>{shareGuest.name}</strong><br />
                  Dengan penuh kebahagiaan kami mengundang Bapak/Ibu...<br />
                  <span style={{ color: C.gold }}>sakinah.wedding/zahrarafi/{shareGuest.name.split(' ')[0].toLowerCase()}</span>
                </p>
              </div>

              {/* Unique link */}
              <div className="flex gap-2">
                <div
                  className="flex-1 px-4 py-2.5 text-xs truncate"
                  style={{ fontFamily: sans, color: C.muted, backgroundColor: C.ivory, border: `1px solid ${C.border}` }}
                >
                  sakinah.wedding/zahrarafi/{shareGuest.name.split(' ')[0].toLowerCase()}
                </div>
                <button
                  onClick={copyLink}
                  className="px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-colors flex items-center gap-1.5"
                  style={{
                    fontFamily: sans,
                    color: copiedLink ? C.surface : C.forest,
                    backgroundColor: copiedLink ? C.forest : 'transparent',
                    border: `1px solid ${C.forest}`,
                  }}
                >
                  {copiedLink ? '✓ Copied' : 'Copy Link'}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-2"
                  style={{ fontFamily: sans, backgroundColor: '#25D366', color: 'white' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 2a5 5 0 0 0-8 5.6L1 11l3.4-1A5 5 0 0 0 10 2z" stroke="white" strokeWidth="1" fill="none" />
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => setShareGuest(null)}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, color: C.muted, border: `1px solid ${C.border}` }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RSVP Page ──────────────────────────────────────────────────────────────────

const rsvpData = [
  { name: 'Bapak Ahmad & Keluarga', category: 'Family', guests: 4, response: 'Attending', message: 'Semoga menjadi keluarga yang sakinah mawaddah warahmah!', date: '24 Aug 2026' },
  { name: 'Budi Santoso', category: 'Friend', guests: 1, response: 'Not Attending', message: 'Maaf tidak bisa hadir, semoga lancar ya!', date: '22 Aug 2026' },
  { name: 'Ibu Rahmawati', category: 'Family', guests: 3, response: 'Attending', message: 'Insya Allah hadir, doakan kami juga ya 🤲', date: '21 Aug 2026' },
  { name: 'Danu Pratama', category: 'Colleague', guests: 1, response: 'Maybe', message: 'Lagi ada urusan mendadak, insya Allah hadir kalau bisa.', date: '20 Aug 2026' },
  { name: 'Rina Maharani', category: 'Friend', guests: 1, response: 'Attending', message: 'Wah selamat ya! Nggak sabar ketemu!', date: '19 Aug 2026' },
];

function RSVPPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filters = ['All', 'Attending', 'Not Attending', 'Maybe', 'Pending'];

  const filtered = rsvpData.filter((r) => {
    const matchFilter = filter === 'All' || r.response === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const rsvpColor = (r: string) => {
    if (r === 'Attending') return 'green';
    if (r === 'Not Attending') return 'red';
    if (r === 'Maybe') return 'gold';
    return 'gray';
  };

  return (
    <div className="flex-1 overflow-y-auto inv-scroll">
      <Header title="RSVP Responses" subtitle="Real-time guest confirmations" />
      <div className="p-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Attending', value: 118, color: C.forest },
            { label: 'Not Attending', value: 24, color: '#8B0000' },
            { label: 'Maybe', value: 12, color: '#9A7A3A' },
            { label: 'Pending', value: 91, color: C.muted },
          ].map((s) => (
            <div
              key={s.label}
              className="px-5 py-4"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <p className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: sans, color: C.muted }}>{s.label}</p>
              </div>
              <p className="text-3xl" style={{ fontFamily: serif, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                style={{
                  fontFamily: sans,
                  color: filter === f ? C.ivory : C.muted,
                  backgroundColor: filter === f ? C.forest : 'transparent',
                  border: `1px solid ${filter === f ? C.forest : C.border}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="px-4 py-1.5 text-xs w-48"
            style={{ fontFamily: sans, color: C.ink, backgroundColor: C.surface, border: `1px solid ${C.border}`, outline: 'none' }}
          />
        </div>

        {/* Table */}
        <div style={{ border: `1px solid ${C.border}` }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: C.ivory, borderBottom: `1px solid ${C.border}` }}>
                {['Guest', 'Category', 'Guests', 'Response', 'Message', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: sans, color: C.muted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    backgroundColor: i % 2 === 0 ? C.surface : `${C.ivory}50`,
                  }}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium" style={{ fontFamily: sans, color: C.ink }}>{r.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge text={r.category} color={r.category === 'Family' ? 'green' : 'gold'} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm" style={{ fontFamily: sans, color: C.ink }}>{r.guests}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge text={r.response} color={rsvpColor(r.response)} />
                  </td>
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="text-xs truncate" style={{ fontFamily: sans, color: C.muted, fontStyle: 'italic' }}>
                      {r.message}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs" style={{ fontFamily: sans, color: C.muted }}>{r.date}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Editor Page ────────────────────────────────────────────────────────────────

const editorSections = ['Cover', 'Quran', 'Bride & Groom', 'Story', 'Countdown', 'Events', 'Gallery', 'Gift', 'RSVP', 'Closing'];

const editorFieldMap: Record<string, { label: string; key: string; type: string }[]> = {
  Cover: [
    { label: 'Bride Name', key: 'brideName', type: 'text' },
    { label: 'Groom Name', key: 'groomName', type: 'text' },
  ],
  Events: [
    { label: 'Akad Date', key: 'akadDate', type: 'text' },
    { label: 'Akad Venue', key: 'akadVenue', type: 'text' },
    { label: 'Reception Venue', key: 'receptionVenue', type: 'text' },
  ],
  'Bride & Groom': [
    { label: 'Bride Full Name', key: 'brideFullName', type: 'text' },
    { label: "Bride's Father", key: 'brideFather', type: 'text' },
    { label: "Bride's Mother", key: 'brideMother', type: 'text' },
    { label: 'Groom Full Name', key: 'groomFullName', type: 'text' },
    { label: "Groom's Father", key: 'groomFather', type: 'text' },
    { label: "Groom's Mother", key: 'groomMother', type: 'text' },
  ],
  Gift: [
    { label: 'Bank Name', key: 'bankName', type: 'text' },
    { label: 'Account Number', key: 'accountNum', type: 'text' },
    { label: 'Account Holder', key: 'accountHolder', type: 'text' },
  ],
  Closing: [
    { label: 'Closing Message', key: 'closingMsg', type: 'textarea' },
  ],
};

function EditorPage() {
  const [activeSection, setActiveSection] = useState('Cover');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [saved, setSaved] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [fields, setFields] = useState({
    brideName: 'Zahra',
    groomName: 'Rafi',
    brideFullName: 'Zahra Aulia Putri',
    brideFather: 'Bapak Ahmad Fauzi',
    brideMother: 'Ibu Siti Rahmah',
    groomFullName: 'Rafi Maulana',
    groomFather: 'Bapak Hendra Maulana',
    groomMother: 'Ibu Nur Aisyah',
    akadDate: '12 December 2026',
    akadVenue: 'Masjid Al-Hikmah',
    receptionVenue: 'Grand Ballroom Hermes Palace',
    bankName: 'BCA',
    accountNum: '1234567890',
    accountHolder: 'Zahra Aulia Putri',
    closingMsg: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir.',
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePublish() {
    setPublishModal(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  }

  const currentFields = editorFieldMap[activeSection] || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Topbar */}
      <div
        className="px-6 py-3 border-b flex items-center justify-between flex-shrink-0"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base" style={{ fontFamily: serif, color: C.forest }}>
            Invitation Editor
          </h2>
          <span className="text-xs px-2 py-0.5" style={{ fontFamily: sans, color: C.gold, border: `1px solid ${C.gold}40` }}>
            SAKINAH
          </span>
        </div>
        <div className="flex items-center gap-3">
          {publishSuccess && (
            <span className="text-xs flex items-center gap-1.5" style={{ fontFamily: sans, color: C.forest }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6 L5 9 L10 3" stroke={C.forest} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Invitation updated successfully
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase flex items-center gap-1.5"
            style={{ fontFamily: sans, color: saved ? C.surface : C.forest, backgroundColor: saved ? C.forest : 'transparent', border: `1px solid ${C.forest}` }}
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
          <button
            onClick={() => setPublishModal(true)}
            className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase"
            style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
          >
            Publish Update
          </button>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Section list */}
        <div
          className="w-44 flex-shrink-0 border-r overflow-y-auto"
          style={{ backgroundColor: C.ivory, borderColor: C.border }}
        >
          {editorSections.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className="w-full px-4 py-3 text-left text-xs border-b transition-colors"
              style={{
                fontFamily: sans,
                color: activeSection === s ? C.forest : C.muted,
                backgroundColor: activeSection === s ? C.surface : 'transparent',
                borderColor: C.border,
                borderLeft: activeSection === s ? `2px solid ${C.gold}` : '2px solid transparent',
                fontWeight: activeSection === s ? 500 : 400,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Center: Preview */}
        <div
          className="flex-1 flex flex-col items-center overflow-y-auto"
          style={{ backgroundColor: '#EEEAE0' }}
        >
          {/* Toggle */}
          <div
            className="flex gap-1 mt-5 mb-6 p-1"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            {(['mobile', 'desktop'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPreviewMode(m)}
                className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all"
                style={{
                  fontFamily: sans,
                  color: previewMode === m ? C.surface : C.muted,
                  backgroundColor: previewMode === m ? C.forest : 'transparent',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Device mockup */}
          <div
            className={`bg-white shadow-2xl transition-all duration-500 ${previewMode === 'mobile' ? 'w-48' : 'w-96'}`}
            style={{
              border: `2px solid ${C.ink}20`,
              borderRadius: previewMode === 'mobile' ? '24px' : '8px',
              minHeight: previewMode === 'mobile' ? '380px' : '260px',
              overflow: 'hidden',
            }}
          >
            {/* Phone notch */}
            {previewMode === 'mobile' && (
              <div className="h-5 flex items-center justify-center" style={{ backgroundColor: C.ink }}>
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: `${C.ivory}30` }} />
              </div>
            )}
            {/* Preview content */}
            <div className="p-3" style={{ backgroundColor: C.ivory, minHeight: '340px' }}>
              <p className="text-center text-[8px] mb-2" style={{ fontFamily: sans, color: C.gold }}>بِسْمِ اللَّهِ</p>
              <p className="text-center text-[7px] uppercase tracking-widest mb-3" style={{ fontFamily: sans, color: C.muted }}>The Wedding of</p>
              <h3 className="text-center text-2xl leading-tight" style={{ fontFamily: serif, color: C.forest }}>
                {fields.brideName}
              </h3>
              <p className="text-center text-sm my-0.5" style={{ fontFamily: serif, color: C.gold, fontStyle: 'italic' }}>&</p>
              <h3 className="text-center text-2xl leading-tight mb-3" style={{ fontFamily: serif, color: C.forest }}>
                {fields.groomName}
              </h3>
              <div className="h-px mb-3" style={{ backgroundColor: `${C.gold}40` }} />
              <p className="text-center text-[7px] uppercase tracking-widest mb-1" style={{ fontFamily: sans, color: C.muted }}>
                {fields.akadDate}
              </p>
              <p className="text-center text-[7px] mb-3" style={{ fontFamily: sans, color: C.muted }}>
                {fields.akadVenue}
              </p>
              <div className="h-px mb-3" style={{ backgroundColor: `${C.gold}40` }} />
              <p className="text-center text-[7px] leading-relaxed" style={{ fontFamily: sans, color: C.muted, fontStyle: 'italic' }}>
                {fields.closingMsg.substring(0, 80)}...
              </p>
            </div>
          </div>
          <p className="text-[9px] mt-3 mb-8" style={{ fontFamily: sans, color: C.muted }}>
            Live preview · Changes reflect instantly
          </p>
        </div>

        {/* Right: Properties */}
        <div
          className="w-64 flex-shrink-0 border-l overflow-y-auto"
          style={{ backgroundColor: C.surface, borderColor: C.border }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <p className="text-xs font-medium" style={{ fontFamily: sans, color: C.forest }}>
              {activeSection}
            </p>
            <p className="text-[10px] mt-0.5" style={{ fontFamily: sans, color: C.muted }}>
              Edit section content
            </p>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {currentFields.length > 0 ? (
              currentFields.map((f) => (
                <div key={f.key}>
                  <label
                    className="block text-[10px] tracking-[0.15em] uppercase mb-1.5"
                    style={{ fontFamily: sans, color: C.muted }}
                  >
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={(fields as Record<string, string>)[f.key]}
                      onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-xs resize-none"
                      style={{ fontFamily: sans, color: C.ink, backgroundColor: C.ivory, border: `1px solid ${C.border}`, outline: 'none' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(fields as Record<string, string>)[f.key]}
                      onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 text-xs"
                      style={{ fontFamily: sans, color: C.ink, backgroundColor: C.ivory, border: `1px solid ${C.border}`, outline: 'none' }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-center py-6" style={{ fontFamily: sans, color: C.muted }}>
                Select a section to edit its content
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {publishModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: `${C.ink}80` }}
        >
          <div
            className="w-full max-w-sm mx-4 anim-scale-in"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <div className="p-8 text-center flex flex-col gap-5">
              <h3 className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>
                Publish Changes?
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: C.muted }}>
                "Your invitation will immediately use the updated version. All guests will see the new content."
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPublishModal(false)}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, color: C.muted, border: `1px solid ${C.border}` }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Template Page ──────────────────────────────────────────────────────────────

function TemplatePage({ onPayment }: { onPayment: () => void }) {
  const [restoreModal, setRestoreModal] = useState<number | null>(null);

  const revisions = [
    { version: '1.2', note: 'Updated gallery photos', date: '27 Aug 2026' },
    { version: '1.1', note: 'Updated wedding venue', date: '20 Aug 2026' },
    { version: '1.0', note: 'Initial invitation', date: '15 Aug 2026' },
  ];

  return (
    <div className="flex-1 overflow-y-auto inv-scroll">
      <Header title="Template Management" subtitle="SAKINAH · Active" />
      <div className="p-8 flex flex-col gap-6 max-w-2xl">
        {/* Template card */}
        <div
          className="p-7 flex items-start gap-6"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
        >
          {/* Mini preview */}
          <div
            className="w-24 h-32 flex-shrink-0 overflow-hidden flex flex-col items-center justify-center gap-1"
            style={{ backgroundColor: C.forest }}
          >
            <p className="text-[8px]" style={{ fontFamily: sans, color: `${C.gold}80` }}>SAKINAH</p>
            <p className="text-sm" style={{ fontFamily: serif, color: C.ivory }}>Zahra</p>
            <p className="text-xs" style={{ fontFamily: serif, color: C.gold, fontStyle: 'italic' }}>&</p>
            <p className="text-sm" style={{ fontFamily: serif, color: C.ivory }}>Rafi</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>SAKINAH</h3>
              <span className="flex items-center gap-1.5 text-[10px] tracking-wide uppercase" style={{ fontFamily: sans, color: '#2E7D32' }}>
                <div className="w-2 h-2 rounded-full bg-green-600" />
                Active
              </span>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              {[
                ['Version', '1.2'],
                ['Last Updated', '27 August 2026'],
                ['Status', 'Published'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-xs w-24 flex-shrink-0" style={{ fontFamily: sans, color: C.muted }}>{k}</span>
                  <span className="text-xs font-medium" style={{ fontFamily: sans, color: C.ink }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase transition-colors hover:opacity-80"
                style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
              >
                Edit
              </button>
              <button
                className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase transition-colors"
                style={{ fontFamily: sans, color: C.forest, border: `1px solid ${C.forest}` }}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <h3 className="text-xl mb-5" style={{ fontFamily: serif, color: C.forest }}>
            Revision History
          </h3>
          <div className="flex flex-col gap-3">
            {revisions.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: i === 0 ? C.forest : 'transparent',
                      color: i === 0 ? C.ivory : C.muted,
                      border: `1px solid ${i === 0 ? C.forest : C.border}`,
                      fontFamily: sans,
                    }}
                  >
                    v{r.version}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ fontFamily: sans, color: C.ink }}>
                      {r.note}
                    </p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: sans, color: C.muted }}>{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-[10px] tracking-wide uppercase"
                    style={{ fontFamily: sans, color: C.muted }}
                  >
                    View
                  </button>
                  {i > 0 && (
                    <>
                      <span style={{ color: C.border }}>·</span>
                      <button
                        onClick={() => setRestoreModal(i)}
                        className="text-[10px] tracking-wide uppercase"
                        style={{ fontFamily: sans, color: C.forest }}
                      >
                        Restore
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restore modal */}
      {restoreModal !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: `${C.ink}80` }}
          onClick={() => setRestoreModal(null)}
        >
          <div
            className="w-full max-w-sm mx-4 anim-scale-in"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center flex flex-col gap-5">
              <h3 className="text-xl" style={{ fontFamily: serif, color: C.forest }}>
                Restore this version?
              </h3>
              <p className="text-sm" style={{ fontFamily: sans, color: C.muted }}>
                Version {revisions[restoreModal]?.version} — {revisions[restoreModal]?.note}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRestoreModal(null)}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, color: C.muted, border: `1px solid ${C.border}` }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setRestoreModal(null)}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
                >
                  Restore Version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Payment Page ───────────────────────────────────────────────────────────────

function PaymentPage() {
  const [payState, setPayState] = useState<'idle' | 'success'>('idle');
  const [voucher, setVoucher] = useState('');
  const [voucherState, setVoucherState] = useState<'idle' | 'valid' | 'invalid' | 'used'>('idle');
  const [rentalCode, setRentalCode] = useState('');
  const [rentalState, setRentalState] = useState<'idle' | 'verified' | 'invalid'>('idle');

  function applyVoucher() {
    if (voucher.toUpperCase() === 'SAKINAH50') setVoucherState('valid');
    else if (voucher.toUpperCase() === 'USED123') setVoucherState('used');
    else setVoucherState('invalid');
  }

  function checkRental() {
    if (rentalCode.toUpperCase() === 'DRS-8F29-KLQ') setRentalState('verified');
    else setRentalState('invalid');
  }

  if (payState === 'success') {
    return (
      <div className="flex-1 overflow-y-auto inv-scroll">
        <Header title="Payment & Activation" />
        <div className="p-8 flex items-center justify-center min-h-96">
          <div className="text-center flex flex-col items-center gap-6 max-w-xs anim-scale-in">
            <div
              className="w-16 h-16 flex items-center justify-center"
              style={{ backgroundColor: `${C.forest}15`, border: `1px solid ${C.forest}30` }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14 L11 19 L22 9" stroke={C.forest} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-3xl" style={{ fontFamily: serif, color: C.forest }}>Invitation Activated</h3>
            <p className="text-sm" style={{ fontFamily: sans, color: C.muted }}>
              Your SAKINAH invitation is now live and ready to share with your guests.
            </p>
            <button
              className="px-8 py-3 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
            >
              Start Customizing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto inv-scroll">
      <Header title="Payment & Activation" subtitle="Activate your SAKINAH invitation" />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        {/* Activation card */}
        <div
          className="p-7 flex flex-col gap-5"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
        >
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: sans, color: C.gold }}>
              SAKINAH
            </p>
            <h3 className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>Invitation Template</h3>
          </div>

          <div className="flex justify-between items-center py-4 border-t border-b" style={{ borderColor: C.border }}>
            <div>
              <p className="text-xs" style={{ fontFamily: sans, color: C.muted }}>Invitation Status</p>
              <p className="text-sm font-medium mt-0.5" style={{ fontFamily: sans, color: '#8B0000' }}>Not Activated</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ fontFamily: sans, color: C.muted }}>Activation Price</p>
              <p className="text-2xl" style={{ fontFamily: serif, color: C.forest }}>
                {voucherState === 'valid' || rentalState === 'verified' ? (
                  <><span className="line-through text-lg text-muted mr-2" style={{ color: C.muted }}>Rp99.000</span>Rp0</>
                ) : 'Rp99.000'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setPayState('success')}
            className="w-full py-3.5 text-[10px] tracking-[0.25em] uppercase transition-colors hover:opacity-80"
            style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
          >
            Activate Invitation
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Voucher */}
          <div
            className="p-6"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <p className="text-sm font-medium mb-4" style={{ fontFamily: sans, color: C.forest }}>
              Have a voucher?
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Enter voucher code"
                className="flex-1 px-3 py-2 text-xs uppercase tracking-wider"
                style={{ fontFamily: sans, color: C.ink, backgroundColor: C.ivory, border: `1px solid ${C.border}`, outline: 'none' }}
              />
              <button
                onClick={applyVoucher}
                className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase"
                style={{ fontFamily: sans, backgroundColor: C.gold, color: C.forest }}
              >
                Apply
              </button>
            </div>
            {voucherState === 'valid' && (
              <p className="text-xs flex items-center gap-1.5" style={{ fontFamily: sans, color: '#2E7D32' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6 L5 9 L10 3" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Voucher successfully applied · 50% OFF
              </p>
            )}
            {voucherState === 'invalid' && (
              <p className="text-xs" style={{ fontFamily: sans, color: '#8B0000' }}>
                Voucher code is invalid or expired.
              </p>
            )}
            {voucherState === 'used' && (
              <p className="text-xs" style={{ fontFamily: sans, color: '#8B0000' }}>
                This voucher has already been used.
              </p>
            )}
          </div>

          {/* Dress rental */}
          <div
            className="p-6"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <p className="text-sm font-medium mb-1" style={{ fontFamily: sans, color: C.forest }}>
              Enter Dress Rental Code
            </p>
            <p className="text-xs mb-4" style={{ fontFamily: sans, color: C.muted }}>
              Dress rental customers receive a free invitation activation.
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={rentalCode}
                onChange={(e) => setRentalCode(e.target.value.toUpperCase())}
                placeholder="DRS-XXXX-XXX"
                className="flex-1 px-3 py-2 text-xs uppercase tracking-widest"
                style={{ fontFamily: sans, color: C.ink, backgroundColor: C.ivory, border: `1px solid ${C.border}`, outline: 'none' }}
              />
              <button
                onClick={checkRental}
                className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase"
                style={{ fontFamily: sans, backgroundColor: C.forest, color: C.ivory }}
              >
                Check
              </button>
            </div>
            {rentalState === 'verified' && (
              <div className="mt-2 p-3" style={{ backgroundColor: `${C.forest}08`, border: `1px solid ${C.forest}20` }}>
                <p className="text-xs flex items-center gap-1.5 mb-1" style={{ fontFamily: sans, color: C.forest }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6 L5 9 L10 3" stroke={C.forest} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Eligible for Wedding Invitation Voucher
                </p>
                <p className="text-xs font-medium" style={{ fontFamily: sans, color: C.gold }}>100% OFF</p>
                <button
                  onClick={() => setRentalState('idle')}
                  className="mt-2 px-4 py-1.5 text-[9px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: sans, backgroundColor: C.gold, color: C.forest }}
                >
                  Apply Voucher
                </button>
              </div>
            )}
            {rentalState === 'invalid' && (
              <p className="text-xs mt-1" style={{ fontFamily: sans, color: '#8B0000' }}>
                Code not found. Please check your rental tracking code.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [page, setPage] = useState<Page>('overview');

  const renderPage = () => {
    switch (page) {
      case 'overview': return <OverviewPage />;
      case 'guests': return <GuestsPage />;
      case 'rsvp': return <RSVPPage />;
      case 'editor': return <EditorPage />;
      case 'template': return <TemplatePage onPayment={() => setPage('payment')} />;
      case 'payment': return <PaymentPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{ fontFamily: sans, backgroundColor: C.ivory }}
    >
      <Sidebar active={page} onNav={setPage} />
      <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: C.ivory }}>
        {renderPage()}
      </main>
    </div>
  );
}
