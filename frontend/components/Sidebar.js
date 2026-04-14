import { useRouter } from 'next/router';
import Link from 'next/link';

const NAV = [
  { href: '/',              icon: '⬛', label: 'Clients' },
  { href: '/dashboard',     icon: '◈',  label: 'Dashboard' },
  { href: '/revenue',       icon: '↑',  label: 'Revenue' },
  { href: '/costs',         icon: '↓',  label: 'Costs' },
  { href: '/balance-sheet', icon: '⊟',  label: 'Balance Sheet' },
  { href: '/cashflow',      icon: '⇄',  label: 'Cash Flow' },
  { href: '/kpis',          icon: '◎',  label: 'KPIs' },
  { href: '/notes',         icon: '✎',  label: 'Advisor Notes' },
];

export default function Sidebar({ clientId, clientName }) {
  const router = useRouter();

  const linkWithClient = (href) =>
    clientId ? `${href}?client=${clientId}` : href;

  const isActive = (href) =>
    router.pathname === href;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0A1422] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center text-navy font-bold text-sm">F</div>
          <div>
            <div className="font-display font-600 text-white text-sm tracking-wide">FinPlan</div>
            <div className="text-[10px] text-[var(--muted)]">Financial Advisor Suite</div>
          </div>
        </div>
      </div>

      {/* Client badge */}
      {clientName && (
        <div className="mx-4 mt-4 px-3 py-2.5 rounded-xl bg-gold/10 border border-gold/20">
          <div className="text-[10px] text-gold/70 uppercase tracking-wider mb-0.5">Active Client</div>
          <div className="text-xs font-medium text-gold truncate">{clientName}</div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon, label }) => (
          <Link key={href} href={linkWithClient(href)}>
            <div className={`nav-item ${isActive(href) ? 'active' : ''}`}>
              <span className="text-base w-5 text-center">{icon}</span>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="text-[10px] text-[var(--muted)]">FinPlan v1.0 · Your Practice</div>
      </div>
    </aside>
  );
}
