export default function KpiCard({ label, value, sub, trend, color = 'teal' }) {
  const colors = {
    teal:  { border: 'border-teal/20',  dot: 'bg-teal',  text: 'text-teal' },
    gold:  { border: 'border-gold/20',  dot: 'bg-gold',  text: 'text-gold' },
    red:   { border: 'border-red-400/20', dot: 'bg-red-400', text: 'text-red-400' },
    blue:  { border: 'border-blue-400/20', dot: 'bg-blue-400', text: 'text-blue-400' },
  };
  const c = colors[color] || colors.teal;

  return (
    <div className={`card border ${c.border} relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${c.dot}`} />
      <div className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2 pl-2">{label}</div>
      <div className={`font-display font-semibold text-2xl text-white pl-2`}>{value}</div>
      {sub && <div className="text-[var(--muted)] text-xs mt-1 pl-2">{sub}</div>}
      {trend !== undefined && (
        <div className={`text-xs mt-2 pl-2 font-medium ${trend >= 0 ? 'text-teal' : 'text-red-400'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% vs prior period
        </div>
      )}
    </div>
  );
}
